import { createSign } from "node:crypto";

type ApiRequest = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  socket: { remoteAddress?: string };
};

type ApiResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): {
    json(body: unknown): void;
  };
};

type RegistrationInput = {
  name?: unknown;
  company?: unknown;
  status?: unknown;
  attendeeCount?: unknown;
};

type RegistrationPayload = {
  name: string;
  company: string;
  status: "yes" | "no";
  attendeeCount: number;
  source?: string;
  userAgent?: string;
  ip?: string;
};

const DEFAULT_SPREADSHEET_ID = "1zZzrndq4MXN1-qtmnmTQ9Yf32Wvvd76CVKdNmedUtEk";
const DEFAULT_SHEET_NAME = "Лист1";
const HEADER_ROW = [
  "Дата и время",
  "Имя и фамилия",
  "Компания",
  "Статус участия",
  "Количество человек",
  "Источник",
  "User Agent",
  "IP",
];

function getEnv(name: string) {
  return process.env[name]?.trim();
}

function normalizePrivateKey(privateKey: string) {
  return privateKey.replace(/\\n/g, "\n");
}

function getPrivateKey() {
  const base64Key = getEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64");
  if (base64Key) {
    return Buffer.from(base64Key, "base64").toString("utf8");
  }

  return getEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
}

function getServiceAccountFromJson() {
  const rawJson = getEnv("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (!rawJson) return {};

  const parsed = JSON.parse(rawJson) as {
    client_email?: string;
    private_key?: string;
  };

  return {
    serviceAccountEmail: parsed.client_email,
    privateKey: parsed.private_key,
  };
}

function base64UrlEncode(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function signJwt(serviceAccountEmail: string, privateKey: string) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claimSet = {
    iss: serviceAccountEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const unsignedJwt = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(
    JSON.stringify(claimSet),
  )}`;
  const signature = createSign("RSA-SHA256")
    .update(unsignedJwt)
    .sign(normalizePrivateKey(privateKey));

  return `${unsignedJwt}.${base64UrlEncode(signature)}`;
}

async function getAccessToken() {
  const jsonAccount = getServiceAccountFromJson();
  const serviceAccountEmail =
    getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL") || jsonAccount.serviceAccountEmail;
  const privateKey = getPrivateKey() || jsonAccount.privateKey;

  if (!serviceAccountEmail || !privateKey) {
    return null;
  }

  const assertion = signJwt(serviceAccountEmail, privateKey);
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google token request failed: ${response.status} ${body}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("Google token response did not include access_token");
  }

  return data.access_token;
}

function buildRow(payload: RegistrationPayload) {
  return [
    new Date().toISOString(),
    payload.name,
    payload.company || "",
    payload.status === "yes" ? "Приду" : "Не смогу прийти",
    payload.attendeeCount,
    payload.source || "stafflow-landing",
    payload.userAgent || "",
    payload.ip || "",
  ];
}

async function appendViaWebhook(payload: RegistrationPayload, webhookUrl: string) {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ ...payload, row: buildRow(payload) }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google Sheets webhook failed: ${response.status} ${body}`);
  }
}

async function appendViaServiceAccount(payload: RegistrationPayload) {
  const token = await getAccessToken();
  if (!token) return false;

  const spreadsheetId = getEnv("GOOGLE_SHEETS_SPREADSHEET_ID") || DEFAULT_SPREADSHEET_ID;
  const sheetName = getEnv("GOOGLE_SHEETS_SHEET_NAME") || DEFAULT_SHEET_NAME;
  const headerRange = encodeURIComponent(`${sheetName}!A1:H1`);
  const range = encodeURIComponent(`${sheetName}!A:H`);

  const headerResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${headerRange}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ values: [HEADER_ROW] }),
    },
  );

  if (!headerResponse.ok) {
    const body = await headerResponse.text();
    throw new Error(`Google Sheets header update failed: ${headerResponse.status} ${body}`);
  }

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ values: [buildRow(payload)] }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google Sheets append failed: ${response.status} ${body}`);
  }

  return true;
}

async function appendRegistration(payload: RegistrationPayload) {
  const webhookUrl = getEnv("GOOGLE_SHEETS_WEBHOOK_URL");
  if (webhookUrl) {
    try {
      await appendViaWebhook(payload, webhookUrl);
      return "google_sheets_webhook";
    } catch (error) {
      console.error("Google Sheets webhook failed. Registration accepted as a fallback.", {
        error,
        registration: payload,
      });
      return "vercel_log";
    }
  }

  try {
    const stored = await appendViaServiceAccount(payload);
    if (stored) return "google_sheets_service_account";
  } catch (error) {
    console.error("Google Sheets service account failed. Registration accepted as a fallback.", {
      error,
      registration: payload,
    });
    return "vercel_log";
  }

  console.warn("Google Sheets is not configured. Registration accepted but not persisted.", {
    registration: payload,
  });
  return "vercel_log";
}

function normalizeRegistration(input: RegistrationInput) {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const company = typeof input.company === "string" ? input.company.trim() : "";
  const status = input.status;
  const rawCount = typeof input.attendeeCount === "number" ? input.attendeeCount : 1;
  const attendeeCount = Number.isFinite(rawCount)
    ? Math.min(Math.max(Math.trunc(rawCount), 1), 5)
    : 1;

  if (!name) {
    throw new Error("Name is required");
  }

  if (status !== "yes" && status !== "no") {
    throw new Error("Status is required");
  }

  const normalizedStatus: "yes" | "no" = status;

  return {
    name,
    company,
    status: normalizedStatus,
    attendeeCount: normalizedStatus === "yes" ? attendeeCount : 1,
  };
}

function normalizeRequest(req: ApiRequest) {
  const payload = normalizeRegistration((req.body || {}) as RegistrationInput);
  const forwardedIp =
    typeof req.headers["x-forwarded-for"] === "string"
      ? req.headers["x-forwarded-for"].split(",")[0]?.trim()
      : "";

  return {
    ...payload,
    userAgent: typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : "",
    ip: forwardedIp || req.socket.remoteAddress || "",
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const storedIn = await appendRegistration(normalizeRequest(req));
    return res.status(200).json({ ok: true, storedIn });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Registration failed" });
  }
}

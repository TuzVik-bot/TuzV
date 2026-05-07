type RegistrationPayload = {
  name: string;
  company?: string | null;
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

function base64UrlEncode(input: string | Uint8Array) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function pemToArrayBuffer(pem: string) {
  const base64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");
  return Buffer.from(base64, "base64");
}

async function signJwt(serviceAccountEmail: string, privateKey: string) {
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
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(privateKey),
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsignedJwt),
  );

  return `${unsignedJwt}.${base64UrlEncode(new Uint8Array(signature))}`;
}

async function getAccessToken() {
  const serviceAccountEmail = getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = getEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");

  if (!serviceAccountEmail || !privateKey) {
    throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  }

  const assertion = await signJwt(serviceAccountEmail, normalizePrivateKey(privateKey));
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
  const spreadsheetId = getEnv("GOOGLE_SHEETS_SPREADSHEET_ID") || DEFAULT_SPREADSHEET_ID;
  const sheetName = getEnv("GOOGLE_SHEETS_SHEET_NAME") || DEFAULT_SHEET_NAME;
  const token = await getAccessToken();
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
      body: JSON.stringify({
        values: [HEADER_ROW],
      }),
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
      body: JSON.stringify({
        values: [buildRow(payload)],
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google Sheets append failed: ${response.status} ${body}`);
  }
}

export async function appendRegistrationToGoogleSheet(payload: RegistrationPayload) {
  const webhookUrl = getEnv("GOOGLE_SHEETS_WEBHOOK_URL");
  if (webhookUrl) {
    await appendViaWebhook(payload, webhookUrl);
    return;
  }

  await appendViaServiceAccount(payload);
}

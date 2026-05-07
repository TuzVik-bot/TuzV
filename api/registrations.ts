import { appendRegistrationToGoogleSheet } from "../src/lib/google-sheets.server";

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
    await appendRegistrationToGoogleSheet(normalizeRequest(req));
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Registration failed" });
  }
}

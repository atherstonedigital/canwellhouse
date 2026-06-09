import { NextResponse, type NextRequest } from "next/server";

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
const FORM_NAME = "contact";
const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type ContactPayload = {
  name?: string;
  email?: string;
  organisation?: string;
  enquiryType?: string;
  message?: string;
  token?: string;
  // Honeypot. Bots fill it; humans never see it.
  botField?: string;
};

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const fail = (message: string, status = 400) =>
  NextResponse.json({ ok: false, error: message }, { status });

export async function POST(req: NextRequest) {
  let data: ContactPayload;
  try {
    data = await req.json();
  } catch {
    return fail("Invalid request.");
  }

  const name = data.name?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const organisation = data.organisation?.trim() ?? "";
  const enquiryType = data.enquiryType?.trim() ?? "";
  const message = data.message?.trim() ?? "";
  const token = data.token ?? "";

  // Honeypot tripped: accept silently so the bot sees success, but drop it.
  if (data.botField) return NextResponse.json({ ok: true });

  if (!name || !email || !message) {
    return fail("Please complete the required fields.");
  }
  if (!isEmail(email)) {
    return fail("Please enter a valid email address.");
  }
  if (!token) {
    return fail("Please complete the verification challenge.");
  }
  if (!TURNSTILE_SECRET) {
    console.error("TURNSTILE_SECRET_KEY is not configured.");
    return fail("The form is temporarily unavailable.", 500);
  }

  // 1. Verify the Turnstile token server-side.
  const ip =
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "";

  let verified = false;
  try {
    const verifyRes = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
    });
    const outcome = (await verifyRes.json()) as { success?: boolean };
    verified = outcome.success === true;
  } catch {
    return fail("Could not reach the verification service.", 502);
  }

  if (!verified) {
    return fail("Verification failed. Please try again.");
  }

  // 2. Forward to Netlify Forms (registered via /public/__forms.html).
  //    Same-origin POST is intercepted by Netlify's form handler at the CDN.
  try {
    const body = new URLSearchParams({
      "form-name": FORM_NAME,
      name,
      email,
      organisation,
      "enquiry-type": enquiryType,
      message,
    });
    const forwardRes = await fetch(`${req.nextUrl.origin}/__forms.html`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!forwardRes.ok) {
      console.error("Netlify form submission failed:", forwardRes.status);
      return fail(
        "We could not submit your enquiry. Please email studio@canwellhouse.com.",
        502
      );
    }
  } catch {
    return fail(
      "We could not submit your enquiry. Please email studio@canwellhouse.com.",
      502
    );
  }

  return NextResponse.json({ ok: true });
}

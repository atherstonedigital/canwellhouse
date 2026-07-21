// HTTP Basic Auth gate for everything under /reports (pages and nested route
// handlers). Registered in netlify.toml against /reports and /reports/* only.
// Credentials come from the REPORTS_USER and REPORTS_PASS environment
// variables set in the Netlify UI; the function fails closed if they are
// missing.

// Netlify global provided by the edge runtime (Deno). Declared here so the
// project's TypeScript check passes without installing edge-runtime types.
declare const Netlify: { env: { get(name: string): string | undefined } };

type Context = { next: () => Promise<Response> };

function unauthorized(): Response {
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="House of Canwell Reports"',
      "Cache-Control": "no-store",
    },
  });
}

// Constant-time comparison so credential checks do not leak match length.
function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const bytesA = encoder.encode(a);
  const bytesB = encoder.encode(b);
  let diff = bytesA.length ^ bytesB.length;
  const length = Math.max(bytesA.length, bytesB.length);
  for (let i = 0; i < length; i++) {
    diff |= (bytesA[i] ?? 0) ^ (bytesB[i] ?? 0);
  }
  return diff === 0;
}

export default async function reportsAuth(
  request: Request,
  context: Context
): Promise<Response> {
  const user = Netlify.env.get("REPORTS_USER");
  const pass = Netlify.env.get("REPORTS_PASS");
  if (!user || !pass) return unauthorized();

  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return unauthorized();

  let decoded: string;
  try {
    decoded = atob(header.slice("Basic ".length).trim());
  } catch {
    return unauthorized();
  }

  const separator = decoded.indexOf(":");
  if (separator === -1) return unauthorized();
  const suppliedUser = decoded.slice(0, separator);
  const suppliedPass = decoded.slice(separator + 1);

  const userOk = timingSafeEqual(suppliedUser, user);
  const passOk = timingSafeEqual(suppliedPass, pass);
  if (!userOk || !passOk) return unauthorized();

  const response = await context.next();
  const patched = new Response(response.body, response);
  patched.headers.set("X-Robots-Tag", "noindex, nofollow");
  return patched;
}

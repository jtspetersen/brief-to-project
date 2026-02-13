/**
 * POST /api/auth
 * Verifies the demo password. Returns { success: true } or 401.
 */
export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const demoPassword = process.env.DEMO_PASSWORD;

    // If no password is configured, allow access (dev convenience)
    if (!demoPassword) {
      return Response.json({ success: true });
    }

    if (password === demoPassword) {
      return Response.json({ success: true });
    }

    return Response.json(
      { error: "Incorrect password" },
      { status: 401 }
    );
  } catch {
    return Response.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

import { Hono } from "hono";
import * as jose from "jose";
import { auth } from "../../../lib/auth";

const router = new Hono({
  strict: false,
});

router.get("/auth/session", async (c) => {
  const sessionData = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  return c.json({
    user: sessionData?.user ?? null,
    session: sessionData?.session ?? null,
  });
});

router.get("/auth/token", async (c) => {
  try {
    const sessionData = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    if (!sessionData)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const claims = {
      aud: "authenticated",
      sub: sessionData.user.id,
      role: "authenticated",
      email: sessionData.user.email,
    };
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const expiresIn = "1h";

    const token = await new jose.SignJWT(claims)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(secretKey);

    return Response.json({ token }, { status: 200 });
  } catch (error) {
    console.error("ERROR", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
});

router.on(["POST", "GET"], "/auth/*", (c) => {
  const request = new Request(c.req.raw, {
    headers: new Headers(c.req.raw.headers),
  });
  return auth.handler(request);
});

export default router;

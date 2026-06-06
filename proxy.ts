// middleware reset password
import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  if (mode === "resetPassword" && oobCode) {
    return NextResponse.redirect(
      new URL(`/reset-password?oobCode=${oobCode}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
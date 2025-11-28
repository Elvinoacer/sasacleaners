import { NextResponse } from "next/server";

// POST: Admin login
export async function POST(request: Request) {
  // TODO: Authenticate admin user
  return NextResponse.json({ message: "Admin login" });
}

// Add more endpoints for logout, session, etc. as needed

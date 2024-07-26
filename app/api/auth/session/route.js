import { getSessionUser } from "@/utils/getSessionUser";
import { NextResponse } from "next/server";

export async function GET(request) {
  const sessionUser = await getSessionUser();
  if (sessionUser) {
    return NextResponse.json(sessionUser);
  } else {
    return NextResponse.json(null);
  }
}

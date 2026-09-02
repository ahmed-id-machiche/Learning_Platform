import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await db.studentProfile.findUnique({
      where: { userId },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[STUDENT_PROFILE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    const { year, filiere } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!year || !filiere) {
      return new NextResponse("Year and Filiere are required", { status: 400 });
    }

    const profile = await db.studentProfile.upsert({
      where: { userId },
      update: {
        year,
        filiere,
      },
      create: {
        userId,
        year,
        filiere,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[STUDENT_PROFILE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

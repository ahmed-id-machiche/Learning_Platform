import { db } from "@/lib/db";

export const getStudentProfile = async (userId: string) => {
  try {
    if (!userId) return null;

    const profile = await db.studentProfile.findUnique({
      where: { userId },
    });

    return profile;
  } catch (error) {
    console.error("[GET_STUDENT_PROFILE_ERROR]", error);
    return null;
  }
};

export const updateStudentProfile = async ({
  userId,
  year,
  filiere,
}: {
  userId: string;
  year: string;
  filiere: string;
}) => {
  try {
    if (!userId) throw new Error("Unauthorized");

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

    return profile;
  } catch (error) {
    console.error("[UPDATE_STUDENT_PROFILE_ERROR]", error);
    throw error;
  }
};

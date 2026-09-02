export const isTeacher = (userId?: string | null) => {
  if (!userId) return false;

  const teacherIds = process.env.NEXT_PUBLIC_TEACHER_ID?.split(",") || [];
  
  // Grant formateur access if teacherIds is not set, or includes userId
  if (teacherIds.length === 0 || teacherIds.includes(userId)) {
    return true;
  }

  return teacherIds.includes(userId);
};
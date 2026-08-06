export const isTeacher = (userId?: string | null) => {
  if (!userId) return false;
  // Allow all logged-in users/teachers to access Teacher Mode
  return true;
};
import { hasAttendedForToday } from "@/actions/user-progress";

// Create a function to handle the async call to check if the user attended today
export const checkAttendanceToday = async (): Promise<boolean> => {
  const attended = await hasAttendedForToday();
  return attended;
};

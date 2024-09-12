import { auth } from "@clerk/nextjs/server";

const adminIds = ["user_2kfzKdm9gb8gM2CHRASEEeJL2jm"];

export const getIsAdmin = () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  return adminIds.indexOf(userId) !== -1;
};

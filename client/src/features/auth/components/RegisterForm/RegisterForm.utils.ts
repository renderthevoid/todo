import { User } from "@/types";
import { UserOption } from "../../types/auth.types";

export const mapUsersToOptions = (users: User[]): UserOption[] => {
  return users.map(user => ({
    id: user.id,
    label: `${user.lastName} ${user.firstName} ${user.middleName}`.trim(),
  }));
};
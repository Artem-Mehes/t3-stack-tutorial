import type { User } from "@clerk/backend";

export const mapUser = (user: User) => ({
  id: user.id,
  username: user.username,
  profileImageUrl: user.profileImageUrl,
});

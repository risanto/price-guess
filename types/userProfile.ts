export type UserProfile = {
  id?: number;
  created_at?: string;
  email: string;
  role: string;
  points: number;
  points_last_added: string;
};

export type UserProfileUpdate = {
  email?: string;
  role?: string;
  points?: number;
  points_last_added?: string;
};

export type UserData = {
  email: string;
  phone: string;
  points: number;
};

export type UserProfile = {
  id?: number;
  created_at?: string;
  email: string;
  role: string;
  points: number;
  points_last_added: string;
};

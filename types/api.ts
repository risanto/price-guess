export interface FetchApiResponse<T = any> {
  statusCode: number;
  data: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface ApiResponse<T = any> {
  statusCode?: number;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export type Config = {
  id: number;
  items: {
    current_content: {
      id: number;
      expires_at: string;
    };
  };
};

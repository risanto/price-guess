export interface ApiResponse<T = any> {
  statusCode?: number;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

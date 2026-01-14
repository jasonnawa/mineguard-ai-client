import { api } from "../api";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: string;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post("auth/login", payload);
  if (response.data.token) localStorage.setItem("token", response.data.token)
  return response.data;
};

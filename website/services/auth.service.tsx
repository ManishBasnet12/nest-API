// website/src/services/login.service.ts
import { api } from "../lib/api-client";

export type Role = "USER" | "SELLER";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: Role;
    [key: string]: unknown;
  };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: Role;
    [key: string]: unknown;
  };
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/user/login", payload);
  return data;
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/user/register", payload);
  return data;
}



export function persistAuthSession(data: LoginResponse): void {
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("user", JSON.stringify(data.user));
  try {
    window.dispatchEvent(new Event("auth_change"));
  } catch {}
}

export function clearAuthSession(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  try {
    window.dispatchEvent(new Event("auth_change"));
  } catch {}
}

export function getToken(): string | null {
  try {
    return localStorage.getItem("access_token");
  } catch {
    return null;
  }
}

export function getUser(): LoginResponse["user"] | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
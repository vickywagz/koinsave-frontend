import axios from "axios";

const BASE_URL = "https://691adb2c2d8d7855757071e9.mockapi.io";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ---- TYPES ----
export type User = {
  id: string;
  name?: string;
  email: string;
  password: string;
  balance: number;
};

export type Transaction = {
  id: string;
  userId: string;
  type: "sent" | "received";
  amount: number;
  to?: string;
  from?: string;
  date: string;
  note?: string;
};

// ---- AUTH ----
export const signupUser = async (email: string, password: string, name?: string) => {
  return api.post<User>("/users", { name, email, password, balance: 0 });
};

export const loginUser = async (email: string, password: string) => {
  const { data: users } = await api.get<User[]>("/users");
  return users.find(u => u.email === email && u.password === password);
};

// ---- TRANSACTIONS ----
export const sendMoney = async (
  userId: string,
  amount: number,
  type: "sent" | "received",
  to?: string,
  from?: string,
  note?: string
) => {
  return api.post<Transaction>("/transactions", { userId, amount, type, to, from, note, date: new Date().toISOString() });
};

export const getUserTransactions = async (userId: string) => {
  const { data } = await api.get<Transaction[]>("/transactions");
  return data.filter(t => t.userId === userId);
};

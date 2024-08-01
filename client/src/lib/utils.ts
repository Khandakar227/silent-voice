import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getLoggedInUser = async () => {
  const token = localStorage.getItem("token");
  const res = await (await fetch("/api/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })).json();
  console.log(res)
  if (res.error) {
    localStorage.removeItem("token");
    return;
  }
  return res;
}
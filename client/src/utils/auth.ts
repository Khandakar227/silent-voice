import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import User from "./models/User";
// import jwt from 'jsonwebtoken';

const LOGIN_DURATION = '7d'

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hashedPassword}`;
}

export function checkPasswordMatch(password: string, hashedPassword: string) {
  const [salt, key] = hashedPassword.split(":");
  const hashedBuffer = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  const match = timingSafeEqual(hashedBuffer, keyBuffer);

  if (match) return true;
  return false;
}

export async function login(email: string, password: string) {
  if (!email || !password)
    throw Error("Invalid email or password.");

  const user = await User.findOne({ email });

  if (!user)
    throw Error("Invalid email or password.");
  if (checkPasswordMatch(password, user.password)) {
    const userInfo = {
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    };

    const token = jwt.sign(userInfo, process.env.JWT_SECRET_KEY as string, {
      expiresIn: LOGIN_DURATION,
    });
    return { token, userInfo };
  } else throw Error("Invalid email or password.");
}

export const getLoggedInUser = async () => {
  const token = localStorage.getItem("token");
  const res = await (await fetch("/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })).json();
  if (res.error) {
    localStorage.removeItem("token");
    return;
  }
  return res;
}

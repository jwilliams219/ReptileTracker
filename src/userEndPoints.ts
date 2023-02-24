import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { RequestWithJWTBody } from "./index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type createUserBody = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  }
  
// Create User
export const createUser = (client: PrismaClient): RequestHandler => async (req, res) => {
  const { firstName, lastName, email, password } = req.body as createUserBody;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Missing Data" });
  }
  const existingUser = await client.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return res.status(401).json({ error: 'Email is already in use:', email });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await client.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
    }
  });
  const token = jwt.sign({
    userId: user.id
  }, process.env.ENCRYPTION_KEY!!, {
    expiresIn: '15m'
  });
  res.json({ user, token });
  return;
}

type LoginBody = {
  email: string,
  password: string,
}
  
// Log in
export const logIn = (client: PrismaClient): RequestHandler => async (req, res) => {
  const { email, password } = req.body as LoginBody;
  const user = await client.user.findFirst({
    where: { email },
    select: { id: true, passwordHash: true},
  });
  if (!user) {
    return res.status(404).json({ message: "Invalid email or password"});
  }
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(404).json({ message: "Invalid email or password"});
  }
  const token = jwt.sign({
    userId: user.id
  }, process.env.ENCRYPTION_KEY!!, {
    expiresIn: '30m'
  });
  res.json({
    user,
    token
  });
  return;
}
  
// List all the schedules for a user.
export const listUserSchedules = (client: PrismaClient): RequestHandler => async (req: RequestWithJWTBody, res) => {
  const userId = req.jwtBody?.userId;
  if (!userId) {
    return res.status(400).json({ message: "Missing Reptile Data"});
  }
  const records = await client.schedule.findMany({
    where: {
      userId: {
        equals: userId,
      }
    }
  });
  res.json({ records });
  return;
}
  
// Get Current user.
export const getMe = (client: PrismaClient): RequestHandler => async (req: RequestWithJWTBody, res) => {
  const userId = req.jwtBody?.userId;
  if (!userId) {
    return res.status(401).json({ message: "unauthorized" });
  }
  const user = await client.user.findFirst({
    where: {
      id: userId
    }
  });
  res.json({ user });
  return;
}
  
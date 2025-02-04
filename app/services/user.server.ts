import type { Password } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

import type { User as PrismaUser } from "@prisma/client";

export type User = PrismaUser & {
  firstName: string;
  lastName: string;
}

export async function getUsers() {
  return prisma.user.findMany()
}

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export function updateUser(userId: string, formData: FormData) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export function validateUserEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 5 && email.includes("@");
}

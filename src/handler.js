import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();

export const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      username: true,
      email: true,
      code: true,
    }
  });
  const result = users.map(({ code, ...user }) => ({
    id: code,
    ...user,
  }));
  res.send(result);
}

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (username.length < 3) {
    res.status(400);
    res.json({
      status: 'fail',
      message: 'Gagal menambahkan user. Mohon isi username',
    });
    return res;
  }

  const isEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  if (email === undefined || email === '' || !isEmail(email)) {
    res.status(400);
    res.json({
      status: 'fail',
      message: 'Gagal menambahkan user. Mohon isi email dengan benar',
    });
    return res;
  }

  if (password.length < 6) {
    res.status(400);
    res.json({
      status: 'fail',
      message: 'Gagal menambahkan user. Mohon isi password minimal 6 karakter',
    });
    return res;
  }

  res.status(201);
  res.json(
    {
      status: 'success',
      message: 'User berhasil ditambahkan',
    },
  );
  return res;
}
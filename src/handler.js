import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
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
  const hash = bcrypt.hashSync('bacon', 8);


  try {
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hash,
        code: uuidv4(),
      }
    });

    res.status(201);
    res.json(
      {
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: user
      },
    );
    return res;

  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        const duplicate = (String(e.meta.target).includes("email")) ? "Email" : "Username";
        res.status(400);
        res.json({
          status: 'fail',
          message: `Gagal menambahkan user. ${duplicate} sudah digunakan`,
        });
        return res;
      }
    }
  }
}
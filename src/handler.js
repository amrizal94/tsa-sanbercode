import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();

// export const getAllUsers = async (req, res) => {
//   const users = await prisma.user.findMany({
//     select: {
//       username: true,
//       email: true,
//       code: true,
//     }
//   });
//   const result = users.map(({ code, ...user }) => ({
//     id: code,
//     ...user,
//   }));
//   res.send(result);
// }

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (username === undefined || username.length < 3) {
    res.status(400);
    res.json({
      status: 'fail',
      message: 'Gagal menambahkan user. Mohon isi username minimal 3 karakter',
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

  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      // Store hash in your password DB.
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
    });
  });
}

export const login = async (req, res) => {
  const { username, password } = req.body;

  // validate username from request body
  if (username === undefined) {
    res.status(401);
    res.json({
      status: 'fail',
      message: 'Mohon isi username dengan benar',
    });
    return res;
  }

  // query get password from database by username
  const user = await prisma.user.findUnique({
    where: {
      username
    },
    select: {
      id: true,
      password: true,
    },
  })

  // check result query
  if (!user) {
    res.status(401);
    res.json({
      status: 'fail',
      message: 'Username belum terdaftar',
    });
    return res;
  }

  // check password
  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      const secret = process.env.JWT_SECRET_KEY || 'secret'
      const expiresIn = 60 * 60 * 1
      const token = jwt.sign(user, secret, { expiresIn });
      res.status(200);
      res.json({
        status: 'success',
        token
      });
      return res;
    }
    res.status(401);
    res.json({
      status: 'fail',
      message: 'Password salah',
    });
    return res;
  });
}
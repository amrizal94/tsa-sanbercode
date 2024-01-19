import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from 'bcrypt';
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

  // validate username from request body
  if (username === undefined || username.length < 3) {
    res.status(400)
      .json({
        status: 'fail',
        message: 'Gagal menambahkan user. Mohon isi username minimal 3 karakter',
      });
    return res;
  }

  // validate email from request body
  const isEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  if (email === undefined || email === '' || !isEmail(email)) {
    res.status(400)
      .json({
        status: 'fail',
        message: 'Gagal menambahkan user. Mohon isi email dengan benar',
      });
    return res;
  }

  // validate password from request body
  if (password.length < 6) {
    res.status(400)
      .json({
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
        await prisma.user.create({
          data: {
            email,
            username,
            password: hash,
          }
        });

        res.status(201)
          .json(
            {
              status: 'success',
              message: 'User berhasil ditambahkan'
            },
          );
        return res;

      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
            const duplicate = (String(e.meta.target).includes("email")) ? "Email" : "Username";
            res.status(400)
              .json({
                status: 'fail',
                message: `Gagal menambahkan user. ${duplicate} sudah digunakan`,
              });
            return res;
          }
        }
        return res.status(500).json({
          status: 'fail',
          message: 'query error create user',
        })
      }
    });
  });
}

export const login = async (req, res) => {
  const { username, password } = req.body;

  // validate username from request body
  if (username === undefined) {
    res.status(401)
      .json({
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
    res.status(401)
      .json({
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
      res.status(200)
        .json({
          status: 'success',
          token
        });
      return res;
    }
    res.status(401)
      .json({
        status: 'fail',
        message: 'Password salah',
      });
    return res;
  });
}


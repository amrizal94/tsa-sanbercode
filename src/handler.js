import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken"
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extention = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + extention)
  }
})

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
})
const uploadSingleImage = upload.single('image');

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
    res.status(400)
      .json({
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
    res.status(400)
      .json({
        status: 'fail',
        message: 'Gagal menambahkan user. Mohon isi email dengan benar',
      });
    return res;
  }

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
        const user = await prisma.user.create({
          data: {
            email,
            username,
            password: hash,
            code: uuidv4(),
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

export const getBooks = (req, res) => {
  uploadSingleImage(req, res, (error) => {
    if (error) {
      console.log(error)
      return res.status(400).json({
        status: 'fail',
        message: 'Tipe file tidak diperbolehkan',
      })
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    return res.status(200)
      .json({
        user: req.userData,
        image: req.file,
        image_url: imageUrl
      })
  })
}
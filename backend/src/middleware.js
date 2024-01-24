import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const accessToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      status: 'fail',
      message: 'Token diperlukan',
    })
  }
  const token = authorization.split(' ')[1];
  const secret = process.env.JWT_SECRET_KEY || 'secret';
  try {
    const jwtDecode = jwt.verify(token, secret);
    req.userData = jwtDecode;
  } catch (error) {
    if (error.message === "jwt expired") {
      return res.status(440).json({
        status: 'fail',
        message: `Your's session has expired and must log in again.`
      })
    }
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized',
    });
  }
  next();
};

export const checkUser = async (req, res, next) => {
  const { code } = req.userData
  if (!code) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized',
    });
  }
  const user = await prisma.user.findUnique({
    where: { code },
    select: {
      username: true
    }
  })
  if (!user) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized',
    });
  }
  req.userData.username = user.username;
  next();
}
import jwt from 'jsonwebtoken'

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
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized',
    });
  }
  next();
};
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
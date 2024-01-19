import multer from 'multer';
import path from 'path';
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();


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
      req.statusCode = 415
      req.statusMessage = "Unsupported Media"
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
})

const uploadSingleImage = upload.single('image');

export const addBooks = (req, res) => {
  uploadSingleImage(req, res, async (error) => {
    if (error) {
      if (req.statusCode === 415) {
        return res.status(400).json({
          status: 'fail',
          message: 'Tipe file tidak diperbolehkan',
        })
      }
      return res.status(500).json({
        status: 'fail',
        message: 'Server error. handling multipart/form-data',
      })
    }
    const { title, description, release_year, price, total_page, category_id } = req.body;
    console.log(!isNaN(release_year))
    if (isNaN(release_year) || release_year < 1980 || release_year > 2021) {
      return res.status(404).json({
        status: 'fail',
        message: 'Gagal menambahkan book. Nilai release_year minimal 1980 dan maksimal adalah 2021'
      })
    }

    if (isNaN(total_page)) {
      return res.status(404).json({
        status: 'fail',
        message: 'Gagal menambahkan book. Mohon isi total_page dengan benar'
      })
    }

    if (title === undefined || title === '') {
      return res.status(404).json({
        status: 'fail',
        message: 'Gagal menambahkan book. Mohon isi title dengan benar'
      })
    }

    if (isNaN(price)) {
      return res.status(404).json({
        status: 'fail',
        message: 'Gagal menambahkan book. Mohon isi price dengan benar'
      })
    }

    if (category_id === undefined || category_id === '') {
      return res.status(404).json({
        status: 'fail',
        message: 'Gagal menambahkan book. Mohon isi category_id'
      })
    }

    const thickness = (total_page <= 100) ? "tipis" : (total_page <= 200) ? "sedang" : "tebal"
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const category = await prisma.category.findUnique({
      select: {
        id: true,
        name: true,
      },
      where: {
        code: category_id, deleted: false,
      },
    })
    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Gagal menambahkan book. Category yang dicari dengan category_id tidak ditemukan'
      });
    }

    try {
      await prisma.book.create({
        data: {
          title,
          description,
          release_year,
          price,
          total_page,
          categoryCode: category_id,
          thickness,
          image_url: imageUrl,
        }
      })
      return res.status(201).json({
        status: 'success',
        message: 'Book berhasil ditambahkan'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'fail',
        message: 'query error create book',
      })
    }
  })
}

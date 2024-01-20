import multer from 'multer';
import path from 'path';
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const uploadPath = 'uploads/'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/${uploadPath}`)
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

export const addBookHandler = (req, res) => {
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

    const thickness = (total_page <= 100) ? "tipis" : (total_page <= 200) ? "sedang" : "tebal";
    const image_url = (req.file) ? req.file.filename : undefined;

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
          release_year: parseInt(release_year),
          price,
          total_page: parseInt(total_page),
          category_code: category_id,
          thickness,
          image_url
        }
      })
      return res.status(201).json({
        status: 'success',
        message: 'Book berhasil ditambahkan'
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'fail',
        message: 'query create book error',
      })
    }
  })
}

export const editBookByIdHandler = (req, res) => {
  uploadSingleImage(req, res, async (error) => {
    const { id } = req.params;
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
    if (release_year && (isNaN(release_year) || release_year < 1980 || release_year > 2021)) {
      return res.status(404).json({
        status: 'fail',
        message: 'Gagal menambahkan book. Nilai release_year minimal 1980 dan maksimal adalah 2021'
      })
    }

    if (price && isNaN(price)) {
      return res.status(404).json({
        status: 'fail',
        message: 'Gagal menambahkan book. Mohon isi price dengan benar'
      })
    }

    if (total_page && isNaN(total_page)) {
      return res.status(404).json({
        status: 'fail',
        message: 'Gagal menambahkan book. Mohon isi total_page dengan benar'
      })
    }
    const thickness = (total_page) ? (total_page <= 100) ? "tipis" : (total_page <= 200) ? "sedang" : "tebal" : undefined;
    const image_url = (req.file) ? req.file.filename : undefined;

    if (category_id) {
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
    }
    try {
      await prisma.book.update({
        where: { code: id, deleted: false },
        data: {
          title,
          description,
          release_year: (release_year) ? parseInt(release_year) : undefined,
          price,
          total_page: (total_page) ? parseInt(total_page) : undefined,
          category_code: category_id,
          thickness,
          image_url
        },
      })
      return res.status(200).json({
        status: 'success',
        message: 'Book berhasil diperbarui',
      })
    } catch (error) {
      console.log(error)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return res.status(404).json({
            status: 'fail',
            message: 'Gagal memperbarui book. ID book tidak ditemukan'
          });
        }
      }
      return res.status(500).json({
        status: 'fail',
        message: 'query update book error',
      })
    }

  })
}

export const getAllBooksHandler = async (req, res) => {
  let { sortByTitle, minYear, maxYear, minPage, maxPage, title } = req.query;
  const { id } = req.params;
  const setSortByTitle = { sortByTitle } ? { title: sortByTitle } : {};
  let where = (id) ? { category_code: id, deleted: false } : { deleted: false };

  if (sortByTitle && sortByTitle !== 'asc' && sortByTitle !== 'desc') {
    return res.status(404).json({
      status: 'fail',
      message: `Gagal sorting book by title. mohon isi query sortByTitle dengan 'asc' atau 'desc'`
    });
  }

  if (minYear && isNaN(minYear)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal filtering book dengan minYear. Nilai minYear harus berupa angka'
    })
  }
  minYear = parseInt(minYear)
  where = { ...where, release_year: { gte: minYear } }

  if (maxYear && isNaN(maxYear)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal filtering book dengan maxYear. Nilai maxYear harus berupa angka'
    })
  }
  maxYear = parseInt(maxYear)
  where = { ...where, release_year: { lte: maxYear } }

  if (minYear && maxYear && (minYear > maxYear)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal filtering book dengan tahun. Nilai maxYear harus lebih besar dari minYear'
    })
  }

  if (minPage && isNaN(minPage)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal filtering book dengan minPage. Nilai minPage harus berupa angka'
    })
  }
  minPage = parseInt(minPage)
  where = { ...where, total_page: { gte: minPage } }

  if (maxPage && isNaN(maxPage)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal filtering book dengan maxPage. Nilai maxPage harus berupa angka'
    })
  }
  maxPage = parseInt(maxPage)
  where = { ...where, total_page: { lte: maxPage } }

  if (minPage && maxPage && (minPage > maxPage)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal filtering book dengan page. Nilai maxPage harus lebih besar dari minPage'
    })
  }

  if (title) {
    where = { ...where, title: { contains: title } }
  }

  const books = await prisma.book.findMany({
    where: where,
    select: {
      code: true,
      title: true,
      description: true,
      image_url: true,
      release_year: true,
      price: true,
      total_page: true,
      thickness: true,
      category: {
        select: {
          code: true,
          name: true
        }
      },
    },
    orderBy: setSortByTitle,
  })

  const result = books.map(({ code, image_url, category, ...book }) => ({
    id: code,
    ...book,
    image_url: `${req.protocol}://${req.get('host')}/uploads/${image_url}`,
    category: {
      id: category.code,
      name: category.name
    }
  }));
  return res.status(200).json({
    status: 'success',
    data: {
      books: result,
    }
  })
};

export const deletedBookByIdHandler = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.book.update({
      where: { code: id, deleted: false },
      data: { deleted: true }
    });
    return res.status(200).json({
      status: 'success',
      message: 'Book berhasil dihapus'
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          status: 'fail',
          message: 'Gagal menghapus book. ID book tidak ditemukan'
        });
      }
    }
    return res.status(500).json({
      status: 'fail',
      message: 'query delete book error'
    })
  }
}
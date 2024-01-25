import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const addCategory = async (req, res) => {
  const { name } = req.body;

  // validate name from request body
  if (name === undefined || name.length < 3) {
    res.status(400)
      .json({
        status: 'fail',
        message: 'Gagal menambahkan category. Mohon isi nama kategorinya minimal 3 karakter',
      });
    return res;
  }
  try {
    await prisma.category.upsert({
      where: {
        deleted: true,
        name
      },
      update: {
        deleted: false
      },
      create: {
        name
      },
    })
    res.status(200).json({
      status: 'success',
      message: 'Category berhasil ditambahkan'
    });
    return res;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(404).json({
          status: 'fail',
          message: 'Gagal menambahkan Category. Nama category sudah digunakan',
        })
      }
    }
    return res.status(500).json({
      status: 'fail',
      message: 'query create category error',
    })
  }
}

export const getAllCategory = async (req, res) => {
  const categories = await prisma.category.findMany({
    select: {
      code: true,
      name: true,
    },
    where: {
      deleted: false
    }
  });
  const result = categories.map(({ code, ...category }) => ({
    id: code,
    ...category,
  }));
  return res.status(200).json({
    status: 'success',
    data: {
      categories: result,
    },
  })
}

export const getCategoryByIdHandler = async (req, res) => {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    select: {
      name: true,
    },
    where: {
      code: id, deleted: false,
    },
  })
  if (!category) {
    return res.status(404).json({
      status: 'fail',
      message: 'Category yang dicari tidak ada'
    });
  }
  res.status(200).json({
    status: 'success',
    data: { category }
  })
}

export const editCategoryByIdHandler = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await prisma.category.update({
      where: { code: id, deleted: false },
      data: { name },
    })
    return res.status(200).json({
      status: 'success',
      message: 'Category berhasil diperbarui',
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(400)
          .json({
            status: 'fail',
            message: 'Gagal memperbarui category. Nama category sudah digunakan',
          });
      }
      if (error.code === 'P2025') {
        return res.status(404).json({
          status: 'fail',
          message: 'Gagal memperbarui category. ID category tidak ditemukan'
        });
      }
    }
    return res.status(500).json({
      status: 'fail',
      message: 'query update category error',
    })
  }
}

export const deleteCategoryByIdHandler = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.category.update({
      where: { code: id, deleted: false },
      data: { deleted: true },
    })
    return res.status(200).json({
      status: 'success',
      message: 'Category berhasil dihapus',
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          status: 'fail',
          message: 'Gagal menghapus category. ID category tidak ditemukan'
        });
      }
    }
    return res.status(500).json({
      status: 'fail',
      message: 'query delete category error',
    })
  }
}

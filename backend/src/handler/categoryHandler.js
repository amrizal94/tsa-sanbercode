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
    const category = await prisma.category.create({ data: { name } });
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
  }
}

export const getAllCategory = async (req, res) => {
  const categories = await prisma.category.findMany({
    select: {
      code: true,
      name: true,
      createdAt: true,
      updatedAt: true
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
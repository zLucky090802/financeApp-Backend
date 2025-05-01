const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export const getCategorias = async (req: any, res: any) => {
  const { usuario_id } = req.params;

  if (!usuario_id) {
    return res.status(400).json({ error: "usuario_id es requerido" });
  }

  const categorias = await prisma.categorias.findMany({
    where: {
      usuario_id: Number(usuario_id),
    },
  });

  res.json(categorias);
};


export const getCategoriaById = async (req:any, res:any) => {
  const { id } = req.params
  const categoria = await prisma.categorias.findUnique({ where: { id: parseInt(id) } })
  categoria ? res.json(categoria) : res.status(404).json({ error: 'No encontrada' })
}

export const createCategoria = async (req:any, res:any) => {
  const { usuario_id, nombre, tipo } = req.body
  const nuevaCategoria = await prisma.categorias.create({
    data: { usuario_id, nombre, tipo }
  })
  res.status(201).json(nuevaCategoria)
}

export const updateCategoria = async (req:any, res:any) => {
  const { id } = req.params
  const { usuario_id, nombre, tipo } = req.body
  const categoria = await prisma.categorias.update({
    where: { id: parseInt(id) },
    data: { usuario_id, nombre, tipo }
  })
  res.json(categoria)
}

export const deleteCategoria = async (req:any, res:any) => {
  const { id } = req.params
  await prisma.categorias.delete({ where: { id: parseInt(id) } })
  res.json({ message: 'Eliminado' })
}

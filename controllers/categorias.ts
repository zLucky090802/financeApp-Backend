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
export const createCategoria = async (req: any, res: any) => {
  const { usuario_id, nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "El nombre es requerido" });
  }

  try {
    const nuevaCategoria = await prisma.categorias.create({
      data: { usuario_id, nombre }, 
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ error: "Error interno al crear la categoría" });
  }
};

export const updateCategoria = async (req: any, res: any) => {
  const { id } = req.params;
  const { usuario_id, nombre } = req.body;

  try {
    const categoria = await prisma.categorias.update({
      where: { id: parseInt(id) },
      data: { usuario_id, nombre },
    });
    res.json(categoria);
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    res.status(500).json({ error: "Error interno al actualizar la categoría" });
  }
};


export const deleteCategoria = async (req:any, res:any) => {
  const { id } = req.params
  await prisma.categorias.delete({ where: { id: parseInt(id) } })
  res.json({ message: 'Eliminado' })
}

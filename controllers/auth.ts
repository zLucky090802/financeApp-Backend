import { Request, Response } from 'express';  // Importando los tipos correctos de Express
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { where } from 'sequelize';
import { ok } from 'assert';

const prisma = new PrismaClient();

export const crearUsuario = async (req: any, res: any) => {
  const { nombre, email, password } = req.body;

  // Verificación de los datos
  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  try {
    
    const salt = await bcrypt.genSalt(10);
    const passwordCifrada =  bcrypt.hashSync(password, salt);

    
    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        nombre,
        email,
        password: passwordCifrada,  // Guardamos la contraseña cifrada
      },
    });

    return res.status(201).json({ message: 'Usuario creado', usuario: nuevoUsuario });
  } catch (error) {
    return res.status(500).json({ message: 'Error creando el usuario', error });
  }
};

export const loginUsuario = async (req: any, res: any) => {
    const { email, password } = req.body;
  
    // Verifica que venga el email
    if (!email) {
      return res.status(400).json({ message: 'El email es obligatorio.' });
    }
  
    try {
     
      const usuario = await prisma.usuarios.findUnique({
        where: { email },
      });

      const validPassword = bcrypt.compareSync(password, usuario.password);
  
      // Si no se encuentra el usuario
      if (!usuario) {
        return res.status(404).json({ 
          message: `No se encontró ningún usuario con el email: ${email}` 
        });
      }

      if(!validPassword){
        return res.status(400).json({
            ok:false,
            msg: 'Password Incorrecto'
        })
      }
  
      // Si se encuentra, se retorna con status 200
      return res.status(200).json({
        message: 'Usuario encontrado correctamente.',
        usuario: {
          
          ok:true,
          nombre: usuario.nombre,
          email: usuario.email,
          
        },
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Ocurrió un error al buscar el usuario.',
        error,
      });
    }
  };
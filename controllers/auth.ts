import { Request, Response } from 'express';  // Importando los tipos correctos de Express
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { where } from 'sequelize';
import { ok } from 'assert';
import { generarJWT } from '../helpers/jwt';

const prisma = new PrismaClient();
export const crearUsuario = async (req: any, res: any) => {
  const { nombre, email, password } = req.body;
  console.log(req.body);

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  try {
    // 👉 Verifica si ya existe un usuario con ese email
    const usuarioExistente = await prisma.usuarios.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(409).json({ message: 'El usuario ya existe con ese email' });
    }

    // Si no existe, procede a crear el usuario
    const salt = await bcrypt.genSalt(10);
    const passwordCifrada = bcrypt.hashSync(password, salt);

    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        nombre,
        email,
        password: passwordCifrada,
      },
    });

    return res.status(201).json({ 
      message: 'Usuario creado',
      usuario: { id: nuevoUsuario.id, email: nuevoUsuario.email }  // puedes retornar más datos si quieres
    });

  } catch (error) {
    console.error(error);
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
      

      const validPassword = bcrypt.compareSync(password, usuario!.password);
  
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
  
      const token = await generarJWT(usuario.id, usuario.nombre);
      const refreshToken = await generarJWT(usuario.id, usuario.nombre); 
      
      return res.status(200).json({
        message: 'Usuario encontrado correctamente.',
        usuario: {
          
          ok:true,
          nombre: usuario.nombre,
          email: usuario.email,
          id: usuario.id,
          token,
          refreshToken
          
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
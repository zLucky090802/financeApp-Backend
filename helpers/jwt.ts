import jwt from 'jsonwebtoken';

interface JWTPayload {
  uid: number;
  name: string;
}

export const generarJWT = (uid: number, name: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const payload: JWTPayload = { uid, name };

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED as string,
      {
        expiresIn: '1h',
      },
      (err, token) => {
        if (err || !token) {
          console.error(err);3
          reject('No se pudo generar el token');
        } else {
          resolve(token);
        }
      }
    );
  });
};

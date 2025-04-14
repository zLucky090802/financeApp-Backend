import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth'; // 👈 importación correcta

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/financeApp/auth', authRoutes); // 👈 pasando el router correctamente



app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

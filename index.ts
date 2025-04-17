import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth'; 
import categoriasRoutes from './routes/categorias';
import accountRoutes from './routes/accounts'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/financeApp/auth', authRoutes); 
app.use('/financeApp/accounts',accountRoutes);




app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

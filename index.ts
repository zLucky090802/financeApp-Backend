import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth'; 
import categoriasRoutes from './routes/categorias';
import accountRoutes from './routes/accounts'
import movementRoutes from './routes/movements'
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:8100',  // Especifica el origen permitido
  methods: 'GET,POST,PUT,DELETE',  // Métodos permitidos
  allowedHeaders: 'Content-Type, Authorization'  // Encabezados permitidos
}));

app.use('/financeApp/auth', authRoutes); 
app.use('/financeApp/accounts',accountRoutes);
app.use('/financeApp/movements', movementRoutes);
app.use('/financeApp/categorias', categoriasRoutes);





app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

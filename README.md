# 💰 FinanceApp Backend

Backend RESTful API para una aplicación de finanzas personales. Permite gestionar usuarios, cuentas, transacciones y categorías con autenticación segura mediante JWT.

---

## 🚀 Tecnologías

- **Node.js** + **TypeScript**
- **Express 5** — Framework web
- **Prisma ORM** — Acceso a base de datos
- **MySQL** — Base de datos relacional
- **JWT** — Autenticación con tokens
- **bcryptjs** — Hash de contraseñas
- **express-validator** — Validación de campos
- **dotenv** — Variables de entorno

---

## 📁 Estructura del proyecto

```
financeApp-Backend/
├── controllers/        # Lógica de negocio por módulo
│   ├── auth.ts
│   ├── accounts.ts
│   ├── movements.ts
│   └── categorias.ts
├── routes/             # Definición de rutas
│   ├── auth.ts
│   ├── accounts.ts
│   ├── movements.ts
│   └── categorias.ts
├── middlewares/        # Validación de tokens y campos
│   ├── authMiddleware.ts
│   └── validar-campos.ts
├── helpers/            # Utilidades (JWT)
│   └── jwt.ts
├── database/           # Configuración de base de datos
│   └── config.ts
├── prisma/
│   └── schema.prisma   # Modelos de datos
└── index.ts            # Entrada principal
```

---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/financeApp-Backend.git
cd financeApp-Backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/financeapp"
JWT_SECRET=tu_clave_secreta
```

### 4. Generar el cliente de Prisma

```bash
npx prisma generate
```

### 5. Ejecutar migraciones

```bash
npx prisma db push
```

### 6. Iniciar el servidor

```bash
# Desarrollo (con hot-reload)
npm run dev

# Producción
npm start
```

---

## 🗄️ Modelos de base de datos

| Modelo | Descripción |
|---|---|
| `usuarios` | Datos de registro e inicio de sesión |
| `cuentas` | Cuentas financieras del usuario (predeterminadas y personalizadas) |
| `transacciones` | Movimientos de ingreso/egreso |
| `categorias` | Categorías personalizadas por usuario |

---

## 🔌 Endpoints de la API

Base URL: `/financeApp`

### 🔐 Auth — `/auth`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/auth/new` | Registrar nuevo usuario |
| `POST` | `/auth/` | Iniciar sesión (retorna JWT) |

### 🏦 Cuentas — `/accounts`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/accounts/predeterminadas` | Obtener cuentas predeterminadas |
| `GET` | `/accounts/personalizadas/:usuario_id` | Obtener cuentas del usuario |
| `GET` | `/accounts/:id` | Obtener cuenta por ID |
| `POST` | `/accounts/` | Crear nueva cuenta |
| `PUT` | `/accounts/:id` | Actualizar cuenta |
| `DELETE` | `/accounts/:id/:usuario_id` | Eliminar cuenta |
| `GET` | `/accounts/balance/:usuario_id/:cuenta_id` | Obtener balance de una cuenta |

### 💸 Movimientos — `/movements`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/movements/` | Crear transacción |
| `GET` | `/movements/:usuario_id` | Listar transacciones por usuario |
| `PUT` | `/movements/:id` | Actualizar transacción |
| `DELETE` | `/movements/:id` | Eliminar transacción |
| `GET` | `/movements/balance/:usuario_id` | Balance total del usuario |
| `GET` | `/movements/movement/:id` | Obtener transacción por ID |
| `GET` | `/movements/cuenta-nombre/:usuario_id/:nombre_cuenta` | Movimientos por nombre de cuenta |

### 🏷️ Categorías — `/categorias`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/categorias/usuario/:usuario_id` | Obtener categorías del usuario |
| `GET` | `/categorias/:id` | Obtener categoría por ID |
| `POST` | `/categorias/` | Crear categoría |
| `PUT` | `/categorias/:id` | Actualizar categoría |
| `DELETE` | `/categorias/:id` | Eliminar categoría |

---

## 🔒 Autenticación

Las rutas protegidas requieren un token JWT en el header:

```
Authorization: Bearer <token>
```

El token se obtiene al iniciar sesión en `POST /financeApp/auth/`.

---

## 🌐 CORS

Por defecto, la API acepta peticiones desde `http://localhost:8100`. Para cambiar el origen permitido, modifica la configuración de CORS en `index.ts`.

---

## 📄 Licencia

ISC

// Importa express usando ESModules
import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from "cors"
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';




const app = express(); // Inicializa express

app.use(express.json()); // permite que express entienda datos en formato JSON

dotenv.config(); // Carga las variables de entorno desde el archivo .env

connectDB();  // conecta a la base de datos 


//Configurar CORS
const whitelist =[process.env.FRONTEND_URL] // hace una lista blanca de las urls que acceeden a la api

const corsOptions ={
    origin: function(origin, callback){  // funcion que verifica si la url de la peticion esta en la lista blanca 
        if (!origin || whitelist.includes(origin)) {
            // Puede consultar la API
            callback(null, true) // permite la peticion
        }else{
            // No esta permitido el request 
            callback(new Error("Error de Cors"))
        }
    },
    credentials:true,
}
app.use(cors(corsOptions)) // habilita CORS para las rutas de la API

// Define las rutas base para el endpoint de usuarios
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/tareas', tareaRoutes)


// Define el puerto, usando el valor de la variable de entorno PORT o 4000 por defecto
const PORT = process.env.PORT || 4000;

// Inicia el servidor
app.listen(4000, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

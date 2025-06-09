// Importa la librería jsonwebtoken
import jwt from 'jsonwebtoken';

// Función que genera un JWT usando el ID del usuario
const generarJWT = (id) => {
    return jwt.sign(
        { id },                      // Payload del token: en este caso, solo el id del usuario
        process.env.JWT_SECRET,     // Clave secreta que debe estar definida en el archivo .env
        {
            expiresIn: '30d',       // El token expirará en 30 días
        }
    );
};

// Exporta la función para que pueda usarse en otros archivos
export default generarJWT;

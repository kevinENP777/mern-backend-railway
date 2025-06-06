import jwt from 'jsonwebtoken'; // Importamos la librería para trabajar con tokens JWT
import Usuario from '../models/Usuario.js'; // Importamos el modelo de Usuario desde Mongoose

// Middleware para verificar si el usuario está autenticado
const checkAuth = async (req, res, next) => {
    let token; // Inicializamos una variable para guardar el token

    // Verificamos si en los headers viene un token tipo "Bearer <token>"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        try {
            // Extraemos el token desde el header Authorization
            token = req.headers.authorization.split(' ')[1];

            // Verificamos y decodificamos el token usando la clave secreta
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Buscamos al usuario en la base de datos con el ID que viene en el token
            // Excluimos algunos campos  innecesarios
            req.usuario = await Usuario.findById(decoded.id).select(
                '-password -confirmado -token -createdAt -updatedAt -__v'
            );

            // Si todo está bien, pasamos al siguiente middleware/controlador
            return next();

        } catch (error) {
            // Si el token es inválido o expiró, devolvemos un error
            return res.status(401).json({ msg: 'Token inválido o expirado' });
        }
    }

    // Si no hay token presente, devolvemos un error
    if (!token) {
        const error = new Error('No hay token en la petición');
        return res.status(401).json({ msg: 'No hay token en la petición' });
    }
    next();
};

export default checkAuth; // Exportamos el middleware para usarlo en las rutas protegidas

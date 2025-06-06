// Importamos express y Router
import express from 'express';
const router = express.Router(); // Creamos una instancia del enrutador

// Importamos los controladores que manejarán la ruta
import { 
    registrar, 
    autenticar, 
    confirmar, 
    olvidePassword, 
    comprobarToken, 
    nuevoPassword,
    perfil 
} from "../controllers/usuarioController.js";
import checkAuth from '../middleware/checkAuth.js';

// Crear nuevo usuario (registro)
router.post('/', registrar); 

// Login de usuario (autenticación)
router.post('/login', autenticar); 

// Confirmación de cuenta por token
router.get('/confirmar/:token', confirmar); 

// Solicitud para restablecer contraseña (envío de email)
router.post('/olvide-password', olvidePassword); 

// Verificación del token recibido por correo y actualización de contraseña
router.route('/olvide-password/:token')
    .get(comprobarToken)       // Verifica si el token es válido
    .post(nuevoPassword);      // Guarda nueva contraseña si el token es válido

router.get('/perfil', checkAuth, perfil)

// Exportamos las rutas
export default router;

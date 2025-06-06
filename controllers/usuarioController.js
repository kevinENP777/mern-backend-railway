import Usuario from '../models/Usuario.js';
import generarId from '../helpers/generarId.js';
import generarJWT from '../helpers/generarJWT.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/email.js';
//import { json } from "express";

// REGISTRO DE USUARIO
const registrar = async (req, res) => {
    const { email } = req.body;

    // Verificar si el usuario ya está registrado
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
        const error = new Error('El usuario ya existe');
        return res.status(400).json({ msg: error.message });
    }
    try {
        // Crear nuevo usuario
        const usuario = new Usuario(req.body);
        usuario.token = generarId(); // Token para confirmar cuenta
        await usuario.save();

        // Enviar el email de confirmación
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
          });
        
        res.json({msg: 'Usuario Creado Correctamente, Revisa tu email para confirmar tu cuenta'});
    } catch (error) {
        console.log(error);
            
    }
};


// * AUTENTICACIÓN (LOGIN)

const autenticar = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)

    // Verificar si existe el usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    // Verificar si está confirmado
    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    // Verificar contraseña
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id) // Generar JWT
        });
    } else {
        const error = new Error('password incorrecto');
        return res.status(401).json({ msg: error.message });
    }
};


// * CONFIRMAR CUENTA MEDIANTE TOKEN

const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await Usuario.findOne({ token });
    if (!usuarioConfirmar) {
        const error = new Error('El token no es válido');
        return res.status(400).json({ msg: error.message });
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save();
        res.json({ msg: 'Cuenta confirmada' });
    } catch (error) {
        console.log(error);
        
    }
};


// * INICIAR PROCESO DE RECUPERACIÓN DE CONTRASEÑA

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuario.token = generarId(); // Nuevo token para recuperación
        await usuario.save();

        // Enviar email de nueva confirmación
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        

        res.json({ msg: 'Hemos enviado un email con las instrucciones' });
    } catch (error) {
        console.log(error);
    }
};


 //* COMPROBAR TOKEN DE RECUPERACIÓN DE CONTRASEÑA

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Usuario.findOne({ token });
    if (tokenValido) {
        res.json({ msg: 'Token válido y el usuario sí existe' });
    } else {
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message });
    }
};


// * GUARDAR NUEVA CONTRASEÑA

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ token });

    if (usuario) {
        usuario.password = password; // Se hashea en el modelo automáticamente
        usuario.token = ""; // Eliminar token usado


        try { 
            await usuario.save();
            res.json({ msg: 'Password modificado correctamente' });
        } 
        catch (error) {
            console.log(error);
                
        }
    } else {
        const error = new Error('Token no valido');
        return res.status(404).json({ msg: error.message });
    }   
};


const perfil = async (req, res) => {
    const { usuario } = req ;

    res.json(usuario);


};

export { 
    registrar, 
    autenticar, 
    confirmar, 
    olvidePassword, 
    comprobarToken, 
    nuevoPassword,
    perfil
};

// Importamos mongoose para definir el esquema del modelo
import mongoose from 'mongoose';

// Importamos bcrypt para hashear (encriptar) las contraseñas
import bcrypt from 'bcrypt';  

// Definimos el esquema del modelo Usuario
const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,      // Campo obligatorio
        trim: true           // Elimina espacios en blanco al inicio y final
    },
    password: {
        type: String, // Campo para la contraseña del usuario
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true         // El correo debe ser único en la base de datos
    },
    token: {
        type: String         // Usado para confirmar cuenta o recuperar contraseña
    },
    confirmado: {
        type: Boolean,
        default: false       // Por defecto, la cuenta no está confirmada
    }
}, {
    timestamps: true         // Agrega automáticamente createdAt y updatedAt
});


// Middleware que se ejecuta antes de guardar el documento en MongoDB
usuarioSchema.pre('save', async function(next) {
    // Solo hashear la contraseña si fue modificada o es nueva
    if (!this.isModified('password')) {
        next();       // Salta el hash si la contraseña no cambió
    }

    // Genera un "salt" (valor aleatorio) para hacer el hash más seguro
    const salt = await bcrypt.genSalt(10);

    // Hashea la contraseña del usuario antes de guardarla
    this.password = await bcrypt.hash(this.password, salt); // sirve para encriptar la contraseña
});


// Método personalizado para comparar contraseñas
usuarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    // Compara la contraseña ingresada con la contraseña hasheada en la base de datos
    return await bcrypt.compare(passwordFormulario, this.password);
};


// Creamos y exportamos el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema); // sirve para crear una colección de usuarios en MongoDB
                                                        // Exportando el modelo para que pueda ser utilizado en otras partes de la aplicación
export default Usuario;

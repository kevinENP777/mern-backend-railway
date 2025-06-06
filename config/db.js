import mongoose from 'mongoose';

const connectDB = async () => { // conecta a la base de datos
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI); 
        const url =`${connection.connection.host}:${connection.connection.port}`; // sirve para mostrar la url de la base de datos 
        console.log(`MongoDB conectado a ${url}`); // muestra la url de la base en la consola 
    }

    catch (error) {
        console.log(`error: ${error.message}`);
        //process.exit(1);
    }
}

export default connectDB; // exporta la funcion conactarDB para conectar la base de datos

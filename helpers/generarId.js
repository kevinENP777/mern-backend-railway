// Función para generar un ID único basado en un número aleatorio y la fecha actual
const generarId = () => {
    // Genera un número aleatorio entre 0 y 1, lo convierte a base 32 y elimina los primeros dos caracteres ("0.")
    const random = Math.random().toString(32).substring(2);
    
    // Obtiene la fecha actual en milisegundos desde el 1 de enero de 1970 y la convierte a base 32
    const fecha = Date.now().toString(32);
    
    // Retorna la concatenación del número aleatorio y la fecha, creando un identificador único
    return random + fecha;
}

export default generarId;

import Proyecto from '../models/Proyecto.js';
import Tarea from '../models/Tarea.js';
import Usuario from '../models/Usuario.js';


const obtenerProyectos = async (req, res) => {
    const proyectos = await Proyecto.find().where('creador').equals(req.usuario).select('-tareas');
    res.json(proyectos);
};

const nuevoProyecto = async (req, res) => {
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id;

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const obtenerProyecto = async (req, res) => {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id).populate('tareas')

    if (!proyecto) {
        const error = new Error('No encontrado');
        return res.status(404).json({ msg: error.message });
    }
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida');
        return res.status(401).json({ msg: error.message });
    }
//Obtener las tareas asociadas al proyecto
        const tareas = await Tarea.find().where('proyecto').equals(proyecto._id)
        res.json(proyecto)
};


const editarProyecto = async (req, res) => {
    const { id } = req.params //Obtenemos el id del proyecto
    
    const proyecto = await Proyecto.findById(id)//Buscamos el proyecto por id y poblamos los colaboradores
    if (!proyecto) {
        const error = new Error('Proyecto no encontrado')
        return res.status(404).json({ msg: error.message })
    }
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida')
        return res.status(401).json({ msg: error.message })
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre //Si no se envía un nombre, se mantiene el nombre actual
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente

    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado) //Retornamos el proyecto almacenado
    } catch (error) {
        console.log(error)
    }
}


const eliminarProyecto = async (req, res) => {
    const { id } = req.params //Obtenemos el id del proyecto
    
    const proyecto = await Proyecto.findById(id)
    if (!proyecto) {
        const error = new Error('Proyecto no encontrado')
        return res.status(404).json({ msg: error.message })
    }
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida')
        return res.status(401).json({ msg: error.message })
    }

    try {
        await proyecto.deleteOne() //Eliminamos el proyecto
        res.json({ msg: 'Proyecto eliminado' }) //Retornamos el proyecto almacenado
    } catch (error) {
        console.log(error)
        
    }
}


const buscarColaborador = async (req, res) => {
    const { email } = req.body

    const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -password -token -updatedAt -__v')

    if (!usuario) {
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({ msg: error.message })
    }

    res.json(usuario)
}
const agregarColaborador = async (req, res) => {
    const proyecto = await Proyecto.findById(req.params.id)

    if (!proyecto) {
        const error = new Error('Proyecto No Encontrado')
        return res.status(404).json({ msg: error.message })
    }
/*
     // Validar que la persona que intenta agregar sea el creador
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no permitida')
        return res.status(403).json({ msg: error.message })
    }

    const { email } = req.body

    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({ msg: error.message })
    }

    // No permitir que el creador se agregue a sí mismo como colaborador
    if (proyecto.creador.toString() === usuario._id.toString()) {
        const error = new Error('El creador del proyecto no puede ser colaborador')
        return res.status(400).json({ msg: error.message })
    }

    // Verificar si ya está en la lista de colaboradores
    if (proyecto.colaboradores.includes(usuario._id)) {
        const error = new Error('Usuario ya es colaborador')
        return res.status(400).json({ msg: error.message })
    }

    // Si todo está bien, se agrega
    proyecto.colaboradores.push(usuario._id)
    await proyecto.save()

    res.json({ msg: 'Colaborador agregado correctamente' })*/

};

const eliminarColaborador = async (req, res) => {};


export{
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
    
    // obtenerTareas,

}


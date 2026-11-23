const express = require('express')
const app = express()

app.use(express.json())

const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.json(productos)
})

// GET - Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.json(producto)
})



// El contador sigue avanzando aunque se elimine un producto.
let siguienteId = productos.reduce((maximo, producto) => Math.max(maximo, producto.id), 0) + 1

// POST y PUT requieren los mismos campos.
function validarProducto(datos) {
    const { nombre, descripcion, precio } = datos || {}

    if (typeof nombre !== 'string' || !nombre.trim() ||
        typeof descripcion !== 'string' || !descripcion.trim() ||
        precio == null || (typeof precio === 'string' && !precio.trim())) {
        return { mensaje: 'Nombre, descripcion y precio son obligatorios' }
    }

    const precioNumerico = typeof precio === 'number' || typeof precio === 'string'
        ? parseFloat(precio)
        : NaN

    if (!Number.isFinite(precioNumerico)) {
        return { mensaje: 'El precio debe ser un numero' }
    }

    return { campos: { nombre, descripcion, precio: precioNumerico } }
}

// POST - Crear un producto
app.post('/productos', (req, res) => {
    const { campos, mensaje } = validarProducto(req.body)
    if (mensaje) {
        return res.status(400).json({ mensaje })
    }

    const producto = { id: siguienteId, ...campos }
    siguienteId += 1
    productos.push(producto)

    return res.status(201).json(producto)
})


// PUT - Reemplazar los datos de un producto conservando su id
app.put('/productos/:id', (req, res) => {
    const id = Number(req.params.id)
    const posicion = productos.findIndex(producto => producto.id === id)

    if (posicion === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    const { campos, mensaje } = validarProducto(req.body)
    if (mensaje) {
        return res.status(400).json({ mensaje })
    }

    const producto = { id, ...campos }
    productos[posicion] = producto
    return res.status(200).json(producto)
})


// DELETE - Quitar un producto del arreglo
app.delete('/productos/:id', (req, res) => {
    const id = Number(req.params.id)
    const posicion = productos.findIndex(producto => producto.id === id)

    if (posicion === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    const [producto] = productos.splice(posicion, 1)
    return res.status(200).json({ mensaje: 'Producto eliminado', producto })
})


app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})

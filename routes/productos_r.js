const express = require('express');
const {Router} = express;
const Producto = require("../classes/Producto.js");
const producto = new Producto();
const router = Router();
const admin = require("../classes/Admin.js");


router.get('/', async (req, res) => {     
    try{
        let todos = await producto.getAll(); 
        if (todos){
            res.status(200).json(todos);
        }else {
            res.status(500).json('Productos is empty');    
        }
    }catch (e){
        console.log(`ERROR: ${e}`)
    }
});

router.post('/', async (req, res) => {         
    try {
        const isAdmin = admin.adminCheq( {admin: true});
        if (isAdmin === true){
            const nuevoProducto = req.body;
            let todos = await producto.getAll();        
            let nuevoId = 1;
            if (todos != '' && todos.length > 0){
                todos.forEach(element => {
                    if (element.id > nuevoId){
                        nuevoId = element.id;
                    }
                });  
                nuevoId = nuevoId + 1;         
            }
            nuevoProducto.id = nuevoId;
            nuevoProducto.timestamp = Date.now();
            await producto.save(nuevoProducto);
            res.status(200).json({
                nombre: nuevoProducto.nombre,
                descripcion: nuevoProducto.descripcion,
                codigo: nuevoProducto.codigo,
                precio: nuevoProducto.precio,
                foto: nuevoProducto.foto,
                stock: nuevoProducto.stock,
                timestamp: nuevoProducto.timestamp,
                id: nuevoProducto.id
            });
        }else {
            res.status(403).send("No autorizado");
        }
    } catch (error) {
        console.log(`ERROR: ${error}`)
    }    
});

router.get('/:id', async (req, res) => {    
    try {
        let id = req.params.id;
        let result = await producto.getById(id);       
        res.status(200).json(result);
    } catch (error) {
        console.log(`ERROR: ${error}`)
    }
});

router.delete('/:id', async (req, res) => {    
    try {
        const isAdmin = admin.adminCheq( {admin: true});
        if(isAdmin === true){
            let id = req.params.id;
            let result = await producto.deleteById(id);       
            res.status(200).json({result:result});
        }else {
            res.status(403).send("No autorizado");
        }
    } catch (error) {
        console.log(`ERROR: ${error}`)
    }
});

router.put('/:id', async (req, res) => {    
    try {
        const isAdmin = admin.adminCheq( {admin: true});
        if(isAdmin === true){
            let id = req.params.id;
            if (id != ''){
                let produ = await producto.getById(id);
                
                if (produ.id != ''){        
                    let nuevoProducto = {                
                        nombre: req.body.nombre ? req.body.nombre : produ.nombre,
                        descripcion: req.body.descripcion ? req.body.descripcion : produ.descripcion,
                        codigo: req.body.codigo ? req.body.codigo : produ.codigo,
                        foto: req.body.foto ? req.body.foto : produ.foto,
                        precio: req.body.precio ? req.body.precio : produ.precio,
                        stock: req.body.stock ? req.body.stock : produ.stock,
                        id: produ.id
                    };
                    producto.update(nuevoProducto, produ.id);
                    res.status(200).json(nuevoProducto);
                }
            }else {
                res.status(500).json('ID is empty');    
            }
        }else {
            res.status(403).send("No autorizado");
        }
    } catch (error) {
        console.log(`ERROR: ${error}`)
    }
});

module.exports = router;




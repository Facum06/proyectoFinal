const express = require('express');
const {Router} = express;
const Contenedor = require('./contenedor.js');
const contenedor = new Contenedor();

const router = Router();

router.get('/', async (req, res) => {     
    let todos = await contenedor.getAll(); 
    if (todos){
        res.render('productos', todos);
    }else {
        res.render('productos', '');    
    }
    
});

router.get('/productosEjs', async (req, res) => {     
    let todos = await contenedor.getAll();    
    res.render('ejs/productosEjs', {productos : todos, mensaje: "Productos"});    
});

router.get('/productosPug', async (req, res) => {     
    let todos = await contenedor.getAll();    
    res.render('productosPug', {
        productos : todos,
        "mensaje": "Productos"
      });    
});

router.get('/productosList', async (req, res) => {     
    let todos = await contenedor.getAll();   

    res.json(todos);
});

router.post('/', async (req, res) => {         
    const nuevoProducto = req.body;
    let todos = await contenedor.getAll();   
    let nuevoId = todos.length +1;
    await contenedor.save(nuevoProducto);
    res.json({
        title: nuevoProducto.title,
        price: nuevoProducto.price,
        thumbail: nuevoProducto.thumbail,
        id: nuevoId
      });
    //return res.redirect("/");
});

router.get('/:id', async (req, res) => {    
    let id = req.params.id;
    let result = await contenedor.getById(id);       
    res.json(result);
});

router.delete('/:id', async (req, res) => {    
    let id = req.params.id;
    let result = await contenedor.deleteById(id);       
    res.json({result:result});
});

router.put('/:id', async (req, res) => {    
    let id = req.params.id;
    let produ = await contenedor.getById(id);
    let nuevoProducto = [];
    if (produ.id != ''){        
        nuevoProducto.push({
            title: "actualizado",
            thumbail: produ.thumbail,
            price: produ.price,
            id: produ.id
        });
        res.json(nuevoProducto);
    }
});

module.exports = router;
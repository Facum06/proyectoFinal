const express = require('express');
const {Router} = express;
const Carrito = require("../classes/Carrito.js");
const carrito = new Carrito();
const router = Router();



router.post('/', async (req, res) => {   
       
    try {        
        const id = await carrito.nuevoCart();
        res.json({"id":id});
    } catch (error) {
        console.log(`ERROR: ${error}`)
    }    
});

router.post('/:id/productos/:id_prod', async (req, res) => {         
    try {       
        const cartId = req.params.id
        const prodId = req.params.id_prod
        let produ = await carrito.productToCart(cartId,prodId);
        console.log(produ)
        res.json(produ);
    } catch (error) {
        console.log(`ERROR: ${error}`)
    }    
});

router.get('/:id/productos', async (req, res) => {         
    try {
        let id = req.params.id;
        let result = await carrito.getById(id, "carrito");       
        res.json(result);
    } catch (error) {
        console.log(`ERROR: ${error}`)
    }
});

router.delete('/:id/productos/:id_prod', async (req, res) => {    
    try {        
        const cartId = req.params.id
        const prodId = req.params.id_prod
        let result = await carrito.deleteById(cartId, prodId);       
        res.json(result);
    } catch (error) {
        console.log(`ERROR: ${error}`)
    }
});

router.delete('/', async (req, res) => {    
    try {       
        await carrito.deleteAll();       
        res.json({result: "Se elimino el carrito"});
    } catch (error) {
        console.log(`ERROR: ${error}`)
    }
});


module.exports = router;




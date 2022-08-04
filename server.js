const express = require('express');
const cors = require( "cors" );
const { Socket } = require('engine.io');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
const routerProductos = require("./routes/productos_r.js");
const routerCarrito = require("./routes/carrito_r.js");


const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);
/*app.use("/", express.static(__dirname + "/public"));
app.get("/", (req, res) =>{
    res.sendFile('index.html', {root: __dirname});
});*/
app.all('*', (req, res) => {
    res.status( 404 ).json({
    error: '404', desc: 'Page not found!'
    })
})


const server = httpServer.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${server.address().port}`);
});

module.exports = app;
const fs = require('fs');


class Carrito {
    constructor(timestamp, productos){      
        this.productos = productos;
        this.timestamp = timestamp;
    }
    async readFile (name){
        try {
          return JSON.parse(await fs.promises.readFile(`database/${name}.json`, 'utf-8'))
        } catch (error) {
          console.log(`ERROR: ${error}`);
        }
    }

    async writeFile(carrito){
    try {
      fs.promises.writeFile('database/carrito.json', JSON.stringify(carrito), 'utf-8' )
    } catch ( error ) {
      console.log( `ERROR: ${ error }` )
    }
  }

    async getById(id, name){
        try {
            const contenido = JSON.parse(await fs.promises.readFile(`database/${name}.json`,'utf-8'));
            if (contenido.length == 0){
                return "No hay información en el archivo";
            }else {          
                let status = 0;
                let retorno = [];                           
                contenido.forEach((value,i) => { 
                    if(value.id == id){
                        status = 1;
                        retorno = value;   
                    }
                });
                if (status === 1){
                    return retorno;
                }else {
                    return "NO se encontro el valor";
                }
            } 
            
        }catch (error){
            console.log("ERROR!!!!! "+error + ` database/${name}.json`);
        }
    }

    async getAll(){
        try {
            let todo = await fs.promises.readFile('database/carrito.json','utf-8');
            if (todo.length > 0){
                const contenido = JSON.parse(todo);
                return contenido;
            }else {
                return '';
            }
        }catch (error){
            console.log(error);
        }
    }

   async nuevoCart(){    
        try {
            const tiene = await this.readFile("carrito");
            const chequeoId = () => {
                let lastID = 0;
                if (tiene != undefined) {                    
                    //lastID = tiene[ tiene.length - 1 ].id
                    tiene.forEach((value,i) => { 
                        //console.log("ID "+ value.id)
                        lastID = value.id
                    });
                }
                return lastID + 1
            }
            const idL = chequeoId();
            const carrito = {id: idL, productos: []};
            if (idL == 1){
                await this.writeFile(carrito);
            }else {                
                tiene.push(carrito);
                await this.writeFile(tiene);
            }
            return idL;
        } catch (error) {
            console.log("ERROR! "+error);
        }
    }

    async addProductToCart(carritoId, producto){
        try {
            let carrito = await this.readFile("carrito");
            let cart = carrito.find((key) => key.id === carritoId);
            cart.productos.push(producto);
            carrito = carrito.map((key) => (
                key.id !== cart.id ? key : cart 
            ));
            await this.writeFile(carrito);
          } catch ( error ) {
            console.log(`ERROR: ${error}`);
        }      
    }

    async removeProductCart(carritoId, productoId){
        try {
            let carrito = await this.readFile("carrito");
            let cart = carrito.find((key) => key.id === carritoId);
            cart.productos = cart.productos.filter((key) => 
                key.id !== productoId
            );
            carrito = carrito.map((key) => (
                key.id !== cart.id ? key : cart
            ));
            await this.writeFile(carrito)
            return carrito;
        } catch ( error ) {
            console.log( `ERROR: ${ error }` )
        }
    }

    async productToCart(cartId,prodId){
        try {            
            const carrito = await this.getById(cartId, "carrito")
            const producto = await this.getById(prodId, "productos")
           // console.log("CART "+cartId+ " - PROD "+prodId);            
            if (!carrito) {
                return ({error: 'Carrito no encontrado.'})                
            } else if ( !producto ) {
                return ({error: 'Producto no encontrado.'})                
            } else {                
                await this.addProductToCart(carrito.id, producto)               
                carrito.productos.push(producto) 
                return carrito;
            }
          } catch ( error ) {
            console.log(`ERROR: ${error}`)
          }
    }

    async deleteById(cartId,prodId){
        try {
            const carrito = await this.getById(cartId, "carrito")
            const producto = await this.getById(prodId, "productos")
           // console.log("CART "+cartId+ " - PROD "+prodId);            
            if (!carrito) {
                return ({error: 'Carrito no encontrado.'})                
            } else if ( !producto ) {
                return ({error: 'Producto no encontrado.'})                
            } else {                
                const result = await this.removeProductCart(carrito.id, producto.id)       
                return result;
            }
        } catch (error) {
            console.log(`ERROR: ${ error }`)
        }
      
    }

    async deleteAll(){
        await this.writeFile([]);          
    }
}

//export default Carrito;
module.exports = Carrito;
const fs = require('fs');

class Producto {
    constructor(nombre, descripcion, codigo, timestamp, stock, precio, foto){      
       this.nombre = nombre;
       this.codigo = codigo;
       this.descripcion = descripcion;
       this.stock = stock;
       this.timestamp = timestamp;
       this.precio = precio;
       this.foto = foto;
    }

    async readFile (){
      try {
        return JSON.parse( await fs.promises.readFile("database/productos.json", 'utf-8'))
      } catch (error) {
        console.log(`ERROR: ${error}`);
      }
    }

    async save(obj){
    let idActual = obj.id;
        try{
            await fs.promises.readFile("database/productos.json",'utf-8', (error, contenido) => {
                if (error){
                    console.log(error);
                    return false;
                }else{      
                    let json = [];
                    if (contenido.length == 0){
                        json.push(obj);
                        fs.writeFile("database/productos.json", JSON.stringify(json) + "\r\n", err => {
                            if (err){                                                   
                                return err;
                            }else {                                                            
                                return idActual;
                            }
                        });      
                    }else {          
                        json = JSON.parse(contenido);     
                        json.push(obj); 
                        fs.writeFile("database/productos.json", JSON.stringify(json) + "\r\n", err => {
                            if (err){                                                   
                                return err;
                            }else {            
                                return idActual;
                            }
                        });     
                    }    
                }
            }); 
        }catch (err){
            console.log("ERROR!!! "+err);
        }
    }

   async getById(id){
        try {
            const contenido = JSON.parse(await fs.promises.readFile('database/productos.json','utf-8'));
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
            console.log(error);
        }
    }

   async getAll(){
        try {
            let todo = await fs.promises.readFile('database/productos.json','utf-8');
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

    async deleteById(id){
        await fs.readFile('database/productos.json','utf-8', (error, contenido) => {
            if (error){
                console.log(error);
                return false;
            }else{                        
                let json = [];
                if (contenido.length == 0){
                    console.log("No hay información en el archivo");
                }else {          
                    json = JSON.parse(contenido);      
                    json.forEach((value, i) => {
                        if(value.id == id){                            
                            json.splice(i, 1);
                            let stat = this.deleteAll();
                            if (stat != ''){
                                this.save(json);                            
                                return id;
                            }
                        }
                    });               
                }           
            }
        }); 
    }

     deleteAll(){     
        try {
            //fs.writeFile("database/productos.json", ""); 
            fs.writeFile('database/productos.json', "", function(err, result) {
                if(err) console.log('error', err);
            });
            return 'ok';
        } catch ( error ) {
            console.log( `ERROR: ${ error }` )
        }
    }

    async update(obj, idprod){
        let idActual = idprod;
            try {                
                let stat = "";   
                const json = await this.readFile();   
                json.forEach((value, i) => {                    
                    if(value.id == idActual) {                            
                        json.splice(i, 1);
                        json.push(obj);
                        stat = this.deleteAll();  
                    }
                });   
                if (stat === "ok"){
                    //this.save(json);                                                
                    fs.writeFile('database/productos.json', JSON.stringify(json), function(err, result) {
                        if(err) {
                            console.log('error', err)
                        }else {
                            return obj;
                        };
                    });
                }
            }catch (err){
                console.log("ERROR!!! "+err);
            }
        }
}

//export default Producto;
module.exports = Producto;
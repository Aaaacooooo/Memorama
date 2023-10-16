
// DATOS
const numeroCartas = 16;
const imagenesDorsoCartas = ['./images/Tnf.png'];
let imagenDorso;
const imagenesCartas = ['./images/Tnf.png'];


//VISTAS
const mantelCartas = document.querySelector("#memory-board");

//MODELO 
let arrayCartas = [];
let partida ={
    estado: 'inicio', // inicio, jugando y fin
    numParejasResueltas: 0, 
    numCartasBocaArriba: 0,
    numIntentosTotales: 0
}

function generaCartas(){
    

    //Vamos a trabajar con un array de imágenes que se va a ir reduciendo para tener cada vez menos imágenes.
    let imagenesDorsorestantes ;

    //Las imágenes se van a generar por parejas, y estas pueden ser reconocidas iguales por la imagen
    for(i=0; i< numeroCartas/2 ; i++){
        let carta= {
            id: i,
            estado: 'bocaabajo'
        }

        carta.imagen = imagenesCartas[Math.random() * (imagenesDorsoCartas.length - 1) + 1];
        //Ahora debemos quitar esta imagen del array imagenCartas y seguir trabjanado con el resto
        arrayCartas.push(carta);

        let cartaPar= {
            id: i++,
            estado: 'bocaabajo'
        }
        cartaPar.imagen = carta.imagen;

        arrayCartas.push(cartaPar);

    }

}

function obtenImagenDorso(){
    let numAleatorio = Math.random() * (imagenesDorsoCartas.length - 1) + 1;
    imagenDorso = imagenesDorsoCartas[numAleatorio];
}

function dibujaCartas(){
    arrayCartas.forEach( (e) => {
        // e va a ser un objeto carta con cada uno de las cartas, ten en cuenta dibujarlas de manera aleatoria.
        // a cada carta se le va a asignar la misma función para detectar cuando se hace click cartaPulsada

    })
}

function inicioPartida(){
    obtenImagenDorso();
    generaCartas();
    dibujaCartas()
}

function cartaPulsada(){
    //Antes de darle la vuelta a la carta, se debe comprobar que en el tablero no hay dos cartas dadas la vuelta
    //Si sólo hay una carta bocaarriba y se pulsa, esta se vuelve a dar la vuelta sin considerarse un intento

}
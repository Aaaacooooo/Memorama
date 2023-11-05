
// DATOS
const numeroCartas = 16;
//Array con las imagenes del Dorso proporcionadas
const imagenesDorsoCartas = [];
let imagenDorso;
//Array con las distintas imágenes proporcionadas
const imagenesCartas = [];


//VISTAS
const mantelCartas = document.querySelector("#memory-board");
let cartasMesa = null;

//MODELO 
let arrayCartas = [];
let partida ={
    estado: 'inicio', // inicio, jugando y fin
    numParejasResueltas: 0, 
    numCartasBocaArriba: 0, //Cada vez que se pulsa una carta se suma una, al darle la vuelta, se resta uno
    numIntentosTotales: 0
}

function generaCartas(){
    

    //Vamos a trabajar con un array de imágenes que se va a ir reduciendo para tener cada vez menos imágenes.
    let imagenesRestantes ;

    //Las imágenes se van a generar por parejas, y estas pueden ser reconocidas iguales por la imagen
    for(i=0; i< numeroCartas/2 ; i++){
        let carta= {
            id: i,
            estado: 'bocaabajo'
        }

        carta.imagen = imagenesCartas[Math.random() * (imagenesDorsoCartas.length - 1) + 1];
        //Ahora debemos quitar esta imagen del array imagenCartas y seguir trabjanado con el resto
        arrayCartas.push(carta);

        //Puedes añadir nuevos atributos al objeto si lo ves necesario
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
        let nuevaCarta = document.createElement('img');
        nuevaCarta.classList.add('.card');
        nuevaCarta.setAttribute('id', e.id);
        nuevaCarta.setAttribute('src', imagenDorso); //Todas empiezan boca abajo
        nuevaCarta.addEventListener('click', cartaPulsada);
        // e va a ser un objeto carta con cada uno de las cartas, ten en cuenta dibujarlas de manera aleatoria.
        // a cada carta se le va a asignar la misma función para detectar cuando se hace click cartaPulsada

    })

    //una vez dibujadas, las añadimos a la variable cartasMesa
    cartasMesa= document.querySelectorAll('.card');
}

function inicioPartida(){
    obtenImagenDorso();
    generaCartas();
    dibujaCartas()
}

function cartaPulsada(e){
    //Antes de darle la vuelta a la carta, se debe comprobar que en el tablero no hay dos cartas dadas la vuelta

    //Si después de pulsar la carta, hay dos cartas boca arriba, hay que comprobar si son iguales o no
}

function darVueltaCarta(idCarta){
    //Debemos buscar en el array de modelos de cartas y establecer su estado como bocaabajo

    //Debemos buscar en el array de las vistas de CArtas la carta por el id, y asignarle la imagenDorso
    cartasMesa.forEach( (e) => {
        (e.id === idCarta) ? e.setAttribute('src',imagenDorso) : e;
    })
    numCartasBocaArriba--;
}


// DATOS
const numeroCartas = 6;
//Array con las imagenes del Dorso proporcionadas
const imagenesDorsoCartas = [
    'images/Dorso/DorsoComida.jpg',
    'images/Dorso/DorsoComida2.jpg'
];
let imagenDorso;
//Array con las distintas imágenes proporcionadas
const imagenesCartas = [
    '/images/Imagenes/Charco Tacoron - El Hierro.jpg',
    '/images/Imagenes/La Graciosa G.png',
    '/images/Imagenes/La Maceta el Hierro.jpg',
    '/images/Imagenes/La Palma.jpg',
    '/images/Imagenes/La Palma2.jpg',
    '/images/Imagenes/Laurisilva La Gomera.png',
    '/images/Imagenes/Playa Cofete  FTV.png',
    '/images/Imagenes/Roque Nublo GC.png',
    '/images/Imagenes/Teide TNF.png',
    '/images/Imagenes/Timanfaya  LNZ.png',
];  




//VISTAS
const mantelCartas = document.querySelector("#memory-board");
let cartasMesa = null;

let arrayCartas = [];


//escuchar el button para llamar al inicioPartida
btn = document.querySelector('button')
btn.addEventListener('click', inicioPartida);




//MODELO 
let partida = {
    estado: 'inicio', // inicio, jugando y fin
    numParejasResueltas: 0,
    numCartasBocaArriba: 0, //Cada vez que se pulsa una carta se suma una, al darle la vuelta, se resta uno
    numIntentosTotales: 0
}

function generaCartas() {
    console.log('generar');


    //Vamos a trabajar con un array de imágenes que se va a ir reduciendo para tener cada vez menos imágenes.
    let imagenesRestantes;

    //Las imágenes se van a generar por parejas, y estas pueden ser reconocidas iguales por la imagen
    for (i = 0; i < numeroCartas / 2; i++) { // Lo dividimos por 2 ya que cada carta tendra una pareja con su mismo id
        let carta = {
            id: i,
            estado: 'bocaabajo'     //Tendremos algo css relacionado con esto ??
        }

        carta.imagen = imagenesCartas[Math.floor((Math.random() * imagenesCartas.length - 1) + 1)];
        //Ahora debemos quitar esta imagen del array imagenCartas y seguir trabjanado con el resto
        arrayCartas.push(carta);

        //Puedes añadir nuevos atributos al objeto si lo ves necesario
        // Un posible puede ser el id de su pareja ??
        let cartaPar = {
            id: i,
            estado: 'bocaabajo'
        }
        cartaPar.imagen = carta.imagen;

        arrayCartas.push(cartaPar);
        console.log(`arrayCartas`);
        console.log(arrayCartas);

    }

}

function obtenImagenDorso() {
    console.log('obtenImagenDorso');
    let numAleatorio = Math.floor(Math.random() * 2) + 1;
    console.log(numAleatorio);
    imagenDorso = imagenesDorsoCartas[numAleatorio - 1]; // Restamos 1 para obtener el índice correcto.
}


function dibujaCartas() {
    console.log('dibujaCartas');
    arrayCartas.forEach((e) => {
        let nuevaCarta = document.createElement('img');
        nuevaCarta.classList.add('.card');
        nuevaCarta.setAttribute('id', e.id);
        console.log('nuevaCarta.id');
        console.log(nuevaCarta.id);
        nuevaCarta.setAttribute('src', imagenDorso); //Todas empiezan boca abajo
        console.log('nuevaCarta.src');
        console.log(nuevaCarta.src);
        nuevaCarta.addEventListener('click', cartaPulsada);
        // e va a ser un objeto carta con cada uno de las cartas, ten en cuenta dibujarlas de manera aleatoria.
        // a cada carta se le va a asignar la misma función para detectar cuando se hace click cartaPulsada

        // Añadir la nueva carta como hijo del elemento mantelCartas
        mantelCartas.appendChild(nuevaCarta);
    })

    //una vez dibujadas, las añadimos a la variable cartasMesa
    cartasMesa = document.querySelectorAll('.card');
}

function inicioPartida() {
    obtenImagenDorso();
    generaCartas();
    dibujaCartas()
    console.log('hasta aqui');
}

function cartaPulsada(e) {
    //Antes de darle la vuelta a la carta, se debe comprobar que en el tablero no hay dos cartas dadas la vuelta

    //Si después de pulsar la carta, hay dos cartas boca arriba, hay que comprobar si son iguales o no
}

function darVueltaCarta(idCarta) {
    //Debemos buscar en el array de modelos de cartas y establecer su estado como bocaabajo

    //Debemos buscar en el array de las vistas de CArtas la carta por el id, y asignarle la imagenDorso
    cartasMesa.forEach((e) => {
        (e.id === idCarta) ? e.setAttribute('src', imagenDorso) : e;
    })
    numCartasBocaArriba--;
}

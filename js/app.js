// DATOS
const numeroCartas = 8;
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
const mantelCartas = document.querySelector(".memory-board"); // Selector corregido
let cartasMesa = null;

let arrayCartas = [];


//escuchar el button para llamar al inicioPartida
btn = document.querySelector('.inicio'); // Selector corregido
btn.addEventListener('click', inicioPartida);

//MODELO 
let partida = {
    estado: 'inicio',
    numParejasResueltas: 0,
    numCartasBocaArriba: 0,
    numIntentosTotales: 0
}

function generaCartas() {
    console.log('generar');

    // Vamos a trabajar con un array de imágenes que se va a ir reduciendo para tener cada vez menos imágenes.
    // Las imágenes se van a generar por parejas
    for (i = 0; i < numeroCartas / 2; i++) {
        let carta = {
            id: i,
            estado: 'bocaabajo'
        }

        carta.imagen = imagenesCartas[Math.floor(Math.random() * imagenesCartas.length)]; // Seleccionar imagen aleatoria
        arrayCartas.push(carta);

        // Crear la pareja de la carta
        let cartaPar = {
            id: i, // Asegúrate de que el id sea único para cada carta
            estado: 'bocaabajo'
        }
        cartaPar.imagen = carta.imagen;
        arrayCartas.push(cartaPar);
    }
}

function obtenImagenDorso() {
    console.log('obtenImagenDorso');
    let numAleatorio = Math.floor(Math.random() * 2); // 0 o 1
    console.log(numAleatorio);
    imagenDorso = imagenesDorsoCartas[numAleatorio];
}

function dibujaCartas() {
    console.log('dibujaCartas');
    arrayCartas.forEach((e) => {
        let nuevaCarta = document.createElement('img');
        nuevaCarta.classList.add('card'); // Clase corregida
        nuevaCarta.setAttribute('id', e.id);
        nuevaCarta.setAttribute('src', imagenDorso);
        nuevaCarta.addEventListener('click', cartaPulsada);
        mantelCartas.appendChild(nuevaCarta);
    })

    // Una vez dibujadas, actualizar la variable cartasMesa
    cartasMesa = document.querySelectorAll('.card');
}

function inicioPartida() {
    obtenImagenDorso();
    generaCartas();
    dibujaCartas();
    btn.disabled = true;
    console.log('hasta aqui');
}

function cartaPulsada(e) {
    // Implementar la lógica para manejar las cartas cuando se hace clic
    cartaPulsada = document.querySelector('.card') //guardamos la carta pulsada en una varia

}

function darVueltaCarta(idCarta) {
    //Debemos buscar en el array de modelos de cartas y establecer su estado como bocaabajo

    //Debemos buscar en el array de las vistas de CArtas la carta por el id, y asignarle la imagenDorso
    cartasMesa.forEach((e) => {
        (e.id === idCarta) ? e.setAttribute('src', imagenDorso) : e;
    })
    numCartasBocaArriba--;
}

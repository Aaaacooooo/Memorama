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

function mezclarCartas(cartas) {
    for (let i = cartas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }
    return cartas;
}

function generaCartas() {
    console.log('generar');

    // Vamos a trabajar con un array de imágenes que se va a ir reduciendo para tener cada vez menos imágenes.
    // Las imágenes se van a generar por parejas


    const parejas = [];

    while (parejas.length < numeroCartas / 2) {
        const randomIndex = Math.floor(Math.random() * imagenesCartas.length);
        const imagen = imagenesCartas[randomIndex];

        // Evitar duplicados
        if (!parejas.includes(imagen)) {
            parejas.push(imagen);
        }
    }

    // Asignar las imágenes a las cartas
    for (let i = 0; i < numeroCartas; i++) {
        let carta = {
            id: i,
            estado: 'bocaabajo',
            imagen: parejas[Math.floor(i / 2)]
        };

        arrayCartas.push(carta);
    }

    arrayCartas = mezclarCartas(arrayCartas);
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
    // Incrementar el número de intentos cada vez que se pulsa una carta
    partida.numIntentosTotales++;

    const intentosElement = document.getElementById('intentos');
    intentosElement.textContent = 'Intentos: ' + partida.numIntentosTotales;
    
    const cartaSeleccionada = e.target;
    const idCartaSeleccionada = parseInt(cartaSeleccionada.id);

    // Si la carta ya está boca arriba o es una pareja resuelta, no hacer nada
    if (arrayCartas[idCartaSeleccionada].estado === 'bocaarriba' || arrayCartas[idCartaSeleccionada].estado === 'resuelta') {
        return;
    }

    buscarParejas();

    // Voltear la carta seleccionada
    cartaSeleccionada.setAttribute('src', arrayCartas[idCartaSeleccionada].imagen);
    arrayCartas[idCartaSeleccionada].estado = 'bocaarriba';
    partida.numCartasBocaArriba++;



    ganar();

}


function darVueltaCarta(idCarta) {
    //Debemos buscar en el array de modelos de cartas y establecer su estado como bocaabajo

    //Debemos buscar en el array de las vistas de CArtas la carta por el id, y asignarle la imagenDorso
    cartasMesa.forEach((e) => {
        (e.id === idCarta) ? e.setAttribute('src', imagenDorso) : e;
    })
    numCartasBocaArriba--;
}



function ganar() {
    // Comprobar si todas las parejas se han resuelto para determinar si el juego ha terminado
    if (partida.numParejasResueltas === numeroCartas / 2) {
        partida.estado = 'fin'; // Marcar el estado del juego como 'fin' cuando se han resuelto todas las parejas
        ('¡Felicidades! Has completado el juego.');
    }
}

function buscarParejas() {
    // Comprobar si hay dos cartas boca arriba para verificar si forman una pareja
    if (partida.numCartasBocaArriba === 2) {
        const cartasBocaArriba = arrayCartas.filter(carta => carta.estado === 'bocaarriba');

        // Si las cartas tienen la misma imagen, forman una pareja
        if (cartasBocaArriba[0].imagen === cartasBocaArriba[1].imagen) {
            cartasBocaArriba.forEach(carta => {
                carta.estado = 'resuelta'; // Marcar las cartas como resueltas
            });
            partida.numParejasResueltas++;
            const parejasResueltasElement = document.getElementById('parejas-resueltas');
            parejasResueltasElement.textContent = 'Parejas resueltas: ' + partida.numParejasResueltas;
        } else {
            // Si las cartas no coinciden, voltear las cartas después de un breve período de tiempo (por ejemplo, 1 segundo)
            setTimeout(() => {
                cartasBocaArriba.forEach(carta => {
                    carta.estado = 'bocaabajo';
                    document.getElementById(carta.id).setAttribute('src', imagenDorso); // Voltear la carta boca abajo
                });
            }, 50);
        }

        partida.numCartasBocaArriba = 0; // Reiniciar el contador de cartas boca arriba después de comprobar las parejas
    }
}
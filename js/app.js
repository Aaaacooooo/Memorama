// DATOS
const numeroCartas = 8;
const imagenesDorsoCartas = [
    'images/Dorso/DorsoComida.jpg',
    'images/Dorso/DorsoComida2.jpg'
];
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
const mantelCartas = document.querySelector(".memory-board");
let cartasMesa = null;
let arrayCartas = [];
let imagenDorso;


btn = document.querySelector('.inicio');
btn.addEventListener('click', inicioPartida);

//MODELO 
let partida = {
    estado: 'inicio',
    numParejasResueltas: 0,
    numCartasBocaArriba: 0,
    numIntentosTotales: 0
}

// ----------------------------------------------------------------
//    ---------- CREAMOS Y DIBUJAMOS LAS CARTAS ----------------
// ----------------------------------------------------------------

function mezclarCartas(cartas) {

    for (let i = cartas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }
    return cartas;
}

function generaCartas() {
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
    let numAleatorio = Math.floor(Math.random() * 2); // 0 o 1
    imagenDorso = imagenesDorsoCartas[numAleatorio];
}

function dibujaCartas() {
    arrayCartas.forEach((e) => {
        let nuevaCarta = document.createElement('img');
        nuevaCarta.classList.add('card');
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
}

// ----------------------------------------------------------------
//          ---------- MANEJO DEL JUEGO ----------------
// ----------------------------------------------------------------



// Función que se ejecuta cuando se hace clic en una carta
function cartaPulsada(e) {
    // Obtiene la carta seleccionada y su ID
    const cartaSeleccionada = e.target;
    const idCartaSeleccionada = parseInt(cartaSeleccionada.id);
    const carta = arrayCartas.filter(carta => carta.id === idCartaSeleccionada)[0];

    // Verifica si la carta está boca abajo para evitar acciones innecesarias
    if (carta.estado === 'bocaabajo') {
        // Voltea visualmente la carta seleccionada
        darVueltaCartaVisual(cartaSeleccionada, carta.imagen);
        // Cambia el estado de la carta en el modelo (de 'bocaabajo' a 'bocaarriba')
        voltearCarta(carta);
        // Incrementa el contador de cartas boca arriba
        partida.numCartasBocaArriba++;
        // Filtra las cartas que están boca arriba en el modelo
        const cartasBocaArriba = arrayCartas.filter(carta => carta.estado === 'bocaarriba');
        console.log(cartasBocaArriba);

        // Si hay dos cartas boca arriba
        if (cartasBocaArriba.length === 2) {
            // Comprueba si las dos cartas boca arriba forman una pareja
            if (cartasBocaArriba[0].imagen === cartasBocaArriba[1].imagen) {
                // Marca las cartas como resueltas en el modelo
                cartasBocaArriba.forEach(carta => carta.estado = 'resuelta');
                console.log('dos resueltas');

                // Actualiza la interfaz para reflejar la resolución de la pareja
                sumarparejasResueltas();
                console.log(cartasBocaArriba);
            } else {
                // Si las cartas no coinciden, las voltea de nuevo después de un breve período de tiempo
                setTimeout(() => {
                    darVueltaCartasBocaAbajo();
                    actualizarVistaCartas();
                    console.log('else', cartasBocaArriba);
                }, 2000); // Esperar 1 segundo antes de voltear las cartas boca abajo
            }
            // Reinicia el contador de cartas boca arriba
            partida.numCartasBocaArriba = 0;
        }
        // Comprueba si el juego ha sido ganado
        ganar();
    }
}

// Función para dar vuelta visualmente las cartas boca abajo
function darVueltaCartasBocaAbajo() {
    console.log('darVueltaCartaVisual');
    arrayCartas.forEach(carta => {
        if (carta.estado === 'bocaarriba') {
            carta.estado = 'bocaabajo';
            // Obtiene el elemento visual de la carta por su ID y le asigna la imagen del dorso
            document.getElementById(carta.id).src = imagenDorso;
        }
    });


    // Suma un intento cada vez que se dan vuelta las cartas boca abajo
    sumarIntentos();
}


function actualizarVistaCartas() {
    arrayCartas.forEach(carta => {
        const cartaVisual = document.getElementById(carta.id);
        if (carta.estado === 'bocaabajo') {
            cartaVisual.setAttribute('src', imagenDorso);
        }
    });
}



function darVueltaCartaVisual(cartaVisual, imagen) {
    cartaVisual.setAttribute('src', imagen);
}

function voltearCarta(carta) {
    carta.estado = 'bocaarriba';
}


function ganar() {
    // Comprobar si todas las parejas se han resuelto para determinar si el juego ha terminado
    if (partida.numParejasResueltas === numeroCartas / 2) {
        partida.estado = 'fin'; // Marcar el estado del juego como 'fin' cuando se han resuelto todas las parejas
        alert('¡Felicidades! Has completado el juego.');
    }
}


function voltearCartasBocaAbajo(cartas) {
    cartas.forEach(carta => {
        carta.estado = 'bocaabajo';
        document.getElementById(carta.id).setAttribute('src', imagenDorso);
    });
    sumarIntentos();
}




function sumarIntentos() {
    // Incrementar el número de intentos cada vez que se pulsa una carta
    partida.numIntentosTotales++;

    const intentosElement = document.getElementById('intentos');
    intentosElement.textContent = 'Intentos: ' + partida.numIntentosTotales;
}

function sumarparejasResueltas() {
    // Incrementar el número de parejas resueltas
    partida.numParejasResueltas++;

    const parejasResueltasElement = document.getElementById('parejas-resueltas');
    parejasResueltasElement.textContent = 'Parejas resueltas: ' + partida.numParejasResueltas;
}
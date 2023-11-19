// DATOS
const numeroCartas = 2;
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
    '/images/Imagenes/carreteraTenerife.jpg',
    '/images/Imagenes/corralejo.jpg',
    '/images/Imagenes/Hierro.webp',
    '/images/Imagenes/HierroeEden.jpg',
    '/images/Imagenes/IsladeLobos.jpg',
    '/images/Imagenes/punta-brava.jpg',
    '/images/Imagenes/temerifeplaya.jpg',
];

//VISTAS
const mantelCartas = document.querySelector(".memory-board");
let cartasMesa = null;
let arrayCartas = [];
let imagenDorso;


//TIEMPO
let segundos = 0;
let minutos = 0;
let tiempo;



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
    iniciarContadorTiempo();
    btn.disabled = true;
    console.log(arrayCartas);
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
        if (arrayCartas.filter(carta => carta.estado === 'bocaarriba').length < 2) {
            // Voltea visualmente la carta seleccionada
            darVueltaCartaVisual(cartaSeleccionada, carta.imagen);
            // Cambia el estado de la carta en el modelo (de 'bocaabajo' a 'bocaarriba')
            voltearCarta(carta);

            // Incrementa el contador de cartas boca arriba
            partida.numCartasBocaArriba++;

            //Filtramos las cartas que están bocaarriba
            const cartasBocaArriba = arrayCartas.filter(carta => carta.estado === 'bocaarriba');

            // Si hay dos cartas boca arriba
            if (cartasBocaArriba.length === 2) {
                // Comprueba si las dos cartas boca arriba forman una pareja
                if (cartasBocaArriba[0].imagen === cartasBocaArriba[1].imagen) {
                    // Marca las cartas como resueltas en el modelo
                    cartasBocaArriba.forEach(carta => carta.estado = 'resuelta');
                    // Actualiza la interfaz para reflejar la resolución de la pareja
                    sumarparejasResueltas();
                } else {
                    // Si las cartas no coinciden, las voltea de nuevo después de un breve período de tiempo
                    setTimeout(() => {
                        darVueltaCartasBocaAbajo();
                        actualizarVistaCartas();
                        animacion(cartasBocaArriba)
                        // Suma un intento cada vez que se dan vuelta las cartas boca abajo
                        sumarIntentos();
                    }, 2000); // Esperar 2   segundo antes de voltear las cartas boca abajo
                }
                // Reinicia el contador de cartas boca arriba
                partida.numCartasBocaArriba = 0;
            }
            // Comprueba si el juego ha sido ganado
            ganar();
        }
    }
}

//Función para la añadir animación
function animacion(cartas) {

    cartas.forEach(carta => {
        const cartaVisual = document.getElementById(carta.id);
        cartaVisual.classList.add('girar');
        setTimeout(() => {
            cartaVisual.classList.remove('girar');
        }, 300);
    })
}



// Función para dar vuelta visualmente las cartas boca abajo
function darVueltaCartasBocaAbajo() {
    arrayCartas.forEach(carta => {
        if (carta.estado === 'bocaarriba') {
            carta.estado = 'bocaabajo';
            // Obtiene el elemento visual de la carta por su ID y le asigna la imagen del dorso
            document.getElementById(carta.id).src = imagenDorso;
        }
    });
}


function actualizarVistaCartas() {
    arrayCartas.forEach(carta => {
        const cartaVisual = document.getElementById(carta.id);
        if (carta.estado === 'bocaabajo') {
            cartaVisual.setAttribute('src', imagenDorso);
            // Agrega la clase para la animación de giro
            cartaVisual.classList.add('girar');
            setTimeout(() => {
                cartaVisual.classList.remove('girar');
            }, 300);
        }
    });
}



function darVueltaCartaVisual(cartaVisual, imagen) {
    cartaVisual.setAttribute('src', imagen);
}

function voltearCarta(carta) {
    carta.estado = 'bocaarriba';
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


function ganar() {
    // Comprobar si todas las parejas se han resuelto para determinar si el juego ha terminado
    if (partida.numParejasResueltas === numeroCartas / 2) {
        detenerContadorTiempo();
        partida.estado = 'fin';

        // Actualiza los detalles en el mensaje final
        document.getElementById('intentos-modal').textContent = document.getElementById('intentos').textContent;
        document.getElementById('parejas-resueltas-modal').textContent = document.getElementById('parejas-resueltas').textContent;
        document.getElementById('tiempo-final').textContent = document.getElementById('tiempo').textContent;

        // Muestra el mensaje final
        const mensajeFinal = document.getElementById('mensaje-final');
        mensajeFinal.style.display = 'flex';

        // Evento para reiniciar el juego al hacer clic en el botón de reiniciar
        document.getElementById('reiniciar').addEventListener('click', () => {
            mensajeFinal.style.display = 'none'; // Oculta el mensaje
            reiniciarJuego(); // Lógica para reiniciar el juego
        });
    }

}

function reiniciarJuego() {
    // Reiniciar contadores y variables
    partida.numIntentosTotales = 0;
    document.getElementById('intentos').textContent = 'Intentos: ' + partida.numIntentosTotales;
    partida.numParejasResueltas = 0;
    document.getElementById('parejas-resueltas').textContent = 'Parejas resueltas: ' + partida.numParejasResueltas;
    partida.estado = 'inicio'; // Ajusta el estado del juego según tu lógica

    // Reiniciar tiempo
    reiniciarContadorTiempo();

    arrayCartas.forEach(carta => {
        // Eliminar la carta del html
        document.getElementById(carta.id).remove();
    });

    // Limpiar el array de cartas
    arrayCartas = [];



    console.log(arrayCartas);

    // Ocultar el mensaje final si está visible
    const mensajeFinal = document.getElementById('mensaje-final');
    if (mensajeFinal.style.display === 'flex') {
        mensajeFinal.style.display = 'none';
    }

    btn.disabled = false;

}


// ----------------------------------------------------------------
//          ---------- MANEJO DEL TIEMPO ----------------
// ----------------------------------------------------------------


function iniciarContadorTiempo() {
    tiempo = setInterval(actualizarTiempo, 1000); // Actualiza el tiempo cada segundo (1000 ms)
}

function detenerContadorTiempo() {
    clearInterval(tiempo); // Detiene el contador de tiempo
}

function reiniciarContadorTiempo() {
    detenerContadorTiempo();
    segundos = 0;
    minutos = 0;
    document.getElementById('tiempo').textContent = 'Tiempo: 00:00';
}

function actualizarTiempo() {
    segundos++;

    if (segundos === 60) {
        segundos = 0;
        minutos++;
    }

    const tiempoMostrado = `${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
    document.getElementById('tiempo').innerText = `Tiempo: ${tiempoMostrado}`;
}








// Lógica para abrir y cerrar la ventana modal
function abrirVentanaModal(imagen, nombreIsla, informacionIsla) {
    detenerContadorTiempo(); // Detener el contador de tiempo
    const modal = document.getElementById('modal');
    const modalContenido = document.getElementById('modal-contenido');
    const modalCerrar = document.getElementById('modal-cerrar');

    // Mostrar contenido en la ventana modal
    modalContenido.innerHTML = `
        <img src="${imagen}" alt="Imagen de la isla" />
        <h2>${nombreIsla}</h2>
        <p>${informacionIsla}</p>
        <button id="cerrar-modal">Cerrar</button>
    `;

    modal.style.display = 'block'; // Mostrar la ventana modal

    // Cerrar la ventana modal después de 8 segundos
    setTimeout(() => {
        modalCerrar.style.display = 'block';
    }, 8000);

    // Evento para cerrar la ventana modal
    modalCerrar.addEventListener('click', () => {
        modal.style.display = 'none';
        reiniciarContadorTiempo(); // Reiniciar el contador de tiempo
    });
}

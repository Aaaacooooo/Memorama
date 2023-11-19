// DATOS
const numeroCartas = 4;
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
    '/images/Imagenes/carreteraTenerife TNF.jpg',
    '/images/Imagenes/corralejo FTV.jpg',
    '/images/Imagenes/Hierro.webp',
    '/images/Imagenes/HierroeEden.jpg',
    '/images/Imagenes/IsladeLobos FTV.jpg',
    '/images/Imagenes/punta-brava TNF.jpg',
    '/images/Imagenes/temerifeplaya TNF.jpg',
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
    manejoLocalStorage()
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

                    buscarIsla(carta);
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


// ----------------------------------------------------------------
//          ---------- MODAL ----------------
// ----------------------------------------------------------------

let timeoutAbrirModal;

function buscarIsla(carta) {
    const urlCarta = carta.imagen; // URL de la primera carta boca arriba
    const nombreIslaCarta = obtenerNombreIsla(urlCarta);
    const informacionIsla = obtenerInformacion(nombreIslaCarta); // Obtener información sobre la isla

    
    timeoutAbrirModal = setTimeout(() => {
        abrirVentanaModal(obtenerImagen(nombreIslaCarta), nombreIslaCarta, informacionIsla);
    }, 2000);
    
}

function obtenerNombreIsla(url) {
    const regExpHierro = new RegExp('Hierro');
    const regExpGraciosa = new RegExp('Graciosa');
    const regExpLaPalma = new RegExp('Palma');
    const regExpLaurisilvaLaGomera = new RegExp('Gomera');
    const regExpGranCanaria = new RegExp('GC');
    const regExpFuerteventura = new RegExp('FTV');
    const regExpTenerife = new RegExp('TNF');
    const regExpLanzarote = new RegExp('LNZ');

    if (regExpHierro.test(url)) {
        return 'El Hierro';
    } else if (regExpGraciosa.test(url)) {
        return 'La Graciosa';
    } else if (regExpLaPalma.test(url)) {
        return 'La Palma';
    } else if (regExpLaurisilvaLaGomera.test(url)) {
        return 'La Gomera';
    } else if (regExpGranCanaria.test(url)) {
        return 'Gran Canaria';
    } else if (regExpFuerteventura.test(url)) {
        return 'Fuerteventura';
    } else if (regExpTenerife.test(url)) {
        return 'Tenerife';
    } else if (regExpLanzarote.test(url)) {
        return 'Lanzarote';
    } else {
        return 'Nombre de isla no encontrado'; // Si no coincide con ninguna expresión
    }
}

function obtenerInformacion(nombreIsla) {
    const informacionIslas = {
        'Fuerteventura': `Fuerteventura es famosa por sus impresionantes playas de arena dorada que se extienden a lo largo de la costa. Algunas de las más populares incluyen Playa de Corralejo, Playa de Sotavento y Playa de Cofete. Fuerteventura tiene un paisaje volcánico único, con vastas extensiones de lava petrificada que se asemejan a un desierto lunar.`,
        'Gran Canaria': `Uno de los puntos destacados de la isla son las Dunas de Maspalomas, un paisaje de dunas de arena que se extiende hasta el mar y se asemeja a un desierto. En el centro de la isla se encuentra el Parque Nacional de Garajonay, declarado Patrimonio de la Humanidad por la UNESCO. Es un bosque de laurisilva subtropical con una gran biodiversidad. La ciudad de Las Palmas, la capital de la isla, cuenta con un casco antiguo encantador con arquitectura colonial bien conservada, como la Casa de Colón, un museo que rinde homenaje a Cristóbal Colón. La isla es conocida por tener una gran variedad de microclimas debido a su topografía diversa. Puedes encontrar desde zonas desérticas hasta áreas montañosas con temperaturas más frescas.`,
        'Lanzarote': `El Parque Nacional de Timanfaya es el parque nacional más destacado de la isla de Lanzarote, que forma parte de las Islas Canarias en España. Este parque nacional es famoso por su paisaje volcánico y lunar. Timanfaya se creó como resultado de una serie de erupciones volcánicas que ocurrieron entre 1730 y 1736, y aún se considera una zona geotérmica activa. En el Parque Nacional de Timanfaya, los visitantes pueden admirar una variedad de formaciones volcánicas, campos de lava, cráteres y cenizas. El suelo es cálido debido a la actividad geotérmica, lo que ha llevado a la creación del "Restaurante El Diablo", donde la comida se cocina utilizando el calor natural del subsuelo.`,
        'La Graciosa': `La Graciosa es la isla más pequeña del archipiélago de las Islas Canarias y se encuentra al norte de Lanzarote. Es famosa por su ambiente tranquilo y relajado. Al no permitirse el acceso de automóviles particulares en la isla (excepto vehículos de servicio), la contaminación y el ruido son prácticamente inexistentes. Está rodeada por una reserva marina, lo que la convierte en un lugar excepcional para el buceo, snorkel y la observación de la vida marina. Además, forma parte de la Reserva de la Biosfera del Archipiélago Chinijo, que incluye varios islotes cercanos. Esta designación destaca su importancia ecológica y la conservación de su entorno natural.`,
        'Tenerife': `Tiene el Pico del Teide que es el pico más alto de España y uno de los volcanes más grandes del mundo. El Parque Nacional del Teide es un destino imprescindible para los amantes de la naturaleza y ofrece una gran variedad de senderos y vistas panorámicas espectaculares. Gran parte de la isla ha sido declarada Reserva de la Biosfera por la UNESCO debido a su diversidad natural y sus esfuerzos de conservación. Las aguas alrededor de Tenerife son un lugar importante para la observación de ballenas y delfines.`,
        'La Palma': `La Palma se conoce comúnmente como "La Isla Bonita" debido a su asombrosa belleza natural, que incluye impresionantes paisajes, acantilados y exuberante vegetación. Es uno de los mejores lugares del mundo para la observación de estrellas, gracias a su cielo limpio y su baja contaminación lumínica. El Observatorio del Roque de los Muchachos es uno de los principales observatorios astronómicos del hemisferio norte. El Bosque de los Tilos es un lugar mágico, conocido por su laurisilva y por el impresionante sendero de Los Tiles, que lleva a través de un paisaje de cuento de hadas con árboles cubiertos de musgo y helechos.`,
        'El Hierro': `El Hierro ha sido declarada Reserva de la Biosfera por la UNESCO debido a su compromiso con la sostenibilidad y la conservación del medio ambiente. La isla ha implementado políticas ecológicas y de energía renovable, incluyendo un innovador sistema de generación de energía a partir de fuentes renovables. El Sabinar es uno de los bosques de sabinas más antiguos de Europa. Estos árboles retorcidos por la acción de los vientos alisios son un elemento distintivo del paisaje de la isla. La isla es de origen volcánico y presenta paisajes impresionantes. El punto más alto, el Pico de Malpaso, ofrece vistas panorámicas del océano y la vecina isla de La Gomera.`,
        'La Gomera': `La laurisilva es un bosque subtropical húmedo que se caracteriza por su exuberante vegetación, que incluye árboles perennes de hojas verdes brillantes, helechos, musgos y líquenes. Estos bosques suelen estar envueltos en niebla y reciben una cantidad significativa de lluvia, lo que contribuye a su biodiversidad. Ha sido declarado Patrimonio de la Humanidad por la UNESCO.`
    };

    return informacionIslas[nombreIsla];
}

function obtenerImagen(nombreIsla) {
    const imagenesIslas = {
        'Fuerteventura': './images/ImagenesModal/Fuerteventura.jpg',
        'Gran Canaria': './images/ImagenesModal/Gran_Canaria.jpg',
        'Lanzarote': './images/ImagenesModal/Lanzarote.jpg',
        'La Graciosa': './images/ImagenesModal/LaGraciosa.jpeg',
        'Tenerife': './images/ImagenesModal/Tenerife.jpeg',
        'La Palma': './images/ImagenesModal/LaPalma.jpeg',
        'El Hierro': './images/ImagenesModal/ElHierro.jpeg',
        'La Gomera': './images/ImagenesModal/LaGomera.jpeg',
    };

    return imagenesIslas[nombreIsla];
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
    `;

    modal.style.display = 'block'; // Mostrar la ventana modal

    // Ocultar las cartas
    arrayCartas.forEach(carta => {
        document.getElementById(carta.id).style.display = 'none';
    });

    // Configurar el temporizador para mostrar el botón de cierre después de 2 segundos
    let modalCerrarTimeout = setTimeout(() => {
        modalCerrar.style.display = 'block';
    }, 2000);

    // Evento para cerrar la ventana modal
    modalCerrar.addEventListener('click', () => {
        modal.style.display = 'none';
        modalCerrar.style.display = 'none';

        // Mostrar las cartas nuevamente
        arrayCartas.forEach(carta => {
            document.getElementById(carta.id).style.display = 'block';
        });

        clearTimeout(modalCerrarTimeout);
        clearTimeout(timeoutAbrirModal);
        reiniciarContadorTiempo(); // Reiniciar el contador de tiempo
        ganar(); // Lógica para verificar si se ha ganado el juego
    });
    // Lógica de manejo de localStorage
    manejoLocalStorage();
}


// ----------------------------------------------------------------
//          ---------- LOCALSTORAGE ----------------
// ----------------------------------------------------------------


function manejoLocalStorage() {
    // Obtener el mejor registro desde localStorage
    const mejorRegistroGuardado = localStorage.getItem('mejorRegistro');

    // Si hay un registro guardado previamente, analizarlo como JSON
    const mejorRegistroParseado = mejorRegistroGuardado ? JSON.parse(mejorRegistroGuardado) : null;

    // Supongamos que tienes el registro actual en una variable llamada 'registroActual'
    // Esto sería una representación simplificada, deberías tener tu lógica para obtener estos valores
    const registroActual = {
        intentos: 0,
        aciertos: 0,
        tiempoTotal: '00:00' // segundos
    };
    console.log(registroActual);

    // Comparar el registro actual con el mejor registro guardado (si existe)
    if (
        !mejorRegistroParseado ||
        registroActual.intentos < mejorRegistroParseado.intentos ||
        registroActual.aciertos > mejorRegistroParseado.aciertos ||
        registroActual.tiempoTotal < mejorRegistroParseado.tiempoTotal
    ) {
        // Si el registro actual supera al mejor registro guardado o si no hay registro guardado previamente,
        // actualiza el mejor registro en localStorage
        localStorage.setItem('mejorRegistro', JSON.stringify(registroActual));
    }

    // Mostrar los datos en un cuadro al inicio de la partida
    const puntuacionAnterior = document.getElementById('puntuacion-anterior');
    if (mejorRegistroGuardado) {
        const mejorRegistroParseado = JSON.parse(mejorRegistroGuardado);
        puntuacionAnterior.innerText = `Intentos: ${mejorRegistroParseado.intentos}, Aciertos: ${mejorRegistroParseado.aciertos}, Tiempo Total: ${mejorRegistroParseado.tiempoTotal}`;
    } else {
        puntuacionAnterior.innerText = 'Juega una partida para guardar una puntuación.';
    }
    console.log(localStorage.getItem('mejorRegistro'));
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


// ----------------------------------------------------------------
//          ---------- FINAL DEL JUEGO ----------------
// ----------------------------------------------------------------



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
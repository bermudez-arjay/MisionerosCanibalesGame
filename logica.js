let datosJuego = {
    misionerosIzq: 3,
    canibalesIzq: 3,
    misionerosDer: 0,
    canibalesDer: 0,
    misionerosBote: 0,
    canibalesBote: 0,
    posicionBote: 'izquierda',
    idSeleccionado: null
};

const dibujoMisionero = `<svg viewBox="0 0 40 120"><g transform="translate(0,10)"><ellipse cx="20" cy="15" rx="8" ry="10" fill="#f5e1b1" stroke="#000"/><path d="M15,25 L25,25 L35,110 L5,110 Z" fill="#4B2C20" stroke="#000"/></g></svg>`;
const dibujoCanibal = `<svg viewBox="0 0 40 120"><g transform="translate(0,10)"><ellipse cx="20" cy="22" rx="10" ry="10" fill="#4a5d23" stroke="#000"/><path d="M15,32 L25,32 L35,110 L5,110 Z" fill="#4a5d23" stroke="#000"/></g></svg>`;

function inicializarPersonajes() {
    const contenedor = document.getElementById('contenedor-personajes');
    contenedor.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        crearEntidad('misionero', i);
        crearEntidad('canibal', i);
    }
    dibujarPosiciones();
}

function crearEntidad(tipo, indice) {
    const div = document.createElement('div');
    div.className = `personaje ${tipo}`;
    div.id = `${tipo}-${indice}`;
    
    if (tipo === 'misionero') {
        div.innerHTML = dibujoMisionero;
    } else {
        div.innerHTML = dibujoCanibal;
    }

    div.onclick = function() {
        if (datosJuego.idSeleccionado) {
            document.getElementById(datosJuego.idSeleccionado).style.filter = "none";
        }
        datosJuego.idSeleccionado = div.id;
        div.style.filter = "drop-shadow(0 0 5px yellow)";
    };
    document.getElementById('contenedor-personajes').appendChild(div);
}

function dibujarPosiciones() {
    let misionerosIzquierda = 0;
    let canibalesIzquierda = 0;
    let misionerosDerecha = 0;
    let canibalesDerecha = 0;

    document.querySelectorAll('.personaje').forEach(function(personaje) {
        if (personaje.parentElement.id === 'contenedor-personajes') {
            const esMisionero = personaje.classList.contains('misionero');
            let ubicacion = personaje.getAttribute('data-orilla');
            
            if (!ubicacion) {
                ubicacion = 'izquierda';
            }

            personaje.style.transform = "scale(1)";
            personaje.style.bottom = "180px";

            if (ubicacion === 'izquierda') {
                if (esMisionero) {
                    personaje.style.left = (20 + misionerosIzquierda * 35) + "px";
                    misionerosIzquierda++;
                } else {
                    personaje.style.left = (150 + canibalesIzquierda * 35) + "px";
                    canibalesIzquierda++;
                }
            } else {
                if (esMisionero) {
                    personaje.style.left = (680 + misionerosDerecha * 35) + "px";
                    misionerosDerecha++;
                } else {
                    personaje.style.left = (810 + canibalesDerecha * 35) + "px";
                    canibalesDerecha++;
                }
            }
        }
    });
}

function subirPasajero() {
    if (!datosJuego.idSeleccionado) {
        return;
    }
    if (datosJuego.misionerosBote + datosJuego.canibalesBote >= 2) {
        return;
    }

    const personaje = document.getElementById(datosJuego.idSeleccionado);
    let orillaActual = personaje.getAttribute('data-orilla');
    
    if (!orillaActual) {
        orillaActual = 'izquierda';
    }

    if (orillaActual !== datosJuego.posicionBote) {
        return;
    }

    const esMisionero = personaje.classList.contains('misionero');
    if (esMisionero) {
        datosJuego.misionerosBote++;
        if (orillaActual === 'izquierda') {
            datosJuego.misionerosIzq--;
        } else {
            datosJuego.misionerosDer--;
        }
    } else {
        datosJuego.canibalesBote++;
        if (orillaActual === 'izquierda') {
            datosJuego.canibalesIzq--;
        } else {
            datosJuego.canibalesDer--;
        }
    }

    let asiento;
    if (datosJuego.misionerosBote + datosJuego.canibalesBote === 1) {
        asiento = "25px";
    } else {
        asiento = "85px";
    }

    personaje.style.bottom = "15px";
    personaje.style.left = asiento;
    personaje.style.transform = "scale(0.7)";
    document.getElementById('bote').appendChild(personaje);

    datosJuego.idSeleccionado = null;
    personaje.style.filter = "none";
    actualizarInterfaz();
}

function bajarPasajero() {
    const personaje = document.getElementById('bote').querySelector('.personaje');
    if (!personaje) {
        return;
    }

    const esMisionero = personaje.classList.contains('misionero');
    if (esMisionero) {
        datosJuego.misionerosBote--;
        if (datosJuego.posicionBote === 'izquierda') {
            datosJuego.misionerosIzq++;
        } else {
            datosJuego.misionerosDer++;
        }
    } else {
        datosJuego.canibalesBote--;
        if (datosJuego.posicionBote === 'izquierda') {
            datosJuego.canibalesIzq++;
        } else {
            datosJuego.canibalesDer++;
        }
    }

    personaje.setAttribute('data-orilla', datosJuego.posicionBote);
    document.getElementById('contenedor-personajes').appendChild(personaje);
    dibujarPosiciones();
    actualizarInterfaz();
    chequearReglas();
}

function gestionarMovimientoBote() {
    if (datosJuego.misionerosBote + datosJuego.canibalesBote === 0) {
        return;
    }

    if (datosJuego.posicionBote === 'izquierda') {
        datosJuego.posicionBote = 'derecha';
    } else {
        datosJuego.posicionBote = 'izquierda';
    }

    if (datosJuego.posicionBote === 'derecha') {
        document.getElementById('bote').className = 'derecha';
    } else {
        document.getElementById('bote').className = '';
    }
    chequearReglas();
}

function chequearReglas() {
    const misionerosComidosIzq = datosJuego.misionerosIzq > 0 && datosJuego.canibalesIzq > datosJuego.misionerosIzq;
    const misionerosComidosDer = datosJuego.misionerosDer > 0 && datosJuego.canibalesDer > datosJuego.misionerosDer;

    if (misionerosComidosIzq || misionerosComidosDer) {
        setTimeout(function() {
            alert("¡Derrota!");
            reiniciar();
        }, 300);
    } else {
        if (datosJuego.misionerosDer === 3 && datosJuego.canibalesDer === 3) {
            setTimeout(function() {
                alert("¡Victoria!");
                reiniciar();
            }, 300);
        }
    }
}

function actualizarInterfaz() {
    document.getElementById('misioneros-izq').innerText = datosJuego.misionerosIzq;
    document.getElementById('canibales-izq').innerText = datosJuego.canibalesIzq;
    document.getElementById('misioneros-der').innerText = datosJuego.misionerosDer;
    document.getElementById('canibales-der').innerText = datosJuego.canibalesDer;
}

function reiniciar() {
    datosJuego = {
        misionerosIzq: 3,
        canibalesIzq: 3,
        misionerosDer: 0,
        canibalesDer: 0,
        misionerosBote: 0,
        canibalesBote: 0,
        posicionBote: 'izquierda',
        idSeleccionado: null
    };
    document.getElementById('bote').className = '';
    inicializarPersonajes();
    actualizarInterfaz();
}

reiniciar();
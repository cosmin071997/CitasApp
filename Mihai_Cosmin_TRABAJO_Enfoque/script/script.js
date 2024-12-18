class TextoBienvenida {
    constructor(texto, contenedorId) {
        this.texto = texto;
        this.contenedor = document.getElementById(contenedorId);
    }

    animarTexto() {
        this.texto.split('').forEach((caracter, indice) => {
            const span = document.createElement('span');
            span.textContent = caracter;
            span.className = 'letra';
            this.contenedor.appendChild(span);

            setTimeout(() => {
                span.classList.add('visible');
            }, indice * 200);
        });
    }
}
// Inicialización del texto de bienvenida
const textoBienvenida = new TextoBienvenida("¡Bienvenido!", 'textoBienvenida');
textoBienvenida.animarTexto();

//-------------------------------------------------

function alternarVista(vista) {
    const textoBienvenida = document.getElementById("textoBienvenida");
    const divForm = document.getElementById("divform");
    const tablaCitas = document.getElementById("tablaCitas");
    const mod = document.getElementById("divM");
    const sidebar = document.getElementById("sideb");
    const fo = document.getElementById("f");


    if (vista === "formulario") {
        divForm.style.display = "block";
        tablaCitas.style.display = "none";
        textoBienvenida.style.display = "none";
        mod.style.display = "none";
    } else if (vista === "tabla") {
        divForm.style.display = "none";
        tablaCitas.style.display = "block";
        mod.style.display = "none";
        mod.style.display = "none";
        sidebar.style.display = "none";
    } else if (vista === "modificar") {
        divForm.style.display = "none";
        tablaCitas.style.display = "none";
        textoBienvenida.style.display = "none";
        mod.style.display = "block";
        sidebar.style.display = "none";
        fo.style.display = "none";
    }
}

function validarF() {
    alternarVista("formulario");
    // Agregar el evento al formulario recién creado
    const citaForm = document.getElementById('citaForm');
    citaForm.onsubmit = null; // Elimina cualquier evento `submit` previo 
    citaForm.addEventListener('submit', function (event) {
        console.log("Validación iniciada..."); //consola
        event.preventDefault(); // Evita el envío del formulario inmediatamente
        let isValid = true;
        // Limpiar mensajes de error previos
        document.querySelectorAll('.error').forEach(errorDiv => errorDiv.textContent = '');
        // Validar Fecha
        const fecha = document.getElementById('fecha');
        if (!fecha.value) {
            document.getElementById('fechaError').textContent = 'La fecha es obligatoria.';
            isValid = false;
        }
        // Validar Hora
        const hora = document.getElementById('hora');
        if (!hora.value) {
            document.getElementById('horaError').textContent = 'La hora es obligatoria.';
            isValid = false;
        }
        // Validar Nombre
        const nombre = document.getElementById('nombre');
        const nombreRegex = /^[a-zA-ZÀ-ÿ\s]{2,}$/; // Permite letras y espacios, mínimo 2 caracteres

        if (!nombre.value.trim()) {
            document.getElementById('nombreError').textContent = 'El nombre es obligatorio.';
            isValid = false;
        } else if (!nombreRegex.test(nombre.value.trim())) {
            document.getElementById('nombreError').textContent = 'El nombre solo puede contener letras y debe tener al menos 2 caracteres.';
            isValid = false;
        } else {
            document.getElementById('nombreError').textContent = ''; // Limpiar el error si es válido
        }

        // Validar Apellido
        const apellido = document.getElementById('apellido');
        const apellidoRegex = /^[a-zA-ZÀ-ÿ\s]{2,}$/; // Permite letras y espacios, mínimo 2 caracteres

        if (!apellido.value.trim()) {
            document.getElementById('apellidoError').textContent = 'El apellido es obligatorio.';
            isValid = false;
        } else if (!apellidoRegex.test(apellido.value.trim())) {
            document.getElementById('apellidoError').textContent = 'El apellido solo puede contener letras y debe tener al menos 2 caracteres.';
            isValid = false;
        } else {
            document.getElementById('apellidoError').textContent = ''; // Limpiar el error si es válido
        }

        // Validar DNI
        const dni = document.getElementById('dni');
        const dniRegex = /^[XYZ]?\d{5,8}[A-Z]$/;
        if (!dni.value.trim()) {
            document.getElementById('dniError').textContent = 'El DNI o NIE es obligatorio.';
            isValid = false;
        } else if (!dniRegex.test(dni.value.toUpperCase())) {
            document.getElementById('dniError').textContent = 'El DNI o NIE no tiene un formato válido.';
            isValid = false;
        }
        // Validar Fecha de Nacimiento
        const fechaN = document.getElementById('fechaN');
        if (!fechaN.value) {
            document.getElementById('fechaNError').textContent = 'La fecha de nacimiento es obligatoria.';
            isValid = false;
        }
        // Verificar si el formulario es válido antes de enviarlo
        if (isValid) {
            const cita = {
                fecha: fecha.value,
                hora: hora.value,
                nombre: nombre.value.trim(),
                apellido: apellido.value.trim(),
                dni: dni.value.trim(),
                fechaN: fechaN.value,
                observaciones: document.getElementById("observaciones").value.trim(),
            };
            guardarCitaEnCookie(cita); // Guardar la cita en cookies

            // Mostrar la imagen de carga
            const imagenCargando = document.getElementById('imagenCargando');
            const tablaCont = document.getElementById('tablaCitas');
            const fformulrio = document.getElementById("divform");
            fformulrio.style.display = "none";
            imagenCargando.style.display = 'block';
            tablaCont.style.display = 'none';

            // Simular un retraso para la imagen de carga (por ejemplo, 2 segundos)
            setTimeout(() => {
                imagenCargando.style.display = 'none';
                mostrarTablaCitas(); // Actualizar la tabla
                tablaCont.style.display = 'block';
            }, 2000); // Retraso de 2 segundos
        } else {
            console.log("Formulario no enviado. Hay errores.");
        }
    });
}


//-------------------------------------------------
//Creeamos y mostraamos la tabla
function mostrarTablaCitas() {
    alternarVista("tabla");

    document.getElementById("textoBienvenida").innerText = "";
    const tablaCont = document.getElementById('tablaCitas');
    let citasGuardadas = JSON.parse(getCookie('citas') || '[]'); // Leer citas de las cookies

    console.log(citasGuardadas); // Consola

    if (tablaCont) {
        if (citasGuardadas.length === 0) {
            // Si no hay citas, mostrar un mensaje
            tablaCont.innerHTML = `<h4>No hay citas disponibles.</h4>
             <button onclick=" validarF()"  class="buttonVo" >Agrega una cita </button>` ;
        } else {
            // Si hay citas, mostrar la tabla
            tablaCont.innerHTML = `
            <table border="1">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>DNI</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Observaciones</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${citasGuardadas.map((cita, index) => `
                        <tr>
                            <td>${cita.fecha}</td>
                            <td>${cita.hora}</td>
                            <td>${cita.nombre}</td>
                            <td>${cita.apellido}</td>
                            <td>${cita.dni}</td>
                            <td>${cita.fechaN}</td>
                            <td>${cita.observaciones}</td>
                            <td>
                                <button class="borrar" onclick="borrarCita(${index})">Borrar</button>
                                <button class="modificar" onclick="modificarCita(${index})">Modificar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            `;
        }

        console.log(tablaCont.style.display);
        console.log(tablaCont.innerHTML);
    } else {
        console.error("Elemento no encontrado");
    }
}




function guardarCitaEnCookie(cita) {
    let citasGuardadas = JSON.parse(getCookie('citas') || '[]'); // Obtener citas existentes
    citasGuardadas.push(cita); // Agregar la nueva cita
    document.cookie = `citas=${encodeURIComponent(JSON.stringify(citasGuardadas))};path=/;max-age=${7 * 24 * 60 * 60}`; // Guardar por 7 días
}

function getCookie(name) {
    let cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null; // Devuelve null si no encuentra la cookie
}


//---------------

function borrarCita(index) {
    let citasGuardadas = JSON.parse(getCookie('citas') || '[]');
    citasGuardadas.splice(index, 1); // Eliminar la cita por índice
    document.cookie = `citas=${encodeURIComponent(JSON.stringify(citasGuardadas))};path=/;max-age=${7 * 24 * 60 * 60}`; // Actualizar cookie
    mostrarTablaCitas(); // Actualizar la tabla
}
function modificarCita(index) {
    const citas = JSON.parse(getCookie("citas") || "[]");
    const cita = citas[index];
    alternarVista("modificar");

    const divM = document.getElementById("divM");
    divM.innerHTML = `
    <h3> Modificar formulario</h3><br><br>

        <div class="modificar">
            <img src="img/undraw_doctors_p6aq.svg" alt="Ilustracion">
            <form id="modificarCitaForm">
                <div class="form-group">
                    <label for="modFecha">Fecha</label>
                    <input type="date" id="modFecha" value="${cita.fecha}" >
                    <div class="error" id="modFechaError"></div>
                </div>
                <div class="form-group">
                    <label for="modHora">Hora</label>
                    <input type="time" id="modHora" value="${cita.hora}" >
                    <div class="error" id="modHoraError"></div>
                </div>
                <div class="form-group">
                    <label for="modNombre">Nombre</label>
                    <input type="text" id="modNombre" value="${cita.nombre}" placeholder="Nombre" >
                    <div class="error" id="modNombreError"></div>
                </div>
                <div class="form-group">
                    <label for="modApellido">Apellido</label>
                    <input type="text" id="modApellido" value="${cita.apellido}" placeholder="Apellido">
                    <div class="error" id="modApellidoError"></div>
                </div>
                <div class="form-group">
                    <label for="modDni">DNI</label>
                    <input type="text" id="modDni" value="${cita.dni}" placeholder="DNI" >
                    <div class="error" id="modDniError"></div>
                </div>
                <div class="form-group">
                    <label for="modFechaN">Fecha de nacimiento</label>
                    <input type="date" id="modFechaN" value="${cita.fechaN}" >
                    <div class="error" id="modFechaNError"></div>
                </div>
                
                <div class="form-group">
                    <label for="modObservaciones">Observaciones</label>
                    <textarea id="modObservaciones" placeholder="Observaciones">${cita.observaciones}</textarea>
                </div>
                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    `;

    const modificarCitaForm = document.getElementById("modificarCitaForm");

    modificarCitaForm.addEventListener("submit", (event) => {
        event.preventDefault();
    
        if (validarFormularioModificado("modificarCitaForm")) {
            const citaModificada = {
                fecha: document.getElementById("modFecha").value,
                hora: document.getElementById("modHora").value,
                nombre: document.getElementById("modNombre").value.trim(),
                apellido: document.getElementById("modApellido").value.trim(),
                dni: document.getElementById("modDni").value.trim(),
                fechaN: document.getElementById("modFechaN").value,
                observaciones: document.getElementById("modObservaciones").value.trim(),
            };
    
            citas[index] = citaModificada;
            document.cookie = `citas=${encodeURIComponent(JSON.stringify(citas))};path=/;max-age=${7 * 24 * 60 * 60}`;
            alert("Cita modificada correctamente.");
            mostrarTablaCitas();
            console.log("modificado");
        } else {
            console.log("Errores en la validación del formulario.");
        }
    });
    
    function validarFormularioModificado(formularioId) {
        let isValid = true;
    
        // Limpiar mensajes de error previos
        document.querySelectorAll(`#${formularioId} .error`).forEach(errorDiv => errorDiv.textContent = '');
    
        // Lista de campos con sus validaciones
        const campos = [
            { 
                id: "modFecha", 
                mensaje: "La fecha es obligatoria.", 
                extra: val => /^\d{4}-\d{2}-\d{2}$/.test(val) || "La fecha debe estar en formato AAAA-MM-DD." 
            },
            { 
                id: "modHora", 
                mensaje: "La hora es obligatoria.", 
                extra: val => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val) || "La hora debe estar en formato HH:MM." 
            },
            { 
                id: "modNombre", 
                mensaje: "El nombre es obligatorio.", 
                extra: val => /^[a-zA-ZÀ-ÿ\s]{2,}$/.test(val) || "El nombre debe contener solo letras y al menos 2 caracteres." 
            },
            { 
                id: "modApellido", 
                mensaje: "El apellido es obligatorio.", 
                extra: val => /^[a-zA-ZÀ-ÿ\s]{2,}$/.test(val) || "El apellido debe contener solo letras y al menos 2 caracteres." 
            },
            { 
                id: "modDni", 
                mensaje: "El DNI o NIE es obligatorio.", 
                extra: val => /^[XYZ]?\d{5,8}[A-Z]$/.test(val.toUpperCase()) || "El DNI o NIE no tiene un formato válido." 
            },
            { 
                id: "modFechaN", 
                mensaje: "La fecha de nacimiento es obligatoria.", 
                extra: val => /^\d{4}-\d{2}-\d{2}$/.test(val) || "La fecha de nacimiento debe estar en formato AAAA-MM-DD." 
            },
        ];
    
        // Validar cada campo
        campos.forEach(({ id, mensaje, extra }) => {
            const campo = document.getElementById(id);
            const errorDiv = document.getElementById(`${id}Error`);
    
            if (!campo.value.trim()) {
                errorDiv.textContent = mensaje;
                isValid = false;
            } else if (extra && extra(campo.value.trim()) !== true) {
                errorDiv.textContent = extra(campo.value.trim());
                isValid = false;
            }
        });
    
        return isValid;
    }
}
// Elementos del DOM
const formularioPrestamo = document.getElementById('form-prestamo')
const inputs = document.querySelectorAll('#form-prestamo input')
const inputNombre = document.getElementById('nombre')
const inputEdad = document.getElementById('edad')
const inputCapital = document.getElementById('capital')
const inputCuotas = document.getElementById('cuotas')
const inputAntiguedad = document.getElementById('antiguedad')
const inputDeudas = document.getElementById('deudas')

// Variables iniciales
let valorCuotas = 0
let valorPrestamo = 0
let nuevoCliente = []
let tasaInteres = 0
let arrayNombresRandom = []
let codigosPrestamo = []

// Funcion calculadora de prestamo
function calculadoraCuotasPrestamo (capital, tasa, periodo) {
    valorCuotas = capital * (((( 1 + tasa ) ** periodo ) * tasa )/ ((( 1 + tasa ) ** periodo - 1 )))
}
// Funcion calcular valor de cuotas del prestamo
function calculadoraPrestamo (prestamo, cuotas) {
    valorPrestamo = prestamo * cuotas
}

// Expresiones regulares para validar formularios
const expresionesRegulares = {
    nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    edad: /^(1[8-9]|[2-7][0-9]|8[0-5])$/,
    capital: /^(100000|[1-9][0-9]{5}|[1-9][0-9]{6}|[1-9][0-9]{7}|10000000)$/,
    cuotas: /^(12|[1-9][0-9]|[1-2][0-9][0-9]|3[0-5][0-9]|360)$/
}

// Estado de los campos de informacion
const campos = {
    nombre: false,
    edad: false,
    capital: false,
    cuotas: false
}

// Funcion para crear una tabla para enviar los valores del prestamo al HTML
function crearTabla() {
    calculadoraCuotasPrestamo(ultimoObjetoDelArray.capital, 0.05, ultimoObjetoDelArray.cuotas)
    calculadoraPrestamo(valorCuotas, ultimoObjetoDelArray.cuotas)
    const div = document.getElementById('informacion-prestamo')
    div.innerHTML = `
        <table class= "tabla-prestamos">
            <tr>
                <td> Capital </td>
                <td> Cantidad de cuotas </td>
                <td> Cuota de prestamo </td>
                <td> Total prestamo a pagar </td>
                <td> Codigo del prestamo </td>
            </tr>
            <tr>
                <td> $${ultimoObjetoDelArray.capital} </td>
                <td> ${ultimoObjetoDelArray.cuotas} </td>
                <td> $${valorCuotas.toFixed(2)} </td>
                <td> $${valorPrestamo.toFixed(2)} </td>
                <td> ${ultimoCodigoGenerado}</td>
            </tr>
        <table>
    `
}

// Funcion para validar formularios
const validarFormulario = (e) => {
    switch (e.target.name) {
        case 'nombre':
            validarCampo(expresionesRegulares.nombre, e.target, 'nombre')
        break;
        case 'edad':
            validarCampo(expresionesRegulares.edad, e.target, 'edad')
        break;
        case 'capital':
            validarCampo(expresionesRegulares.capital, e.target, 'capital')
        break;
        case 'cuotas':
            validarCampo(expresionesRegulares.cuotas, e.target, 'cuotas')
        break;
    }
}

// Funcion para validar los campos de informacion
const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`form-grupo-${campo}`).classList.remove('form-grupo-incorrecto')
        document.getElementById(`form-grupo-${campo}`).classList.add('form-grupo-correcto')
        document.querySelector(`#form-grupo-${campo} i`).classList.add('fa-check-circle')
        document.querySelector(`#form-grupo-${campo} i`).classList.remove('fa-circle-xmark')
        document.querySelector(`#form-grupo-${campo} .form-input-error`).classList.remove('form-input-error-activo')
        campos[campo] = true
    } else {
        document.getElementById(`form-grupo-${campo}`).classList.add('form-grupo-incorrecto')
        document.getElementById(`form-grupo-${campo}`).classList.remove('form-grupo-correcto')
        document.querySelector(`#form-grupo-${campo} i`).classList.remove('fa-check-circle')
        document.querySelector(`#form-grupo-${campo} i`).classList.add('fa-circle-xmark')
        document.querySelector(`#form-grupo-${campo} .form-input-error`).classList.add('form-input-error-activo')
        campos[campo] = false
    }
}

// Evento para validar la entrada de datos
inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario)
    input.addEventListener('blur', validarFormulario)
})

// Gerenacion de apellido random para usarse como codigo del prestamo

fetch('https://randomuser.me/api/')
.then( ( nombreRandom ) => nombreRandom.json() )
.then( ( data ) => {
    arrayNombresRandom = data.results
    arrayNombresRandom.forEach(function(user) {
        codigosPrestamo.push(user.name.last)
        ultimoCodigoGenerado = codigosPrestamo[codigosPrestamo.length - 1]
    })
})


//Evento de envio del formulario
formularioPrestamo.addEventListener('submit', function(e) {
    e.preventDefault()
    setTimeout(function() {
        if (campos.nombre && campos.edad && campos.capital && campos.cuotas) {
            nuevoCliente.push({
                nombre: inputNombre.value,
                edad: Number(inputEdad.value),
                capital: Number(inputCapital.value),
                cuotas: Number(inputCuotas.value), 
                codigo: ultimoCodigoGenerado
            })
            formularioPrestamo.reset()
            ultimoObjetoDelArray = nuevoCliente[nuevoCliente.length - 1]
            crearTabla()
            localStorage.clear()
            localStorage.setItem("arrayNuevoCliente", JSON.stringify(nuevoCliente))
            document.querySelectorAll('.form-grupo-correcto').forEach((icono) => {
                icono.classList.remove('form-grupo-correcto')
            })
        } else {
            swal("ERROR DE DATOS DEL FORMULARIO", "Por favor ingresar nuevamente los datos del prestamo", "warning")
        }
    }, 500)})

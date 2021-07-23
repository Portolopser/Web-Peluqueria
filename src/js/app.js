let page = 1;

const appointment = {
    name = '',
    date = '',
    time = '',
    services: []
}

document.addEventListener('DOMContentLoaded', function () {
    initApp();
});

function initApp() {
    showServicesDB();

    //Indica en qué DIV nos encontramos actualmente según el tab que se pulsa
    showSection();

    //Oculta o muestra una sección según el tab que se pulsa
    changeSection();

    next();
    previous();

    //Comprueba la página actual para ocultar o mostrar la paginación
    pagesButtons();

    // Muestra el resumen de la cita o mensaje de error en caso de que no se pueda validar correctamente
    showAppointmentData();

    //Guarda el nombre de la cita en el objeto con nombre 'serviceOBJ'
    appointmentName();

    //Guarda el día en el que se coge la cita
    appointmentDate();

    //Deshabilita los días que ya han pasado en el datepicker de la fecha del input del formulario
    denyPastDays();

    //Guarda la hora de la cita
    storeAppointmentTime();
}

function storeAppointmentTime() {
    //Seleccionamos el input del tiempo en el formulario
    const timeInput = document.querySelector('#time');
    timeInput.addEventListener('input', function(e){
        console.log(e.target.value);
        //Guardamos el valor en timeNow
        const timeAppointment = e.target.value;
        //Usamos el split para que haga una separación de las horas y los minutos, y en este caso lo almacenamos en la variable 'hour' que serán las horas
        const hour = timeAppointment.split(':');
        console.log(hour);

        //Si la hora seleccionada está entre las 10:00 y las 18:00 el valor de la variable 'timeAppointment' que es el obtenido por medio del input se almacena en el objeto 'appointment' como su parámetro 'time'
        if(hour[0] < 10 || hour[0] > 18){
            showAlert('Esa hora no está disponible', 'error');
            setTimeout(() => {
                timeInput.value = '';
            }, 3000);
        } else {
            appointment.time =  timeAppointment;
        }
    })
}

function denyPastDays() {
    const dateInput = document.querySelector('#date');
    
    //Haciendo esto el 'new Date()' nos va a dar la hora exacta en la que se creó la variable 'dateNow' 
    const dateNow = new Date();
    const year = dateNow.getFullYear();
    //Hacemos esto para que por ejemplo Enero sea el mes número 1 y no empiece en el 0
    const month = dateNow.getMonth() + 1;
    const day = dateNow.getDate() + 1;

    //Formato que queremos: ddd-mm-yyyy
    //Creamos la cadena con los datos y el formato y se la asignamos a la variable 'dateDeny'
    const dateDeny = `${year}-${month}-${day}`;

    //Hacemos que el atributo 'min' del input de fecha tenga el valor de la variable
    dateInput.min = dateDeny;

    console.log(dateDeny);
}

function appointmentDate() {
    //Seleccionamos la ID Fecha del Input que está en la línea 43 del index.html, que es en el que hay que escoger la fecha en el formulario
    const dateInput = document.querySelector('#date');

    //Le ponemos el EventListener de input, que se usa para los propios inputs
    dateInput.addEventListener('input', function(e) {
        //Pillamos el valor de la fecha introducida con el e.target.value (nos devuelve la fecha en String)
        //console.log(e.target.value);

        //Guardamos el valor de la fecha introducida en el input en la variable 'day', pero esta vez nos va a salir con más información ya que estamos creando un objeto 'Date()'
        
        //getUTCDay nos devuelve le valor del día de la semana en número, concretamente del 0 al 6
        //El Domingo es 0,..., y el Sábado es 6
        const day = new Date(e.target.value).getUTCDay();

        //Si se selecciona una fecha el domingo le decimos que no es válido
        if([0].includes(day)) {
            //Con esto evitamos que la fecha seleccionada se quede como seleccionada en el input aunque no sea válida y le asignamos el valor de cadena vacía para que un mejor aspecto
            e.preventDefault();
            dateInput.value = '';
            //Utilizamos la función que creamos de mostrar alerta, y le pasamos como primer parámetro el mensaje y como segundo parámetro el tipo de alerta, en este caso es de tipo 'error'
            showAlert('El Domingo no abrimos', 'error');
        } else {
            //En caso de que sea válida la fecha le asignamos el valor (value) del input (la fecha) a la variable 'dateInput' y se lo asignamos a su vez al objeto global creado 'appointment' como valor en su parámetro 'date'
            appointment.date = dateInput.value;

            //Esto ya nos muestra la información de la cita con el nombre del cliente y la fecha establecidas
            console.log(appointment);
        }

        //Crea un objeto 'options' que nos genera el día, año y mes gracias a las palabras 'weekday', 'year' y 'month'
        /* const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long'
        } */
        //console.log(day.toLocaleDateString('es-ES', options));
    });
}

function appointmentName() {
    //Seleccionamos la ID Nombre del Input que está en la línea 39 del index.html, que es en el que hay que escribir el nombre en el formulario
    const inputName = document.querySelector('#name');

    //Le ponemos el EventListener de input, que se usa para los propios inputs
    inputName.addEventListener('input', function (e) {
        //Cada vez que el usuario escribe una letra en el input si hacemos un console log podemos ver que lo pilla, usamos el 'trim()' para quitar espacios en blanco tanto al principio como al final
        const nameText = e.target.value.trim();
        console.log(nameText);

        //Validar de que 'nameText' tiene que tener contenido y no estar vacío
        //Si el texto introducido en el input (valor de este recogido en la variable nameText) está vacío o es menor de 3 se muestra el error con el showAlert que es una función que hemos definido debajo de esta
        if(nameText === '' || nameText.length < 3) {
            showAlert('Nombre no válido','error');
        } else {
            //Con este código mostramos el error de la alerta ya de primeras, y cuando el usuario escriba 3 o más caracteres se va a quitar el error
            const alert = document.querySelector('.alert');
            if(alert) {
                alert.remove();
            }
            appointment.name = nameText;
        }
    });
}

//Le damos parámetros de mensaje y error. Mensaje para asignarle el textContent y el tipo para que se sepa que es de type 'error'
function showAlert(mensaje, type) {
    //Si ya hay una alerta previa definida, entonces no crear otra según introducimos datos. Con el return detenemos la ejecución del código y se queda ahí
    const previousAlert = document.querySelector('.alert');
    if (previousAlert) {
        return;
    }

    //Creamos un div donde se pintará la alerta almacenado en la variable 'alert', lo asignamos al mensaje con el (alert.textContent = mensaje;) y luego le añadimos la clase 'alert' para darle el aspecto de mensaje de alerta mediante css
    const alert = document.createElement('DIV');
    alert.textContent = mensaje;
    alert.classList.add('alert');

    //Si el type del mensaje es 'error' le añadimos la clase 'error'
    if(type === 'error') {
        alert.classList.add('error');
    } else if (type === 'success') {
        alert.classList.add('success');
    }

    //Insertar en el html donde seleccionamos la clase del formulario, la asignamos a la variable 'form' y luego le hacemos el appendChild para que se pinte justo debajo la variable 'alert', que más arriba vemos que es la DIV que contiene el mensaje
    const form = document.querySelector('form');
    form.appendChild(alert);

    //Eliminar la alerta almacenada en la variable '.alert' después de 3 segundos con el setTimeout
    setTimeout( function() {
        alert.remove();
    }, 3000);
}

//Función que muestra los datos de la cita (Crea un párrafo y lo pinta debajo de una div con la clase '.recap-content')
function showAppointmentData() {
    //Destructuring
    const { name, date, time, services } = appointment;

    //Seleccionar el resumen de la cita
    const recapDiv = document.querySelector('.recap-content');

    //Limpia el html previo
    while(recapDiv.firstChild) {
        recapDiv.removeChild(recapDiv.firstChild);
    }

    //Validación del objeto 'appointment'
    //Si uno de los campos del formulario está vacío (includes('')), se crea un elemento P y se pinta debajo de la div noServices
    if(Object.values(appointment).includes('')) {
        const noServices = document.createElement('P');
        noServices.textContent = 'Los datos del formulario están incompletos';

        noServices.classList.add('deny-appointment');

        //Agregar a recap
        recapDiv.appendChild(noServices);
    } else {

        const appointmentHeading = document.createElement('H3');
        appointmentHeading.textContent = 'Appointment Recap';

        //Vamos a mostrar el resumen de la cita o el recap
        const appointmentName = document.createElement('P');
        //Vamos a utilizar innerHTML en vez de textContent para escribir el HTML ha que es lo más conveniente a la hora de querer escribir etiquetas HTML por templateStrings
        appointmentName.innerHTML = `<span>Nombre:</span> ${name}`;

        const appointmentDate = document.createElement('P');
        appointmentDate.innerHTML = `<span>Fecha:</span> ${date}`;

        const appointmentTime = document.createElement('P');
        appointmentTime.innerHTML = `<span>Hora:</span> ${time}`;

        const serviceAppointment = document.createElement('DIV');
        serviceAppointment.classList.add('services-recap');

        const servicesHeading = document.createElement('H3');
        servicesHeading.textContent = 'Services Recap';

        serviceAppointment.appendChild(servicesHeading);

        //Para calcular el total de la cita
        let appointmentTotalPrice = 0;

        //Iterar sobre el array de servicios
        services.forEach(function(service) {
            //Aplicamos destructuring y así podemos referenciar fácilmente más abajo 
            const { name, price } = service;

            const serviceContainer = document.createElement('DIV');
            serviceContainer.classList.add('service-container');

            const serviceText = document.createElement('P');
            serviceText.textContent = name;

            const servicePrice = document.createElement('P');
            servicePrice.textContent = price;
            servicePrice.classList.add('service-price');

            const serviceTotal = price.split('$');
            //console.log(parseInt( serviceTotal[1].trim() ));

            appointmentTotalPrice += parseInt( serviceTotal[1].trim() );

            console.log(typeof(appointmentTotalPrice));

            //Insertar nombre y precio de servicio en el div. Primero siempre se referencia al artículo padre y dentro del AppendChild es donde va el elemento que queremos insertar
            serviceContainer.appendChild(serviceText);
            serviceContainer.appendChild(servicePrice);

            serviceAppointment.appendChild(serviceContainer);

        });


        //A la variable recapDiv definida más arriba en esta función le agregamos finalmente el 'appointmentName' que es el elemento HTML creado antes para que se pinte el nombre del valor del input del formulario, y así con el resto de parámetros del objeto 'appointment'
        recapDiv.appendChild(appointmentHeading);
        recapDiv.appendChild(appointmentName);
        recapDiv.appendChild(appointmentDate);
        recapDiv.appendChild(appointmentTime);

        recapDiv.appendChild(serviceAppointment);

        const totalPrice = document.createElement('P');
        totalPrice.innerHTML = `<span>Payment total: </span> ${appointmentTotalPrice}`;

        recapDiv.appendChild(totalPrice);
    }
}

//Paginación siguiente 
function next() {
    const nextPage = document.querySelector('#next');
    nextPage.addEventListener('click', function() {
        page++;

        pagesButtons();
    });
}

//Paginación anterior
function previous() {
    console.log('Anterior');

    const prevPage = document.querySelector('#previous');
    prevPage.addEventListener('click', function() {
        page--;

        pagesButtons();
    });
}

//Funcionalidad de los tres botones de la parte superior
function pagesButtons() {
    const nextPage = document.querySelector('#next');
    const prevPage = document.querySelector('#previous');

    if(page === 1) {
        prevPage.classList.add('hidden');
    } else if(page === 3) {
        nextPage.classList.add('hidden');
        prevPage.classList.remove('hidden');
        showAppointmentData(); //Estamos en la página 3, carga el resumen con los datos de la cita
    } else {
        nextPage.classList.remove('hidden');
        prevPage.classList.remove('hidden');
    }

    showSection(); //Cambia la sección que se muestra por la de la página
}

//Función que muestra el contenido de una sección
function showSection() {
    //Eliminar la clase 'show-section' de la sección anterior
    const previousSection = document.querySelector('.show-section');
    if (previousSection) {
        previousSection.classList.remove('show-section');
    }

    const currentSection = document.querySelector(`#step-${page}`);
    currentSection.classList.add('show-section');

    //Eliminar la classe 'current' de la tab anterior
    const nextSection = document.querySelector('.tabs .current');
    if(nextSection) {
        nextSection.classList.remove('current');
    } 

    //Destaca el tab en el que estamos
    const tab = document.querySelector(`[data-step="${page}"]`);
    tab.classList.add('current');
}

//Función que cambia de sección según hagas click
function changeSection() {
    const links = document.querySelectorAll('.tabs button');

    //Mismo código que el peoyecto del festival de rap, hacemos lo mismo que en los enlaces de navegación de la navbar superior
    links.forEach( function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            page = parseInt(e.target.dataset.step);

/*             //Agrega la clase 'show-section' donde dimos click
            const section = document.querySelector(`#step-${page}`);
            section.classList.add('show-section');

            //Agrega la clase 'current' donde dimos click
            const tab = document.querySelector(`[data-step="${page}"]`);
            tab.classList.add('current'); */

            //Llamar la función de mostrar section
            showSection();

            pagesButtons();
        });
    });
}

//Función asíncrona que coge los datos del archivo JSON en el que están los servicios de peluquería
async function showServicesDB() {
    try {
        const result = await fetch('./servicios.json');
        const db = await result.json();

        //Usamos el destructuring
        const {
            servicios
        } = db;

        //Podemos generar desde aquí el html
        servicios.forEach(servicio => {
            //Seguimos usando destructuring para coger esos valores de "servicio", en vez de hacer servicio.id, servicio.nombre y servicio.precio
            const {
                id,
                nombre,
                precio
            } = servicio;

            //DOM Scripting
            //Generar el nombre del servicio
            const serviceName = document.createElement('P');
            serviceName.textContent = nombre;
            serviceName.classList.add('service-name');

            //Generar el precio del servicio
            const servicePrice = document.createElement('P');
            servicePrice.textContent = `${precio} $`;
            servicePrice.classList.add('service-price');

            //Generar div contenedor 
            const serviceDiv = document.createElement('DIV');
            serviceDiv.classList.add('service');
            serviceDiv.dataset.idService = id;

            //Selecciona un servicio para la cita y le cambia el color cuando está seleccionado
            serviceDiv.onclick = selectService;

            //Inyectar precio y nombre al div de servicio
            serviceDiv.appendChild(serviceName);
            serviceDiv.appendChild(servicePrice);

            document.querySelector('#services').appendChild(serviceDiv);

            console.log(serviceDiv);
        })

    } catch (error) {
        console.log(error);
    }
}

//Función que le añade o le quita la clase '.selected' si está pulsado o no
function selectService(e) {

    let element;
    //Forzar que el elemento sobre el cual hacemos click sea el div
    if(e.target.tagName === 'P') {
        element = e.target.parentElement;
    } else {
        element = e.target;
    }

    //Hacemos una comprobación con el '.contains' sobre si tiene la clase con nombre "selected", si la tiene se la quitamos a la hora de hacer click, y si no la tiene se la añadimos. Esta clase se utilizará en  css para darle un color al fondo
    if(element.classList.contains('selected')) {
        element.classList.remove('selected');

        const id = parseInt( element.dataset.idService );

        removeService(id);
    } else {
        element.classList.add('selected');

        //Crea un objeto y le pasa todos los valores que tiene el servicio, que en este caso son el id, el nombre y el precio
        const serviceOBJ = {
            id: parseInt(element.dataset.id),
            name: element.firstElementChild.textContent,
            price: element.firstElementChild.nextElementSibling.textContent // element.lastElementChild.textContent
        }

        addService(serviceOBJ);
    }
}

function removeService(id) {
    const { services } = appointment; 
    appointment.services = services.filter(service => service.id !== id);
}

function addService(serviceOBJ) {
    const { services } = appointment;
    //Con esta línea cogemos el array de 'services' y le añadimos al final el serviceOBJ (es parecido al array.push)
    appointment.services = [...services, serviceOBJ];
}
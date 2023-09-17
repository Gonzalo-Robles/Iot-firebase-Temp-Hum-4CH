// Configuración de Firebase
var firebaseConfig = {
    apiKey: "completa tus datos",
    authDomain: "completa tus datos",
    databaseURL: "completa tus datos.firebaseio.com",
    projectId: "completa tus datos",
    storageBucket: "completa tus datos",
    messagingSenderId: "completa tus datos",
    appId: "completa tus datos",
  };

// Inicializar la app de Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

setInterval(releTimer, 1000);
setInterval(releTermostato, 1000);

let termostatoActive;
let timerInterval; // Variable para almacenar el intervalo del temporizador
let termostatoInterval; // Variable para almacenar el intervalo del temporizador
  
function toggleDarkMode() {
    const body = document.querySelector('body');
    body.classList.toggle('dark-mode');
  }



let relayState;


  
////////////////////////////////////////////////////////////////////////////
////                                                                    ////
////  Escuchar cambios en los relés y actualizar el estado en la página ////
////                                                                    ////
////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////
////                      CALEFACCION                                   ////
////////////////////////////////////////////////////////////////////////////
firebase.database().ref("calefaccion").on("value", function(snapshot) {
  var relayState = snapshot.val();
  document.getElementById("led1").innerText = relayState === 1 ? "ON" : "OFF";
  var button = document.querySelectorAll('button.toggle-button')[0];
  button.innerText = relayState === 1 ? "ON" : "OFF";
  button.className = "toggle-button " + (relayState === 1 ? "on" : "off");

});
////////////////////////////////////////////////////////////////////////////
////                           RIEGO                                    ////
////////////////////////////////////////////////////////////////////////////
  firebase.database().ref("riego").on("value", function(snapshot) {
    var relayState = snapshot.val();
    document.getElementById("led2").innerText = relayState === 1 ? "ON" : "OFF";
    var button = document.querySelectorAll('button.toggle-button')[1];
    button.innerText = relayState === 1 ? "ON" : "OFF";
    button.className = "toggle-button " + (relayState === 1 ? "on" : "off");
  });

////////////////////////////////////////////////////////////////////////////
////                          VENTILACION                               ////
////////////////////////////////////////////////////////////////////////////
  firebase.database().ref("ventilacion").on("value", function(snapshot) {
    var relayState = snapshot.val();
    document.getElementById("led3").innerText = relayState === 1 ? "ON" : "OFF";
    var button = document.querySelectorAll('button.toggle-button')[2];
    button.innerText = relayState === 1 ? "ON" : "OFF";
    button.className = "toggle-button " + (relayState === 1 ? "on" : "off");
  });

////////////////////////////////////////////////////////////////////////////
////                           LUCES                                    ////
////////////////////////////////////////////////////////////////////////////
  firebase.database().ref("luces").on("value", function(snapshot) {
    var relayState = snapshot.val();
    document.getElementById("led4").innerText = relayState === 1 ? "ON" : "OFF";
    var button = document.querySelectorAll('button.toggle-button')[3];
    button.innerText = relayState === 1 ? "ON" : "OFF";
    button.className = "toggle-button " + (relayState === 1 ? "on" : "off");
  });



//////////////////////////////////////////////////////////////////////////////
////                                                                      ////
////                                                                      ////
////                               TIMER                                  ////
////                                                                      ////
//////////////////////////////////////////////////////////////////////////////
// Funcion para grabar los tiempos de activacion y desactivacion
function saveSchedule() {
    var timeOn = document.getElementById('timeOn').value; // Obtiene la hora y minutos de encendido
    var timeOff = document.getElementById('timeOff').value; // Obtiene la hora y minutos de apagado

    // Split de la cadena para obtener la hora y minutos por separado
    var hourOn = parseInt(timeOn.split(':')[0]);
    var minuteOn = parseInt(timeOn.split(':')[1]);
    var hourOff = parseInt(timeOff.split(':')[0]);
    var minuteOff = parseInt(timeOff.split(':')[1]);

    // Guardar la programación horaria en Firebase
    firebase.database().ref('schedule').set({
      hourOn: hourOn,
      minuteOn: minuteOn,
      hourOff: hourOff,
      minuteOff: minuteOff
    });
    document.getElementById("valorGuardado").textContent ="Tiempo guardado!";
  }

function releTimer() {
  firebase.database().ref('inputs/timerCheckbox').once('value').then(function(snapshot) {
    var timerCheckbox = snapshot.val();
    if (timerCheckbox) {
      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();

      // Leer la programación horaria desde Firebase
      firebase.database().ref('schedule').once('value').then(function(snapshot) {
        const schedule = snapshot.val();
        const hourOn = schedule.hourOn;
        const minuteOn = schedule.minuteOn;
        const hourOff = schedule.hourOff;
        const minuteOff = schedule.minuteOff;

        // Comprobar si es hora de encender o apagar las luces
        if (
          (currentHour > hourOn || (currentHour === hourOn && currentMinute >= minuteOn)) &&
          (currentHour < hourOff || (currentHour === hourOff && currentMinute < minuteOff))
        ) {
          firebase.database().ref('luces').set(1);
        } else {
          firebase.database().ref('luces').set(0);
        }
      });
    } else {
      // Si el temporizador está desactivado, detener el intervalo
      clearInterval(timerInterval);
    }
  });
}

// Iniciar el intervalo para releTimer
timerInterval = setInterval(releTimer, 1000); // Llamar a releTimer cada 60 segundos (ajusta según sea necesario)


// Cambio de estado para cargar en firebase
function cambiarEstadoRelay(path, state) {
  firebase.database().ref(path).set(state);
}

function toggleRelay(path) {
  firebase.database().ref('inputs/timerCheckbox').once("value").then(function(snapshot) {
    var timerActive = snapshot.val();

    // Verificar si es el dispositivo de las luces y si el temporizador está activo
    if (path === 'luces' && timerActive) {
       setInterval(releTimer, 1000);
    } else {
      // Si el temporizador no está 
      firebase.database().ref(path).once("value").then(function(snapshot) {
        var currentState = snapshot.val();
        var newState = currentState === 1 ? 0 : 1;
        cambiarEstadoRelay(path, newState);
      });
    }
  });
}
// Funcion para cambiar de estado si esta cliqueado
function toggleTimer(isChecked) {
  firebase.database().ref("inputs/timerCheckbox").set(isChecked);
  if (isChecked) {
    // Si se activa el temporizador, inicia el intervalo
    timerInterval = setInterval(releTimer, 1000);
  } else {
    // Si se desactiva el temporizador, detén el intervalo y apaga las luces
    clearInterval(timerInterval);
    firebase.database().ref('luces').set(0);
  }
}
// Función para obtener una cadena de dos dígitos con un cero a la izquierda si es necesario
function twoDigitString(num) {
  return num < 10 ? '0' + num : num.toString();
}
// Función para mostrar el tiempo de encendido y apagado actual en la interfaz
function displaySchedule() {
    firebase.database().ref('schedule').once('value').then(function (snapshot) {
        var schedule = snapshot.val();
        var timeOnDisplay = document.getElementById('timeOnDisplay');
        var timeOffDisplay = document.getElementById('timeOffDisplay');
        
        // Formatear la cadena con el tiempo de encendido y apagado actual
        var timeOnString = twoDigitString(schedule.hourOn) + ':' + twoDigitString(schedule.minuteOn);
        var timeOffString = twoDigitString(schedule.hourOff) + ':' + twoDigitString(schedule.minuteOff);
        
        timeOnDisplay.innerText = timeOnString;
        timeOffDisplay.innerText = timeOffString;
    });
}

//////////////////////////////////////////////////////////////////////////////
////                                                                      ////
////                                                                      ////
////                               TERMOSTATO                             ////
////                                                                      ////
//////////////////////////////////////////////////////////////////////////////
// Function para actualizar el valor máximo y mínimo de temperatura en Firebase
function setTemperatureRange(maxTemp, minTemp) {
  firebase.database().ref('Temperatura').set({
    maxTemp: maxTemp,
    minTemp: minTemp
  });
  }
  
  // Function para guardar el valor máximo y mínimo de temperatura ingresados por el usuario
  function saveTemperatureRange() {
      var maxTempInput = document.getElementById('maxTempInput');
      var minTempInput = document.getElementById('minTempInput');
      var maxTemp = parseInt(maxTempInput.value);
      var minTemp = parseInt(minTempInput.value);
  
      if (!isNaN(maxTemp) && !isNaN(minTemp) && maxTemp >= 2 && maxTemp <= 50 && minTemp >= 2 && minTemp <= 50) {
          // Guardo los valores de tempeatura en firebase
          setTemperatureRange(maxTemp, minTemp);
          maxTempInput.value = '';
          minTempInput.value = '';
          
          // muestro los valores guardados 
          document.getElementById('maxTempDisplay').innerText = maxTemp ;
          document.getElementById('minTempDisplay').innerText = minTemp ;
      } else {
          alert('Los valores de temperatura deben estar entre 2 y 50.');
      }
  }

  function releTermostato() {
    firebase.database().ref('inputs/termostatoCheckbox').once('value').then(function(snapshot) {
      var termostatoCheckbox = snapshot.val();
      if (termostatoCheckbox) {
        console.log("Estoy dentro del if");
        firebase.database().ref('Temperatura').once('value').then(function(snapshot) {
          var temperatureRange = snapshot.val();
          var currentTemp = document.getElementById('temperatura');
          var currentTemp = parseInt(currentTemp.innerText);
          console.log(currentTemp);
          console.log(temperatureRange.minTemp);
          console.log(temperatureRange.maxTemp);
          if (
            (currentTemp >= temperatureRange.minTemp) &&
            (currentTemp <= temperatureRange.maxTemp)
          ) {
            firebase.database().ref('calefaccion').set(1);
          } else {
            firebase.database().ref('calefaccion').set(0);
          }
        });
      } else {
        clearInterval(termostatoInterval);
      }
    });
  }
  
  


// Cambio de estado para cargar en firebase
function cambiarEstadoRelayTermostato(path, state) {
  firebase.database().ref(path).set(state);
}
 
function toggleRelayTermostato(path) {
  firebase.database().ref('inputs/termostatoCheckbox').once("value").then(function(snapshot) {
    var termostatoActive = snapshot.val();
    
    if (path === 'calefaccion' && termostatoActive) {
      setInterval(releTermostato,1000);
      }
    // Verificar si es el dispositivo de calefacción y si el termostato está desactivado
    else{
      firebase.database().ref(path).once("value").then(function(snapshot) {
        var currentState = snapshot.val();
        var newState = currentState === 1 ? 0 : 1;
        cambiarEstadoRelayTermostato(path, newState);
      });
    }
  });

  // Deshabilitar el botón de calefacción si el termostato está activo
  if (termostatoActive) {
    var calefaccionButton = document.getElementById("calefaccionButton");
    calefaccionButton.disabled = true;
  }
}


function toggleTermostato(isCheckedTermostato) {
  firebase.database().ref("inputs/termostatoCheckbox").set(isCheckedTermostato);

  // Activar el termostatoInterval si está marcado el termostatoCheckbox
  if (isCheckedTermostato) {
    console.log("esta cliqueado");
    termostatoInterval = setInterval(releTermostato, 1000);
  } else {
    clearInterval(termostatoInterval);
    firebase.database().ref('calefaccion').set(0); // Desactivar la calefacción
  }

  // Deshabilitar o habilitar el botón de calefacción según el estado del termostato
  var calefaccionButton = document.getElementById("calefaccionButton");
  calefaccionButton.disabled = isCheckedTermostato;
}

 


// Observar cambios en el tiempo de encendido y apagado y actualizar la interfaz
firebase.database().ref('schedule').on('value', function (snapshot) {
    displaySchedule();
});

// Llamamos a la función displaySchedule() al cargar la página para mostrar el tiempo de encendido y apagado actual
displaySchedule();

//// hasta aca todo lo que es timer




// Observar cambios en la humedad y temperatura
  firebase.database().ref('Sensores/Humedad').on('value', function(snapshot) {
    var humedad = snapshot.val();
    document.getElementById('humedad').innerText = humedad;
  });
  
firebase.database().ref('Sensores/Temperatura').on('value', function(snapshot) {
  var temperatura = snapshot.val();
  document.getElementById('temperatura').innerText = temperatura;
 });
  


  


// Escuchar cambios en los valores guardados en Firebase y actualizar el frontend
database.ref('Temperatura').on('value', (snapshot) => {
const data = snapshot.val();
  if (data) {
    document.getElementById("maxTempDisplay").textContent = data.maxTemp ;
    document.getElementById("minTempDisplay").textContent = data.minTemp ;
  }
});


  

// Agregar el evento de escucha a la casilla de verificación
   
    var termostatoCheckbox = document.getElementById("termostatoCheckbox");
    termostatoCheckbox.addEventListener("change", function () {
    var isCheckedTermostato = termostatoCheckbox.checked;
    toggleTermostato(isCheckedTermostato); // Llama a la función toggleTermostato() con el nuevo valor
    });
    var timerCheckbox = document.getElementById("timerCheckbox");
    timerCheckbox.addEventListener("change", function () {
    var isChecked = timerCheckbox.checked;
    toggleTimer(isChecked); // Llama a la función toggleTermostato() con el nuevo valor
    });
//==================funcion de lectura===================// 
  function readTermostatoCheckboxValue() {
    var termostatoCheckboxRef = database.ref("inputs/termostatoCheckbox");
    termostatoCheckboxRef.on("value", function(snapshot) {
      var isCheckedTermostato = snapshot.val();
      var termostatoCheckbox = document.getElementById("termostatoCheckbox");
      termostatoCheckbox.checked = isCheckedTermostato;
    });
    
  }
  function readTimerCheckboxValue() {
    var timerCheckboxRef = database.ref("inputs/timerCheckbox");
    timerCheckboxRef.on("value", function(snapshot) {
      var isChecked = snapshot.val();
      var timerCheckbox = document.getElementById("timerCheckbox");
      timerCheckbox.checked = isChecked;
    });
    
  }

  
  // Call the function to read the initial value
  readTermostatoCheckboxValue();
  readTimerCheckboxValue();


////////////////----- input check temporizador y termostato--------////////////////////
// Función para activar el temporizador
function setTimer() {
    const activationHour = parseInt(document.getElementById("activationHourInput").value);
    const activationMinute = parseInt(document.getElementById("activationMinuteInput").value);
    const deactivationHour = parseInt(document.getElementById("deactivationHourInput").value);
    const deactivationMinute = parseInt(document.getElementById("deactivationMinuteInput").value);

    // Aquí puedes validar que los valores de hora y minuto sean válidos (entre 0 y 23 para la hora, y 0 y 59 para el minuto).

    // Guarda el temporizador en Firebase
    database.ref('temporizador').set({
        activacion: {
            hora: activationHour,
            minuto: activationMinute
        },
        desactivacion: {
            hora: deactivationHour,
            minuto: deactivationMinute
        },
        activo: true
    });
}
// Función para desactivar el temporizador
function disableTimer() {
    // Desactiva el temporizador en Firebase
    database.ref('temporizador').update({
        activo: false
    });
}
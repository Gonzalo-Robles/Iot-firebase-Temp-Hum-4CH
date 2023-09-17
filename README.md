# Iot-firebase-Temp-Hum-4CH
Control de temperatura, humedad, ventilacion, luces y riego. Mediante un ESP8266 usando como servidor Firebase.
**Descripción del Proyecto**

El código es una implementación de JavaScript que utiliza Firebase para controlar dispositivos y sensores, como calefacción, luces, termostato, riego y ventilación, basándose en datos de sensores de humedad y temperatura. Además, incluye funcionalidad de temporizador para activar y desactivar dispositivos en horarios específicos. Este código se utiliza para crear un sistema de automatización del hogar que controla dispositivos y ajusta el entorno en función de la temperatura y la programación horaria. Los datos se almacenan y se recuperan de Firebase para mantener la persistencia de la configuración y el estado de los dispositivos.

**Funcionalidades Principales**

- **Configuración de Firebase**: Se inicializa la aplicación de Firebase utilizando una configuración predefinida que incluye claves de API y URL de la base de datos.

- **Escucha de cambios en los relés**: El código escucha cambios en los estados de diferentes dispositivos (calefacción, luces, riego, ventilación) en la base de datos de Firebase y actualiza la interfaz de usuario en consecuencia.

- **Control de dispositivos mediante botones**: Permite controlar los dispositivos directamente desde la interfaz de usuario utilizando botones que cambian el estado en Firebase.

- **Temporizador**: El código implementa un temporizador que activa y desactiva las luces en función de un horario predefinido. Los horarios se almacenan en Firebase y se actualizan según sea necesario.

- **Termostato**: Implementa un termostato que controla la calefacción en función de un rango de temperatura predefinido. Cuando la temperatura cae fuera de ese rango, la calefacción se enciende o apaga.

- **Sensores de Humedad y Temperatura**: El código muestra en tiempo real los valores de humedad y temperatura obtenidos de sensores y los actualiza en la interfaz de usuario.

- **Interfaz de usuario y Eventos de Cambio**: El código incluye elementos de la interfaz de usuario, como casillas de verificación para activar y desactivar el temporizador y el termostato, así como campos para configurar valores de temperatura.

- **Persistencia de Configuración**: La configuración, como los valores de temperatura y los horarios del temporizador, se almacena en Firebase para su persistencia.

- **Funciones de Control**: Varias funciones permiten cambiar el estado de los dispositivos y guardar configuraciones en Firebase.

- **Manejo de Eventos**: El código maneja eventos de cambio en las casillas de verificación para activar y desactivar el temporizador y el termostato.

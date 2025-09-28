[readme.txt](https://github.com/user-attachments/files/22585933/readme.txt)
# Hecho por:
- Claudio Troncoso
- Sebastián Espinoza
# Asistente virtual de sito gamer

##  Índice
1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Requerimientos](#requerimientos)
3. [Arquitectura de la Información](#arquitectura-de-la-información)
3. [Diseño de prototipos](#prototipo-de-diseño)
4. [Librerías usadas con Angular](#Librerías-usadas-con-Angular)
5. [Consideraciones](#Consideraciones)

## Resumen del Proyecto

- - -

### Problemática ficticia 
- Una empresa gamer ficticia, posee una gran cantidad de consultas repetitivas sobre compatibilidad de componentes y recomendaciones sobre productos, lo que produce que todo el tiempo del personal de ventas y soporte técnico tenga que responder sobre estos temas a sus usuarios.
### Solución propuesta
- Como estudiantes de la Pontificia Universidad Católica de Valparaíso proponemos un asistente virtual que descongestione la cantidad de consultas que recibe la empresa. 
- Para ello, el asistente virtual debe ser capaz de responder preguntas como:
-  "¿Esta placa de video es compatible con mi motherboard?"
- "¿Qué fuente de poder necesito para esta RTX 4070?"
- "¿Cuál es la diferencia entre este monitor de 240Hz y el de 165Hz?"
- Entonces el **asistente virtual abarca 2 temáticas claves**, que son repetitivas en las consultas realizadas por los usuarios. La primera es la **compatibilidad entre componentes** y la segunda es la **comparación de componentes.**

- - -

## Requerimientos

## Roles del Sistema
- **Administrador**Control total sobre el sitio web
- **Usuario**Puede crear o iniciar sesión como usuario de la aplicación y realizar consultas al asistente virtual.

## Requerimientos Funcionales por Rol


### Rol-Administrador

- **RF-ADM-01**El administrador puede gestionar usuarios dentro de la base de datos del sitio web.
- **RF-ADM-02** El administrador puede visualizar las conversaciones entre el usuario y el asistente virtual.


### Rol-Usuario

- **RF-Usu-01** El usuario puede iniciar una conversación con el asistente virtual haciendo click en el apartado (Zero o ¡Empieza a preguntar ahora!) 
-**RF-Usu-02** El usuario puede abrir una barra lateral
-**RF-Usu-03** El usuario puede visualizar los chats en la barra lateral
- **RF-Usu-04** El usuario puede crear una nueva conversación con el asistente virtual (Botón Nuevo chat).
- **RF-Usu-05** El usuario puede consultar por la compatibilidad entre dos componentes con lenguaje natural.
- **RF-Usu-06** El usuario puede consultar por la diferencia entre dos componentes con lenguaje natural. 

- **RF-Usu-07** El usuario puede consultar información respecto a páginas en específico.
- **RF-Usu-08** El usuario puede solicitar el link de la página original del producto asociado.
- **RF-Usu-09** El usuario tendrá asociado a su cuenta su historial de chats con el asistente virtual.

- - -

## Requerimientos No Funcionales

### RNF-01: Tiempo de respuesta
- El sistema debe responder a solicitudes de registro, inicio de sesión o de preguntas en **2 segundos** en el 95% de los casos.

### RNF-02: Seguridad
- Solo usuarios autenticados pueden realizar preguntas al asistente virtual.
- Debe haber control de roles: administrador, y usuario.

### RNF-03: Usabilidad
- La interfaz debe ser intuitiva y fácil de usar.
- Debe seguir principios de diseño responsive para adaptarse a pantallas móviles y de escritorio.

### RNF-04: Portabilidad
- El sistema debe funcionar correctamente en dispositivos móviles tales como:
  - Android
  - IOS
y los siguientes navegadores:
  - Google Chrome (última versión)
  - Mozilla Firefox
  - Microsoft Edge
  - OperaGX

### RNF-05: Escalabilidad
- El sistema debe poder manejar al menos **100 usuarios** sin disminución significativa del rendimiento.  

### RNF-06: Confiabilidad
El sistema debe ser capaz de recuperarse de una caída del servidor en un tiempo límite de 2 horas.

### RNF-07: Documentación
El sistema debe contar con una sección de preguntas frecuentes que responda a diferentes dudas comunes que pueden surgir entre los usuarios de la aplicación.

- - -

## Arquitectura de la Información
Estructura de navegación: https://whimsical.com/estructura-de-navegacion-4mE1oyVxWBfGvQMvbUdUVw

## Prototipo de diseño
[Figma Prototipo de asistente virtual]  (https://www.figma.com/design/XJJT5uAGzE6oJ6jOUZQO40/Proyecto_Asistente-Virtual_Web?node-id=1-3&p=f&t=P06YqS2Dab5TQuyH-0)

- - -

## Librerías usadas con Angular

Angular Core (v20.0.0): 
 - @angular/animations
 - @angular/common
 - @angular/compiler
 - @angular/core
 - @angular/forms
 - @angular/platform-browser
 - @angular/platform-browser-dynamic
 - @angular/router

Capacitor (Apps Nativas):
 - @capacitor/app (v7.1.0)
 - @capacitor/core (v7.4.3)
 - @capacitor/haptics (v7.0.2)
 - @capacitor/keyboard (v7.0.3)
 - @capacitor/status-bar (v7.0.3)

Ionic Framework::
 - @ionic/angular (v8.0.0)
 - ionicons (v7.0.0)

Otras Dependencias:
 - rxjs (v7.8.0)
 - tslib (v2.3.0)
 - zone.js (v0.15.0)

- - -

## Consideraciones 
- No se implementó el panel del administrador y el modelo de usuario de tipo administrador debido a la falta de conocimiento frente al manejo de roles y permisos mediante una base de datos.
- La mayoria de las funcionalidades son beta, por lo tanto, pueden ser propensas a errores y poco fidedignas al resultado final de la aplicacion web.

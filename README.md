Proyecto Aula — Sistema de Gastos Personales
Descripción
Aplicación de consola para gestionar ingresos y gastos mensuales por categorías, con persistencia en JSON y alertas al alcanzar umbrales de presupuesto del 80% y 90%. El objetivo del checkpoint 1 es demostrar dominio de estructuras de datos básicas, modularidad y pruebas unitarias con pytest.

Casos de uso — MVP

Crear usuario

Descripción: Registrar un nuevo usuario con nombre y ingreso mensual.
Criterios de aceptación: Se crea objeto Usuario con nombre e ingreso; aparece en la colección en memoria.

Asignar presupuesto por categoría

Descripción: Definir o actualizar el presupuesto mensual para una categoría (Alimentación, Transporte, Hogar, Otros).
Criterios de aceptación: El presupuesto se guarda y afecta el cálculo de saldo restante.

Registrar gasto

Descripción: Añadir un gasto a una categoría con monto y descripción.
Criterios de aceptación: El gasto se incluye en la lista de movimientos de la categoría; totales y saldo se actualizan.

Ver resumen de usuario

Descripción: Mostrar resumen con ingreso, presupuestos por categoría, gastos acumulados y saldos.
Criterios de aceptación: Resumen devuelve datos coherentes por categoría y totales.

Alertas por umbral de gasto

Descripción: Emitir señal/indicador cuando gasto en una categoría alcanza 80% y 90% del presupuesto.
Criterios de aceptación: Se detecta y reporta (ej. flag o mensaje) al alcanzar cada umbral.

Guardar usuarios

Descripción: Serializar usuarios y sus movimientos a JSON.
Criterios de aceptación: Archivo JSON creado/actualizado con la información esperada.

Cargar usuarios 

Descripción: Reconstruir usuarios desde archivo JSON al iniciar la aplicación.
Criterios de aceptación: Usuarios, presupuestos y movimientos se restauran correctamente; archivo inexistente → lista vacía.


Deshacer último gasto

Descripción: Eliminar o revertir el gasto más reciente en una categoría.
Criterios de aceptación: Último movimiento removido y totales actualizados.

Listar usuarios

Descripción: Mostrar la lista de usuarios registrados.
Criterios de aceptación: Devuelve nombres/identificadores de usuarios disponibles.

Eliminar usuario 

Descripción: Eliminar usuario de la colección.
Criterios de aceptación: Usuario deja de aparecer en listados y JSON actualizado.


Autenticación básica

Descripción: Mecanismo sencillo para identificar y autorizar usuarios que usan la aplicación. Soporta registro de credenciales (usuario/contraseña) y login. Las contraseñas se almacenan de forma segura (hash) y las operaciones que modifican datos sensibles requieren haber iniciado sesión.

Criterios de aceptación:

Registro: se puede crear un usuario con email único y contraseña. La función retorna éxito y el usuario queda persistido.

Almacenamiento seguro: la contraseña nunca se guarda en texto plano, se usa hashing.

Login: se puede iniciar sesión con email y contraseña; credenciales válidas retornan un token de sesión simple o un indicador de sesión activa.

Autorización: operaciones protegidas (p. ej. registrar gasto, cambiar presupuesto, eliminar usuario) son rechazadas si no hay sesión válida; retornan error/estado 401/403 en la API o mensaje en CLI.

Manejo de errores: login con credenciales incorrectas responde mensaje claro sin revelar si el usuario existe; intentos repetidos pueden limitarse.

Persistencia e invalidación: tokens de sesión se invalidan al cerrar sesión; al reiniciar la aplicación la sesión no se restaura automáticamente sin re-login.


Interfaz gráfica + API REST

Descripcion: Añadir una API REST que exponga las operaciones principales (crear/listar usuarios, asignar presupuesto, registrar gasto, ver resumen, persistencia) y una interfaz gráfica que consuma dicha API para interacción amigable.

Criterios de aceptación: 
Endpoint mínimos y comportamientos.

Seguridad: 
Validacion de entrada.
No exponer contraseñas.

Interfaz gráfica:
Formulario para asignar presupuesto.
Interfaz consume la API y muestra mensajes de error/éxito según respuestas.
Alertas visibles cuando una categoría supera el umbral de gasto.

Objetivos
Registrar, consultar y acumular gastos por categoría.

Asignar y actualizar presupuestos por categoría con cálculo de saldo restante.

Guardar y cargar usuarios y sus movimientos en un archivo JSON legible.

Emitir alertas cuando el gasto alcanza el 80% o el 90% del presupuesto mensual.

Estructura
backend/

categorias.py: clases de dominio para categorías (Alimentacion, Transporte, Hogar, Otros) y atributos de presupuesto, saldo, gastos y movimientos.

usuario/: modelo de Usuario y operaciones de negocio (asignar presupuesto, registrar gasto, obtener resumen).

storage.py: utilidades de persistencia para guardar_usuarios y cargar_usuarios con JSON.

menu.py y main.py: flujo interactivo por consola.

tests/

conftest.py: fixtures y configuración de ruta del proyecto para pytest.

test_smoke.py: verificación básica del entorno de pruebas.

test_categorias.py: acumulados y alertas por umbrales.

test_storage.py: round‑trip de guardado/carga con JSON.

test_usuario_crud.py: lectura de resumen, actualización de presupuesto por categoría y eliminación en una colección simulada.

Requisitos
Python 3.10 o superior.

Entorno virtual recomendado (venv).

pytest para ejecutar pruebas.

Instalación
Crear y activar entorno virtual en la raíz del repo:

<img width="742" height="89" alt="image" src="https://github.com/user-attachments/assets/91b7ecb3-c38f-4b17-838e-001bdb7a62c1" />



<img width="751" height="100" alt="image" src="https://github.com/user-attachments/assets/edffd945-efc1-4d50-ab59-450a595e7412" />

Ejecución
Iniciar la aplicación por consola:

<img width="740" height="70" alt="image" src="https://github.com/user-attachments/assets/062003a1-9fa1-433b-9c18-5a89bbb505b6" />

Seguir el menú para:

Crear usuario y definir ingreso mensual.

Asignar presupuestos por categoría.

Registrar gastos con descripción.

Ver resumen y saldo restante.

Deshacer último gasto (si se usa esa opción del menú).

Datos y persistencia
Archivo por defecto: usuarios.json en la raíz del proyecto.

guardar_usuarios: serializa la información clave del Usuario (ingreso, categorías, presupuestos y movimientos).

cargar_usuarios: reconstruye usuarios y sus categorías y vuelve a aplicar los movimientos.

Pruebas unitarias (pytest)
Ejecutar toda la suite:


<img width="751" height="71" alt="image" src="https://github.com/user-attachments/assets/f6debf4d-5f85-41b9-8178-89ad1040c3e0" />

Ejecutar por archivo o patrón:


<img width="750" height="96" alt="image" src="https://github.com/user-attachments/assets/a3a34f41-4451-47de-9ec5-2d662aaefb8c" />

Qué valida la suite:

test_smoke.py: entorno de pruebas operativo.

test_categorias.py:

Asignar presupuesto y registrar gastos acumulando totales.

Alertas al 80% y 90% del presupuesto por categoría.

test_storage.py:

Crear Usuario real, asignar presupuestos, registrar gasto, guardar a JSON y recargar; comprobar que nombre, ingreso y métricas de categoría persisten coherentemente.

Cargar archivo inexistente retorna lista vacía.

test_usuario_crud.py:

Lectura de resumen para un Usuario inicial.

Actualización de presupuesto de una categoría y verificación en el resumen.

Eliminación lógica del usuario en una colección en memoria.

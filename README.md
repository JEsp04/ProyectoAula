Proyecto Aula — Sistema de Gastos Personales
Descripción
Aplicación de consola para gestionar ingresos y gastos mensuales por categorías, con persistencia en JSON y alertas al alcanzar umbrales de presupuesto del 80% y 90%. El objetivo del checkpoint 1 es demostrar dominio de estructuras de datos básicas, modularidad y pruebas unitarias con pytest.

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

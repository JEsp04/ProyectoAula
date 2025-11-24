# SmartBudget — Proyecto Aula

## Resumen corto

SmartBudget es una aplicación educativa de gestión de presupuesto personal. Incluye un backend en Python (FastAPI) que persiste usuarios en `usuarios.json` y un frontend en React (Vite) que consume la API. El sistema usa estructuras de datos como árboles de categorías, diccionarios y listas, y aplica recursión para construir/recorrer el árbol de categorías.

Contenido de este README

- Descripción y objetivo
- Cómo ejecutar el proyecto (backend y frontend)
- Estructura del repositorio
- Estructuras de datos y algoritmos (árboles, recursión, diccionarios)
- Endpoints principales de la API
- Notas de seguridad y recomendaciones
- Comandos útiles y tests

## Descripción y objetivo

El objetivo del proyecto es proporcionar una aplicación ligera para organizar ingresos, asignar presupuestos por categoría y registrar gastos. La app mantiene un histórico de movimientos y calcula alertas cuando se supera cierto umbral.

## Ejecución (desarrollo)

Requisitos previos

- Python 3.10+ (se probó con Python 3.11+)
- Node.js + npm (para el frontend)

Backend (Windows - PowerShell)

1. Abrir PowerShell en la carpeta del proyecto (donde está `backend/` y `usuarios.json`):

```powershell
cd "c:\Users\Valderrama\documents\SmartBuget\ProyectoAula"
# (opcional) crear y activar un venv
py -3 -m venv .venv
.venv\Scripts\Activate.ps1

# instalar dependencias mínimas
pip install fastapi uvicorn[standard] bcrypt PyJWT python-dotenv email-validator python-multipart httpx requests passlib[bcrypt] python-jose[cryptography]

# ejecutar el servidor
py -3 -m uvicorn backend.api:app --reload
```

Frontend (Windows)

```powershell
cd frontend
npm install
npm run dev
# abre http://localhost:5173 (o el puerto que indique Vite)
```

## Git Bash / Linux / macOS (equivalente)

```bash
# Ir a la raíz del proyecto
cd /c/Users/Valderrama/documents/SmartBuget/ProyectoAula
# crear y activar venv (en Git Bash sobre Windows puede ser necesario usar 'source')
py -3 -m venv .venv
source .venv/Scripts/activate   # en Linux/macOS usar: source .venv/bin/activate

# instalar dependencias (ejemplo en Git Bash o bash)
cd backend
pip install fastapi uvicorn[standard] bcrypt PyJWT python-dotenv email-validator python-multipart httpx requests passlib[bcrypt] python-jose[cryptography]

# ejecutar backend
cd .. (en la raiz , no en la carpeta backend)
uvicorn backend.api:app --reload

# Frontend (Git Bash)
cd frontend
npm install
npm run dev
```

## Estructura del repositorio

Raíz relevante:

El proyecto contiene backend, frontend y tests. A continuación se muestra la estructura de carpetas y archivos tal como está ahora en el repositorio:

```
README.md
usuarios.json
backend/
	__init__.py
	api.py
	controllers/
		__init__.py
		categoria_controller.py
		usuario_controller.py
	models/
		__init__.py
		categorias.py
		category_node.py
		usuario.py
	schemas/
		usuario_schema.py
	storage/
		storage.py
	__pycache__/

frontend/
	.gitignore
	eslint.config.js
	index.html
	package.json
	README.md
	vite.config.js
	src/
		App.css
		App.jsx
		index.css
		main.jsx
		components/
			CategoryTree.jsx
			Dashboard.jsx
			GastoForm.jsx
			LoginForm.jsx
			Navbar.jsx
			Notificacion.jsx
			PresupuestoForm.jsx
			RegisterForm.jsx
		pages/
			FinanzasPage.jsx
			HomePage.jsx
			LoginPage.jsx
			RegisterPage.jsx
		services/
			api.js
			authService.js
			categoriaService.js
			expenseService.js
			userService.js
		store/
			useAuthStore.js
			useExpenseStore.js
		utils/
			categorias.js

tests/
	conftest.py
	test_categorias.py
	test_smoke.py
	test_storage.py
	test_trees.py
	test_usuario_crud.py
	__pycache__/

```

## Uso de IA en el proyecto

Durante el desarrollo de este proyecto se usaron herramientas de asistencia por IA para acelerar tareas de diseño y generación de código . En particular, se empleó IA para ayudar a crear y estructurar archivos bajo `backend/schemas/` (por ejemplo `usuario_schema.py`) y para reforzar partes de la lógica de LAS Pruebas Unitarias, tambien se implemento la IA Para ayudas en el services, como `userService.js`.

## Estructuras de datos y algoritmos

1. Usuario (clase)

- Representa al usuario y contiene atributos numéricos (ingreso_mensual, saldoRestante, gastosMensuales), objetos de categoría y un `historial` (lista de movimientos).

2. Categorías (objetos planos)

- Cada categoría (Alimentación, Transporte, Hogar, Otros) se modela como objeto con propiedades como `presupuestoInicial`, `gastos`, `saldoRestante` y `movimientos` (lista).

3. Árbol de categorías (CategoryNode)

- Para mostrar una representación jerárquica, se construye un árbol con `CategoryNode`.
- Implementación: la clase `Usuario.build_category_tree()` crea un nodo raíz y añade los nodos hijos para cada categoría.
- Uso de recursión: el método `to_dict()` de `CategoryNode` (y cualquier recorrido del árbol) puede implementar recursión para serializar hijos anidados.

Ejemplo (simplificado) de árbol en JSON:

```json
{
  "name": "Categorias",
  "children": [
    {
      "name": "Alimentacion",
      "presupuesto": 1000,
      "gastos": 200,
      "children": []
    },
    { "name": "Transporte", "presupuesto": 0, "gastos": 0, "children": [] }
  ]
}
```

4. Diccionarios y listas

- Internamente se usan `dict` para mapear atributos de usuarios/categorías y `list` para movimientos. Al guardar en `usuarios.json`, se serializa una lista de usuarios (cada usuario es un diccionario).

Algoritmos clave

- Registro de gasto (`Usuario.registrar_gasto`): valida el monto frente al `saldoRestante` de la categoría, ajusta totales y añade un movimiento a la lista `historial` y a `categoria.movimientos`.
- Eliminación de gasto con restauración de totales (`eliminar_gasto_por_id`): busca el movimiento por `id`, revierte los contadores y elimina la entrada.
- Construcción del árbol (`build_category_tree`): crea nodos y devuelve una estructura recursiva. Esto facilita mostrar la jerarquía en el frontend.

- Listas (`list` en Python) para `historial` y `movimientos` — estas listas pueden comportarse como pilas si se usan `append()`/`pop()`.
- Arrays/listas en el frontend (JS) que usan `push()`/`pop()` para manipular movimientos.
- Diccionarios (`dict`) para mapear categorías y atributos.

API (endpoints principales)
Nota: la API expone rutas bajo `/api` según `backend/api.py`.

- GET `/api` — health check
- GET `/api/usuarios/ObtenerTodos` — devuelve resumen de todos los usuarios
- GET `/api/usuarios/ObtenerPor/{email}` — devuelve resumen de usuario por email
- POST `/api/usuarios/register` — registro (devuelve token JWT y usuario)
- POST `/api/usuarios/login` — login (devuelve token JWT y usuario)
- POST `/api/usuarios/{email}/presupuesto` — asignar presupuesto a categoría
- POST `/api/usuarios/{email}/gasto` — registrar gasto en categoría
- DELETE `/api/usuarios/{email}/gasto/{id}` — eliminar gasto por id
- POST `/api/usuarios/{email}/reset` — endpoint agregado: resetea presupuestos/gastos/historial para el usuario (preserva `ingreso_mensual`)

Ejemplo de llamada (curl / PowerShell):

```powershell
# Login
curl -X POST "http://127.0.0.1:8000/api/usuarios/login" -H "Content-Type: application/json" -d '{"email":"tu@mail.com","password":"tuPass"}'

# Reset usuario (reemplaza email)
curl -X POST "http://127.0.0.1:8000/api/usuarios/tu_email%40dominio.com/reset"
```

Frontend

- `frontend` usa React + Vite. La comunicación con la API se realiza con Axios en `src/services/api.js` (baseURL: `http://localhost:8000/api`).
- El componente `Dashboard.jsx` incluye un botón para resetear asignaciones/gastos que llama al endpoint `/reset` y actualiza el store (`useAuthStore`) para sincronizar `localStorage`.

Testing

- Hay una carpeta `tests/` con pruebas pytest. Para ejecutar tests (si tienes pytest instalado):

```powershell
py -3 -m pytest -q
```

Diagrama de clases (resumen textual)

```text
Usuario
	- nombre: str
	- email: str
	- ingreso_mensual: float
	- saldoRestante: float
	- gastosMensuales: float
	- password_hash: str
	- alimentacion, transporte, hogar, otros: Categoria
	- historial: list[Movimiento]

Categoria
	- nombre: str
	- presupuestoInicial: float
	- gastos: float
	- saldoRestante: float
	- movimientos: list[Movimiento]

CategoryNode
	- name
	- presupuesto
	- gastos
	- children: list[CategoryNode]
```

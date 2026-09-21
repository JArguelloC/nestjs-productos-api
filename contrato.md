# Contrato CRUD de Productos

Este documento define el contrato de interfaz (API-First) para el recurso `/productos` en la API REST de integración de sistemas.

---

## Tabla Resumen del Contrato

| Operación | Verbo HTTP | URI | Códigos de Éxito / Respuesta |
| :--- | :--- | :--- | :--- |
| **Listar** | `GET` | `/api/v1/productos` | `200 OK` |
| **Obtener uno** | `GET` | `/api/v1/productos/{id}` | `200 OK` / `404 Not Found` |
| **Crear** | `POST` | `/api/v1/productos` | `201 Created` + Cabecera `Location` |
| **Reemplazar** | `PUT` | `/api/v1/productos/{id}` | `204 No Content` |
| **Actualizar parcial** | `PATCH` | `/api/v1/productos/{id}` | `200 OK` |
| **Eliminar** | `DELETE` | `/api/v1/productos/{id}` | `204 No Content` / `404 Not Found` |

---

## Modelo de Datos (`Producto`)

```typescript
{
  id: number;        // Identificador único (autogenerado/incremental)
  nombre: string;    // Nombre del producto
  precio: number;    // Precio unitario del producto (positivo)
}
```

---

## Detalle de Endpoints

### 1. Listar Productos
- **Método / URI**: `GET /api/v1/productos`
- **Descripción**: Recupera el listado completo de productos registrados.
- **Códigos de Respuesta**:
  - `200 OK`: Devuelve un arreglo con los productos existentes (`Producto[]`).

### 2. Obtener un Producto
- **Método / URI**: `GET /api/v1/productos/{id}`
- **Parámetros**:
  - `id` (path, obligatorio): Identificador numérico entero (`number`).
- **Códigos de Respuesta**:
  - `200 OK`: Retorna el objeto `Producto` encontrado.
  - `400 Bad Request`: Si `id` no es un entero válido.
  - `404 Not Found`: Si no existe un producto con dicho `id`.

### 3. Crear Producto
- **Método / URI**: `POST /api/v1/productos`
- **Cuerpo de la Petición (`CreateProductoDto`)**:
  ```json
  {
    "nombre": "string",
    "precio": 0.0
  }
  ```
- **Cabeceras de Respuesta**:
  - `Location`: `/api/v1/productos/{id}` (URI hacia el nuevo recurso creado).
- **Códigos de Respuesta**:
  - `201 Created`: Producto creado exitosamente. Retorna el recurso creado o vacío según implementación, con la cabecera `Location`.
  - `400 Bad Request`: Datos de entrada inválidos (ej. falta `nombre`, precio no numérico o negativo).

### 4. Reemplazar Producto (Actualización Total)
- **Método / URI**: `PUT /api/v1/productos/{id}`
- **Parámetros**:
  - `id` (path, obligatorio): Identificador del producto a sustituir.
- **Cuerpo de la Petición (`ReplaceProductoDto`)**:
  ```json
  {
    "nombre": "string",
    "precio": 0.0
  }
  ```
  *(Requiere el reemplazo de todos los campos obligatorios del recurso)*.
- **Códigos de Respuesta**:
  - `204 No Content`: El recurso fue reemplazado exitosamente (sin cuerpo en la respuesta).
  - `400 Bad Request`: Payload incompleto o tipos de datos inválidos.
  - `404 Not Found`: Si el producto con `id` no existe.

### 5. Actualizar Parcialmente un Producto
- **Método / URI**: `PATCH /api/v1/productos/{id}`
- **Parámetros**:
  - `id` (path, obligatorio): Identificador del producto a modificar.
- **Cuerpo de la Petición (`UpdateProductoDto`)**:
  ```json
  {
    "nombre"?: "string",
    "precio"?: 0.0
  }
  ```
  *(Permite enviar uno o más campos opcionales para actualizar)*.
- **Códigos de Respuesta**:
  - `200 OK`: Retorna el producto con sus campos actualizados.
  - `400 Bad Request`: Datos inválidos.
  - `404 Not Found`: Si el producto con `id` no existe.

### 6. Eliminar Producto
- **Método / URI**: `DELETE /api/v1/productos/{id}`
- **Parámetros**:
  - `id` (path, obligatorio): Identificador del producto a remover.
- **Códigos de Respuesta**:
  - `204 No Content`: Producto eliminado satisfactoriamente (sin contenido).
  - `400 Bad Request`: Parámetro `id` inválido.
  - `404 Not Found`: Si el producto a eliminar no existe.


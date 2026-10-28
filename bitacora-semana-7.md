# Bitácora de Aprendizaje - Semana 7
## Contratos y Validación con JSON Schema

---

### 1. ¿Cuál de los tres (JSON Schema con `ajv`, DTOs con `class-validator` de la Semana 2, contrato `.proto` de la Semana 3) se sintió más "contrato explícito", y por qué?

El contrato **`.proto` (Protocol Buffers / gRPC de la Semana 3)** es el que se siente más estrictamente como un "contrato explícito", seguido muy de cerca por **JSON Schema**.

* **Por qué `.proto`:** Es una especificación formal, binaria y agnóstica al lenguaje de programación donde no existe ambigüedad: define tipos estáticos obligatorios, números de campo inmutables para serialización y firmas exactas de servicios (RPC). Además, genera el código y los stubs en cliente y servidor a partir del mismo archivo, imposibilitando discrepancias entre ambas partes.
* **JSON Schema con `ajv`:** También es un contrato explícito de primer nivel (*schema-first*), ya que vive en un archivo estandarizado (`.json`) independiente del backend y permite validar payloads en cualquier plataforma o lenguaje.
* **En contraste con `class-validator`:** Este último es un enfoque *code-first* acoplado al framework (NestJS/TypeScript). El contrato no existe de forma autónoma, sino que surge de clases y decoradores de ejecución en Node.js, lo cual lo hace más débil como contrato externo entre equipos o sistemas heterogéneos.

---

### 2. ¿En qué escenario preferirías `class-validator` sobre JSON Schema, y viceversa?

#### Preferiría `class-validator` cuando:
1. **El desarrollo es interno o monorepo TypeScript/NestJS:** Cuando tanto el frontend como el backend comparten tipado o están construidos en el mismo stack.
2. **Transformación e hidratación de objetos:** `class-transformer` junto a `class-validator` permite instanciar directamente clases con métodos de dominio, casting de tipos primitivos complejos y sanitización fluida.
3. **Desarrollo ágil interno:** Es más rápido de escribir y mantener decoradores directos sobre propiedades de clase sin necesidad de gestionar archivos JSON externos ni esquemas independientes de metamodelo.

#### Preferiría `JSON Schema` cuando:
1. **Integración con clientes y terceros heterogéneos:** Cuando la API es consumida por múltiples lenguajes (Java, Python, Go, C#) que necesitan validar cargas localmente usando un estándar neutral IETF.
2. **Validaciones estructurales complejas y declarativas:** Reglas como `additionalProperties: false`, discriminadores de polimorfismo, `anyOf`/`oneOf`, y rangos numéricos avanzados que son más naturales y potentes en JSON Schema.
3. **Gobierno y auditoría de contratos:** Cuando se versionan esquemas en catálogos o registros centralizados (Schema Registry / API Gateways) y se requiere verificar retrocompatibilidad de forma automatizada mediante scripts antes de desplegar.

---

### 3. Si tu equipo tuviera 5 consumidores externos de esta API, ¿usarías la política BACKWARD o FULL para versionar este esquema? Justifica.

Usaría la política **FULL (Compatibilidad Total: Backward + Forward)**, o al menos **BACKWARD estricta** si la arquitectura lo exige, siendo **FULL** la opción ideal para consumidores externos:

* **Justificación de la política FULL:**
  * Al tener **5 consumidores externos**, tú como proveedor del API **no controlas el ciclo de despliegue ni la velocidad de actualización de esos clientes**.
  * **Backward compatibility** garantiza que cuando el servidor se actualice a la versión nueva (ej. `v2`), los clientes antiguos que sigan enviando peticiones en formato anterior (`v1`) sigan funcionando sin interrupciones.
  * **Forward compatibility** garantiza que si un cliente se adelanta o se implementa un cambio progresivo, los sistemas con esquemas previos puedan procesar o tolerar los datos del nuevo sin romperse inesperadamente.
* **Por qué no permitir cambios incompatibles (Breaking Changes):**
  * Un cambio que rompa el contrato (como volver obligatorio un campo nuevo como `categoria` sin valor por defecto) detendría de golpe las integraciones de los 5 clientes externos, provocando incidentes en producción.
  * Por tanto, la regla de oro con consumidores externos es: **campos nuevos siempre opcionales**, **no eliminar campos existentes** y **no cambiar tipos de datos**, garantizando una transición suave.


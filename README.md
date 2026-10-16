# Panel de vida de Mario

Aplicación personal con Next.js, TypeScript y React. Interfaz adaptable al móvil, navegación, autenticación y tareas privadas con Supabase.

## Estado real

El acceso usa Supabase Auth con correo y contraseña. Todavía no hay lectura de correo, análisis de contratos ni envío de avisos. Las tareas persisten tras ejecutar la migración descrita abajo. El almacenamiento de contratos aún no está disponible.

## Desarrollo

Requiere Node.js 24 LTS y npm.

```sh
npm ci
npm run dev
```

Validación de producción: `npm run build`.

## Despliegue en Vercel

Importar este repositorio y usar la configuración detectada de Next.js. Seleccionar Node.js 24.x. Configurar las dos variables públicas de Supabase descritas más abajo.

## Próximas etapas

1. Activar la tabla de tareas con la migración incluida.
2. Contratos: almacenamiento privado, extracción y confirmación de fechas.
3. Calendario, avisos y registro de envíos.
4. Integraciones del Panel de vida.
5. Android con Capacitor y notificaciones.

Nunca guardar documentos personales ni claves privadas en el repositorio.

## Autenticación (etapa 2)

Configurar en Vercel como Config, para Production y Preview:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

No usar service_role ni Secret keys. Volver a desplegar tras cambiar variables.

Crear el primer usuario en Supabase > Authentication > Users > Add user > Create new user. Usar correo propio y una contraseña exclusiva, y marcar la confirmación automática del correo si está disponible. No hay registro público desde la interfaz. El proveedor Email debe estar habilitado. El servicio de Supabase puede permitir altas por API según su configuración; cada futura tabla y archivo debe protegerse con RLS por usuario. No confiar en la ausencia de un botón de registro como control de acceso a datos.

El panel se verifica en el servidor con getUser, usa cookies y renueva la sesión en Proxy. Sin variables o sin usuario válido, la ruta principal redirige a /login. Cerrar sesión elimina la sesión de este navegador. Las tareas se guardan en la tabla tasks con permisos por usuario. No hay almacenamiento de contratos implementado todavía.

Verificación manual en producción: entrar, recargar, cerrar sesión y comprobar que volver a / exige identificarse; repetir en ventana privada. No se han enviado correos ni creado usuarios como parte del desarrollo.

## Tareas (etapa 3)

Ejecutar supabase/migrations/202610160001_tasks.sql en Supabase > SQL Editor. Crea la tabla, limita los permisos y aplica RLS para lectura, creación, actualización y borrado por propietario. No requiere nuevas claves ni variables de entorno. Mientras no se ejecute, el panel muestra un aviso y no permite añadir tareas; no simula que se hayan guardado.

Las tareas se cargan al entrar, recargar o pulsar Actualizar. Los cambios aparecen tras confirmación de Supabase; no hay sincronización en tiempo real. En móvil se usa la misma cuenta. Los otros módulos siguen pendientes de integración.

Prueba de aislamiento disponible en supabase/tests/tasks_rls.sql: usa dos usuarios temporales dentro de una transacción con rollback. Debe ejecutarse en Supabase después de la migración. No se ha ejecutado contra el proyecto remoto durante el desarrollo porque no hay acceso administrativo a su base de datos. La compilación y comprobación de tipos se validan localmente.

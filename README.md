# Panel de vida de Mario

Aplicación personal con Next.js, TypeScript y React. Primera etapa: interfaz adaptable al móvil, navegación y tareas temporales de demostración.

## Estado real

El acceso usa Supabase Auth con correo y contraseña. Todavía no hay lectura de correo, análisis de contratos ni envío de avisos. Las tareas de la demo se reinician al recargar. No subir datos personales hasta implementar autenticación y permisos.

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

1. Tablas privadas y permisos por usuario en Supabase.
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

El panel se verifica en el servidor con getUser, usa cookies y renueva la sesión en Proxy. Sin variables o sin usuario válido, la ruta principal redirige a /login. Cerrar sesión elimina la sesión de este navegador. Las tareas siguen siendo de demostración y no se guardan en Supabase. No hay tablas ni almacenamiento de contratos implementados todavía.

Verificación manual en producción: entrar, recargar, cerrar sesión y comprobar que volver a / exige identificarse; repetir en ventana privada. No se han enviado correos ni creado usuarios como parte del desarrollo.

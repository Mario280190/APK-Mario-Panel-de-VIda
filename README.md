# Panel de vida de Mario

Aplicación personal con Next.js, TypeScript y React. Primera etapa: interfaz adaptable al móvil, navegación y tareas temporales de demostración.

## Estado real

No hay autenticación, conexión con Supabase, lectura de correo, análisis de contratos ni envío de avisos todavía. Las tareas de la demo se reinician al recargar. No subir datos personales hasta implementar autenticación y permisos.

## Desarrollo

Requiere Node.js 24 LTS y npm.

```sh
npm ci
npm run dev
```

Validación de producción: `npm run build`.

## Despliegue en Vercel

Importar este repositorio y usar la configuración detectada de Next.js. Seleccionar Node.js 24.x. No se necesitan variables de entorno para esta primera etapa.

## Próximas etapas

1. Autenticación y datos privados con Supabase.
2. Contratos: almacenamiento privado, extracción y confirmación de fechas.
3. Calendario, avisos y registro de envíos.
4. Integraciones del Panel de vida.
5. Android con Capacitor y notificaciones.

Nunca guardar documentos personales ni claves privadas en el repositorio.

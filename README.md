# Backend Serverless Lambda

Proyecto de backend serverless utilizando Docker para ejecutar contenedores de manera eficiente y escalable. Este proyecto permite desplegar aplicaciones en contenedores Docker, gestionando su ciclo de vida y proporcionando una arquitectura flexible para el desarrollo de servicios backend.

## Arquitectura de solucion 👷

<img width="1632" height="727" alt="image" src="https://github.com/user-attachments/assets/4f24bae4-059e-433f-87a9-30d85286c013" />

## Preview 🚀

<img width="1470" height="653" alt="image" src="https://github.com/user-attachments/assets/9fb6f7ca-0512-4dbe-a3c3-da685febceb6" />

## Instalacion

```bash
pnpm install
```

```bash
pnpm run migrate
```

## Uso

```bash
pnpm run dev
```

```bash
pnpm run test
```

## Docker (Recomendado)

```bash
docker compose up -d
```

## Ejemplo de peticion

```bash
curl --request POST \
  --url http://127-0-0-1.sslip.io/api/deploy \
  --header 'Content-Type: application/json' \
  --data '{
 "from": "image",
 "name": "test-welcome",
 "port": 80,
 "image": "docker/welcome-to-docker:latest"
}'
```

**Resultado esperado:**

```json

 {
 "message": "Worker started successfully",
 "url": "http://test-welcome.127-0-0-1.sslip.io/"
}

```
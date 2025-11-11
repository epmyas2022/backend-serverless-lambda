//TODO: validar con zod
export const EnvironmentConfig = {
  DOCKER_HOST: process?.env?.["DOCKER_HOST"] || "0.0.0.0",
  DOCKER_PORT: process?.env?.["DOCKER_PORT"] || "2375",
  DOCKER_NETWORK: process?.env?.["DOCKER_NETWORK"] || "backend-serverless-lambda-network",
  REDIS_URL: process?.env?.["REDIS_URL"] || "redis://localhost:6379",
  DB_FILE_NAME: process?.env?.["DB_FILE_NAME"] || "file:database.db",
};

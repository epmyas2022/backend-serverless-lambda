//TODO: validar con joi
export const EnvironmentConfig = {
  DOCKER_HOST: process?.env?.["DOCKER_HOST"] || "0.0.0.0",
  DOCKER_PORT: process?.env?.["DOCKER_PORT"] || "2375",
  REDIS_URL: process?.env?.["REDIS_URL"] || "redis://localhost:6379",
};

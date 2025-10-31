//TODO: validar con joi
export const EnvironmentConfig = {
  DOCKER_HOST: process?.env?.["DOCKER_HOST"] || "0.0.0.0",
  DOCKER_PORT: process?.env?.["DOCKER_PORT"] || "2375",
};

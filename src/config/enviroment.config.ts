export function EnvironmentConfig() {
  return {
    DOCKER_HOST: process?.env?.["DOCKER_HOST"] || "tcp://0.0.0.0:2375",
  };
}

//SE ENCARGARA DE HACER LA CONSTRUCCION DEL PROYECTO CON DOCKER ASI COMO LEVANTAR Y DETENER EL SERVICIO
import { DockerClient } from "@docker/node-sdk";
import { catchError } from "../utils/helper.ts";

export class DeployWithDocker {
  protected dockerClient?: DockerClient;
  constructor() {
    this.init();
  }
  private async init() {
    const [error, client] = await catchError<DockerClient>(
      DockerClient.fromDockerConfig()
    );
    if (error)
      throw new Error(`🚨 Docker client not initialized: ${error.message}`);

    this.dockerClient = client;
    console.log("🐳 Docker client initialized");
  }

  async getDockerFile() {}
  async getEnvironment() {}

  async build() {}

  async status() {}

  async start() {}

  async stop() {}
}

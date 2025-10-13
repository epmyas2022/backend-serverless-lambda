//SE ENCARGARA DE HACER LA CONSTRUCCION DEL PROYECTO CON DOCKER ASI COMO LEVANTAR Y DETENER EL SERVICIO
import { DockerClient } from "@docker/node-sdk";

export class DeployWithDocker {
  protected dockerClient?: DockerClient;
  constructor() {
    this.init();
  }
  private async init() {
    this.dockerClient = await DockerClient.fromDockerConfig();
    if (!this.dockerClient) throw new Error("🚨 Docker client not initialized");
    console.log("🐳 Docker client initialized");

    console.log(await this.dockerClient.containerList());
  }

  async getDockerFile() {}
  async getEnvironment() {}

  async build() {}

  async status() {}

  async start() {}

  async stop() {}
}

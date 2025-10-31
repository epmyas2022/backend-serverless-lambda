//SE ENCARGARA DE HACER LA CONSTRUCCION DEL PROYECTO CON DOCKER ASI COMO LEVANTAR Y DETENER EL SERVICIO
import Docker from "dockerode";
import { join } from "node:path";
import { directoryStream } from "../utils/files.ts";
import { logger } from "../config/logger.ts";
import { EnvironmentConfig } from "../config/enviroment.config.ts";
import type { DeployRun, DeployBuild } from "../common/interfaces/deploy.interface.ts";
import { mapToExposedPorts, mapToPortBindings } from "../utils/mapper.ts";
import  { StatusContainer } from "../common/constants/deploy.const.ts";
import { catchError } from "../utils/helper.ts";

/*
 * Clase singleton para gestionar despliegues con Docker
 */
export class DeployWithDocker {
  private static _instance: DeployWithDocker;
  protected static docker: Docker | null = null;
  private constructor(docker: Docker) {
    DeployWithDocker.docker = docker;
  }
  static init() {
    if (DeployWithDocker._instance) return DeployWithDocker._instance;

    const docker = new Docker({
      protocol: "http",
      host: EnvironmentConfig.DOCKER_HOST,
      port: EnvironmentConfig.DOCKER_PORT,
    });

    docker.ping((err) => {
      if (err)
        return logger.error("Docker is not running or not accessible:", err);

      logger.info("Docker client initialized");
    });

    DeployWithDocker._instance = new DeployWithDocker(docker);

    return DeployWithDocker._instance;
  }

  async getEnvironment() {
    // Obtener información del entorno de Docker
  }

  async compose() {
    // Implementar funcionalidad de Docker Compose si es necesario
  }

  async build(args: DeployBuild) {
    const { path } = args;

    logger.info("Building Docker image from path: " + path);

    const { dockerfile = "Dockerfile", environments = {}, name } = args;

    const stream = await directoryStream(join(path));

    DeployWithDocker.docker?.buildImage(
      stream,
      {
        t: name,
        dockerfile: dockerfile,
        buildargs: environments,
      },
      function (err, response) {
        if (err) {
          return logger.error("Error building Docker image:", err);
        }
        response?.pipe(process.stdout, { end: true });
        response?.on("end", () => {
          logger.info("Docker image built successfully");
        });
      }
    );
  }
  async status(containerId: string) {
    const status = await DeployWithDocker.docker
      ?.getContainer(containerId)
      .inspect();
    return status?.State.Status;
  }

  async isRunning(containerId: string) {
    const [error, status] = await catchError(this.status(containerId));
    return !error && status === StatusContainer.RUNNING;
  }

  async isStopped(containerId: string) {
    const [error, status] = await catchError(this.status(containerId));
    return !error && (
      status === StatusContainer.EXITED || status === StatusContainer.CREATED
    );
  }

  async isPaused(containerId: string) {
    const status = await this.status(containerId);
    return status === StatusContainer.PAUSED;
  }

  async exists(containerId: string) {
    return DeployWithDocker.docker
      ?.getContainer(containerId)
      .inspect()
      .then(() => true)
      .catch(() => false);
  }

  async run(options: DeployRun) {
    const { image, name, ports } = options;
    const ExposedPorts = mapToExposedPorts(ports);
    const PortBindings = mapToPortBindings(ports);

    if (await this.exists(name)) {
      logger.info("Container already exists:" + name);
      return;
    }

    DeployWithDocker.docker?.createContainer(
      {
        name,
        ExposedPorts,
        Image: image,
        HostConfig: {
          PortBindings,
        },
      },
      (err, container) => {
        if (err) {
          return logger.error("Error creating Docker container:" + err);
        }

        container?.start((err) => {
          if (err) {
            return logger.error("Error starting Docker container:" + err);
          }
          logger.info(
            `Docker container started successfully with ID: ${container.id}`
          );
        });
      }
    );
  }

  async start(containerId: string) {
    const container = DeployWithDocker.docker?.getContainer(containerId);
    if (!container) {
      return logger.error("Container not found: " + containerId);
    }
    container.start((err) => {
      if (err) {
        return logger.error("Error starting Docker container:" + err);
      }
      logger.info(
        "Docker container started successfully with ID: " + container.id
      );
    });
  }

  stop(containerId: string) {
    const container = DeployWithDocker.docker?.getContainer(containerId);
    if (!container) {
      return logger.error("Container not found: " + containerId);
    }
    container.stop((err) => {
      if (err) {
        return logger.error("Error stopping Docker container:" + err);
      }
      logger.info(
        "Docker container stopped successfully with ID: " + container.id
      );
    });
  }
}

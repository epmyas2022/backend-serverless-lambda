//SE ENCARGARA DE HACER LA CONSTRUCCION DEL PROYECTO CON DOCKER ASI COMO LEVANTAR Y DETENER EL SERVICIO
import Docker from "dockerode";
import { join } from "node:path";
import { directoryStream } from "../utils/files.ts";
import { logger } from "../config/logger.ts";
import { EnvironmentConfig } from "../config/enviroment.config.ts";
import type {
  DeployRun,
  DeployBuild,
} from "../common/interfaces/deploy.interface.ts";
import { mapToEnv, mapToExposedPorts } from "../utils/mapper.ts";
import { StatusContainer } from "../common/constants/deploy.const.ts";
import { catchError } from "../utils/helper.ts";

/*
 * Clase singleton para gestionar despliegues con Docker
 */
export class DeployWithDocker {
  private static _instance: DeployWithDocker;
  protected static docker: Docker | null = null;
  protected timers: Map<string, NodeJS.Timeout> = new Map();
  protected  processUuid: string = crypto.randomUUID();
  private constructor(docker: Docker) {
    DeployWithDocker.docker = docker;
  }
  static init(processUuid: string = crypto.randomUUID()): DeployWithDocker {
    if (DeployWithDocker._instance) return DeployWithDocker._instance;

    const docker = new Docker({
      protocol: "http",
      host: EnvironmentConfig.DOCKER_HOST,
      port: EnvironmentConfig.DOCKER_PORT,
    });

    docker.ping((err) => {
      if (err)
        return logger.error(
          `[${processUuid}] Docker is not running or not accessible:`,
          err,
        );

      logger.info(`[${processUuid}] Docker client initialized`);
    });

    DeployWithDocker._instance = new DeployWithDocker(docker);
    DeployWithDocker._instance.processUuid = processUuid;

    return DeployWithDocker._instance;
  }

  async getEnvironment() {
    // Obtener información del entorno de Docker
  }

  async compose() {
    // Implementar funcionalidad de Docker Compose si es necesario
  }

  async build(args: DeployBuild): Promise<string> {
    const { path } = args;

    logger.info(`[${this.processUuid}] Building Docker image from path: ${path}`);

    const { dockerfile = "Dockerfile", environments = {}, name } = args;

    const stream = await directoryStream(join(path));

    return new Promise((resolve, reject) => {
      DeployWithDocker.docker?.buildImage(
        stream,
        {
          t: name,
          dockerfile: dockerfile,
          buildargs: environments,
        },
        function (err, response) {
          if (err) {
            logger.error(`[${DeployWithDocker._instance?.processUuid}] Error building Docker image:`, err);
            reject(err);
          }
          response?.pipe(process.stdout, { end: true });
          response?.on("end", () => {
            logger.info(`[${DeployWithDocker._instance?.processUuid}] Docker image built successfully`);
            //name of the image is passed to resolve
            resolve(name);
          });
        },
      );
    });
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
    return (
      !error &&
      (status === StatusContainer.EXITED || status === StatusContainer.CREATED)
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
    const { image, name, ports, environments = {} } = options;
    const ExposedPorts = mapToExposedPorts(ports);

    if (await this.exists(name)) {
      logger.info(`[${this.processUuid}] Container already exists: ${name}`);
      return;
    }

    DeployWithDocker.docker?.createContainer(
      {
        name,
        ExposedPorts,
        Image: image,
        Env: mapToEnv(environments),
        HostConfig: {
          NetworkMode: EnvironmentConfig.DOCKER_NETWORK,
        },
      },
      (err, container) => {
        if (err) {
          return logger.error(`[${this.processUuid}] Error creating Docker container: ${err}`);
        }

        container?.start((err) => {
          if (err) {
            return logger.error(`[${this.processUuid}] Error starting Docker container: ${err}`);
          }
          logger.info(
            `[${this.processUuid}] Docker container started successfully with ID: ${container.id}`,
          );
        });
      },
    );
  }

  lifespan(containerId: string, lifespan: number = 60000): void {
    if (this.timers.has(containerId)) {
      this.timers.get(containerId)?.refresh();
      return;
    }
    this.timers.set(
      containerId,
      setTimeout(async () => {
        if (await this.isRunning(containerId)) this.delete(containerId);
      }, lifespan),
    );
  }

  async start(containerId: string) {
    const container = DeployWithDocker.docker?.getContainer(containerId);
    if (!container) {
      return logger.error(`[${this.processUuid}] Container not found: ${containerId}`);
    }
    container.start((err) => {
      if (err) {
        return logger.error(`[${this.processUuid}] Error starting Docker container: ${err}`);
      }
      logger.info(
        `[${this.processUuid}] Docker container started successfully with ID: ${container.id}`,
      );
    });
  }

  delete(containerId: string) {
    const container = DeployWithDocker.docker?.getContainer(containerId);
    if (!container) {
      return logger.error(`[${this.processUuid}] Container not found: ${containerId}`);
    }
    container.remove({ force: true }, (err) => {
      if (err) {
        return logger.error(`[${this.processUuid}] Error deleting Docker container: ${err}`);
      }
      logger.info(
        `[${this.processUuid}] Docker container deleted successfully with ID: ${container.id}`,
      );
    });
  }

  stop(containerId: string) {
    const container = DeployWithDocker.docker?.getContainer(containerId);
    if (!container) {
      return logger.error(`[${this.processUuid}] Container not found: ${containerId}`);
    }
    container.stop((err) => {
      if (err) {
        return logger.error(`[${this.processUuid}] Error stopping Docker container: ${err}`);
      }
      logger.info(
        `[${this.processUuid}] Docker container stopped successfully with ID: ${container.id}`,
      );
    });
  }
}

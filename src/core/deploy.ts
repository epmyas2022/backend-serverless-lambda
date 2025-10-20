//SE ENCARGARA DE HACER LA CONSTRUCCION DEL PROYECTO CON DOCKER ASI COMO LEVANTAR Y DETENER EL SERVICIO
import Docker from "dockerode";
import { join } from "path";
import { directoryStream } from "../utils/files.ts";

interface DeployBuild {
  path: string;
  dockerfile: string;
  environments: Record<string, string>;
  name: string;
}
export class DeployWithDocker {
  static _instance: DeployWithDocker;
  protected static docker: Docker | null = null;
  private constructor(docker: Docker) {
    DeployWithDocker.docker = docker;
  }
  static async init() {
    if(DeployWithDocker._instance)
      return DeployWithDocker._instance;
    
    const docker = new Docker({
      protocol: "http",
      host: "0.0.0.0",
      port: 2375,
    });

    docker.ping((err) => {
      if (err)
        return console.error(
          "❌ Docker is not running or not accessible:",
          err
        );

      console.log("🐳 Docker client initialized");
    });

    DeployWithDocker._instance = new DeployWithDocker(docker);

    return DeployWithDocker._instance;
  }

  async getEnvironment() {}

  async build(args: DeployBuild) {
    const { path } = args;
    console.log("🚧 Building Docker image from path:", path);

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
          return console.error("❌ Error building Docker image:", err);
        }
        response?.pipe(process.stdout, { end: true });
        response?.on("end", () => {
          console.log("✅ Docker image built successfully");
        });
      }
    );
  }
  async status() {}

  async start() {}

  async stop() {}
}

export interface ServerConfig {
  name: string;
  externalPort: number;
  port: number;
  environments?: Record<string, string>;
  service?: {
    lifespan?: number; // in seconds
  };
}

export interface ServerConfigDockerFile extends ServerConfig {
  from: "dockerFile";
  path: string;
  dockerFilePath?: string;
}

export interface ServerConfigImage extends ServerConfig {
  from: "image";
  imageName: string;
}

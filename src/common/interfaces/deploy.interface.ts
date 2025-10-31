export interface DeployBuild {
  path: string;
  dockerfile: string;
  environments: Record<string, string>;
  name: string;
}

export interface DeployRun {
  image: string;
  name: string;
  ports: {
    [portExternal: string]: string; // mapping of internal to external ports
  }
}
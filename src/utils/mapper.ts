import type { DeployRun } from "../common/interfaces/deploy.interface.ts";

export function mapToExposedPorts(ports: DeployRun["ports"]): {
  [port: string]: {};
} {
  return Object.values(ports).reduce<Record<string, {}>>((acc, port) => {
    acc[port] = {};
    return acc;
  }, {});
}

export function mapToPortBindings(ports: DeployRun["ports"]): Record<
  string,
  {
    HostPort: string;
  }[]
> {
  return Object.entries(ports).reduce<
    Record<string, Array<{ HostPort: string }>>
  >((acc, [external, internal]) => {
    acc[internal] = [{ HostPort: external }];
    return acc;
  }, {});
}

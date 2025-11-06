import type { RequestHandler, Request, Response } from "express";
import { Domain } from "../common/constants/deploy.const.ts";
import { logger } from "../config/logger.ts";
import { createProxyMiddleware } from "http-proxy-middleware";
import type { Socket } from "node:net";

export async function catchError<T>(
  promise: Promise<T> | PromiseLike<T>
): Promise<[null, T] | [Error, null]> {
  try {
    const result = await promise;
    return [null, result];
  } catch (err) {
    return [err as Error, null];
  }
}

export function randomPort(): number {
  const min = 2000;
  const max = 65000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function subdomainFromName(name: string): string | null {
  const parts = name.split(".");

  if (parts.length < 4 || !parts[0]) return null;

  return parts[0]?.toLocaleLowerCase();
}

export function localUrl(
  ip: string,
  subdomain?: string | null,
  domain: string = Domain.SSLIP
): string {
  const ipFormatted = ip.replaceAll(".", "-");
  return `http://${subdomain ? subdomain + "." : ""}${ipFormatted}.${domain}/`;
}

export function createProxy(
  target: string,
  ssl: boolean = false
): RequestHandler {
  return createProxyMiddleware({
    target: `http${ssl ? "s" : ""}://${target}`,
    changeOrigin: true,
    timeout: 5000,
    proxyTimeout: 5000,
    on: {
      error: (err: Error, req: Request, _res: Response | Socket) => {
        logger.error(`Proxy error for ${req.url}: ${err.message}`);
      },
    },
  });
}

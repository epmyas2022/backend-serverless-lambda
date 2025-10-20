import * as fs from "fs/promises";
import { Readable } from "stream";
import tar from "tar-fs";

export async function getFileAssets(path: string): Promise<string> {
  const data = await fs.readFile(path, "utf-8");
  return data;
}

export async function readFile(path: string): Promise<NodeJS.ReadableStream> {
  const data = await fs.readFile(path);
  console.log("File read from path:", path);
  const stream = Readable.from(data);
  return stream;
}



export async function directoryStream(path: string): Promise<NodeJS.ReadableStream> {
  return tar.pack(path);
}

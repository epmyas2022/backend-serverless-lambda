import * as fs from "fs/promises";

export async function getFileAssets(path: string): Promise<string> {
  const data = await fs.readFile(path, "utf-8");
  return data;
}

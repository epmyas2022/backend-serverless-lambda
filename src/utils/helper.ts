
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
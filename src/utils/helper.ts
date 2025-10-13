
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

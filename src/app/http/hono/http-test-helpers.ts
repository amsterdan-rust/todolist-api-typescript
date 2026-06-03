export const readJson = async <TBody>(response: Response): Promise<TBody> =>
  (await response.json()) as TBody;

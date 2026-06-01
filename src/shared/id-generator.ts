export type IdGenerator = {
  generate: () => string;
};

export const makeCryptoIdGenerator = (): IdGenerator => ({
  generate: () => crypto.randomUUID(),
});

export type Clock = {
  now: () => Date;
};

export const makeSystemClock = (): Clock => ({
  now: () => new Date(),
});

function* idGenerator(): Generator<string, string, void> {
  let id = 0;
  while (true) yield (id++).toString(36);
}

const idGen = idGenerator();

const MathUtils = {
  id: () => idGen.next().value,
  DEG2RAD: Math.PI / 180,
  RAD2DEG: 180 / Math.PI,
};

export { MathUtils };

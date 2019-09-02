export const rand = (min: number, max: number): number => {
  const diff = max - min;
  return min + Math.random() * diff;
};

export const range = (min: number, max?: number): number[] => {
  if (!max) {
    max = min; // eslint-disable-line no-param-reassign
    min = 0; // eslint-disable-line no-param-reassign
  }
  const diff = max - min;
  const realMin = Math.min(max, min);
  const realMax = Math.max(max, min);
  const baseArray = [...Array(Math.abs(diff)).keys()].map(n => n + realMin);
  return max >= min ? baseArray : [realMax, ...baseArray.slice(1).reverse()];
};

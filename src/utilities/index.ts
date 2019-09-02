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

export const dampen = (num: number, by: number, center = 0): number => {
  // number is already at the center
  if (num === center) return center;

  // number is higher than the center; subtract and don't overshoot the center
  if (num > center) {
    const newNum = num - by;
    return newNum < center ? center : newNum;
  }

  // number is lower than the center; add and don't overshoot the center
  const newNum = num + by;
  return newNum > center ? center : newNum;
};

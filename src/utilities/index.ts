export const rand = (min: number, max: number): number => {
  const [realMin, realMax] = min < max ? [min, max] : [max, min];
  const diff = realMax - realMin;
  return realMin + (Math.random() * diff);
};

export const range = (min: number, max?: number): number[] => {
  if (!max) {
    max = min; // eslint-disable-line no-param-reassign
    min = 0; // eslint-disable-line no-param-reassign
  }
  const [realMin, realMax] = min < max ? [min, max] : [max, min];
  const diff = realMax - realMin;
  const baseArray = [...Array(diff).keys()].map(n => n + realMin);
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

export const bound = (num: number, min: number, max: number): number => {
  const [realMin, realMax] = min < max ? [min, max] : [max, min];
  if (num < realMin) return realMin;
  if (num > realMax) return realMax;
  return num;
};

export const between = (num: number, min: number, max: number, inclusive = true): boolean => {
  const [realMin, realMax] = min < max ? [min, max] : [max, min];
  return inclusive ? (num >= realMin && num <= realMax) : (num > realMin && num < realMax);
};

export const difference = (n: number, m: number): number => Math.abs(n - m);

function baseSum(array, fn) {
  let result,
      index = -1,
      length = array.length;

  while (++index < length) {
    let current = fn(array[index]);
    if (current !== undefined) {
      result = result === undefined ? current : (result + current);
    }
  }
  return result;
}

export function sumBy(array, fn) {
  return (array && array.length)
    ? baseSum(array, fn)
    : 0;
}

function getMinMax(str) {
  let arr = str.split(' ');

  arr = arr.filter( item => !isNaN(Number(item)) );

  arr.sort( (a, b) => a - b );

  return {
    min: +arr[0],
    max: +arr[arr.length - 1],
  };
}

function factorial(n) {

  let result = 1;

  if ( n == 0 || n == 1) {
    return result;
  }

  while ( n > 1 ) {
    result *= n;
    n--;
  }

  return result;
}

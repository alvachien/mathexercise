// mathutility.ts
// Math Utility

// Greatest Common Divisor (GCD)
export function getGCD1(a: number, b: number): number {
  return (a % b === 0) ? b : getGCD1(b, a % b);
}

export function getGCD2(a: number, b: number): number {
  if (a === b) {
    return a;
  } else if (a > b) {
    return getGCD2(a - b, b);
  } else {
    return getGCD2(b - a, b);
  }
}

export function getGCD3(a: number, b: number): number {
  let temp = 0;
  for (temp = a; ; temp--) {
    if (a % temp === 0 && b % temp === 0) {
      break;
    }
  }
  return temp;
}

// Least Common Multiple， LCM
export function getLCM(a: number, b: number): number {
  return a * b / getGCD2(a, b);
}

// Generate random number
export function generateNumber(endnr: number, bgnnr: number, dcmplace: number) {
  let rnum1 = Math.random() * (endnr - bgnnr) + bgnnr;
  if (dcmplace > 0) {
    rnum1 = parseFloat(rnum1.toFixed(dcmplace));
  } else {
    rnum1 = Math.round(rnum1);
  }
  return rnum1;
}

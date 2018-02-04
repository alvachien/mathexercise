
/**
 * Workout the slash
 * @param dim Dimension
 */
export function workoutSlash(dim: number) {
  for (let i = 0; i < 2 * dim - 1; i++) {
    console.log(`Slash ${i} output: `);
    for (let j = 0; j <= i; j++) {
      if (j <= dim - 1 && i <= dim + j - 1) {        
        console.log(`[${j}][${i - j}]`);
      }
    }
  }
}

/**
 * Workout the backslash
 * @param dim Dimension
 */
export function workoutBackSlash(dim: number) {
  for (let i = 2 * dim - 1; i >= 0; i--) {
    console.log(`BackSlash ${i} output: `);
    for (let j = 0; j <= i; j++) {
      if (j <= dim - 1 && i <= dim + j - 1) {        
        console.log(`[${j}][${i - j}]`);
      }
    }
  }
}


/**
 * Interface of the position in Matrix
 */
export interface MatrixPosIntf {
  x: number;
  y: number;
}

/**
 * Workout the slash
 * @param dim Dimension
 */
export function workoutSlash(dim: number): MatrixPosIntf[][] {
  if (dim <= 1) {
    throw new Error("Wrong parameter");
  }

  let arrst:MatrixPosIntf[][] = [];
  for (let i = 0; i < 2 * dim - 1; i++) {
    let arpos:MatrixPosIntf[] = [];

    for (let j = 0; j <= i; j++) {      
      if (j <= dim - 1 && i <= dim + j - 1) {
        arpos.push({x: j, y: i-j});
      }
    }

    arpos.sort((a,b) => {
      return a.x - b.x;
    });
    
    if (arpos.length > 0) {
      arrst.push(arpos);
    }    
  }

  return arrst;
}

/**
 * Workout the backslash
 * @param dim Dimension
 */
export function workoutBackSlash(dim: number): MatrixPosIntf[][] {
  if (dim <= 1) {
    throw new Error("Wrong parameter");
  }

  let arrst:MatrixPosIntf[][] = [];

  for(let i = 0; i <= dim - 1; i ++) {
    let arpos: MatrixPosIntf[] = [];
    for(let j = 0; j <= i; j++) {
      arpos.push({x: i-j, y:dim - 1 -j});
    }

    if (arpos.length > 0) {
      arrst.push(arpos);
    }
  }

  for (let i = 1; i <= dim - 1; i ++) {
    let arpos: MatrixPosIntf[] = [];
    for (let j = 0; j <= dim - 1 - i; j++) {
      arpos.push({x: i+j, y:j});
    }

    if (arpos.length > 0) {
      arrst.push(arpos);
    }
  }

  return arrst;
}

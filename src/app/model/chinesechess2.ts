import { getCanvasMouseEventPosition } from './uicommon';
import { environment } from '../../environments/environment';

// Refer to https://github.com/itlwei/chess

function arr2Clone(arr) {
  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    newArr[i] = arr[i].slice();
  }

  return newArr;
}

// Base class for piece
class ChineseChessPieceBase {
  x: any;
  y: any;
  text: any;
  value: any[];
  isShow: boolean;
  my: any;
  key: string;
  alpha = 1;

  img: string; // Short name
  image: any;
  bl: any;
  ps = [];

  get imageFullPath(): string {
    return environment.AppHost + '/assets/image/chinesechess/' + this.img + '.png';
  }

  constructor(key: string, x: number, y: number) {
    this.key = key;
    this.x = x;
    this.y = y;
    this.isShow = true; // Defaul is show!
  }

  loadImage() {
    if (this.image === undefined) {
      this.image = new Image();
      this.image.src = this.imageFullPath;
    }
  }

  show(ctx, spaceX, pointStartX, spaceY, pointStartY) {
    if (this.isShow) {
      this.loadImage();

      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.drawImage(this.image, spaceX * this.x + pointStartX, spaceY * this.y + pointStartY);
      ctx.restore();
    }
  }

  bylaw(x: number, y: number, my, play: ChineseChess2Play): any[] {
    return [];
  }
}

// Rook
class ChineseChessRook extends ChineseChessPieceBase {
  constructor(isAI: boolean, key: string, x: number, y: number) {
    super(key, x, y);

    const pvalue = [
      [206, 208, 207, 213, 214, 213, 207, 208, 206],
      [206, 212, 209, 216, 233, 216, 209, 212, 206],
      [206, 208, 207, 214, 216, 214, 207, 208, 206],
      [206, 213, 213, 216, 216, 216, 213, 213, 206],
      [208, 211, 211, 214, 215, 214, 211, 211, 208],

      [208, 212, 212, 214, 215, 214, 212, 212, 208],
      [204, 209, 204, 212, 214, 212, 204, 209, 204],
      [198, 208, 204, 212, 212, 212, 204, 208, 198],
      [200, 208, 206, 212, 200, 212, 206, 208, 200],
      [194, 206, 204, 212, 200, 212, 204, 206, 194]
    ];

    this.my = isAI ? -1 : 1;
    if (isAI) {
      this.text = '車';
      this.img = 'b_c';
      this.bl = 'c';
      this.value = arr2Clone(pvalue).reverse();
    } else {
      this.text = '车';
      this.img = 'r_c';
      this.bl = 'c';
      this.value = arr2Clone(pvalue);
    }
  }

  bylaw(x: number, y: number, my, play: ChineseChess2Play) {
    const d = [];

    // 左侧检索
    for (let i = x - 1; i >= 0; i--) {
      if (play.map[y][i]) {
        if (play.getPiece(play.map[y][i]).my !== my) {
          d.push([i, y]);
        }

        break;
      } else {
        d.push([i, y]);
      }
    }

    // 右侧检索
    for (let i = x + 1; i <= 8; i++) {
      if (play.map[y][i]) {
        if (play.getPiece(play.map[y][i]).my !== my) { d.push([i, y]); }
        break;
      } else {
        d.push([i, y]);
      }
    }

    // 上检索
    for (let i = y - 1; i >= 0; i--) {
      if (play.map[i][x]) {
        if (play.getPiece(play.map[i][x]).my !== my) { d.push([x, i]); }
        break;
      } else {
        d.push([x, i]);
      }
    }

    // 下检索
    for (let i = y + 1; i <= 9; i++) {
      if (play.map[i][x]) {
        if (play.getPiece(play.map[i][x]).my !== my) { d.push([x, i]); }
        break;
      } else {
        d.push([x, i]);
      }
    }

    return d;
  }
}

// Horse
class ChineseChessHorse extends ChineseChessPieceBase {
  constructor(isAI: boolean, key: string, x: number, y: number) {
    super(key, x, y);

    const pvalue = [
      [90, 90, 90, 96, 90, 96, 90, 90, 90],
      [90, 96, 103, 97, 94, 97, 103, 96, 90],
      [92, 98, 99, 103, 99, 103, 99, 98, 92],
      [93, 108, 100, 107, 100, 107, 100, 108, 93],
      [90, 100, 99, 103, 104, 103, 99, 100, 90],

      [90, 98, 101, 102, 103, 102, 101, 98, 90],
      [92, 94, 98, 95, 98, 95, 98, 94, 92],
      [93, 92, 94, 95, 92, 95, 94, 92, 93],
      [85, 90, 92, 93, 78, 93, 92, 90, 85],
      [88, 85, 90, 88, 90, 88, 90, 85, 88]
    ];

    this.my = isAI ? -1 : 1;
    if (isAI) {
      this.text = '馬';
      this.img = 'b_m';
      this.bl = 'm';
      this.value = arr2Clone(pvalue).reverse();
    } else {
      this.text = '马';
      this.img = 'r_m';
      this.bl = 'm';
      this.value = arr2Clone(pvalue);
    }
  }

  bylaw(x: number, y: number, my, play: ChineseChess2Play) {
    const d = [];

    // 1点
    if (y - 2 >= 0 && x + 1 <= 8 && !play.map[y - 1][x]
      && (!play.getPiece(play.map[y - 2][x + 1]) || play.getPiece(play.map[y - 2][x + 1]).my !== my)) {
      d.push([x + 1, y - 2]);
    }

    // 2点
    if (y - 1 >= 0 && x + 2 <= 8 && !play.map[y][x + 1]
      && (!play.getPiece(play.map[y - 1][x + 2]) || play.getPiece(play.map[y - 1][x + 2]).my !== my)) {
      d.push([x + 2, y - 1]);
    }

    // 4点
    if (y + 1 <= 9 && x + 2 <= 8 && !play.map[y][x + 1]
      && (!play.getPiece(play.map[y + 1][x + 2]) || play.getPiece(play.map[y + 1][x + 2]).my !== my)) {
      d.push([x + 2, y + 1]);
    }

    // 5点
    if (y + 2 <= 9 && x + 1 <= 8 && !play.map[y + 1][x]
      && (!play.getPiece(play.map[y + 2][x + 1]) || play.getPiece(play.map[y + 2][x + 1]).my !== my)) {
      d.push([x + 1, y + 2]);
    }

    // 7点
    if (y + 2 <= 9 && x - 1 >= 0 && !play.map[y + 1][x]
      && (!play.getPiece(play.map[y + 2][x - 1]) || play.getPiece(play.map[y + 2][x - 1]).my !== my)) {
      d.push([x - 1, y + 2]);
    }

    // 8点
    if (y + 1 <= 9 && x - 2 >= 0 && !play.map[y][x - 1]
      && (!play.getPiece(play.map[y + 1][x - 2]) || play.getPiece(play.map[y + 1][x - 2]).my !== my)) {
      d.push([x - 2, y + 1]);
    }

    // 10点
    if (y - 1 >= 0 && x - 2 >= 0 && !play.map[y][x - 1]
      && (!play.getPiece(play.map[y - 1][x - 2]) || play.getPiece(play.map[y - 1][x - 2]).my !== my)) {
      d.push([x - 2, y - 1]);
    }

    // 11点
    if (y - 2 >= 0 && x - 1 >= 0 && !play.map[y - 1][x]
      && (!play.getPiece(play.map[y - 2][x - 1]) || play.getPiece(play.map[y - 2][x - 1]).my !== my)) {
      d.push([x - 1, y - 2]);
    }

    return d;
  }
}

class ChineseChessElephant extends ChineseChessPieceBase {
  constructor(isAI: boolean, key: string, x: number, y: number) {
    super(key, x, y);

    const pvalue = [
      [0, 0, 20, 0, 0, 0, 20, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 23, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 20, 0, 0, 0, 20, 0, 0],

      [0, 0, 20, 0, 0, 0, 20, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [18, 0, 0, 0, 23, 0, 0, 0, 18],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 20, 0, 0, 0, 20, 0, 0]
    ];

    this.my = isAI ? -1 : 1;
    if (isAI) {
      this.text = '象';
      this.img = 'b_x';
      this.bl = 'x';
      this.value = arr2Clone(pvalue);
    } else {
      this.text = '相';
      this.img = 'r_x';
      this.bl = 'x';
      this.value = arr2Clone(pvalue);
    }
  }

  bylaw(x: number, y: number, my, play: ChineseChess2Play) {
    const d = [];
    if (my === 1) { // 红方
      // 4点半
      if (y + 2 <= 9 && x + 2 <= 8 && !play.map[y + 1][x + 1]
        && (!play.getPiece(play.map[y + 2][x + 2]) || play.getPiece(play.map[y + 2][x + 2]).my !== my)) {
        d.push([x + 2, y + 2]);
      }
      // 7点半
      if (y + 2 <= 9 && x - 2 >= 0 && !play.map[y + 1][x - 1]
        && (!play.getPiece(play.map[y + 2][x - 2]) || play.getPiece(play.map[y + 2][x - 2]).my !== my)) {
        d.push([x - 2, y + 2]);
      }
      // 1点半
      if (y - 2 >= 5 && x + 2 <= 8 && !play.map[y - 1][x + 1]
        && (!play.getPiece(play.map[y - 2][x + 2]) || play.getPiece(play.map[y - 2][x + 2]).my !== my)) {
        d.push([x + 2, y - 2]);
      }
      // 10点半
      if (y - 2 >= 5 && x - 2 >= 0 && !play.map[y - 1][x - 1]
        && (!play.getPiece(play.map[y - 2][x - 2]) || play.getPiece(play.map[y - 2][x - 2]).my !== my)) {
        d.push([x - 2, y - 2]);
      }
    } else {
      // 4点半
      if (y + 2 <= 4 && x + 2 <= 8 && !play.map[y + 1][x + 1]
        && (!play.getPiece(play.map[y + 2][x + 2]) || play.getPiece(play.map[y + 2][x + 2]).my !== my)) {
        d.push([x + 2, y + 2]);
      }
      // 7点半
      if (y + 2 <= 4 && x - 2 >= 0 && !play.map[y + 1][x - 1]
        && (!play.getPiece(play.map[y + 2][x - 2]) || play.getPiece(play.map[y + 2][x - 2]).my !== my)) {
        d.push([x - 2, y + 2]);
      }
      // 1点半
      if (y - 2 >= 0 && x + 2 <= 8 && !play.map[y - 1][x + 1]
        && (!play.getPiece(play.map[y - 2][x + 2]) || play.getPiece(play.map[y - 2][x + 2]).my !== my)) {
        d.push([x + 2, y - 2]);
      }
      // 10点半
      if (y - 2 >= 0 && x - 2 >= 0 && !play.map[y - 1][x - 1]
        && (!play.getPiece(play.map[y - 2][x - 2]) || play.getPiece(play.map[y - 2][x - 2]).my !== my)) {
        d.push([x - 2, y - 2]);
      }
    }
    return d;
  }
}

class ChineseChessGuard extends ChineseChessPieceBase {
  constructor(isAI: boolean, key: string, x: number, y: number) {
    super(key, x, y);

    const pvalue = [
      [0, 0, 0, 20, 0, 20, 0, 0, 0],
      [0, 0, 0, 0, 23, 0, 0, 0, 0],
      [0, 0, 0, 20, 0, 20, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],

      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 20, 0, 20, 0, 0, 0],
      [0, 0, 0, 0, 23, 0, 0, 0, 0],
      [0, 0, 0, 20, 0, 20, 0, 0, 0]
    ];

    this.my = isAI ? -1 : 1;
    if (isAI) {
      this.text = '士';
      this.img = 'b_s';
      this.bl = 's';
      this.value = arr2Clone(pvalue);
    } else {
      this.text = '仕';
      this.img = 'r_s';
      this.bl = 's';
      this.value = arr2Clone(pvalue);
    }
  }

  bylaw(x: number, y: number, my, play: ChineseChess2Play) {
    const d = [];
    if (my === 1) { // 红方
      // 4点半
      if (y + 1 <= 9 && x + 1 <= 5 && (!play.getPiece(play.map[y + 1][x + 1]) || play.getPiece(play.map[y + 1][x + 1]).my !== my)) {
        d.push([x + 1, y + 1]);
      }
      // 7点半
      if (y + 1 <= 9 && x - 1 >= 3 && (!play.getPiece(play.map[y + 1][x - 1]) || play.getPiece(play.map[y + 1][x - 1]).my !== my)) {
        d.push([x - 1, y + 1]);
      }
      // 1点半
      if (y - 1 >= 7 && x + 1 <= 5 && (!play.getPiece(play.map[y - 1][x + 1]) || play.getPiece(play.map[y - 1][x + 1]).my !== my)) {
        d.push([x + 1, y - 1]);
      }
      // 10点半
      if (y - 1 >= 7 && x - 1 >= 3 && (!play.getPiece(play.map[y - 1][x - 1]) || play.getPiece(play.map[y - 1][x - 1]).my !== my)) {
        d.push([x - 1, y - 1]);
      }
    } else {
      // 4点半
      if (y + 1 <= 2 && x + 1 <= 5 && (!play.getPiece(play.map[y + 1][x + 1]) || play.getPiece(play.map[y + 1][x + 1]).my !== my)) {
        d.push([x + 1, y + 1]);
      }
      // 7点半
      if (y + 1 <= 2 && x - 1 >= 3 && (!play.getPiece(play.map[y + 1][x - 1]) || play.getPiece(play.map[y + 1][x - 1]).my !== my)) {
        d.push([x - 1, y + 1]);
      }
      // 1点半
      if (y - 1 >= 0 && x + 1 <= 5 && (!play.getPiece(play.map[y - 1][x + 1]) || play.getPiece(play.map[y - 1][x + 1]).my !== my)) {
        d.push([x + 1, y - 1]);
      }
      // 10点半
      if (y - 1 >= 0 && x - 1 >= 3 && (!play.getPiece(play.map[y - 1][x - 1]) || play.getPiece(play.map[y - 1][x - 1]).my !== my)) {
        d.push([x - 1, y - 1]);
      }
    }
    return d;
  }
}

class ChineseChessGeneral extends ChineseChessPieceBase {
  constructor(isAI: boolean, key: string, x: number, y: number) {
    super(key, x, y);

    const pvalue = [
      [0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
      [0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
      [0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],

      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
      [0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
      [0, 0, 0, 8888, 8888, 8888, 0, 0, 0]
    ];

    this.my = isAI ? -1 : 1;
    if (isAI) {
      this.text = '帅';
      this.img = 'b_j';
      this.bl = 'j';
      this.value = arr2Clone(pvalue);
    } else {
      this.text = '将';
      this.img = 'r_j';
      this.bl = 'j';
      this.value = arr2Clone(pvalue);
    }
  }

  private isRelNull(x, y, play) {
    const y1 = play.getPiece('j0').y;
    const x1 = play.getPiece('J0').x;
    const y2 = play.getPiece('J0').y;
    for (let i = y1 - 1; i > y2; i--) {
      if (play.map[i][x1]) {
        return false;
      }
    }

    return true;
  }

  bylaw(x: number, y: number, my, play: ChineseChess2Play) {
    const d = [];

    if (my === 1) { // 红方
      // 下
      if (y + 1 <= 9 && (!play.getPiece(play.map[y + 1][x]) || play.getPiece(play.map[y + 1][x]).my !== my)) {
        d.push([x, y + 1]);
      }
      // 上
      if (y - 1 >= 7 && (!play.getPiece(play.map[y - 1][x]) || play.getPiece(play.map[y - 1][x]).my !== my)) {
        d.push([x, y - 1]);
      }
      // 老将对老将的情况
      if (play.getPiece('j0').x === play.getPiece('J0').x && this.isRelNull(x, y, play)) {
        d.push([play.getPiece('J0').x, play.getPiece('J0').y]);
      }
    } else {
      // 下
      if (y + 1 <= 2 && (!play.getPiece(play.map[y + 1][x]) || play.getPiece(play.map[y + 1][x]).my !== my)) {
        d.push([x, y + 1]);
      }
      // 上
      if (y - 1 >= 0 && (!play.getPiece(play.map[y - 1][x]) || play.getPiece(play.map[y - 1][x]).my !== my)) {
        d.push([x, y - 1]);
      }
      // 老将对老将的情况
      if (play.getPiece('j0').x === play.getPiece('J0').x && this.isRelNull(x, y, play)) {
        d.push([play.getPiece('j0').x, play.getPiece('j0').y]);
      }
    }
    // 右
    if (x + 1 <= 5 && (!play.getPiece(play.map[y][x + 1]) || play.getPiece(play.map[y][x + 1]).my !== my)) {
      d.push([x + 1, y]);
    }
    // 左
    if (x - 1 >= 3 && (!play.getPiece(play.map[y][x - 1]) || play.getPiece(play.map[y][x - 1]).my !== my)) {
      d.push([x - 1, y]);
    }

    return d;
  }
}

class ChineseChessCannon extends ChineseChessPieceBase {
  constructor(isAI: boolean, key: string, x: number, y: number) {
    super(key, x, y);

    const pvalue = [
      [100, 100, 96, 91, 90, 91, 96, 100, 100],
      [98, 98, 96, 92, 89, 92, 96, 98, 98],
      [97, 97, 96, 91, 92, 91, 96, 97, 97],
      [96, 99, 99, 98, 100, 98, 99, 99, 96],
      [96, 96, 96, 96, 100, 96, 96, 96, 96],

      [95, 96, 99, 96, 100, 96, 99, 96, 95],
      [96, 96, 96, 96, 96, 96, 96, 96, 96],
      [97, 96, 100, 99, 101, 99, 100, 96, 97],
      [96, 97, 98, 98, 98, 98, 98, 97, 96],
      [96, 96, 97, 99, 99, 99, 97, 96, 96]
    ];

    this.my = isAI ? -1 : 1;
    if (isAI) {
      this.text = '炮';
      this.img = 'b_p';
      this.bl = 'p';
      this.value = arr2Clone(pvalue).reverse();
    } else {
      this.text = '炮';
      this.img = 'r_p';
      this.bl = 'p';
      this.value = arr2Clone(pvalue);
    }
  }

  bylaw(x, y, my, play: ChineseChess2Play) {
    const d = [];

    // 左侧检索
    let n = 0;
    for (let i = x - 1; i >= 0; i--) {
      if (play.map[y][i]) {
        if (n === 0) {
          n++;
          continue;
        } else {
          if (play.getPiece(play.map[y][i]).my !== my) {
            d.push([i, y]);
          }
          break;
        }
      } else {
        if (n === 0) {
          d.push([i, y]);
        }
      }
    }

    // 右侧检索
    n = 0;
    for (let i = x + 1; i <= 8; i++) {
      if (play.map[y][i]) {
        if (n === 0) {
          n++;
          continue;
        } else {
          if (play.getPiece(play.map[y][i]).my !== my) {
            d.push([i, y]);
          }
          break;
        }
      } else {
        if (n === 0) {
          d.push([i, y]);
        }
      }
    }
    // 上检索
    n = 0;
    for (let i = y - 1; i >= 0; i--) {
      if (play.map[i][x]) {
        if (n === 0) {
          n++;
          continue;
        } else {
          if (play.getPiece(play.map[i][x]).my !== my) {
            d.push([x, i]);
          }
          break;
        }
      } else {
        if (n === 0) {
          d.push([x, i]);
        }
      }
    }
    // 下检索
    n = 0;
    for (let i = y + 1; i <= 9; i++) {
      if (play.map[i][x]) {
        if (n === 0) {
          n++;
          continue;
        } else {
          if (play.getPiece(play.map[i][x]).my !== my) {
            d.push([x, i]);
          }
          break;
        }
      } else {
        if (n === 0) {
          d.push([x, i]);
        }
      }
    }

    return d;
  }
}

class ChineseChessPawn extends ChineseChessPieceBase {
  constructor(isAI: boolean, key: string, x: number, y: number) {
    super(key, x, y);

    const pvalue = [
      [9, 9, 9, 11, 13, 11, 9, 9, 9],
      [19, 24, 34, 42, 44, 42, 34, 24, 19],
      [19, 24, 32, 37, 37, 37, 32, 24, 19],
      [19, 23, 27, 29, 30, 29, 27, 23, 19],
      [14, 18, 20, 27, 29, 27, 20, 18, 14],

      [7, 0, 13, 0, 16, 0, 13, 0, 7],
      [7, 0, 7, 0, 15, 0, 7, 0, 7],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    this.my = isAI ? -1 : 1;
    if (isAI === true) {
      this.text = '卒';
      this.img = 'b_z';
      this.bl = 'z';
      this.value = arr2Clone(pvalue).reverse();
    } else {
      this.text = '兵';
      this.img = 'r_z';
      this.bl = 'z';
      this.value = arr2Clone(pvalue);
    }
  }

  bylaw(x: number, y: number, my, play: ChineseChess2Play) {
    const d = [];

    if (my === 1) { // 红方
      // 上
      if (y - 1 >= 0 && (!play.getPiece(play.map[y - 1][x]) || play.getPiece(play.map[y - 1][x]).my !== my)) {
        d.push([x, y - 1]);
      }
      // 右
      if (x + 1 <= 8 && y <= 4 && (!play.getPiece(play.map[y][x + 1]) || play.getPiece(play.map[y][x + 1]).my !== my)) {
        d.push([x + 1, y]);
      }
      // 左
      if (x - 1 >= 0 && y <= 4 && (!play.getPiece(play.map[y][x - 1]) || play.getPiece(play.map[y][x - 1]).my !== my)) {
        d.push([x - 1, y]);
      }
    } else {
      // 下
      if (y + 1 <= 9 && (!play.getPiece(play.map[y + 1][x]) || play.getPiece(play.map[y + 1][x]).my !== my)) {
        d.push([x, y + 1]);
      }
      // 右
      if (x + 1 <= 8 && y >= 6 && (!play.getPiece(play.map[y][x + 1]) || play.getPiece(play.map[y][x + 1]).my !== my)) {
        d.push([x + 1, y]);
      }
      // 左
      if (x - 1 >= 0 && y >= 6 && (!play.getPiece(play.map[y][x - 1]) || play.getPiece(play.map[y][x - 1]).my !== my)) {
        d.push([x - 1, y]);
      }
    }

    return d;
  }
}

class ChineseChessBackground {
  imageBackground: any;
  isLoaded: boolean;

  constructor() {
    this.isLoaded = false;

    this.imageBackground = new Image();
    this.imageBackground.src = environment.AppHost + '/assets/image/chinesechess/bg.png';
    this.imageBackground.onload = () => {
      this.isLoaded = true;
    };
  }

  show(ctx) {
    // if (this.isLoaded) {
      ctx.drawImage(this.imageBackground, 0, 0);
    // } else {
    //  console.error('ChineseChessBackground: Picture not loaded yet');
    // }
  }
}

class ChineseChessPane {
  x;
  y;
  newX;
  newY;
  isShow;
  imagePane: any;
  isLoaded: boolean;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.newX = 0;
    this.newY = 0;
    this.isShow = false;
    this.isLoaded = false;

    this.imagePane = new Image();
    this.imagePane.src = environment.AppHost + '/assets/image/chinesechess/r_box.png';
    this.imagePane.onload = () => {
      this.isLoaded = true;
    };
  }

  show(ctx, spaceX, spaceY, pointStartX, pointStartY) {
    if (this.isShow) {
      // if (this.isLoaded) {

      // } else {
      //   console.error('ChineseChessPane: Picture not loaded yet');
      // }

      ctx.drawImage(this.imagePane, spaceX * this.x + pointStartX, spaceY * this.y + pointStartY)
      ctx.drawImage(this.imagePane, spaceX * this.newX + pointStartX, spaceY * this.newY + pointStartY)
    }
  }
}

class ChineseChessDot {
  x;
  y;
  isShow;
  dots = [];
  imageDot: any;
  isLoaded: boolean;

  constructor() {
    this.isLoaded = false;

    this.imageDot = new Image();
    this.imageDot.src = environment.AppHost + '/assets/image/chinesechess/dot.png';
    this.imageDot.onload = () => {
      this.isLoaded = true;
    };
  }

  show(ctx, spaceX, spaceY, pointStartX, pointStartY) {
    if (this.isShow) {
      // if (this.isLoaded) {
        for (let i = 0; i < this.dots.length; i++) {
          ctx.drawImage(this.imageDot, spaceX * this.dots[i][0] + 10 + pointStartX, spaceY * this.dots[i][1] + 10 + pointStartY);
        }
      // } else {
      //   console.error('ChineseChessDot: Picture not loaded yet');
      // }
    }
  }
}

// Map to comm
export class ChineseChessUI {
  styleSetting: any;
  canvasMain: any;
  contextMain: any;
  aidata: any;

  childList: any[];
  initMap;
  keys;

  // Images
  objBackground: ChineseChessBackground;
  objPane: ChineseChessPane;
  objDot: ChineseChessDot;

  get width(): number {
    return this.styleSetting.width;
  }
  get height(): number {
    return this.styleSetting.height;
  }
  get spaceX(): number {
    return this.styleSetting.spaceX;
  }
  get spaceY(): number {
    return this.styleSetting.spaceY;
  }
  get pointStartX(): number {
    return this.styleSetting.pointStartX;
  }
  get pointStartY(): number {
    return this.styleSetting.pointStartY;
  }
  set isDotShow(isshow: boolean) {
    this.objDot.isShow = isshow;
  }
  set isPaneShow(isshow: boolean) {
    this.objPane.isShow = isshow;
  }

  constructor() {
    this.objBackground = new ChineseChessBackground();
    this.objPane = new ChineseChessPane();
    this.objDot = new ChineseChessDot();

    this.styleSetting = {
      width: 530,
      height: 567,
      spaceX: 57,
      spaceY: 57,
      pointStartX: -2,
      pointStartY: 0
    };

    this.initMap = [
      ['C0', 'M0', 'X0', 'S0', 'J0', 'S1', 'X1', 'M1', 'C1'],
      [, , , , , , , , ],
      [, 'P0', , , , , , 'P1', ],
      ['Z0', , 'Z1', , 'Z2', , 'Z3', , 'Z4'],
      [, , , , , , , , ],
      [, , , , , , , , ],
      ['z0', , 'z1', , 'z2', , 'z3', , 'z4'],
      [, 'p0', , , , , , 'p1', ],
      [, , , , , , , , ],
      ['c0', 'm0', 'x0', 's0', 'j0', 's1', 'x1', 'm1', 'c1']
    ];

    this.keys = {
      'c0': 'c', 'c1': 'c',
      'm0': 'm', 'm1': 'm',
      'x0': 'x', 'x1': 'x',
      's0': 's', 's1': 's',
      'j0': 'j',
      'p0': 'p', 'p1': 'p',
      'z0': 'z', 'z1': 'z', 'z2': 'z', 'z3': 'z', 'z4': 'z', 'z5': 'z',

      'C0': 'C', 'C1': 'C',
      'M0': 'M', 'M1': 'M',
      'X0': 'X', 'X1': 'X',
      'S0': 'S', 'S1': 'S',
      'J0': 'J',
      'P0': 'P', 'P1': 'P',
      'Z0': 'Z', 'Z1': 'Z', 'Z2': 'Z', 'Z3': 'Z', 'Z4': 'Z', 'Z5': 'Z',
    };
  }

  public init(canvas: any) {
    this.canvasMain = canvas;
    this.contextMain = this.canvasMain.getContext('2d');
  }

  /**
   * Create the peices
  */
  createPieces(): Map<string, ChineseChessPieceBase> {
    const pieces: Map<string, ChineseChessPieceBase> = new Map<string, ChineseChessPieceBase>();

    for (let i = 0; i < this.initMap.length; i++) {
      for (let j = 0; j < this.initMap[i].length; j++) {
        const key = this.initMap[i][j];

        if (key !== undefined) {
          const piecekey = this.keys[key];
          switch (piecekey) {
            case 'c': {
              const piece = new ChineseChessRook(false, key, j, i);
              pieces.set(piece.key, piece);
            }
            break;

            case 'C': {
              const piece = new ChineseChessRook(true, key, j, i);
              pieces.set(piece.key, piece);
            }
            break;

            case 'm': {
              const piece = new ChineseChessHorse(false, key, j, i);
              pieces.set(piece.key, piece);
            }
            break;

            case 'M': {
              const piece = new ChineseChessHorse(true, key, j, i);
              pieces.set(piece.key, piece);
            }
            break;

            case 'x': {
              const piece = new ChineseChessElephant(false, key, j, i);
              pieces.set(piece.key, piece);
            }
            break;

            case 'X': {
              const piece = new ChineseChessElephant(true, key, j, i);
              pieces.set(piece.key, piece);
            }
            break;

            case 's': {
              const piece = new ChineseChessGuard(false, key, j, i);
              pieces.set(piece.key, piece);
            }
            break;

            case 'S': {
              const piece = new ChineseChessGuard(true, key, j, i);
              pieces.set(piece.key, piece);
            }
            break;

            case 'j': {
              const piece = new ChineseChessGeneral(false, key, j, i);
              pieces.set(piece.key, piece);
            }
            break;

            case 'J': {
              const piece = new ChineseChessGeneral(true, key, j, i);
              pieces.set(piece.key, piece);
            }
            break;

            case 'p': {
              const piece = new ChineseChessCannon(false, key, j, i);
              pieces.set(piece.key, piece);
            }
              break;

            case 'P': {
              const piece = new ChineseChessCannon(true, key, j, i);
              pieces.set(piece.key, piece);
            }
            break;

            case 'z': {
              const piece = new ChineseChessPawn(false, key, j, i);
              pieces.set(piece.key, piece);
            }
            break;

            case 'Z': {
              const piece = new ChineseChessPawn(true, key, j, i);
              pieces.set(piece.key, piece);
            }
            break;

            default: {
              throw new Error('Unknow key inputted:' + key);
            }
          }
        }
      }
    }

    return pieces;
  }

  public setPaneDetail(x, y, newX, newY) {
    this.objPane.x = x;
    this.objPane.y = y;
    this.objPane.newX = newX;
    this.objPane.newY = newY;
  }

  public setDots(dots: any[]) {
    this.objDot.dots = dots;
  }

  public show() {
    this.contextMain.clearRect(0, 0, this.width, this.height);

    // Show background first
    this.objBackground.show(this.contextMain);

    // Show the Pane
    this.objPane.show(this.contextMain, this.spaceX, this.spaceY, this.pointStartX, this.pointStartY);

    // Show the Dots
    this.objDot.show(this.contextMain, this.spaceX, this.spaceY, this.pointStartX, this.pointStartY);
  }
}

export class ChineseChessAI {
  historyTable = {};
  gambit: any[];
  historyBill: any[];
  treeDepth: any;
  number: any;

  public init(com: ChineseChessUI, play: ChineseChess2Play, pace, depth) {
    const bill = this.historyBill || com.aidata; // 开局库

    if (bill.length > 0) {
      const len = pace.length;
      const arr = [];

      // 先搜索棋谱
      for (let i = 0; i < bill.length; i++) {
        if (bill[i].slice(0, len) === pace) {
          arr.push(bill[i]);
        }
      }

      if (arr.length > 0) {
        const inx = Math.floor(Math.random() * arr.length);
        this.historyBill = arr;
        return arr[inx].slice(len, len + 4).split('');
      } else {
        this.historyBill = [];
      }
    }

    // 如果棋谱里面没有，人工智能开始运作
    const initTime = new Date().getTime();
    this.treeDepth = depth;

    this.number = 0;
    this.historyTable = [];

    let val = this.getAlphaBeta(-99999, 99999, this.treeDepth, arr2Clone(play.map), play.my, play);

    if (!val || val.value === -8888) {
      this.treeDepth = 2;
      val = this.getAlphaBeta(-99999, 99999, this.treeDepth, arr2Clone(play.map), play.my, play);
    }

    if (val && val.value !== -8888) {
      const man = play.getPiece(val.key);
      const nowTime = new Date().getTime();

      // com.get("moveInfo").innerHTML='<h3>AI搜索结果：</h3>最佳着法：'+
      //                 com.createMove(com.arr2Clone(play.map),man.x,man.y,val.x,val.y)+
      //                 '<br />搜索深度：'+AI.treeDepth+'<br />搜索分支：'+
      //                 AI.number+'个 <br />最佳着法评估：'+
      //                 val.value+'分'+
      //                 ' <br />搜索用时：'+
      //                 (nowTime-initTime)+'毫秒'

      return [man.x, man.y, val.x, val.y]
    } else {
      return false;
    }
  }

  iterativeSearch(map, my, play) {
    const timeOut = 100;
    const initDepth = 1;
    const maxDepth = 8;

    this.treeDepth = 0;
    const initTime = new Date().getTime();

    for (let i = initDepth; i <= maxDepth; i++) {
      const nowTime = new Date().getTime();
      this.treeDepth = i;
      // this.aotuDepth=i;
      const val = this.getAlphaBeta(-99999, 99999, this.treeDepth, map, my, play)
      if (nowTime - initTime > timeOut) {
        return val;
      }
    }

    return false;
  }

  getMapAllMan(map, my, play) {
    const piece = [];

    for (let i = 0; i < map.length; i++) {
      for (let n = 0; n < map[i].length; n++) {
        const key = map[i][n];

        if (key && play.getPiece(key).my === my) {
          play.getPiece(key).x = n;
          play.getPiece(key).y = i;

          piece.push(play.getPiece(key));
        }
      }
    }

    return piece;
  }

  getMoves(map, my, play) {
    const manArr = this.getMapAllMan(map, my, play);
    const moves = [];
    const foul = play.isFoul;

    for (let i = 0; i < manArr.length; i++) {
      const man = manArr[i];
      const val = man.bylaw(man.x, man.y, man.my, play);

      for (let n = 0; n < val.length; n++) {
        const x = man.x;
        const y = man.y;
        const newX = val[n][0];
        const newY = val[n][1];

        // 如果不是长将着法
        if (foul[0] !== x || foul[1] !== y || foul[2] !== newX || foul[3] !== newY) {
          moves.push([x, y, newX, newY, man.key])
        }
      }
    }

    return moves;
  }

  getAlphaBeta(A, B, depth, map, my, play) {
    if (depth === 0) {
      return { value: this.evaluate(map, my, play) }; // 局面评价函数;
    }

    const moves = this.getMoves(map, my, play); // 生成全部走法;
    let rootKey;
    let key;
    let newX;
    let newY;

    // 这里排序以后会增加效率

    for (let i = 0; i < moves.length; i++) {
      // 走这个走法;
      const move = moves[i];
      key = move[4];
      const oldX = move[0];
      const oldY = move[1];
      newX = move[2];
      newY = move[3];
      const clearKey = map[newY][newX] || '';

      map[newY][newX] = key;
      delete map[oldY][oldX];
      play.getPiece(key).x = newX;
      play.getPiece(key).y = newY;

      if (clearKey === 'j0' || clearKey === 'J0') { // 被吃老将,撤消这个走法;
        play.getPiece(key).x = oldX;
        play.getPiece(key).y = oldY;
        map[oldY][oldX] = key;
        delete map[newY][newX];

        if (clearKey) {
          map[newY][newX] = clearKey;
          // play.mans[ clearKey ].isShow = false;
        }

        return { 'key': key, 'x': newX, 'y': newY, 'value': 8888 };
      } else {
        const val = -this.getAlphaBeta(-B, -A, depth - 1, map, -1 * my, play).value;

        // 撤消这个走法
        play.getPiece(key).x = oldX;
        play.getPiece(key).y = oldY;
        map[oldY][oldX] = key;
        delete map[newY][newX];
        if (clearKey) {
          map[newY][newX] = clearKey;
          // play.mans[ clearKey ].isShow = true;
        }
        if (val >= B) {
          // 将这个走法记录到历史表中;
          // AI.setHistoryTable(txtMap,AI.treeDepth-depth+1,B,my);
          return { 'key': key, 'x': newX, 'y': newY, 'value': B };
        }
        if (val > A) {
          A = val; // 设置最佳走法;
          if (this.treeDepth === depth) {
            rootKey = { 'key': key, 'x': newX, 'y': newY, 'value': A };
          }
        }
      }
    }

    if (this.treeDepth === depth) { // 已经递归回根了
      if (!rootKey) {
        // AI没有最佳走法，说明AI被将死了，返回false
        return false;
      } else {
        // 这个就是最佳走法;
        return rootKey;
      }
    }

    return { 'key': key, 'x': newX, 'y': newY, 'value': A };
  }

  // 奖着法记录到历史表
  setHistoryTable(txtMap, depth, value, my) {
    // this.historyTable.length ++;
    this.historyTable[txtMap] = { depth: depth, value: value }
  }

  // 评估棋局 取得棋盘双方棋子价值差
  evaluate(map, my, play) {
    let val = 0;
    for (let i = 0; i < map.length; i++) {
      for (let n = 0; n < map[i].length; n++) {
        const key = map[i][n];
        if (key) {
          val += play.getPiece(key).value[i][n] * play.getPiece(key).my;
        }
      }
    }

    this.number++;
    return val * my;
  }
}

/**
 * Kernel Play upon chinese chess
*/
export class ChineseChess2Play {
  my = 1;
  isPlay = true;
  showPane: any;

  map = [];
  pace = [];
  nowManKey: string;
  depth = 3;
  isFoul;
  public pieces: Map<string, ChineseChessPieceBase>;
  private _childList: any[];
  private _instanceUI: ChineseChessUI;

  constructor() {
  }

  /**
   * Initialize
   * @param ui Instance of UI
   */
  public init(ui: ChineseChessUI) {
    this._instanceUI = ui;

    this.map = arr2Clone(this._instanceUI.initMap);
    this.pieces = this._instanceUI.createPieces();
  }

  /**
   * Get piece
   * @param key Key of the piece
   */
  public getPiece(key: string): ChineseChessPieceBase {
    if (!this.pieces.has(key)) {
      return undefined;
    }

    return this.pieces.get(key);
  }

  // Show
  public show() {
    // Background
    this._instanceUI.show();

    // Show the pieces
    this.pieces.forEach((value) => {
      if (value.isShow) {
        value.show(this._instanceUI.contextMain, this._instanceUI.spaceX, this._instanceUI.pointStartX,
          this._instanceUI.spaceY, this._instanceUI.pointStartY);
      }
    });
  }

  //   regret (){
  //     var map  = arr2Clone(com.initMap);
  //     //初始化所有棋子
  //     for (var i=0; i<map.length; i++){
  //       for (var n=0; n<map[i].length; n++){
  //         var key = map[i][n];
  //         if (key){
  //           com.mans[key].x=n;
  //           com.mans[key].y=i;
  //           com.mans[key].isShow = true;
  //         }
  //       }
  //     }
  //     var pace= this.pace;
  //     pace.pop();
  //     pace.pop();

  //     for (var i=0; i<pace.length; i++){
  //       var p= pace[i].split("")
  //       var x = parseInt(p[0], 10);
  //       var y = parseInt(p[1], 10);
  //       var newX = parseInt(p[2], 10);
  //       var newY = parseInt(p[3], 10);
  //       var key=map[y][x];
  //       //try{

  //       var cMan=map[newY][newX];
  //       if (cMan) com.mans[map[newY][newX]].isShow = false;
  //       com.mans[key].x = newX;
  //       com.mans[key].y = newY;
  //       map[newY][newX] = key;
  //       delete map[y][x];
  //       if (i==pace.length-1){
  //         com.showPane(newX ,newY,x,y)
  //       }
  //       //} catch (e){
  //       //	com.show()
  //       //	z([key,p,pace,map])

  //       //	}
  //     }
  //     this.map = map;
  //     this.my=1;
  //     this.isPlay=true;
  //     com.show();
  //   }

  clickPiece(key, x, y) {
    console.log('Entering ChineseChess2Play.clickPiece');
    this.my = 1;
    const piece = this.getPiece(key);

    if (this.nowManKey && this.nowManKey !== key && piece.my !== this.getPiece(this.nowManKey).my) {
      // 吃子
      if (this.indexOfPs(this.getPiece(this.nowManKey).ps, [x, y])) {
        piece.isShow = false;

        const pace = this.getPiece(this.nowManKey).x + '' + this.getPiece(this.nowManKey).y;

        delete this.map[this.getPiece(this.nowManKey).y][this.getPiece(this.nowManKey).x];

        this.map[y][x] = this.nowManKey;
        this._instanceUI.setPaneDetail(this.getPiece(this.nowManKey).x, this.getPiece(this.nowManKey).y, x, y);

        this._instanceUI.isPaneShow = false;
        this._instanceUI.isDotShow = false;

        this.show();
      }
    } else {
      if (piece.my === 1) {
        if (this.getPiece(this.nowManKey)) {
          this.getPiece(this.nowManKey).alpha = 1;
        }

        piece.alpha = 0.6;
        this.nowManKey = key;

        piece.ps = piece.bylaw(x, y, piece.my, this); // 获得所有能着点
        this._instanceUI.setDots(piece.ps);
        this._instanceUI.isDotShow = true;

        this.show();
      }
    }
  }

  clickPoint(x, y) {
    console.log('Entering ChineseChess2Play.clickPoint');
    this.my = 1;

    if (this.nowManKey) {
      const curpiece = this.getPiece(this.nowManKey);
      if (this.indexOfPs(curpiece.ps, [x, y])) {
        const pace = curpiece.x + '' + curpiece.y;

        delete this.map[curpiece.y][curpiece.x];
        this.map[y][x] = this.nowManKey;

        this._instanceUI.setPaneDetail(curpiece.x, curpiece.y, x, y)
        curpiece.x = x;
        curpiece.y = y;
        curpiece.alpha = 1;
        this.pace.push(pace + x + y);

        this.nowManKey = undefined;

        this._instanceUI.setDots([]);
        this._instanceUI.isDotShow = false;
        this.show();

        setTimeout(this.AIPlay(), 500);
      } else {
        // alert("不能这么走哦！")
      }
    }
  }

  AIPlay() {
    console.log('Entering ChineseChess2Play.AIPlay');
    this.my = -1;

    const objAI = new ChineseChessAI();
    const pace = objAI.init(this._instanceUI, this, this.pace.join(''), 4);
    if (!pace) {
      // this.showWin (1);
      return;
    }

    this.pace.push(pace.join(''));
    let key = this.map[pace[1]][pace[0]];
    this.nowManKey = key;

    key = this.map[pace[3]][pace[2]];
    if (key) {
      this.AIClickPiece(key, pace[2], pace[3]);
    } else {
      this.AIclickPoint(pace[2], pace[3]);
    }
  }

  checkFoul = function () {
    const p = this.pace;
    const len = parseInt(p.length, 10);
    if (len > 11 && p[len - 1] === p[len - 5] && p[len - 5] === p[len - 9]) {
      return p[len - 4].split('');
    }

    return false;
  }

  AIClickPiece(key, x, y) {
    console.log('Entering ChineseChess2Play.AIClickPiece');
    const piece = this.getPiece(key);

    // 吃子
    piece.isShow = false;
    delete this.map[this.getPiece(this.nowManKey).y][this.getPiece(this.nowManKey).x];

    this.map[y][x] = this.nowManKey;
    // this.showPane();
    this._instanceUI.setPaneDetail(this.getPiece(this.nowManKey).x, this.getPiece(this.nowManKey).y, x, y)
    this.getPiece(this.nowManKey).x = x;
    this.getPiece(this.nowManKey).y = y;
    this.nowManKey = undefined;

    this.show();
    //     if (key == "j0") play.showWin (-1);
    //     if (key == "J0") play.showWin (1);
  }

  AIclickPoint(x, y) {
    console.log('Entering ChineseChess2Play.AIClickPiece');

    const key = this.nowManKey;
    const piece = this.getPiece(key);

    if (this.nowManKey) {
      delete this.map[this.getPiece(this.nowManKey).y][this.getPiece(this.nowManKey).x];
      this.map[y][x] = key;

      this._instanceUI.setPaneDetail(piece.x, piece.y, x, y)
      piece.x = x;
      piece.y = y;
      this.nowManKey = undefined;
    }
    this.show();
  }

  indexOfPs(ps, xy) {
    for (let i = 0; i < ps.length; i++) {
      if (ps[i][0] === xy[0] && ps[i][1] === xy[1]) {
        return true;
      }
    }

    return false;
  }

  public getClickPoint(evt: MouseEvent, com: ChineseChessUI) {
    const domXY = getCanvasMouseEventPosition(com.canvasMain, evt);

    const x = Math.round((domXY.x - com.pointStartX) / com.spaceX)
    const y = Math.round((domXY.y - com.pointStartY) / com.spaceY)
    return { x: x, y: y }
  }

  public getClickPiece(e, com: ChineseChessUI) {
    const clickXY = this.getClickPoint(e, com);

    const x = clickXY.x;
    const y = clickXY.y;
    if (x < 0 || x > 8 || y < 0 || y > 9) {
      return false;
    }

    return (this.map[y][x] && this.map[y][x] !== '0') ? this.map[y][x] : false;
  }
}

// Refer to http://www.html5tricks.com/html5-zgxq.html
// /*! 一叶孤舟 | qq:28701884 | 欢迎指教 */

function arr2Clone(arr){
	let newArr = [];
	for (let i = 0; i < arr.length; i++){	
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

  img: string; // Short name
  bl: any;
  
  get imageFullPath(): string {
    return '../../assets/image/chinesechess/' + this.img + '.png';
  }

  constructor(key: string, x: number, y: number) {
    this.key = key;
    this.x = x;
    this.y = y;
  }
}

// Rook 
class ChineseChessRook extends ChineseChessPieceBase {
  constructor(isAI: boolean, key: string, x: number, y: number) {
    super(key, x, y);

    let pvalue = [
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

    if (isAI) {
      this.my = false;
      this.text = '車';
      this.img = 'b_c';
      this.my = -1;
      this.bl = 'c';
      this.value = arr2Clone(pvalue).reverse();
    } else {
      this.my = 1;
      this.text = '车';
      this.img = 'r_c';
      this.bl = 'c';
      this.value = arr2Clone(pvalue);
    }
  }

  bylaw(x, y, map: any[], my: boolean) {
    let d = [];

    // 左侧检索
    for (var i = x - 1; i >= 0; i--){
      if (map[y][i]) {
        if (this.mans[map[y][i]].my !== my) {
          d.push([i,y]);
        }

        break;
      } else {
        d.push([i,y])	
      }
    }

    //右侧检索
    for (let i= x + 1; i <= 8; i++){
      if (map[y][i]) {
        if (this.mans[map[y][i]].my !== my) d.push([i,y]);
        break
      }else{
        d.push([i,y])	
      }
    }

    //上检索
    for (let i = y-1 ; i >= 0; i--){
      if (map[i][x]) {
        if (this.mans[map[i][x]].my!=my) d.push([x,i]);
        break
      }else{
        d.push([x,i])	
      }
    }

    //下检索
    for (let i = y+1 ; i<= 9; i++){
      if (map[i][x]) {
        if (this.mans[map[i][x]].my!=my) d.push([x,i]);
        break
      }else{
        d.push([x,i])	
      }
    }

    return d;
  }  
}

// Horse
class ChineseChessHorse extends ChineseChessPieceBase {
  constructor(isAI: boolean, key: string, x: number, y: number) {
    super(key, x, y);

    let pvalue = [
      [90, 90, 90, 96, 90, 96, 90, 90, 90],
      [90, 96,103, 97, 94, 97,103, 96, 90],
      [92, 98, 99,103, 99,103, 99, 98, 92],
      [93,108,100,107,100,107,100,108, 93],
      [90,100, 99,103,104,103, 99,100, 90],
      
      [90, 98,101,102,103,102,101, 98, 90],
      [92, 94, 98, 95, 98, 95, 98, 94, 92],
      [93, 92, 94, 95, 92, 95, 94, 92, 93],
      [85, 90, 92, 93, 78, 93, 92, 90, 85],
      [88, 85, 90, 88, 90, 88, 90, 85, 88]
    ];

    if (isAI) {
      this.text = '馬'; 
      this.img = 'b_m';
      this.my = -1;
      this.bl = 'm';
      this.value = arr2Clone(pvalue).reverse();

    } else {
      this.text = '马';
      this.img = 'r_m';
      this.my = 1;
      this.bl = 'm';
      this.value = arr2Clone(pvalue);
    }
  }
}

class ChineseChessElephant extends ChineseChessPieceBase {
  constructor(isAI: boolean, key: string, x: number, y: number) {
    super(key, x, y);

    let pvalue = [
      [0, 0,20, 0, 0, 0,20, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0,23, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0,20, 0, 0, 0,20, 0, 0],
      
      [0, 0,20, 0, 0, 0,20, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [18,0, 0, 0,23, 0, 0, 0,18],
      [0, 0, 0, 0, 0, 0, 0, 0, 0], 
      [0, 0,20, 0, 0, 0,20, 0, 0]
    ];

    if (isAI) {
      this.text = '象';
      this.img = 'b_x';
      this.my = -1;
      this.bl = 'x';
      this.value = arr2Clone(pvalue);
    } else {
      this.text = '相';
      this.img = 'r_x';
      this.my = 1;
      this.bl = 'x';
      this.value = arr2Clone(pvalue);
    }
  }
}

class ChineseChessGuard extends ChineseChessPieceBase {
  constructor(isAI: boolean, key: string, x: number, y: number) {
    super(key, x, y);

    let pvalue = [
      [0, 0, 0,20, 0,20, 0, 0, 0],
      [0, 0, 0, 0,23, 0, 0, 0, 0],
      [0, 0, 0,20, 0,20, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0,20, 0,20, 0, 0, 0],
      [0, 0, 0, 0,23, 0, 0, 0, 0], 
      [0, 0, 0,20, 0,20, 0, 0, 0]
    ];

    if (isAI) {
      this.text = '士';
      this.img = 'b_s';
      this.my = -1;
      this.bl = 's';
      this.value = arr2Clone(pvalue);
    } else {
      this.text = '仕';
      this.img = 'r_s';
      this.my = 1;
      this.bl = 's';
      this.value = arr2Clone(pvalue);
    }
  }
}

class ChineseChessGeneral extends ChineseChessPieceBase {
  constructor(isAI: boolean, key: string, x: number, y: number) {
    super(key, x, y);

    let pvalue = [
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

    if (isAI) {
      this.text = '帅';
      this.img = 'b_j';
      this.my = -1;
      this.bl = 'j';
      this.value = arr2Clone(pvalue);
    } else {
      this.text = '将';
      this.img = 'r_j';
      this.my = 1;
      this.bl = 'j';
      this.value = arr2Clone(pvalue);
    }
  }
}

class ChineseChessCannon extends ChineseChessPieceBase {
  constructor(isAI: boolean, key: string, x: number, y: number) {
    super(key, x, y);

    let pvalue = [
        
      [100, 100,  96, 91,  90, 91,  96, 100, 100],
      [ 98,  98,  96, 92,  89, 92,  96,  98,  98],
      [ 97,  97,  96, 91,  92, 91,  96,  97,  97],
      [ 96,  99,  99, 98, 100, 98,  99,  99,  96],
      [ 96,  96,  96, 96, 100, 96,  96,  96,  96], 
      
      [ 95,  96,  99, 96, 100, 96,  99,  96,  95],
      [ 96,  96,  96, 96,  96, 96,  96,  96,  96],
      [ 97,  96, 100, 99, 101, 99, 100,  96,  97],
      [ 96,  97,  98, 98,  98, 98,  98,  97,  96],
      [ 96,  96,  97, 99,  99, 99,  97,  96,  96]
    ];

    if (isAI) {
      this.text = '炮';
      this.img = 'b_p'; 
      this.my = -1;
      this.bl = 'p';
      this.value = arr2Clone(pvalue).reverse();
    } else {
      this.text = '炮';
      this.img = 'r_p';
      this.my  = 1;
      this.bl = 'p';
      this.value = arr2Clone(pvalue);
    }
  }
}

class ChineseChessPawn extends ChineseChessPieceBase {
  constructor(isAI: boolean, key: string, x: number, y: number) {
    super(key, x, y);

    let pvalue = [
      [ 9,  9,  9, 11, 13, 11,  9,  9,  9],
      [19, 24, 34, 42, 44, 42, 34, 24, 19],
      [19, 24, 32, 37, 37, 37, 32, 24, 19],
      [19, 23, 27, 29, 30, 29, 27, 23, 19],
      [14, 18, 20, 27, 29, 27, 20, 18, 14],
      
      [ 7,  0, 13,  0, 16,  0, 13,  0,  7],
      [ 7,  0,  7,  0, 15,  0,  7,  0,  7], 
      [ 0,  0,  0,  0,  0,  0,  0,  0,  0],
      [ 0,  0,  0,  0,  0,  0,  0,  0,  0],
      [ 0,  0,  0,  0,  0,  0,  0,  0,  0]
    ];
    if (isAI) {
      this.text = '卒';
      this.img = 'b_z';
      this.my = -1;
      this.bl = 'z';
      this.value = arr2Clone(pvalue).reverse();
    } else {
      this.text = '兵';
      this.img = 'r_z';
      this.my = 1;
      this.bl = 'z';
      this.value = arr2Clone(pvalue);
    }
  }
}

class ChineseChessMan {
  com: any;
  pater: any;
  x: any;
  y: any;
  key: any;
  my: any;
  text: any;
  value: any;
  isShow;
  alpha;
  ps;

  constructor(com, key, x, y){
    this.com = com;

    this.pater = key.slice(0,1);
    let o = com.args[this.pater]
    this.x = x||0;   
    this.y = y||0;
    this.key = key ;
    this.my = o.my;
    this.text = o.text;
    this.value = o.value;
    this.isShow = true;
    this.alpha = 1;
    this.ps = []; //着点
  }

  show(ctx){
    if (this.isShow) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.drawImage(this.com[this.pater].img, this.com.spaceX * this.x + this.com.pointStartX , this.com.spaceY *  this.y + this.com.pointStartY);
      ctx.restore(); 
    }
  }

  // bl(map){
  //   let map = map || play.map;
  //   return this.com.bylaw[o.bl](this.x,this.y,map,this.my)    
  // }
}

class ChineseChessPane {
  x;
  y;
  newX;
  newY;
  isShow;
  com;

  constructor(com, img, x, y){
    this.com = com;
    this.x = x||0; 
      this.y = y||0;
    this.newX = x||0; 
      this.newY = y||0;
    this.isShow = true;
  }  

	show(){
		if (this.isShow) {
			this.com.ct.drawImage(this.com.paneImg, this.com.spaceX * this.x + this.com.pointStartX , this.com.spaceY *  this.y + this.com.pointStartY)
			this.com.ct.drawImage(this.com.paneImg, this.com.spaceX * this.newX + this.com.pointStartX  , this.com.spaceY *  this.newY + this.com.pointStartY)
		}
	}
}	

class ChineseChessDot {
  x;
  y;
  isShow;
  dots= [];

  show(com, ctx) {
    for (var i=0; i<this.dots.length;i++){
			if (this.isShow) ctx.drawImage(com.dotImg, com.spaceX * this.dots[i][0]+10  + com.pointStartX ,com.spaceY *  this.dots[i][1]+10 + com.pointStartY)
		}    
  }
}

// Map to comm
export class ChineseChessUI {
  styleSetting: any = undefined;
  canvasMain: any;
  contextMain: any;

  childList: any[];
  initMap;
  initMap1;
  keys;
  pieces: Map<string, ChineseChessPieceBase>;

  // Images
  imageBackground: any;
  imageDot: any;
  imagePane: any;

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
    
  constructor() {
    this.imageBackground = new Image();
    this.imageBackground.src = '../../assets/image/chinesechess/bg.png';
    this.imageDot = new Image();
    this.imageDot.src = '../../assets/image/chinesechess/dot.png';
    this.imagePane = new Image();
    this.imagePane.src = '../../assets/image/chinesechess/r_box.png';

    this.styleSetting = {
      width:530,
      height:567,
      spaceX:57,
      spaceY:57,
      pointStartX:-2,
      pointStartY:0,
      page:"chinesechess2"
    };

    this.initMap = [
      ['C0','M0','X0','S0','J0','S1','X1','M1','C1'],
      [    ,    ,    ,    ,    ,    ,    ,    ,    ],
      [    ,'P0',    ,    ,    ,    ,    ,'P1',    ],
      ['Z0',    ,'Z1',    ,'Z2',    ,'Z3',    ,'Z4'],
      [    ,    ,    ,    ,    ,    ,    ,    ,    ],
      [    ,    ,    ,    ,    ,    ,    ,    ,    ],
      ['z0',    ,'z1',    ,'z2',    ,'z3',    ,'z4'],
      [    ,'p0',    ,    ,    ,    ,    ,'p1',    ],
      [    ,    ,    ,    ,    ,    ,    ,    ,    ],
      ['c0','m0','x0','s0','j0','s1','x1','m1','c1']
    ];
    this.initMap1 = [
      [    ,    ,    ,    ,'J0',    ,    ,    ,    ],
      [    ,    ,    ,    ,    ,    ,    ,    ,    ],
      [    ,    ,    ,    ,    ,'z0',    ,    ,    ],
      [    ,    ,    ,    ,    ,    ,    ,    ,    ],
      [    ,    ,    ,    ,    ,    ,    ,    ,    ],
      [    ,    ,    ,    ,    ,    ,    ,    ,    ],
      [    ,    ,    ,    ,    ,    ,    ,    ,    ],
      [    ,    ,    ,    ,    ,    ,    ,    ,    ],
      [    ,    ,    ,    ,    ,    ,    ,    ,    ],
      [    ,    ,    ,'j0',    ,    ,    ,    ,    ]
    ];

    this.keys = {
      'c0':'c','c1':'c',
      'm0':'m','m1':'m',
      'x0':'x','x1':'x',
      's0':'s','s1':'s',
      'j0':'j',
      'p0':'p','p1':'p',
      'z0':'z','z1':'z','z2':'z','z3':'z','z4':'z','z5':'z',
      
      'C0':'C','C1':'C',
      'M0':'M','M1':'M',
      'X0':'X','X1':'X',
      'S0':'S','S1':'S',
      'J0':'J',
      'P0':'P','P1':'P',
      'Z0':'Z','Z1':'Z','Z2':'Z','Z3':'Z','Z4':'Z','Z5':'Z',
    };

    this.pieces = new Map<string, ChineseChessPieceBase>();
    this.childList = [];
    this.createPieces();
  }

  public init(canvas: any) {
    this.canvasMain = canvas;
    this.contextMain = this.canvasMain.getContext('2d');    
  }

  // bylaw_c(x,y,map,my){
  //   let d=[];

  //   //左侧检索
  //   for (var i=x-1; i>= 0; i--){
  //     if (map[y][i]) {
  //       if (this.mans[map[y][i]].my!=my) d.push([i,y]);
  //       break
  //     }else{
  //       d.push([i,y])	
  //     }
  //   }

  //   //右侧检索
  //   for (let i=x+1; i <= 8; i++){
  //     if (map[y][i]) {
  //       if (this.mans[map[y][i]].my!=my) d.push([i,y]);
  //       break
  //     }else{
  //       d.push([i,y])	
  //     }
  //   }
  //   //上检索
  //   for (let i = y-1 ; i >= 0; i--){
  //     if (map[i][x]) {
  //       if (this.mans[map[i][x]].my!=my) d.push([x,i]);
  //       break
  //     }else{
  //       d.push([x,i])	
  //     }
  //   }
  //   //下检索
  //   for (let i = y+1 ; i<= 9; i++){
  //     if (map[i][x]) {
  //       if (this.mans[map[i][x]].my!=my) d.push([x,i]);
  //       break
  //     }else{
  //       d.push([x,i])	
  //     }
  //   }

  //   return d;
  // }

  // bylaw_m(x,y,map,my){
  //   var d=[];
  //     //1点
  //     if ( y-2>= 0 && x+1<= 8 && !play.map[y-1][x] &&(!this.mans[map[y-2][x+1]] || this.mans[map[y-2][x+1]].my!=my)) d.push([x+1,y-2]);
  //     //2点
  //     if ( y-1>= 0 && x+2<= 8 && !play.map[y][x+1] &&(!this.mans[map[y-1][x+2]] || this.mans[map[y-1][x+2]].my!=my)) d.push([x+2,y-1]);
  //     //4点
  //     if ( y+1<= 9 && x+2<= 8 && !play.map[y][x+1] &&(!this.mans[map[y+1][x+2]] || this.mans[map[y+1][x+2]].my!=my)) d.push([x+2,y+1]);
  //     //5点
  //     if ( y+2<= 9 && x+1<= 8 && !play.map[y+1][x] &&(!this.mans[map[y+2][x+1]] || this.mans[map[y+2][x+1]].my!=my)) d.push([x+1,y+2]);
  //     //7点
  //     if ( y+2<= 9 && x-1>= 0 && !play.map[y+1][x] &&(!this.mans[map[y+2][x-1]] || this.mans[map[y+2][x-1]].my!=my)) d.push([x-1,y+2]);
  //     //8点
  //     if ( y+1<= 9 && x-2>= 0 && !play.map[y][x-1] &&(!this.mans[map[y+1][x-2]] || this.mans[map[y+1][x-2]].my!=my)) d.push([x-2,y+1]);
  //     //10点
  //     if ( y-1>= 0 && x-2>= 0 && !play.map[y][x-1] &&(!this.mans[map[y-1][x-2]] || this.mans[map[y-1][x-2]].my!=my)) d.push([x-2,y-1]);
  //     //11点
  //     if ( y-2>= 0 && x-1>= 0 && !play.map[y-1][x] &&(!this.mans[map[y-2][x-1]] || this.mans[map[y-2][x-1]].my!=my)) d.push([x-1,y-2]);
  
  //   return d;
  // }

  // bylaw_x(x,y,map,my){
  //   var d=[];
  //   if (my===1){ //红方
  //     //4点半
  //     if ( y+2<= 9 && x+2<= 8 && !play.map[y+1][x+1] && (!this.mans[map[y+2][x+2]] || this.mans[map[y+2][x+2]].my!=my)) d.push([x+2,y+2]);
  //     //7点半
  //     if ( y+2<= 9 && x-2>= 0 && !play.map[y+1][x-1] && (!this.mans[map[y+2][x-2]] || this.mans[map[y+2][x-2]].my!=my)) d.push([x-2,y+2]);
  //     //1点半
  //     if ( y-2>= 5 && x+2<= 8 && !play.map[y-1][x+1] && (!this.mans[map[y-2][x+2]] || this.mans[map[y-2][x+2]].my!=my)) d.push([x+2,y-2]);
  //     //10点半
  //     if ( y-2>= 5 && x-2>= 0 && !play.map[y-1][x-1] && (!this.mans[map[y-2][x-2]] || this.mans[map[y-2][x-2]].my!=my)) d.push([x-2,y-2]);
  //   }else{
  //     //4点半
  //     if ( y+2<= 4 && x+2<= 8 && !play.map[y+1][x+1] && (!this.mans[map[y+2][x+2]] || this.mans[map[y+2][x+2]].my!=my)) d.push([x+2,y+2]);
  //     //7点半
  //     if ( y+2<= 4 && x-2>= 0 && !play.map[y+1][x-1] && (!this.mans[map[y+2][x-2]] || this.mans[map[y+2][x-2]].my!=my)) d.push([x-2,y+2]);
  //     //1点半
  //     if ( y-2>= 0 && x+2<= 8 && !play.map[y-1][x+1] && (!this.mans[map[y-2][x+2]] || this.mans[map[y-2][x+2]].my!=my)) d.push([x+2,y-2]);
  //     //10点半
  //     if ( y-2>= 0 && x-2>= 0 && !play.map[y-1][x-1] && (!this.mans[map[y-2][x-2]] || this.mans[map[y-2][x-2]].my!=my)) d.push([x-2,y-2]);
  //   }
  //   return d;
  // }
  
  // bylaw_s(x,y,map,my){
  //   var d=[];
  //   if (my===1){ //红方
  //     //4点半
  //     if ( y+1<= 9 && x+1<= 5 && (!this.mans[map[y+1][x+1]] || this.mans[map[y+1][x+1]].my!=my)) d.push([x+1,y+1]);
  //     //7点半
  //     if ( y+1<= 9 && x-1>= 3 && (!this.mans[map[y+1][x-1]] || this.mans[map[y+1][x-1]].my!=my)) d.push([x-1,y+1]);
  //     //1点半
  //     if ( y-1>= 7 && x+1<= 5 && (!this.mans[map[y-1][x+1]] || this.mans[map[y-1][x+1]].my!=my)) d.push([x+1,y-1]);
  //     //10点半
  //     if ( y-1>= 7 && x-1>= 3 && (!this.mans[map[y-1][x-1]] || this.mans[map[y-1][x-1]].my!=my)) d.push([x-1,y-1]);
  //   }else{
  //     //4点半
  //     if ( y+1<= 2 && x+1<= 5 && (!this.mans[map[y+1][x+1]] || this.mans[map[y+1][x+1]].my!=my)) d.push([x+1,y+1]);
  //     //7点半
  //     if ( y+1<= 2 && x-1>= 3 && (!this.mans[map[y+1][x-1]] || this.mans[map[y+1][x-1]].my!=my)) d.push([x-1,y+1]);
  //     //1点半
  //     if ( y-1>= 0 && x+1<= 5 && (!this.mans[map[y-1][x+1]] || this.mans[map[y-1][x+1]].my!=my)) d.push([x+1,y-1]);
  //     //10点半
  //     if ( y-1>= 0 && x-1>= 3 && (!this.mans[map[y-1][x-1]] || this.mans[map[y-1][x-1]].my!=my)) d.push([x-1,y-1]);
  //   }
  //   return d;      
  // }

  // bylaw_j(x,y,map,my){
  //   var d=[];
  //   var isNull=(function (y1,y2){
  //     var y1 = this.mans['j0'].y;
  //     var x1 = this.mans['J0'].x;
  //     var y2 = this.mans['J0'].y;
  //     for (var i = y1-1; i > y2; i--){
  //       if (map[i][x1]) return false;
  //     }
  //     return true;
  //   })();
    
  //   if (my===1){ //红方
  //     //下
  //     if ( y+1<= 9  && (!this.mans[map[y+1][x]] || this.mans[map[y+1][x]].my!=my)) d.push([x,y+1]);
  //     //上
  //     if ( y-1>= 7 && (!this.mans[map[y-1][x]] || this.mans[map[y-1][x]].my!=my)) d.push([x,y-1]);
  //     //老将对老将的情况
  //     if ( this.mans['j0'].x == this.mans['J0'].x &&isNull) d.push([this.mans['J0'].x,this.mans['J0'].y]);
      
  //   }else{
  //     //下
  //     if ( y+1<= 2  && (!this.mans[map[y+1][x]] || this.mans[map[y+1][x]].my!=my)) d.push([x,y+1]);
  //     //上
  //     if ( y-1>= 0 && (!this.mans[map[y-1][x]] || this.mans[map[y-1][x]].my!=my)) d.push([x,y-1]);
  //     //老将对老将的情况
  //     if ( this.mans['j0'].x == this.mans["J0"].x &&isNull) d.push([this.mans['j0'].x,this.mans['j0'].y]);
  //   }
  //   //右
  //   if ( x+1<= 5  && (!this.mans[map[y][x+1]] || this.mans[map[y][x+1]].my!=my)) d.push([x+1,y]);
  //   //左
  //   if ( x-1>= 3 && (!this.mans[map[y][x-1]] || this.mans[map[y][x-1]].my!=my))d.push([x-1,y]);
  //   return d;
  // }

  // bylaw_p(x,y,map,my){
  //   var d=[];
  //   //左侧检索
  //   var n=0;
  //   for (var i=x-1; i>= 0; i--){
  //     if (map[y][i]) {
  //       if (n==0){
  //         n++;
  //         continue;
  //       }else{
  //         if (this.mans[map[y][i]].my!=my) d.push([i,y]);
  //         break	
  //       }
  //     }else{
  //       if(n==0) d.push([i,y])	
  //     }
  //   }
  //   //右侧检索
  //   var n=0;
  //   for (var i = x+1; i <= 8; i++){
  //     if (map[y][i]) {
  //       if (n==0){
  //         n++;
  //         continue;
  //       }else{
  //         if (this.mans[map[y][i]].my!=my) d.push([i,y]);
  //         break	
  //       }
  //     }else{
  //       if(n==0) d.push([i,y])	
  //     }
  //   }
  //   //上检索
  //   var n=0;
  //   for (var i = y-1 ; i >= 0; i--){
  //     if (map[i][x]) {
  //       if (n==0){
  //         n++;
  //         continue;
  //       }else{
  //         if (this.mans[map[i][x]].my!=my) d.push([x,i]);
  //         break	
  //       }
  //     }else{
  //       if(n==0) d.push([x,i])	
  //     }
  //   }
  //   //下检索
  //   var n=0;
  //   for (var i = y+1 ; i<= 9; i++){
  //     if (map[i][x]) {
  //       if (n==0){
  //         n++;
  //         continue;
  //       }else{
  //         if (this.mans[map[i][x]].my!=my) d.push([x,i]);
  //         break	
  //       }
  //     }else{
  //       if(n==0) d.push([x,i])	
  //     }
  //   }
  //   return d;
  // }

  // bylaw_z(x,y,map,my){
  //   var d=[];
  //   if (my===1){ //红方
  //     //上
  //     if ( y-1>= 0 && (!this.mans[map[y-1][x]] || this.mans[map[y-1][x]].my!=my)) d.push([x,y-1]);
  //     //右
  //     if ( x+1<= 8 && y<=4  && (!this.mans[map[y][x+1]] || this.mans[map[y][x+1]].my!=my)) d.push([x+1,y]);
  //     //左
  //     if ( x-1>= 0 && y<=4 && (!this.mans[map[y][x-1]] || this.mans[map[y][x-1]].my!=my))d.push([x-1,y]);
  //   }else{
  //     //下
  //     if ( y+1<= 9  && (!this.mans[map[y+1][x]] || this.mans[map[y+1][x]].my!=my)) d.push([x,y+1]);
  //     //右
  //     if ( x+1<= 8 && y>=6  && (!this.mans[map[y][x+1]] || this.mans[map[y][x+1]].my!=my)) d.push([x+1,y]);
  //     //左
  //     if ( x-1>= 0 && y>=6 && (!this.mans[map[y][x-1]] || this.mans[map[y][x-1]].my!=my))d.push([x-1,y]);
  //   }
    
  //   return d;
  // }

  createPieces() {
    for (let i = 0; i < this.initMap.length; i++){
      for (let j = 0; j < this.initMap[i].length; j++){
        let key = this.initMap[i][j];
        if (key !== undefined) {
          let piecekey = this.keys[key];
          switch(piecekey) {
            case 'c': {
              let piece = new ChineseChessRook(false, key, j, i);
              this.pieces.set(piece.key, piece);
            }
            break;

            case 'C': {
              let piece = new ChineseChessRook(true, key, j, i);
              this.pieces.set(piece.key, piece);
            }
            break;

            case 'm': {
              let piece = new ChineseChessHorse(false, key, j, i);
              this.pieces.set(piece.key, piece);
            }
            break;

            case 'M': {
              let piece = new ChineseChessHorse(true, key, j, i);
              this.pieces.set(piece.key, piece);
            }
            break;

            case 'x': {
              let piece = new ChineseChessElephant(false, key, j, i);
              this.pieces.set(piece.key, piece);
            }
            break;

            case 'X': {
              let piece = new ChineseChessElephant(true, key, j, i);
              this.pieces.set(piece.key, piece);
            }
            break;

            case 's': {
              let piece = new ChineseChessGuard(false, key, j, i);
              this.pieces.set(piece.key, piece);
            }
            break;

            case 'S': {
              let piece = new ChineseChessGuard(true, key, j, i);
              this.pieces.set(piece.key, piece);
            }
            break;

            case 'j': {
              let piece = new ChineseChessGeneral(false, key, j, i);
              this.pieces.set(piece.key, piece);
            }
            break;

            case 'J': {
              let piece = new ChineseChessGeneral(true, key, j, i);
              this.pieces.set(piece.key, piece);
            }
            break;

            case 'p': {
              let piece = new ChineseChessCannon(false, key, j, i);
              this.pieces.set(piece.key, piece);
            }
            break;

            case 'P': {
              let piece = new ChineseChessCannon(true, key, j, i);
              this.pieces.set(piece.key, piece);
            }
            break;

            case 'z': {
              let piece = new ChineseChessPawn(false, key, j, i);
              this.pieces.set(piece.key, piece);
            }
            break;

            case 'Z': {
              let piece = new ChineseChessPawn(true, key, j, i);
              this.pieces.set(piece.key, piece);
            }
            break;

            default: {
              throw new Error('Unknow key inputted:' + key);
            }            
          }
        }
      }
    }      
  }

  showBackground() {
    // Background
    this.contextMain.drawImage(this.imageBackground, 0, 0);
  }

  show() {
    this.contextMain.clearRect(0, 0, this.width, this.height);

    // Show background first

    for(let i = 0; i < this.childList.length; i++) {
      this.childList[i].show(this.contextMain);
    }
  }
  
  getDomXY (dom){
    let left = dom.offsetLeft;
    let top = dom.offsetTop;
    let current = dom.offsetParent;

    while (current !== undefined){
      left += current.offsetLeft;
      top += current.offsetTop;
      current = current.offsetParent;
    }

    return {x:left,y:top};
  }  
}

export class ChineseChess2Play {
  my = 1;
  map = [];
  nowManKey = false;
  pace =[];
  isPlay = true;
  mans = [];
  bylaw: any;
  show: any;
  showPane: any;
  isOffensive = true;
  depth =  3;

  constructor(com: ChineseChessUI) {
    this.map 			  =	arr2Clone (com.initMap);
    // this.mans 			=	com.mans;
    //this.bylaw 			= com.bylaw;
    this.show 			= com.show;
    //this.showPane 	= com.showPane;  
  }

  public init() {

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

//   clickCanvas = function (e){
//     if (!this.isPlay) return false;
//     var key = this.getClickMan(e);
//     var point = this.getClickPoint(e);
    
//     var x = point.x;
//     var y = point.y;
    
//     if (key){
//       this.clickMan(key,x,y);	
//     }else {
//       this.clickPoint(x,y);	
//     }
//     this.isFoul = this.checkFoul();//检测是不是长将
//   }

//   clickMan(key,x,y){
//     var man = com.mans[key];
//     //吃子
//     if (this.nowManKey&&play.nowManKey != key && man.my != com.mans[play.nowManKey ].my){
//       //man为被吃掉的棋子
//       if (this.indexOfPs(com.mans[play.nowManKey].ps,[x,y])){
//         man.isShow = false;
//         var pace=com.mans[play.nowManKey].x+""+com.mans[play.nowManKey].y
//         //z(bill.createMove(play.map,man.x,man.y,x,y))
//         delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
//         play.map[y][x] = play.nowManKey;
//         com.showPane(com.mans[play.nowManKey].x ,com.mans[play.nowManKey].y,x,y)
//         com.mans[play.nowManKey].x = x;
//         com.mans[play.nowManKey].y = y;
//         com.mans[play.nowManKey].alpha = 1
        
//         play.pace.push(pace+x+y);
//         play.nowManKey = false;
//         com.pane.isShow = false;
//         com.dot.dots = [];
//         com.show()
//         com.get("clickAudio").play();
//         setTimeout("play.AIPlay()",500);
//         if (key == "j0") play.showWin (-1);
//         if (key == "J0") play.showWin (1);
//       }
//     // 选中棋子
//     }else{
//       if (man.my===1){
//         if (com.mans[play.nowManKey]) com.mans[play.nowManKey].alpha = 1 ;
//         man.alpha = 0.6;
//         com.pane.isShow = false;
//         this.nowManKey = key;
//         com.mans[key].ps = com.mans[key].bl(); //获得所有能着点
//         com.dot.dots = com.mans[key].ps
//         com.show();
//         //com.get("selectAudio").start(0);
//         com.get("selectAudio").play();
//       }
//     }
//   }
  
//   clickPoint(x,y){
//     var key=this.nowManKey;
//     var man=com.mans[key];
//     if (this.nowManKey){
//       if (this.indexOfPs(com.mans[key].ps,[x,y])){
//         var pace=man.x+""+man.y
//         //z(bill.createMove(play.map,man.x,man.y,x,y))
//         delete this.map[man.y][man.x];
//         play.map[y][x] = key;
//         com.showPane(man.x ,man.y,x,y)
//         man.x = x;
//         man.y = y;
//         man.alpha = 1;
//         this.pace.push(pace+x+y);
//         this.nowManKey = false;
//         com.dot.dots = [];
//         com.show();
//         com.get("clickAudio").play();
//         setTimeout("play.AIPlay()",500);
//       }else{
//         //alert("不能这么走哦！")	
//       }
//     }
    
//   }
//   AIPlay = function (){
//     //return
//     this.my = -1 ;
//     var pace=AI.init(this.pace.join(''))
//     if (!pace) {
//       this.showWin (1);
//       return ;
//     }

//     this.pace.push(pace.join(''));
//     var key=this.map[pace[1]][pace[0]]
//       this.nowManKey = key;
    
//     var key=this.map[pace[3]][pace[2]];
//     if (key){
//       this.AIclickMan(key,pace[2],pace[3]);	
//     }else {
//       this.AIclickPoint(pace[2],pace[3]);	
//     }
//     com.get("clickAudio").play();
    
    
//   }
  
//   checkFoul = function(){
//     var p=this.pace;
//     var len=parseInt(p.length,10);
//     if (len>11&&p[len-1] == p[len-5] &&p[len-5] == p[len-9]){
//       return p[len-4].split("");
//     }
//     return false;
//   }

//   AIclickMan = function (key,x,y){
//     var man = com.mans[key];
//     //吃子
//     man.isShow = false;
//     delete this.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
//     this.map[y][x] = play.nowManKey;
//     this.showPane(com.mans[play.nowManKey].x ,com.mans[play.nowManKey].y,x,y)
    
//     com.mans[this.nowManKey].x = x;
//     com.mans[this.nowManKey].y = y;
//     this.nowManKey = false;
    
//     com.show()
//     if (key == "j0") play.showWin (-1);
//     if (key == "J0") play.showWin (1);
//   }

//   AIclickPoint(x,y){
//     var key = this.nowManKey;
//     var man = com.mans[key];

//     if (this.nowManKey){
//       delete this.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
//       this.map[y][x] = key;
      
//       com.showPane(man.x,man.y,x,y)
      
//       man.x = x;
//       man.y = y;
//       this.nowManKey = false;      
//     }
//     com.show();
//   }

//   indexOfPs(ps,xy){
//     for (var i=0; i<ps.length; i++){
//       if (ps[i][0]==xy[0]&&ps[i][1]==xy[1]) return true;
//     }
//     return false;
    
//   }
//   getClickPoint(e){
//     var domXY = com.getDomXY(com.canvas);
//     var x=Math.round((e.pageX-domXY.x-com.pointStartX-20)/com.spaceX)
//     var y=Math.round((e.pageY-domXY.y-com.pointStartY-20)/com.spaceY)
//     return {"x":x,"y":y}
//   }
//   getClickPiece(e){
//     var clickXY=play.getClickPoint(e);
//     var x=clickXY.x;
//     var y=clickXY.y;
//     if (x < 0 || x>8 || y < 0 || y > 9) return false;
//     return (play.map[y][x] && play.map[y][x]!="0") ? play.map[y][x] : false;
//   }

}

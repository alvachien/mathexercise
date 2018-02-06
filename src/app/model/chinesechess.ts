// Refer to https://github.com/lhttjdr/xiangqi/blob/master/index.html

// /**
//  * Chiness chess point
//  */
// export class ChineseChessPoint {
//   x: number;
//   y: number;

//   constructor(x: number, y: number) {
//     this.moveTo(x, y);
//   }

//   move(dx: number, dy: number) {
//     this.x += dx;
//     this.y += dy;
//   }

//   moveTo(x: number, y: number) {
//     this.x = x;
//     this.y = y;
//   }

//   isEquals(pt: ChineseChessPoint): boolean {
//     return this.x === pt.x && this.y === pt.y;
//   }

//   toString(): string {
//     return '(' + this.x + ', ' + this.y + ')';
//   }
// }

// /**
//  * Rect in chinese chess
//  */
// export class ChineseChessRect {
//   left: number;
//   top: number;
//   right: number;
//   bottom: number;

//   constructor(left, top, right, bottom) {
//     this.left = left;
//     this.top = top
//     this.right = right;
//     this.bottom = bottom;
//   }

//   // Width
//   get width(): number {
//     return this.right - this.left;
//   }

//   get height(): number {
//     return this.bottom - this.top;
//   }

//   move(dx: number, dy: number): void {
//     this.left += dx;
//     this.right += dx;
//     this.top += dy;
//     this.bottom += dy;
//   }

//   moveTo(x: number, y: number) {
//     this.right = x + this.width;
//     this.bottom = y + this.height;
//     this.left = x;
//     this.top = y;
//   }

//   isPointIn(point: ChineseChessPoint): boolean {
//     return this.left <= point.x && this.right > point.x && this.top <= point.y && this.bottom > point.y;
//   }

//   isOverlap(rc: ChineseChessRect): boolean {
//     return !(this.left >= rc.right || this.right <= rc.left || this.top >= rc.bottom || this.bottom <= rc.top);
//   }

//   isEquals(rc: ChineseChessRect): boolean {
//     return this.left === rc.left && this.top === rc.top && this.right === rc.right && this.bottom === rc.bottom;
//   }

//   toString(): string {
//     return '[' + this.left + ', ' + this.top + ', ' + this.right + ', ' + this.bottom + ']';
//   }
// }

// export class ChineseChessWidget {
//   id: string;
//   parent: any;
//   children: any;
//   offsetRect: ChineseChessRect;
//   canvas: any;

//   constructor(id, parent, canvas) {
//     this.id = id || '_id_' + Math.random();
//     this.parent = parent;
//     this.canvas = canvas || (this.parent ? this.parent.canvas : null);
//     this.children = new Array();
//     this.offsetRect = new ChineseChessRect(0, 0, 0, 0);

//     if (this.parent !== undefined) {
//       this.parent.addChild(this);
//     }
//   }

//   public init() {
//     this.eachChild(el => {
//       el.onPaint();
//     }, true);
//   }

//   onMouseDown(point: ChineseChessPoint) {
//     this.eachChild((el) => {
//       if (el.hitTest(point)) {
//         el.onMouseDown(point);
//         return true;
//       } else {
//         return false;
//       }
//     }, true);
//   }

//   onMouseUp(point: ChineseChessPoint) {
//     this.eachChild((el) => {
//       if (el.hitTest(point)) {
//         el.onMouseUp(point);
//         return true;
//       } else {
//         return false;
//       }
//     }, true);
//   }
//   onMouseMove(point: ChineseChessPoint) {
//     this.eachChild((el) => {
//       return el.onMouseMove(point);
//     }, true);
//   }

//   onPaint(canvas) { }

//   addChild(child: any) {
//     if (!this.hasChild(child)) {
//       this.children.push(child);
//     }
//     child.parent = this;
//   }

//   hasChild(child: any): boolean {
//     for (let i = 0; i < this.children.length; i++) {
//       if (this.children[i] === child) {
//         return true;
//       }
//     }

//     return false;
//   }

//   eachChild(callback, reverse) {
//     if (reverse) {
//       for (let i = this.children.length - 1; i >= 0; i--) {
//         if (callback(this.children[i])) { break; }
//       }
//     } else {
//       for (let i = 0; i < this.children.length; i++) {
//         if (callback(this.children[i])) { break; }
//       }
//     }
//   }

//   moveChildToTop(child: any): void {
//     child = this.removeChild(child);
//     if (child !== undefined) { this.children.push(child); }
//   }

//   removeChild(child: any) {
//     for (let i = 0; i < this.children.length; i++) {
//       if (this.children[i] === child) { return this.children.splice(i, 1)[0]; }
//     }

//     return undefined;
//   }

//   hitTest(point: ChineseChessPoint) {
//     return this.offsetRect.isPointIn(point);
//   }

//   show() {
//     this.redraw();
//   }

//   redraw(): void {
//     this.onPaint(this.canvas);
//     this.eachChild(el => {
//       el.redraw();
//     }, true);
//   }

//   onDestroy(): void {
//     this.eachChild((el) => {
//       el.onDestroy();
//     }, true);
//     this.children = [];
//     if (this.parent !== undefined) { this.parent.removeChild(this); }
//   }

//   toString(): string {
//     return this.id;
//   }
// }

// export class ChinesChessRootWidge extends ChineseChessWidget {
//   constructor(id, canvas) {
//     super(id, null, canvas);
//   }

//   init() {
//     let _this = this;

//     document.onmousedown = document.ontouchstart = (e) => {
//       e = e || window.event;
//       _this.onMouseDown(_this.getFixedMousePoint(e, _this.canvas));
//     };

//     document.onmouseup = document.ontouchend = (e) => {
//       e = e || window.event;
//       _this.onMouseUp(_this.getFixedMousePoint(e, _this.canvas));
//     }

//     document.onmousemove = document.ontouchend = (e) => {
//       e = e || window.event;
//       _this.onMouseMove(_this.getFixedMousePoint(e, _this.canvas));
//     }
//   }

//   public getFixedMousePoint(e, dom) {
//     const x = e.pageX - dom.offsetLeft;
//     const y = e.pageY - dom.offsetTop;
//     return new ChineseChessPoint(x, y);
//   }
// }

// export class ChineseChessBoard extends ChinesChessRootWidge {
//   campOrder: boolean;
//   mover: number;
//   isMoving: boolean;
//   boardMap: any;
//   searchEngine: any;
//   history: any;

//   constructor() {
//     super();

//     this.offsetRect.left = 0;
//     this.offsetRect.top = 0;
//     this.offsetRect.right = 460;
//     this.offsetRect.bottom = 510;

//     this.history = new Array();
//     this.boardMap = new Array();

//     for (let i = 0; i < 9; i++) {
//       this.boardMap[i] = new Array();
//       for (let j = 0; j < 10; j++) {
//         this.boardMap[i][j] = undefined;
//       }
//     }

//     for (let i = 0; i < this.children.length; i++) {
//       let child = this.children[i];
//       if (child instanceof ChineseChessChess && child.pos !== undefined) {
//         this.boardMap[child.pos.x][child.pos.y] = child;
//       }
//     }

//     this.searchEngine = new NegaScout_TT_HH();
//     this.searchEngine.setMoveGenerator(new MoveGenerator());
//     this.searchEngine.setEvaluator(new Evaluation());
//     this.searchEngine.setSearchDepth(10);
//   }

//   findChess(pos) {
//     if (!this.isValidPos(pos)) {
//       return undefined;
//     }
//     for (let i = 0; i < this.children.length; i++) {
//       let child = this.children[i];
//       if (child instanceof ChineseChessChess && child.pos !== undefined && child.pos.isEquals(pos)) {
//         return child;
//       }
//     }
//     return undefined;
//   }

//   isGameOver() {
//     var red = false,
//       black = false;
//     for (var i = 0; i < this.children.length; i++) {
//       var child = this.children[i];
//       if (child instanceof Chess) {
//         if (child.type == "R_KING") red = true;
//         else if (child.type == "B_KING") black = true;
//         if (red && black) return false;
//       }
//     }
//     return true;
//   }

//   recordMove(chess, pos) {
//     var move = new Object();
//     move.from = chess.pos;
//     move.to = pos;
//     move.target = this.findChess(pos);
//     this.history.push(move);
//   }

//   restore() {
//     if (this.history.length % 2 == 1 || this.history.length == 0) return;
//     for (var i = 0; i < 2; ++i) {
//       var move = this.history.pop();
//       chess = this.findChess(move.to);

//       chess.autoMoveBackTo(move.from);

//       if (move.target != null) {

//         this.addChild(move.target);
//         this.boardMap[move.to.x][move.to.y] = move.target;

//         move.target.autoMoveBackTo(move.to);
//       }
//     }
//     this.mover = 0;
//   }

//   moveChessWithoutRecored(chess, pos) {
//     this.boardMap[pos.x][pos.y] = chess;
//     if (!chess.pos.equals(pos)) {
//       this.boardMap[chess.pos.x][chess.pos.y] = undefined;
//       chess.pos = pos;
//     }
//   }

//   moveChess(chess, pos) {
//     this.recordMove(chess, pos);
//     this.removeChess(pos);
//     this.boardMap[pos.x][pos.y] = chess;
//     this.boardMap[chess.pos.x][chess.pos.y] = undefined;
//     chess.pos = pos;
//     this.mover = 1 - chess.camp;
//     this.computerMoveChess();

//     if (this.isGameOver()) {
//       if (this.mover === 1) alert("恭喜，你赢啦！");
//       else alert("输了哦，下次再努力吧～");
//       this.mover = -1;
//       return;
//     }
//   }

//   computerMoveChess() {

//     if (this.mover === 1) {
//       let _this = this;
//       let timer = setInterval(function () {
//         if (_this.isMoving) return;
//         clearInterval(timer);
//         var bestMove = _this.searchEngine.searchAGoodMove(_this.boardMap);
//         if (bestMove.score <= -19990) {
//           alert("我输了~");
//           return;
//         }
//         var Chess = _this.findChess(bestMove.from);
//         Chess.autoMoveTo(bestMove.to);
//       }, 100);
//     }
//   }

//   removeChess(pos) {
//     this.boardMap[pos.x][pos.y] = undefined;
//     var chess = this.findChess(pos);
//     if (chess !== undefined) this.removeChild(chess);
//   }

//   isValidPos(pos) {
//     return pos != undefined && !this.isOutsideBoard(pos);
//   }

//   isInsideCamp(pos, camp) {
//     if (!this.isValidPos(pos)) return false;
//     if (camp === this.campOrder) {
//       return pos.y <= 4;
//     } else {
//       return pos.y >= 5;
//     }
//   }

//   isInsidePalace(pos, camp) {
//     if (!this.isValidPos(pos)) return false;
//     if (pos.x < 3 || pos.x > 5) return false;
//     if (camp === this.campOrder) {
//       return pos.y <= 2;
//     } else {
//       return pos.y >= 7;
//     }
//   }

//   isOutsideBoard(pos) {
//     return pos.x < 0 || pos.x >= 9 || pos.y < 0 || pos.y >= 10;
//   }

//   onPaint() {
//     let str = '<table cellspacing=0 border=1>';
//     for (let j = 0; j < 10; j++) {
//       str += '<tr>';
//       for (let i = 0; i < 9; i++) {
//         str += '<td style="height:15px;width:40px;">';
//         if (this.boardMap[i][j] !== undefined)
//           str += this.boardMap[i][j].id;
//         str += '</td>';
//       }
//       str += '</tr>';
//     }
//     str += '</table>';
//     document.getElementById('debug').innerHTML = str;

//     let ctx = this.canvas.getContext('2d');

//     ctx.fillStyle = style.board.background;
//     ctx.beginPath();
//     ctx.rect(0, 0, layout.offsetWidth, layout.offsetHeight);
//     ctx.fill();
//     ctx.closePath();

//     let p = layout.padding,
//       s = layout.cell,
//       w = layout.width,
//       h = layout.height;
//     ctx.strokeStyle = style.board.border;
//     ctx.lineWidth = 2;
//     ctx.beginPath();

//     for (let i = 0; i < 10; i++) {
//       ctx.moveTo(p, s * i + p);
//       ctx.lineTo(w + p, s * i + p);
//     }

//     ctx.moveTo(p, p);
//     ctx.lineTo(p, h + p);
//     ctx.moveTo(w + p, p);
//     ctx.lineTo(w + p, h + p);

//     for (let i = 1; i < 8; i++) {
//       ctx.moveTo(s * i + p, p);
//       ctx.lineTo(s * i + p, s * 4 + p);
//       ctx.moveTo(s * i + p, s * 5 + p);
//       ctx.lineTo(s * i + p, h + p);
//     }

//     ctx.moveTo(s * 3 + p, p);
//     ctx.lineTo(s * 5 + p, s * 2 + p);
//     ctx.moveTo(s * 5 + p, 0 + p);
//     ctx.lineTo(s * 3 + p, s * 2 + p);
//     ctx.moveTo(s * 3 + p, s * 7 + p);
//     ctx.lineTo(s * 5 + p, s * 9 + p);
//     ctx.moveTo(s * 5 + p, s * 7 + p);
//     ctx.lineTo(s * 3 + p, s * 9 + p);
//     ctx.stroke();
//     ctx.closePath();

//     ctx.save();
//     ctx.rotate(-Math.PI / 2);
//     ctx.font = style.board.font;
//     ctx.fillStyle = style.board.border;
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     ctx.fillText('楚', -(p + s * 4.5), (p + s * 1.5));
//     ctx.fillText('河', -(p + s * 4.5), (p + s * 2.5));
//     ctx.rotate(Math.PI);
//     ctx.fillText('漢', (p + s * 4.5), -(p + s * 6.5));
//     ctx.fillText('界', (p + s * 4.5), -(p + s * 5.5));
//     ctx.restore();
//   }
// }

// export class ChineseChessChess extends ChineseChessWidget {
//   name: any;
//   type: any;
//   camp: any;
//   pos: any;
//   isDragging: boolean;
//   targetPos: any;
//   targetIndicatorAlpha: number = 0.2;

//   constructor(id, parent, name, type, camp, pos) {
//     super(id, parent);

//     this.name = name;
//     this.type = type;
//     this.camp = camp || 0;
//     this.pos = pos || new Point(0, 0);
//     this.offsetRect.left = layout.padding + layout.cell * this.pos.x - layout.cell / 2;
//     this.offsetRect.top = layout.padding + layout.cell * this.pos.y - layout.cell / 2;
//     this.offsetRect.right = this.offsetRect.left + layout.cell;
//     this.offsetRect.bottom = this.offsetRect.top + layout.cell;
//   }

//   onPaint() {
//     var ctx = this.canvas.getContext('2d');
//     ctx.fillStyle = style.chess[this.camp].background;
//     ctx.strokeStyle = style.chess[this.camp].border;
//     ctx.font = style.chess[this.camp].font;

//     var x = this.offsetRect.left + layout.cell / 2,
//       y = this.offsetRect.top + layout.cell / 2;
//     ctx.beginPath();
//     ctx.fillStyle = "rgba(0, 0, 0, 0.2)";

//     if (this.isDragging) ctx.arc(x + 2, y + 4, layout.chessRadius + 1, 0, 360);
//     else ctx.arc(x + 1, y + 2, layout.chessRadius + 1, 0, 360);
//     ctx.fill();
//     ctx.fillStyle = style.chess[this.camp].background;
//     ctx.closePath();

//     if (this.targetPos != null && this.targetIndicatorAlpha > 0) {
//       ctx.beginPath();
//       ctx.fillStyle = "rgba(0, 128, 0, " + this.targetIndicatorAlpha + ")";
//       ctx.arc(layout.padding + this.targetPos.x * layout.cell, layout.padding + this.targetPos.y * layout.cell, layout.cell / 2, 0, 360);
//       ctx.fill();
//       ctx.fillStyle = style.chess[this.camp].background;
//       ctx.closePath();
//     }

//     ctx.beginPath();
//     ctx.arc(x, y, layout.chessRadius, 0, 360);
//     ctx.fill();
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
//     ctx.fillText(this.name, x + 1, y - layout.fontSize / 16 + 1);
//     ctx.fillStyle = style.chess[this.camp].fontColor;
//     ctx.fillText(this.name, x, y - layout.fontSize / 16);
//     ctx.stroke();
//     ctx.closePath();
//   }

//   onMouseDown(point) {
//     if (this.parent.isMoving) return;
//     if (this.parent.mover == this.camp) {
//       this.isDragging = true;
//       this.parent.moveChildToTop(this);
//       this.parent.redraw();
//     }
//   }

//   onMouseMove(point) {
//     if (this.isDragging) {
//       if (point.x <= 0 || point.x >= layout.offsetWidth || point.y <= 0 || point.y >= layout.offsetHeight) {
//         this.isDragging = false;
//         this.moveTo(this.pos);
//         this.parent.redraw();
//         return;
//       }

//       var x = point.x - layout.cell / 2,
//         y = point.y - layout.cell / 2;

//       this.offsetRect.moveTo(x, y);

//       var pos = this.point2chessPos(x, y);

//       if (this.isTargetValid(pos)) this.targetPos = pos;
//       else this.targetPos = null;

//       this.parent.redraw();
//     }
//   }

//   onMouseUp(point) {
//     if (this.isDragging) {
//       this.isDragging = false;
//       var pos = this.targetPos || this.pos;
//       this.moveTo(pos);
//       if (this.targetPos != null) {
//         this.parent.moveChess(this, pos);
//       }
//     }
//   }

//   autoMoveBackTo(pos) {
//     this.targetPos = pos;
//     this.moveTo(pos);
//     if (this.targetPos != null) {
//       this.parent.moveChessWithoutRecored(this, pos);
//     }
//   }
//   autoMoveTo(pos) {
//     this.targetPos = pos;
//     this.moveTo(pos);
//     if (this.targetPos != null) {
//       this.parent.moveChess(this, pos);
//     }
//   }

//   point2chessPos(x, y) {
//     return new Point(Math.ceil((x - layout.padding) / layout.cell), Math.ceil((y - layout.padding) / layout.cell));
//   }

//   chessPos2point(x, y) { }

//   moveTo(pos) {
//     this.parent.isMoving = true;

//     var left = layout.padding + layout.cell * pos.x - layout.cell / 2,
//       top = layout.padding + layout.cell * pos.y - layout.cell / 2;

//     var dx = left - this.offsetRect.left,
//       dy = top - this.offsetRect.top;

//     var t = 0,
//       c = 15,
//       _this = this;
//     var timer = setInterval(function () {

//       if (++t > c) {
//         clearInterval(timer);
//         _this.pos = pos;
//         _this.offsetRect.moveTo(left, top);
//         _this.targetPos = null;
//         _this.targetIndicatorAlpha = 0.2;
//         _this.parent.isMoving = false;
//         return;
//       }

//       let ratio = 0;
//       if (t <= c / 2) {
//         ratio = 2 * t / c;
//         ratio = 1 - 0.5 * ratio * ratio * ratio * ratio;
//       } else {
//         ratio = 2 - 2 * t / c;
//         ratio = 0.5 * ratio * ratio * ratio * ratio;
//       }
//       _this.offsetRect.moveTo(left - dx * ratio, top - dy * ratio);
//       _this.targetIndicatorAlpha = 0.2 * ratio;
//       _this.parent.redraw();
//     }, 40);
//   }

//   isTargetValid(pos) {
//     if (!this.parent.isValidPos(pos)) return false;
//     var chess = this.parent.findChess(pos);
//     return chess == null || chess.camp !== this.camp;
//   }
//   isRed() {
//     return this.camp === 0;
//   }

//   isSameCamp(chess) {
//     return this.camp === chess.camp;
//   }
// }

// export class ChineseChessChariot extends ChineseChessChess {
//   constructor(id, parent, camp, pos) {
//     super(id, parent, "車", camp === 0 ? "R_CAR" : "B_CAR", camp, pos);
//   }

//   isTargetValid(pos) {
//     if (!this._super(pos)) return false;
//     var dx = pos.x - this.pos.x,
//       dy = pos.y - this.pos.y;
//     if (dx != 0 && dy != 0) return false;
//     var targetChess = this.parent.findChess(pos);
//     var steps = Math.max(Math.abs(dx), Math.abs(dy));
//     var blockPos = new Point(this.pos.x, this.pos.y);
//     for (var i = 1; i < steps; i++) {
//       blockPos.x += dx / steps;
//       blockPos.y += dy / steps;
//       if (this.parent.findChess(blockPos) != null) return false;
//     }
//     return true;
//   }
// }

// export class ChinessChessHorse extends ChineseChessChess {
//   constructor(id, parent, camp, pos) {
//     super(id, parent, "馬", camp==0?"R_HORSE":"B_HORSE", camp, pos);
//   }

//   isTargetValid(pos) {
//     if (!this._super(pos)) return false;
//     var dx = pos.x - this.pos.x,
//         dy = pos.y - this.pos.y;
//     if (dx == 0 || dy == 0 || Math.abs(dx) + Math.abs(dy) != 3) return false;
//     var targetChess = this.parent.findChess(pos);
//     var blockPos = new Point(this.pos.x, this.pos.y);
//     if (Math.abs(dx) == 2) blockPos.x += dx / 2;
//     else blockPos.y += dy / 2;
//     return this.parent.findChess(blockPos) == null;
//   }  
// }

// export class ChineseChessElephant extends ChineseChessChess {
//   constructor(id, parent, camp, pos) {
//     super(id, parent, camp == 0 ? "相" : "象", camp==0?"R_ELEPHANT":"B_ELEPHANT", camp, pos);
//   }
//   isTargetValid(pos) {
//       if (!this._super(pos)) return false;
//       if (!this.parent.isInsideCamp(pos, this.camp)) return false;
//       var dx = pos.x - this.pos.x,
//           dy = pos.y - this.pos.y;
//       if (Math.abs(dx) != 2 || Math.abs(dy) != 2) return false;
//       var blockPos = new Point(this.pos.x + dx / 2, this.pos.y + dy / 2);
//       return this.parent.findChess(blockPos) == null;
//   }
// }

// export class ChineseChessGuard extends ChineseChessChess {
//   constructor(id, parent, camp, pos) {
//     super(id, parent, camp == 0 ? "士" : "仕", camp==0?"R_BISHOP":"B_BISHOP", camp, pos);
//   }
//   isTargetValid(pos) {
//     if (!this._super(pos)) return false;
//     if (!this.parent.isInsidePalace(pos, this.camp)) return false;
//     var dx = pos.x - this.pos.x,
//         dy = pos.y - this.pos.y;
//     if (Math.abs(dx) != 1 || Math.abs(dy) != 1) return false;
//     return true;
//   }
// }


/**
 * Chinese Chess
 */
export class ChineseChess {

}

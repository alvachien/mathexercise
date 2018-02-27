// Another Chinese Chess implement
// Based on https://github.com/dengl11/ChineseChessAI/
// 

export class Piece {

  name: string;
  position: [number, number]; // (row, column)

  constructor(name, position) {
    this.name = name;
    this.position = position;
  }


  moveTo(newPos) {
    this.position = newPos;
  }

  // return a copy of a piece
  copy() {
    return new Piece(this.name, this.position);
  }
}

export class DummyPiece extends Piece {

  constructor(position) {
      super('', position);
  }
}

export class InitGame {
  static getRedPieces() {
    return [
        new Piece('j1', [1, 1]),
        new Piece('j2', [1, 9]),
        new Piece('p1', [3, 2]),
        new Piece('p2', [3, 8]),
        new Piece('m1', [1, 2]),
        new Piece('m2', [1, 8]),
        new Piece('x1', [1, 3]),
        new Piece('x2', [1, 7]),
        new Piece('s1', [1, 4]),
        new Piece('s2', [1, 6]),
        new Piece('z1', [4, 1]),
        new Piece('z2', [4, 3]),
        new Piece('z3', [4, 5]),
        new Piece('z4', [4, 7]),
        new Piece('z5', [4, 9]),
        new Piece('k', [1, 5])
    ];
  }

  static getBlackPieces() {
    return [
        new Piece('j1', [10, 1]),
        new Piece('j2', [10, 9]),
        new Piece('p1', [8, 2]),
        new Piece('p2', [8, 8]),
        new Piece('m1', [10, 2]),
        new Piece('m2', [10, 8]),
        new Piece('x1', [10, 3]),
        new Piece('x2', [10, 7]),
        new Piece('s1', [10, 4]),
        new Piece('s2', [10, 6]),
        new Piece('z1', [7, 1]),
        new Piece('z2', [7, 3]),
        new Piece('z3', [7, 5]),
        new Piece('z4', [7, 7]),
        new Piece('z5', [7, 9]),
        new Piece('k', [10, 5])
    ];
  }
}

export class Rule {
  static minRow = 1;
  static maxRow = 10;
  static minCol = 1;
  static maxCol = 9;

  static hasPieceOnRows(col, minRow, maxRow, boardStates: {}) {
      for (var i = minRow; i <= maxRow; i++) {
          if (boardStates[[i, col].toString()]) return true;
      }
      return false;
  }

  static numPieceOnRows(col, minRow, maxRow, boardStates) {
      var r = 0;
      for (var i = minRow; i <= maxRow; i++) {
          if (boardStates[[i, col].toString()]) r += 1;
      }
      return r;
  }

  // return moves within board range and escape positions occupied by own team
  // boardStates: {posStr->[name, isMyPiece]}
  static filterBoundedMoves(currRow, currCol, moves, boardStates) {
      // filter out invalied move
      return moves.filter(m => (
          (m[0] != currRow || m[1] != currCol) &&
          m[0] >= this.minRow &&
          m[0] <= this.maxRow &&
          m[1] <= this.maxCol &&
          m[1] >= this.minCol &&
          !(m.toString() in boardStates && boardStates[m.toString()][1])
      ))
  }

  static movesOnSameLine(currRow, currCol, boardStates) {
      var moves = [];
      for (var i = currRow + 1; i <= this.maxRow; i++) {
          var k = [i, currCol].toString();
          if (k in boardStates) {
              if (!boardStates[k][1]) moves.push([i, currCol]);
              break;
          }
          moves.push([i, currCol]);
      }
      for (var j = currRow - 1; j >= this.minRow; j--) {
          var k = [j, currCol].toString();
          if (k in boardStates) {
              if (!boardStates[k][1]) moves.push([j, currCol]);
              break;
          }
          moves.push([j, currCol]);
      }
      for (var i = currCol + 1; i <= this.maxCol; i++) {
          var k = [currRow, i].toString();
          if (k in boardStates) {
              if (!boardStates[k][1]) moves.push([currRow, i]);
              break;
          }
          moves.push([currRow, i]);
      }
      for (var j = currCol - 1; j >= this.minCol; j--) {
          var k = [currRow, j].toString();
          if (k in boardStates) {
              if (!boardStates[k][1]) moves.push([currRow, j]);
              break;
          }
          moves.push([currRow, j]);
      }
      return moves;
  }

  // Ju
  static possibleMovesForJu(currRow, currCol, boardStates) {
      return this.movesOnSameLine(currRow, currCol, boardStates);
  }

  // Ma
  static possibleMovesForMa(currRow, currCol, boardStates) {
      var moves = [];
      if (!([currRow + 1, currCol].toString() in boardStates)) {
          moves.push([currRow + 2, currCol + 1]);
          moves.push([currRow + 2, currCol - 1]);
      }
      if (!([currRow - 1, currCol].toString() in boardStates)) {
          moves.push([currRow - 2, currCol + 1]);
          moves.push([currRow - 2, currCol - 1]);
      }
      if (!([currRow, currCol + 1].toString() in boardStates)) {
          moves.push([currRow + 1, currCol + 2]);
          moves.push([currRow - 1, currCol + 2]);
      }
      if (!([currRow, currCol - 1].toString() in boardStates)) {
          moves.push([currRow + 1, currCol - 2]);
          moves.push([currRow - 1, currCol - 2]);
      }
      return moves;
  }

  static findFirstOpponentOnRow(row, startCol, states, team, incFn) {
      while (startCol >= this.minCol && startCol <= this.maxCol) {
          var k = [row, startCol].toString();
          if (k in states) {
              if (states[k][1]) return;
              else return [row, startCol];
          }
          startCol = incFn(startCol);
      }
  }
  static findFirstOpponentOnCol(col, startRow, states, team, incFn) {
      while (startRow >= this.minRow && startRow <= this.maxRow) {
          var k = [startRow, col].toString();
          if (k in states) {
              if (states[k][1]) return;
              else return [startRow, col];
          }
          startRow = incFn(startRow);
      }
  }

  // Pao
  static possibleMovesForPao(currRow, currCol, boardStates, team) {
      var inc = (x => x + 1);
      var dec = (x => x - 1);
      var moves = [];
      for (var i = currRow + 1; i <= this.maxRow; i++) {
          var k = [i, currCol].toString();
          if (k in boardStates) {
              var next = this.findFirstOpponentOnCol(currCol, i + 1, boardStates, team, inc);
              if (next) moves.push(next);
              break;
          }
          moves.push([i, currCol]);
      }
      for (var j = currRow - 1; j >= this.minRow; j--) {
          var k = [j, currCol].toString();
          if (k in boardStates) {
              var next = this.findFirstOpponentOnCol(currCol, j - 1, boardStates, team, dec);
              if (next) moves.push(next);
              break;
          }
          moves.push([j, currCol]);
      }
      for (var i = currCol + 1; i <= this.maxCol; i++) {
          var k = [currRow, i].toString();
          if (k in boardStates) {
              var next = this.findFirstOpponentOnRow(currRow, i + 1, boardStates, team, inc);
              if (next) moves.push(next);
              break;
          }
          moves.push([currRow, i]);
      }
      for (var j = currCol - 1; j >= this.minCol; j--) {
          var k = [currRow, j].toString();
          if (k in boardStates) {
              var next = this.findFirstOpponentOnRow(currRow, j - 1, boardStates, team, dec);
              if (next) moves.push(next);
              break;
          }
          moves.push([currRow, j]);
      }
      return moves;
  }

  // Shi
  static possibleMovesForShi(currRow, currCol, boardStates, isLowerTeam) {
      var moves = [];
      if (2 == currRow || currRow == 9) { // in the center
          moves = [
              [currRow - 1, currCol + 1],
              [currRow - 1, currCol - 1],
              [currRow + 1, currCol + 1],
              [currRow + 1, currCol - 1]
          ];
      } else {
          moves = isLowerTeam ? [[2, 5]] : [[9, 5]];
      }
      return moves;
  }

  // King
  static possibleMovesForKing(currRow, currCol, boardStates) {
      var moves = [];
      for (var col = 4; col <= 6; col++)  moves.push([currRow, col]);
      if (currRow < 5) {
          for (var row = 1; row <= 3; row++) moves.push([row, currCol]);
      }
      else {
          for (var row = 8; row <= 10; row++) moves.push([row, currCol]);
      }
      return moves.filter(x => ((x[0] - currRow) * (x[0] - currRow) + (x[1] - currCol) * (x[1] - currCol)) < 2);
  }

  // Xiang
  static possibleMovesForXiang(currRow, currCol, boardStates, isLowerTeam) {
      var moves = [];
      var canMoveDowward = (isLowerTeam || currRow >= 8);
      var canMoveUpward = (currRow <= 3 || !isLowerTeam);
      if (canMoveUpward && !([currRow + 1, currCol + 1].toString() in boardStates)) moves.push([currRow + 2, currCol + 2]);
      if (canMoveUpward && !([currRow + 1, currCol - 1].toString() in boardStates)) moves.push([currRow + 2, currCol - 2]);
      if (canMoveDowward && !([currRow - 1, currCol + 1].toString() in boardStates)) moves.push([currRow - 2, currCol + 2]);
      if (canMoveDowward && !([currRow - 1, currCol - 1].toString() in boardStates)) moves.push([currRow - 2, currCol - 2]);
      return moves;
  }

  // Zu
  static possibleMovesForZu(currRow, currCol, boardStates, isLowerTeam) {
      var beyond = isLowerTeam ? (currRow > 5) : (currRow <= 5); //beyond the river
      var moves = isLowerTeam ? [[currRow + 1, currCol]] : [[currRow - 1, currCol]];
      if (beyond) {
          moves.push([currRow, currCol - 1]);
          moves.push([currRow, currCol + 1]);
      }
      return moves;
  }

  // all legal moves for a piece in a board state
  // boardStates: {posStr->[name, isMyPiece]}
  // return [(row, col)]
  static possibleMoves = function(piece: Piece, boardStates: {}, isLowerTeam) {
      var name = piece.name[0];
      var currRow = piece.position[0];
      var currCol = piece.position[1];
      var moves = [];

      switch (name) {
          case 'j':
              moves = this.possibleMovesForJu(currRow, currCol, boardStates);
              break
          case 'm':
              moves = this.possibleMovesForMa(currRow, currCol, boardStates);
              break
          case 'x':
              moves = this.possibleMovesForXiang(currRow, currCol, boardStates, isLowerTeam);
              break
          case 's':
              moves = this.possibleMovesForShi(currRow, currCol, boardStates, isLowerTeam);
              break
          case 'k':
              moves = this.possibleMovesForKing(currRow, currCol, boardStates);
              break
          case 'p':
              moves = this.possibleMovesForPao(currRow, currCol, boardStates);
              break
          case 'z':
              moves = this.possibleMovesForZu(currRow, currCol, boardStates, isLowerTeam);
              break
      }
      // console.log(piece.name, moves);
      moves = this.filterBoundedMoves(currRow, currCol, moves, boardStates);
      return moves;
  }

  // return a list of all possible moves
  // boardStates: {posStr->[name, isMyPiece]}
  static allPossibleMoves = function(myPieces: Piece[], boardStates: {}, team) {
      var moves = {};
      // team is in the lower part of the river
      var isLowerTeam = (team == 1);
      for (var i in myPieces) {
          var piece = myPieces[i];
          var moves4Piece = this.possibleMoves(piece, boardStates, isLowerTeam);
          // console.log("moves4Piece", piece.name, moves4Piece)
          // if (!moves4Piece || moves4Piece.length == 0) continue;
          moves[piece.name] = moves4Piece;
      }
      return moves;
  }

  // @param: return
  // 0: not end
  // 1: Win
  // -1: Lase
  // {posStr->[name, isMyPiece]}
  static getGameEndState = function(agent) {
      var myPieces: Piece[] = agent.myPieces;
      var oppoPieces: Piece[] = agent.oppoPieces;
      var boardState = agent.boardState;
      return this.getGameEndStateByState(myPieces, oppoPieces, boardState, agent.team)

  }

  static getGameEndStateByState = function(myPieces: Piece[], oppoPieces: Piece[], boardState, team) {
      var myKing = myPieces.filter(x => x.name == 'k')[0];
      var oppoKing = oppoPieces.filter(x => x.name == 'k')[0];
      if (!myKing) return -1;
      if (!oppoKing) return 1;
      var myKingCol = myKing.position[1];
      // not on the same col
      if (myKingCol != oppoKing.position[1]) return 0;
      if (team == 1) {
          var minRow = myKing.position[0] + 1;
          var maxRow = oppoKing.position[0] - 1;
      } else {
          var minRow = oppoKing.position[0] + 1;
          var maxRow = myKing.position[0] - 1;
      }
      if (this.hasPieceOnRows(myKingCol, minRow, maxRow, boardState)) return 0;
      return 1;
  }
}

export class Agent {
    team: number;
    strategy: number = 0;
    legalMoves: {}; // name->[positions]
    pastMoves = [];
    myPieces: Piece[];
    oppoPieces: Piece[];
    oppoAgent: Agent;
    // myPiecesDic: {}; // {name -> pos}
    boardState: {}; // {posStr->[name, isMyPiece]}

    DEPTH = 0;


    constructor(team: number, myPieces = null, pastMoves = [], strategy = 0) {
        this.team = team;
        if (myPieces == null)
            this.myPieces = (team == 1 ? InitGame.getRedPieces() : InitGame.getBlackPieces());
        else {
            this.myPieces = myPieces;
        }
        this.pastMoves = pastMoves;
        this.strategy = strategy;
        // console.log("Agent")
    }
    setOppoAgent(oppoAgent) {
        this.oppoAgent = oppoAgent;
        this.oppoPieces = oppoAgent.myPieces;
        this.updateState();
    }
    // return | 1:win | -1:lose | 0:continue
    updateState() {
        this.updateBoardState();
        this.computeLegalMoves();
    }

    // compute legals moves for my pieces after state updated
    computeLegalMoves() {
        this.legalMoves = Rule.allPossibleMoves(this.myPieces, this.boardState, this.team);
    }

    // update board state by pieces
    updateBoardState() {
        var state = {};
        for (var i in this.myPieces) state[this.myPieces[i].position.toString()] = [this.myPieces[i].name, true];
        for (var i in this.oppoPieces) state[this.oppoPieces[i].position.toString()] = [this.oppoPieces[i].name, false];
        this.boardState = state;
    }

    movePieceTo(piece: Piece, pos, isCapture = undefined) {
        piece.moveTo(pos);
        this.addMove(piece.name, pos);
        if (isCapture == undefined) isCapture = this.oppoPieces.filter(x => x.position + '' == pos + '').length > 0;
        // having oppo piece in target pos
        if (isCapture) this.captureOppoPiece(pos);
    }

    // capture piece of opponent
    // pos: position of piece to be captured
    captureOppoPiece(pos) {
        for (var i = 0; i < this.oppoPieces.length; i++) {
            if (this.oppoPieces[i].position + '' == pos + '') {
                this.oppoPieces.splice(i, 1); // remove piece from pieces
                return;
            }
        }
    }

    // add move to pastMoves
    addMove(pieceName, pos) {
        this.pastMoves.push({ "name": pieceName, "position": pos });
    }

    // agent take action
    nextMove() {
        var computeResult = this.comptuteNextMove();
        var piece = computeResult[0];
        var toPos = computeResult[1];
        this.movePieceTo(piece, toPos);
    };

    // TO BE IMPLEMENTED BY CHILD CLASS
    // return: [piece, toPos]
    comptuteNextMove() { alert("YOU SHOULD NOT CALL THIS!") }

    getPieceByName(name) {
        return this.myPieces.filter(x => x.name == name)[0];
    }

    // TO BE OVERIDE BY TDLeaner
    update_weights(nSimulations, result) { return []; }
    // TO BE OVERIDE BY TDLeaner
    save_state(feature_vec) { }
    copy() {
        return new Agent(this.team, this.myPieces.map(x => x.copy()), this.copyMoves());
    }

    copyMoves() {
        return this.pastMoves.slice();
    }
}

export class HumanAgent extends Agent {
}

export class State {
    redAgent: Agent;
    blackAgent: Agent;
    playingTeam: number;
    endFlag = null; // null: on going | 1: red win | -1: black win | 0: draw

    constructor(redAgent: Agent, blacAgent: Agent, playingTeam = 1, setOppoo = true) {
        this.redAgent = redAgent;
        this.blackAgent = blacAgent;
        this.playingTeam = playingTeam;
        if (setOppoo) {
            this.blackAgent.setOppoAgent(this.redAgent);
            this.redAgent.setOppoAgent(this.blackAgent);
        }
    }

    // TDlearning
    learn(nSimulations) {
        this.redAgent.update_weights(nSimulations, this.endFlag);
        this.blackAgent.update_weights(nSimulations, this.endFlag);
    }
    record_feature(feature_vec) {
        // console.log("record_feature")
        this.redAgent.save_state(feature_vec);
        this.blackAgent.save_state(feature_vec);
    }

    // return | 1:win | -1:lose | 0:continue for playing team
    getEndState() {
        var playing = this.playingTeam == 1 ? this.redAgent : this.blackAgent;
        var endState = Rule.getGameEndState(playing);
        return endState;
    }
    // return a copy of state
    copy(setOppoo = true) {
        var newState = new State(this.redAgent.copy(), this.blackAgent.copy(), this.playingTeam, setOppoo);
        return newState;
    }

    // // return next state by action
    // next_state(movePieceName, toPos) {
    //     // make a copy a state
    //     var nextState = this.copy();
    //     nextState.switchTurn();
    //     var agent = this.playingTeam == 1 ? nextState.redAgent : nextState.blackAgent;
    //     agent.movePieceTo(agent.getPieceByName(movePieceName), toPos);
    //     agent.updateState();
    //     agent.oppoAgent.updateState();
    //     return nextState;
    // }

    switchTurn() {
        this.playingTeam = -this.playingTeam;
    }
    // return a evaluation score for this state
    getEvaludation(team) {

    }
}

export class Evaluation {

    static pieceValues = {
        'k': 6000,
        's': 120,
        'x': 120,
        'j': 600,
        'm': 270,
        'p': 285,
        'z': 30
    };

    static posValues = {
        'j': [
            [-2, 10, 6, 14, 12, 14, 6, 10, -2],
            [8, 4, 8, 16, 8, 16, 8, 4, 8],
            [4, 8, 6, 14, 12, 14, 6, 8, 4],
            [6, 10, 8, 14, 14, 14, 8, 10, 6],
            [12, 16, 14, 20, 20, 20, 14, 16, 12],
            [12, 14, 12, 18, 18, 18, 12, 14, 12],
            [12, 18, 16, 22, 22, 22, 16, 18, 12],
            [12, 12, 12, 18, 18, 18, 12, 12, 12],
            [16, 20, 18, 24, 26, 24, 18, 20, 16],
            [14, 14, 12, 18, 16, 18, 12, 14, 14]
        ],
        'j-1': [
            [14, 14, 12, 18, 16, 18, 12, 14, 14],
            [16, 20, 18, 24, 26, 24, 18, 20, 16],
            [12, 12, 12, 18, 18, 18, 12, 12, 12],
            [12, 18, 16, 22, 22, 22, 16, 18, 12],
            [12, 14, 12, 18, 18, 18, 12, 14, 12],
            [12, 16, 14, 20, 20, 20, 14, 16, 12],
            [6, 10, 8, 14, 14, 14, 8, 10, 6],
            [4, 8, 6, 14, 12, 14, 6, 8, 4],
            [8, 4, 8, 16, 8, 16, 8, 4, 8],
            [-2, 10, 6, 14, 12, 14, 6, 10, -2]
        ],
        'm': [
            [0, -4, 0, 0, 0, 0, 0, -4, 0],
            [0, 2, 4, 4, -2, 4, 4, 2, 0],
            [4, 2, 8, 8, 4, 8, 8, 2, 4],
            [2, 6, 8, 6, 10, 6, 8, 6, 2],
            [4, 12, 16, 14, 12, 14, 16, 12, 4],
            [6, 16, 14, 18, 16, 18, 14, 16, 6],
            [8, 24, 18, 24, 20, 24, 18, 24, 8],
            [12, 14, 16, 20, 18, 20, 16, 14, 12],
            [4, 10, 28, 16, 8, 16, 28, 10, 4],
            [4, 8, 16, 12, 4, 12, 16, 8, 4]
        ],
        'm-1': [
            [4, 8, 16, 12, 4, 12, 16, 8, 4],
            [4, 10, 28, 16, 8, 16, 28, 10, 4],
            [12, 14, 16, 20, 18, 20, 16, 14, 12],
            [8, 24, 18, 24, 20, 24, 18, 24, 8],
            [6, 16, 14, 18, 16, 18, 14, 16, 6],
            [4, 12, 16, 14, 12, 14, 16, 12, 4],
            [2, 6, 8, 6, 10, 6, 8, 6, 2],
            [4, 2, 8, 8, 4, 8, 8, 2, 4],
            [0, 2, 4, 4, -2, 4, 4, 2, 0],
            [0, -4, 0, 0, 0, 0, 0, -4, 0]
        ],
        'p': [
            [0, 0, 2, 6, 6, 6, 2, 0, 0],
            [0, 2, 4, 6, 6, 6, 4, 2, 0],
            [4, 0, 8, 6, 10, 6, 8, 0, 4],
            [0, 0, 0, 2, 4, 2, 0, 0, 0],
            [-2, 0, 4, 2, 6, 2, 4, 0, -2],
            [0, 0, 0, 2, 8, 2, 0, 0, 0],
            [0, 0, -2, 4, 10, 4, -2, 0, 0],
            [2, 2, 0, -10, -8, -10, 0, 2, 2],
            [2, 2, 0, -4, -14, -4, 0, 2, 2],
            [6, 4, 0, -10, -12, -10, 0, 4, 6]
        ],
        'p-1': [
            [6, 4, 0, -10, -12, -10, 0, 4, 6],
            [2, 2, 0, -4, -14, -4, 0, 2, 2],
            [2, 2, 0, -10, -8, -10, 0, 2, 2],
            [0, 0, -2, 4, 10, 4, -2, 0, 0],
            [0, 0, 0, 2, 8, 2, 0, 0, 0],
            [-2, 0, 4, 2, 6, 2, 4, 0, -2],
            [0, 0, 0, 2, 4, 2, 0, 0, 0],
            [4, 0, 8, 6, 10, 6, 8, 0, 4],
            [0, 2, 4, 6, 6, 6, 4, 2, 0],
            [0, 0, 2, 6, 6, 6, 2, 0, 0]
        ],
        'z': [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, -2, 0, 4, 0, -2, 0, 0],
            [2, 0, 8, 0, 8, 0, 8, 0, 2],
            [6, 12, 18, 18, 20, 18, 18, 12, 6],
            [10, 20, 30, 34, 40, 34, 30, 20, 10],
            [14, 26, 42, 60, 80, 60, 42, 26, 14],
            [18, 36, 56, 80, 120, 80, 56, 36, 18],
            [0, 3, 6, 9, 12, 9, 6, 3, 0]
        ],
        'z-1': [
            [0, 3, 6, 9, 12, 9, 6, 3, 0],
            [18, 36, 56, 80, 120, 80, 56, 36, 18],
            [14, 26, 42, 60, 80, 60, 42, 26, 14],
            [10, 20, 30, 34, 40, 34, 30, 20, 10],
            [6, 12, 18, 18, 20, 18, 18, 12, 6],
            [2, 0, 8, 0, 8, 0, 8, 0, 2],
            [0, 0, -2, 0, 4, 0, -2, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
    };

    // return value of piece
    static pieceValue(name) {
        return this.pieceValues[name[0]];
    }
    // return value of position: [row, col]
    static posValue(name, pos, team = 1) {
        var matrix = this.posValues[name[0] + team];
        if (!matrix) return 0;
        return matrix[pos[0] - 1][pos[1] - 1];
    }

}

export class EvalFnAgent extends Agent {

    DEPTH = 2;
    strategy = 1;

    constructor(team: number, depth = 2, myPieces = null, pastMoves = []) {
        // console.log("EvalFnAgent")
        super(team, myPieces, pastMoves);
        this.DEPTH = depth;
    }

    // return a copy of an agent
    copy() {
        return new EvalFnAgent(this.team, this.DEPTH, this.myPieces.map(x => x.copy()), this.copyMoves());
    }
}

export class GreedyAgent extends Agent {

    strategy = 0;
    DEPTH = 1;

    // private method of computing next move
    comptuteNextMove() {
        // var pieceNames = Object.keys(this.legalMoves);
        var piece;
        var maxVal = 0;
        var maxVal = -Infinity;
        var fromPos = [];
        var toPos = [];
        for (var i in this.myPieces) {
            var name = this.myPieces[i].name;
            var moves = this.legalMoves[name];
            for (var j in moves) {
                var move = moves[j];
                var value = this.getValueOfMove(name, move);
                fromPos = this.myPieces[i].position;
                if (value > maxVal) {
                    toPos = move;
                    piece = this.myPieces[i];
                    maxVal = value;
                }
            }
        }
        return [piece, toPos];
    }


    getValueOfMove(pieceName, toPos) {
        var piece = this.boardState[toPos.toString()];
        var posVal = Evaluation.posValue(pieceName, toPos);
        if (!piece) return posVal; // empty place
        if (piece[1]) alert("Bug");
        return Evaluation.pieceValue(piece[0]) + posVal;
    }


    // return a copy of an agent
    copy() {
        return new GreedyAgent(this.team, this.myPieces.map(x => x.copy()), this.copyMoves());
    }
}

export class MoveReorderPruner extends EvalFnAgent {

    strategy = 2

    constructor(team: number, depth = 2, myPieces = undefined, pastMoves = []) {
        super(team, depth, myPieces, pastMoves);
        this.DEPTH = depth;
    }

    copy() {
        return new MoveReorderPruner(this.team, this.DEPTH, this.myPieces.map(x => x.copy()), this.copyMoves());
    }
}

export class MCTS extends Agent {


    strategy = 5;
    N_SIMULATION;
    copy() {
        return new MCTS(this.team, this.N_SIMULATION, this.myPieces.map(x => x.copy()), this.pastMoves);
    }

    constructor(team: number, N, myPieces = undefined, pastMoves = []) {
        super(team, myPieces, pastMoves);
        this.N_SIMULATION = N;
    }
}

export class TDLearner extends EvalFnAgent {
    strategy = 3;
    weights = [];
    // INIT_WEIGHTS = [20, 15, 30, 7, 20, 0, 20];
    // INIT_WEIGHTS = [0, 0, 0, 0, 0, 0, 0];
    INIT_WEIGHTS = [5, 10, 2, 0, 2, 0, 10];
    feature_matrix = []; //[fea_vec]

    constructor(team: number, depth = 2, weights, myPieces = null, pastMoves = []) {
        super(team, depth, myPieces, pastMoves);
        this.weights = weights;
        // console.log(this.myPieces)
        // this.weights = weights ? weights : this.INIT_WEIGHTS;
    }

    copy() {
        // console.log(this.pastMoves)
        // console.log(this.copyMoves())
        return new TDLearner(this.team, this.DEPTH, this.weights, this.myPieces.map(x => x.copy()), this.copyMoves());
    }

    merge_arr(x, y) {
        var r = [];
        for (var i = 0; i < x.length; i++) r.push(x[i] + y[i]);
        return r;
    }


    // result: 1-red win | -1:red lose
    // [nThreat, nCapture, nCenterCannon, nBottomCannon, rook_mob, horse_mob, elephant_mob]
    update_weights(nSimulations, result) {
        if (result == 0) return this.weights;
        result *= this.team;
        // consolidate features vectors throught whole game into one
        // console.log("this.feature_matrix:", this.feature_matrix)
        var accu_fea = this.feature_matrix.reduce(this.merge_arr);
        accu_fea = accu_fea.map(x => x / this.feature_matrix.length)
        // var last_fea = this.feature_matrix[this.feature_matrix.length - 1];
        // var combined_fea = last_fea;
        // accu_fea = accu_fea.map(this.squash);
        // console.log("accu_fea:", accu_fea)
        // console.log("last_fea:", last_fea)
        // console.log("nSimulations:", nSimulations)
        var eta = 2 / Math.sqrt(nSimulations); // learning rate
        // console.log("eta:", eta)
        // var gradient = combined_fea.map(x => x * result);
        // console.log("gradient:", gradient)
        // console.log("this.weights:", this.weights)
        for (var i = 0; i < accu_fea.length; i++) {
            this.weights[i] += eta * result * (eta * accu_fea[i]);
            // this.weights[i] += eta * result * (10 * accu_fea[i] - this.weights[i] + 10 * last_fea[i]);
            // this.weights[i] += eta * (this.squash(gradient[i], this.weights[i]+1) - this.weights[i]);
            this.weights[i] = Math.min(Math.max(this.weights[i], 0), 20);
        }
        console.log("UPDATED WEIGHT:", this.weights)
        return this.weights;
    }

    squash(x, range = 20) { return (1 / (Math.exp(-x) + 1) - 0.5) * range; }

    save_state(feature_vec) {
        // console.log("save_state: ", feature_vec, " | Current: ", this.feature_matrix)
        this.feature_matrix.push(feature_vec);
    }

}

export class TDLearnerTrained extends EvalFnAgent {
    strategy = 4;

    copy() { return new TDLearnerTrained(this.team, this.DEPTH, this.myPieces.map(x => x.copy()), this.copyMoves()); }
}

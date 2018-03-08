import { Component, OnInit, AfterViewInit, HostListener,
  EventEmitter, Output, Input, } from '@angular/core';
import { State, Piece, DummyPiece, GreedyAgent, EvalFnAgent, MoveReorderPruner, TDLearner,
  TDLearnerTrained, MCTS, HumanAgent,  } from '../model/chinesechess3';
import { ChessAiService } from '../services';

@Component({
  selector: 'app-pg-chinese-chess2',
  templateUrl: './pg-chinese-chess2.component.html',
  styleUrls: ['./pg-chinese-chess2.component.scss']
})
export class PgChineseChess2Component implements OnInit {

  /***************** CONTROL *******************/
  redTeam = 1;
  blackTeam = -1;
  boardState = {}; // {postion => piece}  || NOT including dummy pieces
  state: State;
  // server: ComputeService;

  weigths_1 = [0, 0, 0, 0, 0, 0, 0];
  weigths_2 = [0, 0, 0, 0, 0, 0, 0];
  INIT_WEIGHT = [0, 0, 0, 0, 0, 0, 0];

  // Strategy
  private DEFAULT_TYPE = 0;
  redAgentType = 0;
  blackAgentType = 0;
  // DEPTH
  DEFAULT_DEPTH = 2;
  redAgentDepth = 2;
  blackAgentDepth = 2;
  blackAgentSimulations = 2000;
  redAgentSimulations = 2000;

  /***************** UI *******************/
  // keep track of all pieces, just for UI purpose (including dummy pieces)
  pieceSize = 67;
  selectedPiece: Piece;
  dummyPieces: DummyPiece[] = [];
  subscription: any;
  lastState: State;

  /***************** EVENT *******************/
  // new game result obtained
  @Output() onResultsUpdated = new EventEmitter<boolean>();
  // new runtime for move obtained
  @Output() onTimeUpdated = new EventEmitter<boolean>();
  // {"strategy-depth": [average_move_runtime, nMoves]}
  @Output() onWeightUpdated = new EventEmitter<boolean>();
  @Output() onClear = new EventEmitter<boolean>();
  // {"strategy-depth": [average_move_runtime, nMoves]}
  runtime_dict = {};

  /***************** ANALYSIS *******************/
  results = [];
  clear_results() {
    this.results = [];
    this.report_result();
    this.weigths_1 = this.INIT_WEIGHT;
    this.weigths_2 = this.INIT_WEIGHT;
  }


  isPossibleMove(pos) {
    if (!this.selectedPiece) {
      return false;
    }
    const moves = this.state.redAgent.legalMoves[this.selectedPiece.name];
    return moves.map(x => x + '').indexOf(pos + '') >= 0;
  }
  // Add dummy pieces to board
  initDummyButtons() {
    this.dummyPieces = [];
    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 9; j++) {
        this.dummyPieces.push(new DummyPiece([i, j]));
      }
    }
  }

  parse_agentType(desc) {
    if (desc === '') {
      return 0;
    }
    return parseInt(desc.split('-')[0], 10);
  }

  chooseRedAgent(desc) {
    this.onClear.emit();
    this.redAgentType = this.parse_agentType(desc);
  }
  chooseBlackAgent(desc) {
    this.onClear.emit();
    this.blackAgentType = this.parse_agentType(desc);
    this.clear_results();
    this.initGame();
  }
  chooseRedAgentDepth(depth) {
    this.redAgentDepth = parseInt(depth, 10);
  }
  chooseBlackAgentDepth(depth) {
    this.blackAgentDepth = parseInt(depth, 10);
    this.initGame();
  }

  chooseBlackSimulations(n) {
    this.blackAgentSimulations = parseInt(n, 10);
    this.initGame();
  }
  chooseRedSimulations(n) {
    this.redAgentSimulations = parseInt(n, 10);
  }

  /***************** LIFE_CYCLE *******************/
  ngOnInit() {
    this.initDummyButtons();
    this.initGame();
  }

  constructor(private server: ChessAiService) {
  }

  initGame() {
    this.selectedPiece = undefined;
    this.lastState = null;
    // init agents
    let redAgent;
    switch (this.redAgentType) {
      case 0: { redAgent = new GreedyAgent(this.redTeam); break; }
      case 1: { redAgent = new EvalFnAgent(this.redTeam, this.redAgentDepth); break; }

      case 2: { redAgent = new MoveReorderPruner(this.redTeam, this.redAgentDepth); break; }
      case 3: { redAgent = new TDLearner(this.redTeam, this.redAgentDepth, this.weigths_1); break; }
      // TDLearner
      case 4: { redAgent = new TDLearnerTrained(this.redTeam, this.redAgentDepth); break; }
      case 5: { redAgent = new MCTS(this.redTeam, this.redAgentSimulations); break; }
      case 6: { redAgent = new MoveReorderPruner(this.redTeam, this.redAgentDepth); break; }
      default: redAgent = new HumanAgent(this.redTeam); break;
    }
    let blackAgent;
    switch (this.blackAgentType) {
      case 0: { blackAgent = new GreedyAgent(this.blackTeam); break; }
      case 1: { blackAgent = new EvalFnAgent(this.blackTeam, this.blackAgentDepth); break; }

      case 2: { blackAgent = new MoveReorderPruner(this.blackTeam, this.blackAgentDepth); break; }
      case 3: { blackAgent = new TDLearner(this.blackTeam, this.blackAgentDepth, this.weigths_2); break; }
      case 4: { blackAgent = new TDLearnerTrained(this.blackTeam, this.blackAgentDepth); break; }
      // TDLearner
      case 5: { blackAgent = new MCTS(this.blackTeam, this.blackAgentSimulations); break; }
      case 6: { blackAgent = new MoveReorderPruner(this.blackTeam, this.blackAgentDepth); break; }
      default: blackAgent = new GreedyAgent(this.blackTeam); break;
    }
    this.state = new State(redAgent, blackAgent);
  }

  clickDummyPiece(piece: Piece) {
    if (!this.isPossibleMove(piece.position) || this.state.endFlag != null) {
      return;
    }
    this.humanMove(piece);
  }

  clickRedPiece(piece: Piece) {
    if (this.state.endFlag != null) {
      return;
    }
    this.selectedPiece = piece;
  }

  clickBlackPiece(piece: Piece) {
    if (!this.isPossibleMove(piece.position) || this.state.endFlag != null) {
      return;
    }
    this.humanMove(piece);
  }

  humanMove(piece: Piece) {
    // before human makes move, make a copy of current state
    this.copyCurrentState();
    this.state.redAgent.movePieceTo(this.selectedPiece, piece.position, true);
    this.switchTurn();
  }

  // end_state: -1: lose | 0: draw | 1: win
  end_game(end_state) {
    const red_win = end_state * this.state.playingTeam;
    // update state for end state
    this.state.endFlag = red_win;
    this.results.push(red_win);
    this.report_result();
    this.weigths_1 = this.state.redAgent.update_weights(this.results.length, red_win);
    this.weigths_2 = this.state.blackAgent.update_weights(this.results.length, red_win);
    this.selectedPiece = undefined;
  }

  // report results
  report_result() {
    this.onResultsUpdated.emit();
    this.onWeightUpdated.emit();
  }
  report_runtime(strategy, depth, time) {
    const type = this.runtime_dict[strategy + '-' + depth];
    if (!type) {
      this.runtime_dict[strategy + '-' + depth] = [time, 1];
    } else {
      const new_num = type[1] + 1;
      this.runtime_dict[strategy + '-' + depth] = [Math.ceil((type[0] * type[1] + time) / new_num), new_num]
    }
    this.onTimeUpdated.emit();
  }

  // switch game turn
  switchTurn() {
    // update playing team
    this.state.switchTurn();
    const agent = (this.state.playingTeam === 1 ? this.state.redAgent : this.state.blackAgent);
    agent.updateState();
    // agent.nextMove();
    const endState = this.state.getEndState();
    if (endState !== 0) {
      this.end_game(endState);
      return;
    }

    this.selectedPiece = undefined;
    // if human's turn, return
    if (this.state.playingTeam === 1) {
      return;
    }

    // this.switchTurn();
    // TBD!!!
    this.server.launchCompute(this.state.copy(false)).subscribe((result) => {
      const move = result['move'];
      const time = parseInt(result['time'], 10);
      const state_feature = result['state_feature'];
      if (time) {
        this.report_runtime(agent.strategy, (agent instanceof MCTS ? agent.N_SIMULATION : agent.DEPTH), time)
      }
      if (state_feature) {
        agent.save_state(state_feature);
      }

      if (!move) { // FAIL
        this.end_game(-1);
        return;
      }

      if (move.length === 0) { // DRAW
        this.end_game(0);
        return;
      }

      const piece = agent.getPieceByName(move[0].name);
      agent.movePieceTo(piece, move[1]);
      this.switchTurn();
    });
  }

  // reverse game state to previous state
  go2PreviousState() {
    if (!this.lastState) {
      return;
    }
    this.state = this.lastState;
    this.lastState = null;
  }

  copyCurrentState() {
    this.lastState = this.state.copy();
  }
}

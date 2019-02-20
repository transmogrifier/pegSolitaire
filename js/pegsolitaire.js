/** Peg class */
class Peg {
  /** Constructor function for Peg
   * @param {number} row Row number of the peg
   * @param {number} col Column number of the peg
   * @param {string} id  ID of the peg
   * @param {number} index Index number of the peg
   * @param {bool} isEmpty Is the peg empty
  */
  constructor(row, col, id, index, isEmpty) {
    this.isEmpty = isEmpty;
    this.row = row;
    this.col = col;
    this.id = id;
    this.index = index;
  }
}

/** Board class */
class Board {
  /** Constructor for Board class */
  constructor() {
    this.boardType = 'Triangle';
    this.numPegs = 0;
    this.pegs = [];
    this.moveFrom = -1;
    this.moveTo = -1;
  }

  /** Sets the Pegs when the board is instantiated */
  setPegs() {
    this.pegs = [];
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    switch (this.boardType) {
      case 'Triangle':
      default:
        // Defines a triangular board with 5 pegs per side
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j <= i; j++) {
            const id = alphabet[j] + i.toString();
            const index = (i*(i + 1)/2) + j;
            if (i === 0 && j === 0) {
              // Set top corner as empty
              this.pegs.push(new Peg(i, j, id, index, true));
            } else {
              // Set all other pegs as occupied
              this.pegs.push(new Peg(i, j, id, index, false));
            }
            this.numPegs++;
          }
        }
        break;
    }
    return;
  }

  /** Render the HTML for the board */
  makeHtml() {
    const gameBoard = $('#game-board'); // Get the game-board div
    gameBoard.svg(); // Attach svg canvas
    const svg = gameBoard.svg('get'); // Get the svg canvas
    // Inline svg will occupy container width, so no need to set width and
    // height attributes here.
    svg.configure({viewBox: '0 0 160 144'}, true);
    const grp = svg.group('theBoard');
    switch (this.boardType) {
      case 'Triangle':
      default:
        const pitchX = 30;
        const pitchY = 26; // (pitchY/pitchX = sin(60deg))
        const radius = 10;
        for (let i=0; i<this.numPegs; i++) {
          const curPeg = this.pegs[i];
          const left = 80 - (pitchX/2)*curPeg.row;
          const cy = 20 + pitchY*curPeg.row;
          const cx = left + pitchX*curPeg.col;
          // const curCircle = $('<circle></circle>');
          const pegState = curPeg.isEmpty ? 'empty':'occupied';
          const pegId = curPeg.id;
          const txtId = pegId +'-txt';
          const pegIndex = curPeg.index;
          svg.circle(grp, cx, cy, radius,
              {id: pegId, index: pegIndex, state: pegState});
          svg.text(grp, cx, cy, pegId,
              {id: txtId, index: pegIndex, state: pegState,
                stroke: 'white', textAnchor: 'middle'});
        }
        break;
    }
    const movesLog = $('<p></p>');
    movesLog.attr('id', 'move-log');
    movesLog.text('Moves:');
    gameBoard.append(movesLog);
  }

  /** Make a move.
  * @return {object} result Result of the move with status
  */
  makeMove() {
    const result =
    {
      movedFrom: '',
      movedTo: '',
      removed: '',
      status: '',
      msg: '',
    };
    if (this.moveFrom >= 0 && this.moveTo >= 0) {
      const nP1 = this.moveFrom;
      const nP2 = this.moveTo;
      const peg1 = this.pegs[nP1];
      const peg2 = this.pegs[nP2];
      result.movedFrom = peg1.id;
      result.movedTo = peg2.id;
      if (!peg1.isEmpty && peg2.isEmpty) {
        // Check if a valid move can be made
        let iRow = -1;
        let iCol = -1;
        if ((Math.abs(peg1.row - peg2.row) === 2 ||
                    (peg1.row - peg2.row) === 0) &&
                    (Math.abs(peg1.col - peg2.col) === 2 ||
                        (peg1.col - peg2.col) === 0)) {
          iRow = (peg1.row + peg2.row)/2;
          iCol = (peg1.col + peg2.col)/2;
        }
        if (iRow >= 0 && iCol >= 0) {
          // Check if intermediate peg is filled
          const iPegIndex = (iRow*(iRow + 1)/2) + iCol;
          if (!this.pegs[iPegIndex].isEmpty) {
            // Make the valid move
            this.pegs[nP1].isEmpty = true;
            this.pegs[nP2].isEmpty = false;
            this.pegs[iPegIndex].isEmpty = true;
            result.removed = this.pegs[iPegIndex].id;
            result.status = 'success';
            result.msg = result.movedFrom + ' - ' +
                                     result.movedTo + '; removed ' +
                                     result.removed;
          } else {
            result.status = 'error';
            result.msg = 'Invalid move';
          }
        } else {
          result.status = 'error';
          result.msg = 'Invalid move';
        }
      } else {
        result.status = 'error';
        result.msg = 'Invalid move';
      }
    } else {
      result.status = 'error';
      result.msg = 'Nothing selected.';
    }
    return result;
  }
}


//Peg, has 2 coordinates and a state
function Peg(row, col, isEmpty){
  this.isEmpty = isEmpty;
  this.row = row;
  this.col = col;
}

function Board(){
    this.boardType = 'Triangle';
    this.numPegs = 0;
    this.pegs = this.getPegs();
    this.html = this.make_html();
}

Board.prototype = {
    getPegs: function(){
        pegs = [];
        switch(this.boardType){
            case 'Triangle':
            default:
                //Defines a triangular board with 5 pegs per side
                for(i = 0; i < 5; i++){
                  for(j = 0; j <= i; j++){
                    if (i === 0 && j === 0){
                        //Set top corner as empty
                        pegs.push(new Peg(i,j,true));
                    } else{
                        //Set all other pegs as occupied
                        pegs.push(new Peg(i,j,false));
                    }
                    this.numPegs++;
                  }
                }
                break;
        }
        return pegs;
    },

    make_html: function(){
        var gameBoard = $("<div></div>"); //Create new div
        gameBoard.attr("class", "container-fluid"); //Set Bootstrap class
        gameBoard.attr("id","game-board"); //Set id
        gameBoard.svg(); //Attach svg canvas
        var svg = gameBoard.svg("get"); //Get the svg canvas
        svg.configure({width: 200, height: 200}, false);

        switch(this.boardType){
            case 'Triangle':
            default:
                var alphabet = 'abcdefghijklmnopqrstuvwxyz'
                var pitchX = 40;
                var pitchY = 25;
                var radius = 10;
                for (i=0; i<this.numPegs; i++){
                  var curPeg = this.pegs[i];
                  var left = 100 - 20*curPeg.row;
                  var cy = 50 + pitchY*curPeg.row;
                  var cx = left + pitchX*curPeg.col;
                  var curCircle = $('<circle></circle>');
                  var pegState = curPeg.isEmpty ? 'empty':'occupied';
                  var pegId = alphabet[curPeg.col] + curPeg.col.toString();
                  var txtId = pegId +'-txt';
                  svg.circle(cx,cy,radius,{id:pegId, state:pegState});
                  svg.text(cx,cy,pegId,
                           {id:txtId, state:pegState, stroke:'white', textAnchor:'middle'});
                }
                break;
        }
        return gameBoard;
    },

    make_a_move: function(move){
        var result = "err: ";
        var alphabet = "abcdefghijklmnopqrstuvwxyz";
        if ("string" === typeof move){
            var mPegs = move.split("-");
            var p1 = mPegs.shift().trim();
            p1 = p1.toLowerCase();
            while (mPegs.length > 0){
                var p2 = mPegs.shit().trim();
                p2 = p2.toLowerCase();
                var nP1 = get_peg_index(p1);
                var nP2 = get_peg_index(p2);
                var peg1 = this.pegs[nP1];
                var peg2 = this.pegs[nP2];
                if (!peg1.isEmpty && peg2.isEmpty){
                    //Check if a valid move can be made
                    var iRow = -1;
                    var iCol = -1;
                    if ((peg1.row === peg2.row) &&
                        (Math.abs(peg1.col - peg2.col) === 2)){
                        iRow = peg1.row;
                        iCol = (peg1.col + peg2.col)/2;
                    } else if ((peg1.col === peg2.col) &&
                               (Math.abs(peg1.row - peg2.row) === 2)){
                        iRow = (peg1.row + peg2.row)/2;
                        iCol = peg1.col;
                    } else if ((Math.abs(peg1.col - peg2.col) === 2) &&
                               (Math.abs(peg1.row - peg2.row) === 2)){
                        iRow = (peg1.row + peg2.row)/2;
                        iCol = (peg1.col + peg2.col)/2;
                    }
                    if (iRow >= 0 && iCol >= 0){
                        //Check if intermediate peg is filled
                        var iPegIndex = (iRow*(iRow + 1)/2) + iCol;
                        if (!this.pegs[iPegIndex].isEmpty){
                            //Make the valid move
                            this.pegs[nP1].isEmpty = true;
                            this.pegs[nP2].isEmpty = false;
                            this.pegs[iPegIndex].isEmpty = true;
                        } else{
                            result = "err: Invalid move";
                            break;
                        }
                    } else {
                        result = "err: Invalid move";
                        break;
                    }
                } else {
                    result = "err: Invalid move";
                    break;
                }
            }
        }
        return result;
    },

    get_peg_index: function(pegId){
        var alphabet = "abcdefghijklmnopqrstuvwxyz";
        var result = -1;
        if (("string" === typeOf pegId) && pegId.length === 2){
            var row = parseInt(pegId[1]);
            var col = alphabet.indexOf(pegId[0]);
            var pegIndex = (row*(row + 1)/2) + col;
            if (pegIndex < this.numPegs){
                result = pegIndex;
            }
        }
        return result;
    },

    get_intermediate_peg_index: function(pegFrom, pegTo){
      var alphabet = "abcdefghijklmnopqrstuvwxyz";
      var result = -1;
      if (pegFrom >= 0 && pegFrom < this.numPegs && pegTo >= 0 &&
          pegTo < this.numPegs){
            var peg1 = this.pegs[pegFrom];
            var peg2 = this.pegs[pegTo];

      }
    }

}

$(document).ready( function(){
  //Toggle rules when rules heading is clicked
  $("#rules").on('click', function(){
      console.log("Rules button clicked.");
      $("#rulestext").toggle();
  });

  $("#new-game").on('click', function(){
      var myBoard = new Board();
      $("body").append(myBoard.html);
  });
});

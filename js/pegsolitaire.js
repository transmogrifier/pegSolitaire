//Peg, has 2 coordinates and a state
function Peg(row, col, id, index, isEmpty){
    this.isEmpty = isEmpty;
    this.row = row;
    this.col = col;
    this.id = id;
    this.index = index;
}

//Game board
function Board(){
    this.boardType = 'Triangle';
    this.numPegs = 0;
    this.pegs = [];
    this.moveFrom = -1;
    this.moveTo = -1;
}

Board.prototype = {
    setPegs: function(){
        this.pegs = [];
        var alphabet = 'abcdefghijklmnopqrstuvwxyz'
        switch(this.boardType){
            case 'Triangle':
            default:
                //Defines a triangular board with 5 pegs per side
                for(i = 0; i < 5; i++){
                  for(j = 0; j <= i; j++){
                    var id = alphabet[j] + i.toString();
                    var index = (i*(i + 1)/2) + j;
                    if (i === 0 && j === 0){
                        //Set top corner as empty
                        this.pegs.push(new Peg(i, j, id, index, true));
                    } else{
                        //Set all other pegs as occupied
                        this.pegs.push(new Peg(i, j, id, index, false));
                    }
                    this.numPegs++;
                  }
                }
                break;
        }
        return;
    },

    make_html: function(){
        var gameBoard = $("#game-board"); //Get the game-board div
        gameBoard.svg(); //Attach svg canvas
        var svg = gameBoard.svg("get"); //Get the svg canvas
        //Inline svg will occupy container width, so no need to set width and
        // height attributes here.
        svg.configure({viewBox: '0 0 160 144'}, true);
        var grp = svg.group('theBoard');
        switch(this.boardType){
            case 'Triangle':
            default:
                var pitchX = 30;
                var pitchY = 26; //(pitchY/pitchX = sin(60deg))
                var radius = 10;
                for (i=0; i<this.numPegs; i++){
                  var curPeg = this.pegs[i];
                  var left = 80 - (pitchX/2)*curPeg.row;
                  var cy = 20 + pitchY*curPeg.row;
                  var cx = left + pitchX*curPeg.col;
                  var curCircle = $('<circle></circle>');
                  var pegState = curPeg.isEmpty ? 'empty':'occupied';
                  var pegId = curPeg.id;
                  var txtId = pegId +'-txt';
                  var pegIndex = curPeg.index;
                  svg.circle(grp,cx,cy,radius,
                             {id:pegId, index: pegIndex, state:pegState});
                  svg.text(grp,cx,cy,pegId,
                           {id:txtId, index: pegIndex, state:pegState,
                            stroke:'white', textAnchor:'middle'});
                }
                break;
        }
        var movesLog = $("<p></p>")
        movesLog.attr("id", "move-log");
        movesLog.text("Moves:");
        gameBoard.append(movesLog);
    },

    make_a_move: function(){
        var result = {movedFrom:'', movedTo:'', removed:'', status:'', msg:''};
        if (this.moveFrom >= 0 && this.moveTo >= 0){
            var nP1 = this.moveFrom;
            var nP2 = this.moveTo;
            var peg1 = this.pegs[nP1];
            var peg2 = this.pegs[nP2];
            result.movedFrom = peg1.id;
            result.movedTo = peg2.id;
            if (!peg1.isEmpty && peg2.isEmpty){
                //Check if a valid move can be made
                var iRow = -1;
                var iCol = -1;
                if ((Math.abs(peg1.row - peg2.row) === 2 ||
                    (peg1.row - peg2.row) === 0) &&
                    (Math.abs(peg1.col - peg2.col) === 2 ||
                        (peg1.col - peg2.col) === 0)){
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
                        result.removed = this.pegs[iPegIndex].id;
                        result.status = "success"
                        result.msg = result.movedFrom + " - " +
                                     result.movedTo + "; removed " +
                                     result.removed;
                    } else{
                        result.status = "error";
                        result.msg = "Invalid move"
                    }
                } else {
                    result.status = "error";
                    result.msg = "Invalid move"
                }
              } else {
                  result.status = "error";
                  result.msg = "Invalid move"
              }
        } else{
            result.status = "error";
            result.msg = "Nothing selected."
        }
        return result;
    }
}

var myBoard = null;

function onClick(curIndex){
    if (myBoard.moveFrom < 0){
        myBoard.moveFrom = curIndex;
    } else if (myBoard.moveTo < 0){
        myBoard.moveTo = curIndex;
        var res = myBoard.make_a_move();
        if (res.status === "success"){
          var mFrom = "#" + res.movedFrom;
          var mTo = "#" + res.movedTo;
          var remv = "#" + res.removed;
          $(mFrom).attr("state", "empty");
          $(mTo).attr("state", "occupied");
          $(remv).attr("state", "empty");
          var newMove = $("<span></span>");
          newMove.text(res.msg);
          $("#move-log").append($("<br />"));
          $("#move-log").append(newMove);
        }
        myBoard.moveFrom = -1;
        myBoard.moveTo = -1;
    }
}

$(document).ready( function(){
    //Toggle rules when rules heading is clicked
    $("#rules").on('click', function(){
        console.log("Rules button clicked.");
        $("#rulestext").toggle();
    });

    $("#new-game").on('click', function(){
        myBoard = new Board();
        myBoard.setPegs();
        myBoard.make_html();

        $("circle").on('click', function(){
            var curIndex = $(this).attr("index");
            onClick(curIndex);
        });
        $("text").on('click', function(){
            var curIndex = $(this).attr("index");
            onClick(curIndex);
        });

    });
});

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
    this.pegs = this.getPegs();
    this.html = this.make_html();
    this.moveFrom = -1;
    this.moveTo = -1;
}

Board.prototype = {
    getPegs: function(){
        pegs = [];
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
                        pegs.push(new Peg(i, j, id, index, true));
                    } else{
                        //Set all other pegs as occupied
                        pegs.push(new Peg(i, j, id, index, false));
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
                // var alphabet = 'abcdefghijklmnopqrstuvwxyz'
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
                  var pegId = curPeg.id;
                  var txtId = pegId +'-txt';
                  var pegIndex = curPeg.index;
                  svg.circle(cx,cy,radius,
                             {id:pegId, index: pegIndex, state:pegState});
                  svg.text(cx,cy,pegId,
                           {id:txtId, index: pegIndex, state:pegState,
                            stroke:'white', textAnchor:'middle'});
                }
                break;
        }
        var movesLog = $("<p></p>")
        movesLog.attr("id", "move-log");
        movesLog.text("Moves:");
        gameBoard.append(movesLog);
        return gameBoard;
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
    },

    get_peg_index: function(pegId){
        var alphabet = "abcdefghijklmnopqrstuvwxyz";
        var result = -1;
        if ((typeof pegId) === "string" && pegId.length === 2){
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

var myBoard = new Board();

function onClick(curIndex){
    if (myBoard.moveFrom < 0){
        myBoard.moveFrom = curIndex;
    } else if (myBoard.moveTo < 0){
        myBoard.moveTo = curIndex;
        var res = myBoard.make_a_move();
        // alert(res.msg);
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
        $("body").append(myBoard.html);

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

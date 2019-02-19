let myBoard = null;

/** Event handler for click event on the pegs
* @param {number} curIndex Index of the peg that was clicked
*/
function onClick(curIndex) {
  if (myBoard.moveFrom < 0) {
    myBoard.moveFrom = curIndex;
  } else if (myBoard.moveTo < 0) {
    myBoard.moveTo = curIndex;
    const res = myBoard.make_a_move();
    if (res.status === 'success') {
      const mFrom = '#' + res.movedFrom;
      const mTo = '#' + res.movedTo;
      const remv = '#' + res.removed;
      $(mFrom).attr('state', 'empty');
      $(mTo).attr('state', 'occupied');
      $(remv).attr('state', 'empty');
      const newMove = $('<span></span>');
      newMove.text(res.msg);
      $('#move-log').append($('<br />'));
      $('#move-log').append(newMove);
    }
    myBoard.moveFrom = -1;
    myBoard.moveTo = -1;
  }
}

/** Event handler for document ready event
 */
$(document).ready( function() {
  // Toggle rules when rules heading is clicked
  $('#rules').on('click', function() {
    console.log('Rules button clicked.');
    $('#rulestext').toggle();
  });

  $('#new-game').on('click', function() {
    myBoard = new Board();
    myBoard.setPegs();
    myBoard.make_html();

    $('circle').on('click', function() {
      const curIndex = $(this).attr('index');
      onClick(curIndex);
    });
    $('text').on('click', function() {
      const curIndex = $(this).attr('index');
      onClick(curIndex);
    });
  });
});

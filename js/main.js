let myBoard = null;

/** Event handler for click event on the pegs */
function onClickCircleText() {
  const curIndex = $(this).attr('index');
  if (myBoard.moveFrom < 0) {
    myBoard.moveFrom = curIndex;
  } else if (myBoard.moveTo < 0) {
    myBoard.moveTo = curIndex;
    const res = myBoard.makeMove();
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
  return;
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
    console.log('New game button clicked.');
    myBoard = new Board();
    myBoard.setPegs();
    myBoard.makeHtml();

    $('circle').on('click', onClickCircleText);

    $('text').on('click', onClickCircleText);
  });
});

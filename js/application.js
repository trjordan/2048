// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

  // Run a move every second!
  function runMove() {
    var board = simpleBoard();
    var horizScore = canCombine(board, 1);
    var vertScore = canCombine(board, 0);

    if (horizScore[0] > vertScore[0]) {
      // Pick left or right if there are more horizontal to merge
      __kb.emit('move', 1 + Math.floor(Math.random()*2)*2);
      console.log('Confidently going left or right');
    } else if (horizScore[0] < vertScore[0]) {
      // Pick up or down if there are more vertical to merge
      __kb.emit('move', Math.floor(Math.random()*2)*2); 
      console.log('Confidentally going up or down');
    } else if (horizScore[1] > vertScore[1]) {
      // Pick left or right if the value of horizontal is higher
      __kb.emit('move', 1 + Math.floor(Math.random()*2)*2);
      console.log('Guessing left or right');
    } else if (horizScore[1] < vertScore[1]) {
      // Pick up or down if the value of vertical is higher
      __kb.emit('move', Math.floor(Math.random()*2)*2); 
      console.log('Guessing up or down');
    } else {
      // Pick randomly
      __kb.emit('move', Math.floor(Math.random()*4)); 
      console.log('I dunno, man');
    }
    window.setTimeout(runMove, 750);
  }

  function simpleBoard() {
    var board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    for (var y = 0; y < 4; y++) {
      for (var x = 0; x < 4; x++) {
        tile = __grid.cells[x][y];
        board[x][y] = tile ? tile.value : 0;
      }
    }

    return board;
  }

  function canCombine(board, horiz) {
    function checkRow(row) {
      //console.log(row);
      var current = row[0];
      for (var i = 1; i < 4; i++) {
        //console.log('current', current);
        //console.log('row', row[i]);
        if (row[i] === current && current !== 0) {
          //console.log('huzzah');
          return current;
        }
        if (current === 0 || current !== row[i]) {
          //console.log('hey');
          current = row[i];
        }
      }
      return 0;
    }

    var total = 0;
    var num = 0;
    var row;
    for (var i = 0; i < 4; i++) {
      if (horiz) {
        row = [board[0][i], board[1][i], board[2][i], board[3][i]];
        //console.log('yay');
      } else {
        row = board[i];
        //console.log('nay');
      }
      var foundTotal = checkRow(row);
      total += foundTotal;
      num += foundTotal ? 1 : 0;
    }
    return [num, total];
  }

  runMove();

});

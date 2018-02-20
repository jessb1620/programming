// this is the model
// is should NOT contain any html or css
var snake = (function() {

  // this is the internal state of the model
  // no one can access this directly

  // define the playing grid (2d array) and other variables

  var map = null,
      points = 0,
      level = 0,
      direction = 0,
      snake = new Array(4),
      active = true,
      speed = 380;

  function initialize() {

    map = new Array(20);
    for (var i = 0; i < map.length; i++) {
      map[i] = new Array(20);
    }

    map = makeSnake(map);
    map = makeFood(map);
    createGame();

    window.addEventListener('keydown', function(e) {
      if (e.keyCode === 38 && direction !== 3) {
          direction = 2;
      } else if (e.keyCode === 40 && direction !== 2) {
          direction = 3;
      } else if (e.keyCode === 37 && direction !== 0) {
          direction = 1;
      } else if (e.keyCode === 39 && direction !== 1) {
          direction = 0;
      }
    });

    function createGame() {
      for (var i = snake.length - 1; i >= 0; i--) {
        if (i === 0) {
          switch(direction) {
            case 0:
              snake[0] = { x: snake[0].x + 1, y: snake[0].y }
                break;
            case 1:
              snake[0] = { x: snake[0].x - 1, y: snake[0].y }
                break;
           case 2:
              snake[0] = { x: snake[0].x, y: snake[0].y - 1 }
                break;
            case 3:
              snake[0] = { x: snake[0].x, y: snake[0].y + 1 }
                break;
          }

          if (snake[0].x < 0 ||
            snake[0].x >= 20 ||
            snake[0].y < 0 ||
            snake[0].y >= 20) {
            endGame();
            return;
          }

         if (map[snake[0].x][snake[0].y] === 1) {
            points += 10;
            map = makeFood(map);

            snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
            map[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;

            if ((points % 30) == 0) {
              level += 1;
            }
          }
          else if (map[snake[0].x][snake[0].y] === 2) {
            endGame();
            return;
          }
          map[snake[0].x][snake[0].y] = 2;
        }
        else {
          if (i === (snake.length - 1)) {
            map[snake[i].x][snake[i].y] = null;
          }
          snake[i] = { x: snake[i - 1].x, y: snake[i - 1].y };
          map[snake[i].x][snake[i].y] = 2;
        }
      }

      // let listeners know the grid was updated
      notify();

      if (active) {
        setTimeout(createGame, speed - (level * 50));
      }
    }

    function makeFood(map) {
      var rndX = Math.round(Math.random() * 19),
          rndY = Math.round(Math.random() * 19);

      while (map[rndX][rndY] === 2) {
        rndX = Math.round(Math.random() * 19);
        rndY = Math.round(Math.random() * 19);
      }

      map[rndX][rndY] = 1;
      return map;
    }

    function makeSnake(map) {
      var rndX = Math.round(Math.random() * 19),
          rndY = Math.round(Math.random() * 19);
      while ((rndX - snake.length) < 0) {
              rndX = Math.round(Math.random() * 19);
      }

      for (var i = 0; i < snake.length; i++) {
        snake[i] = { x: rndX - i, y: rndY };
        map[rndX - i][rndY] = 2;
      }

      return map;
    }

    function endGame() {
      active = false;
      // let listeners know we are done
      notify();
    }
  }

  function isActive() {
    return active;
  }

  function getPoints() {
    return points;
  }

  function getLevel() {
    return level;
  }

  // handle listeners

  var listeners = [];

  // this function registers/adds a listener
  function listen(cb) {
    // collect them in the listeners array
    listeners.push(cb);
  }

  // notify all listeners of a change to the grid
  function notify() {
    // iterate through the array and call the listen callback function
    for (var i = 0; i < listeners.length; i++) {
      // call the function
      listeners[i](map, active);
    }
  }

  // all functionality is accessed through the methods below
  return {
    initialize: initialize,
    isActive: isActive,
    getPoints: getPoints,
    getLevel: getLevel,
    listen: listen
  };

})();

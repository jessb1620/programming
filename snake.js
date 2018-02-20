// this is the model
// is should NOT contain any html or css
var snake = (function() {

  // this is the internal state of the model
  // no one can access this directly

  var map = null;
  function initialize(){
    notify();
  }

  // define the playing grid (2d array)

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
      listeners[i](map);
    }
  }

  // all functionality is accessed through the methods below
  return {
    initialize: initialize,
    listen: listen
  };

})();

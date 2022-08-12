const controllers = {}

function connecthandler(e) {
  addgamepad(e.gamepad);
}

function addgamepad(gamepad){
  controllers[gamepad.index] = gamepad;
  // add something on interface...
}

window.addEventListener('gamepadconnected', gamepadConnected);
window.addEventListener('gamepaddisconnected', gamepaddisconnected);
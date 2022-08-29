//connect to the gamepa
const handleGamepadConnected = () => {
  console.log("gamepad connected");
}

//disconnected to the gamepad 
const handleGamepadDisconnected = () => {
  console.log("gamepad disconnected");
}

window.addEventListener('gamepadconnected', (e) => {
  handleGamepadConnected();
})

window.addEventListener('gamepaddisconnected', (e) => {
  handleGamepadDisconnected();
})

//start prediction 
const startPredict = () => {
  animate()
}

const animate = () => {
  requestAnimationFrame(animate)
}

const gamepadControls = () => {
  gamepads = navigator.getGamepads();
  if (!gamepads[0]) return;
  gamepad = gamepads[0];

  const dx = gamepad.axes[3];
  const dy = gamepad.axes[2];

  const rx = gamepad.axes[1];
  const ry = gamepad.axes[0];

  const trigger = gamepad.buttons[7].value;

  // dataCollect(dx, dy, rx, ry, trigger);
}

const dataCollect = (dx, dy, rx, ry, trigger) => {
}


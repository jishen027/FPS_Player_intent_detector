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
  gamepadControls()
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


  dataCollect(dx, dy, rx, ry, trigger);
}

let coordinateData = [];
let temp_coordinate_data = [];
const AIMING_ACTION = 0;
const MOVING_ACTION = 1;

const dataCollect = (dx, dy, rx, ry, trigger) => {
  //start recording
  if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
    console.log("============= Start record Moving data ======================= ");
    temp_coordinate_data.push({ x: dx, y: dy, rx: rx, ry: ry, trigger: trigger, type: MOVING_ACTION })
  }

  // stop 
  if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1 && temp_coordinate_data.length != 0) {

    if (coordinateData != 0) {
      // _upload_data(coordinateData);
      _dataprocessing(coordinateData)
      coordinateData = temp_coordinate_data;
      temp_coordinate_data = [];
    } else {
      coordinateData = temp_coordinate_data;
      temp_coordinate_data = [];
    }
  }

  // stop by trigger
  if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1 && trigger > 0) {
    console.log("============= Start record Aiming data ======================= ");
    if (coordinateData.length != 0) {
      coordinateData.forEach((coordinate) => {
        coordinate.type = AIMING_ACTION;
      });
      // _upload_data(coordinateData);
      _dataprocessing(coordinateData)
      coordinateData = [];
    }
  }
}


let mean_x = 0, mean_y = 0, mean_rx = 0, mean_ry = 0;
let sum_x = 0, sum_y = 0, sum_rx = 0, sum_ry = 0;
let counter = 0;
let data = []
let center_point = []

const _dataprocessing = (coordinates) => {

  coordinates.forEach((coordinate) => {
    sum_x += coordinate.x;
    sum_y += coordinate.y;
    sum_rx += coordinate.rx;
    sum_ry += coordinate.ry;
  })
  counter = coordinates.length;

  mean_x = sum_x / counter;
  mean_y = sum_y / counter;
  mean_rx = sum_rx / counter;
  mean_ry = sum_ry / counter;

  center_point.push(mean_x.toFixed(4).toString())
  center_point.push(mean_y.toFixed(4).toString())
  center_point.push(mean_rx.toFixed(4).toString())
  center_point.push(mean_ry.toFixed(4).toString())

  data.push(center_point)

  const result_data = postData(data);

  sum_x = 0;
  sum_y = 0;
  sum_rx = 0;
  sum_ry = 0;

  mean_x = 0;
  mean_y = 0;
  mean_rx = 0;
  mean_ry = 0;

  data = []
  center_point = []

}

const h1_title = document.getElementById('title')

const postData = async (data) => {
  const response = await fetch('/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  console.log(result)

  if(result.result == 1){
    title.innerHTML = "Player Action : Moving"
    title.style.color = 'red'
  }

  if(result.result == 0){
    title.innerHTML = "Player Action : Aiming"
    title.style.color = 'blue'
  }
}

const startPredictBtn = document.getElementById('start_predict')
startPredictBtn.addEventListener('click', (e) => {
  e.preventDefault();
  startPredict();
  // postData([[0.1, 0.1, 0.1, 0.1]]);
})

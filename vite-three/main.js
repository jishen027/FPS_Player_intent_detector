import * as THREE from 'three'

import { PointerLockControls } from './three_modules/PointerLockControls';
import { initializeApp } from 'firebase/app';

// import dotenv from 'dotenv'
// dotenv.config()

// const firebaseConfig = {
//   apiKey: "AIzaSyClz8_9nwl6l5ReK4c44h_ajsDxYuf_VTw",
//   authDomain: "three-js-demo-58da4.firebaseapp.com",
//   projectId: "three-js-demo-58da4",
//   storageBucket: "three-js-demo-58da4.appspot.com",
//   messagingSenderId: "273050549481",
//   appId: "1:273050549481:web:c54af289a4a30ea7cb4478"
// };

// const app = initializeApp(firebaseConfig);

let controls, renderer, camera, scene, raycaster, pointer;

let INTERSECTED;

let gamepads, gamepad;

let _euler;

init();
animate();

function init() {
  // crosshair
  const crosshair = document.getElementById('crosshair');
  crosshair.innerHTML = '+';
  crosshair.style.display = 'none';
  _euler = new THREE.Euler(0, 0, 0, 'YXZ');


  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(0, 10, -1);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xffffff, 0, 750);

  //light
  const amientLight = new THREE.AmbientLight();
  scene.add(amientLight);

  const pointLight = new THREE.PointLight();
  pointLight.position.set(1000, 1000, 1000);
  scene.add(pointLight);

  controls = new PointerLockControls(camera, document.body);

  const blocker = document.getElementById('blocker');
  const instructions = document.getElementById('instructions');

  instructions.addEventListener('click', () => {
    controls.lock();
  });

  controls.addEventListener('lock', () => {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
    crosshair.style.display = 'block';
  });

  controls.addEventListener('unlock', () => {
    blocker.style.display = 'block';
    instructions.style.display = '';
    crosshair.style.display = 'none';
  });

  //floor
  let floorGeometry = new THREE.PlaneGeometry(2000, 2000);
  floorGeometry.rotateX(-Math.PI / 2);
  const floorMaterial = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.2 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  scene.add(floor);

  //grid helper
  const helper = new THREE.GridHelper(2000, 100);
  helper.material.opacity = 0.25;
  helper.material.transparent = true;
  scene.add(helper);

  //object
  const geometry = new THREE.SphereGeometry(10, 32, 16);
  const material = new THREE.MeshLambertMaterial({
    color: '#95a5a6',
    transparent: true,
    opacity: 0.8
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = Math.floor(Math.random() * 20 - 10) * 10;
  sphere.position.y = Math.floor(Math.random() * 20) * 10 + 10;
  sphere.position.z = Math.floor(Math.random() * 20 - 10) * 10;
  scene.add(sphere);

  //raycaster
  pointer = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

  // render
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  aimObject();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  gamepadControls();
}

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function aimObject() {
  raycaster.setFromCamera({ x: 0, y: 0 }, camera);

  const intersects = raycaster.intersectObjects(scene.children, false);

  if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh) {
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED) {
        INTERSECTED.material.color.set('#95a5a6');
        INTERSECTED.material.transparent = true;
        INTERSECTED.material.opacity = 0.8;
      }
      INTERSECTED = intersects[0].object;
      INTERSECTED.material.color.set('#e74c3c');
      INTERSECTED.material.transparent = true;
      INTERSECTED.material.opacity = 0.5;
    }

  } else {
    if (INTERSECTED) {
      INTERSECTED.material.color.set('#95a5a6');
      INTERSECTED.material.transparent = true;
      INTERSECTED.material.opacity = 0.8;
    }
    INTERSECTED = null;
  }
}
function shootingAction(event) {
  raycaster.setFromCamera({ x: 0, y: 0 }, camera);
  const intersects = raycaster.intersectObjects(scene.children, false);
  if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh) {
    intersects[0].object.position.x = Math.floor(Math.random() * 20 - 10) * 10;
    intersects[0].object.position.y = Math.floor(Math.random() * 20) * 10 + 10;
    intersects[0].object.position.z = Math.floor(Math.random() * 20 - 10) * 10;
  }
}

// controllers
function handleConnected(event) {
  console.log("gamepads connected", event.gamepad);
  console.log("firestore start");
}

function handleDisconnected(event) {
  console.log("gamepad disconnected")
}

function gamepadControls() {
  gamepads = navigator.getGamepads();
  if (!gamepads[0]) return;
  gamepad = gamepads[0];

  const dx = gamepad.axes[3];
  const dy = gamepad.axes[2];

  rotateCamera(dx, dy);

  if (gamepad.buttons[7].pressed) {
    shootingAction()
  }
}

function rotateCamera(dx, dy) {
  if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
    console.log(dx, dy);

    _euler.setFromQuaternion(camera.quaternion);

    _euler.y -= dy * 0.05;
    _euler.x -= dx * 0.05;

    _euler.x = Math.max(Math.PI / 2 - Math.PI, Math.min(Math.PI / 2 - 0, _euler.x));

    camera.quaternion.setFromEuler(_euler);
  }
}

// data collecter


window.addEventListener('resize', onWindowResize);
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('click', shootingAction);
window.addEventListener('gamepadconnected', handleConnected);
window.addEventListener('gamepaddisconnected', handleDisconnected);
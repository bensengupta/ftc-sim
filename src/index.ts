import * as Lib3D from "./lib";

var svgElem = document.querySelector("svg")!;
const svg = new Lib3D.SvgRenderer({ svg: svgElem });
const scene = new Lib3D.Scene();
const camera = new Lib3D.PerspectiveCamera({ x: 100, rotX: Math.PI / 3 });

// Create objects
const cube = new Lib3D.Box({
  x: 200,
  y: 0,
  z: 0,
  width: 200,
  depth: 200,
  height: 200,
});

const cube2 = new Lib3D.Box({
  x: -200,
  y: 0,
  z: -10,
  width: 200,
  depth: 200,
  height: 200,
  rotX: Math.PI / 4,
  rotY: Math.PI / 4,
});

const sphere = new Lib3D.Sphere({
  x: -200,
  y: 0,
  z: 50,
});

scene.add(cube);
scene.add(cube2);
// scene.add(sphere);

// Animate objects
function animate() {
  requestAnimationFrame(animate);
  cube.rotate(8e-3, 6e-3, 2.5e-3);
  svg.render(scene, camera);
  // sphere.rotate(16e-3)
  // console.log(cube.AABB)
}

// setInterval(() => {
//   cube.rotate(8e-3, 6e-3, 2.5e-3);
//   svg.render(scene, camera);
// }, 1000);

animate();

// Rotate cube
var mousePressed = false;

svgElem.onmousedown = function () {
  mousePressed = true;
};
svgElem.onmouseup = function () {
  mousePressed = false;
};
svgElem.onmouseleave = function () {
  mousePressed = false;
};
svgElem.onmousemove = function ({ movementX, movementY }) {
  if (mousePressed) {
    cube.rotate(movementY * 8e-3, -movementX * 6e-3, 0);
    // cube2.translate(movementX/5,-movementY/5)
    cube2.rotate(movementY * 8e-3, -movementX * 6e-3, 0);
  }
};

document.onkeypress = function ({ code }) {
  console.log(code);
  switch(code) {
    case 'KeyW':
      camera.translate(0, 0, 1);
    case 'KeyS':
      camera.translate(0, 0, -1);
    case 'KeyA':
      camera.translate(-1, 0, 0);
    case 'KeyD':
      camera.translate(1, 0, 0);
  }
}

// Try removing if you have issues with hot-reloading
if (module.hot) module.hot.accept();

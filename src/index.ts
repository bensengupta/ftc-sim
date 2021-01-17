import * as Lib3D from "./lib";

// function Sphere(r: number, lo: number, la: number) {
//   // Points
//   const ps: { [key: string]: Lib3D.Point } = {};
//   for (let lat = 0; lat < la; lat++)
//     for (let lon = 0; lon < lo; lon++) {
//       var angLO = (lon / lo) * Math.PI * 2,
//         angLA = (lat / la) * 2 * Math.PI;
//       var x = Math.cos(angLO) * Math.cos(angLA) * r;
//       var y = Math.sin(angLA) * r;
//       var z = Math.sin(angLO) * Math.cos(angLA) * r;
//       ps[lat + "," + lon] = new Lib3D.Point(x, y, z);
//     }

//   // Surfaces
//   const paths = [];
//   for (let lat = 0; lat < la; lat++)
//     for (let lon = 0; lon < lo; lon++) {
//       var la1 = (lat + 1) % la,
//         lo1 = (lon + 1) % lo;
//       paths.push(
//         new Lib3D.Path3D(
//           ps[lat + "," + lon],
//           ps[la1 + "," + lon],
//           ps[la1 + "," + lo1],
//           ps[lat + "," + lo1]
//         )
//       );
//       console.log(paths[paths.length - 1]);
//     }

//   // Color
//   for (let path of paths)
//     path.fill =
//       "rgb(" +
//       Math.random() * 255 +
//       "," +
//       Math.random() * 255 +
//       "," +
//       Math.random() * 255 +
//       ")";
//   paths[paths.length - 1].fill = "#ff0";

//   return new Lib3D.Object3D(...paths);
// }

var svgElem = document.querySelector("svg")!;
const svg = new Lib3D.SvgRenderer({ svg: svgElem });
const scene = new Lib3D.Scene();
const camera = new Lib3D.PerspectiveCamera();


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
// const sphere = Sphere(100,20,30);
// console.log(sphere)

scene.add(cube);
scene.add(cube2);

// svg.insert(sphere)
// camera.perspective = 5e2;
// svg.Perspective = 5e2;

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

const translate = new Lib3D.Matrix4([
  1, 0, 0, 100,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
]);

const rotate = new Lib3D.Euler(0, 0, 0).toRotationMatrix();

const scale = new Lib3D.Matrix4([
  2, 0, 0, 0,
  0, 2, 0, 0,
  0, 0, 2, 0,
  0, 0, 0, 1,
]);


const transform = translate.multiplyMatrix(rotate).multiplyMatrix(scale);

const v1 = new Lib3D.Vector4(0, 0, 0, 1).multiplyMatrix(transform);

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

// Try removing if you have issues with hot-reloading
if (module.hot) module.hot.accept();

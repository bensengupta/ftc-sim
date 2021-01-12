import { SVG3D, Object3D, Path3D, Point } from "./lib";

function createCuboid(
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number
) {
  // Points
  const p1 = new Point(x, y, z);
  const p2 = new Point(x, y, z + d);
  const p3 = new Point(x, y + h, z);
  const p4 = new Point(x, y + h, z + d);
  const p5 = new Point(x + w, y, z);
  const p6 = new Point(x + w, y, z + d);
  const p7 = new Point(x + w, y + h, z);
  const p8 = new Point(x + w, y + h, z + d);

  // Surfaces
  const path1 = new Path3D(p1, p2, p4, p3);
  const path2 = new Path3D(p2, p1, p5, p6);
  const path3 = new Path3D(p1, p3, p7, p5);
  const path4 = new Path3D(p4, p2, p6, p8);
  const path5 = new Path3D(p6, p5, p7, p8);
  const path6 = new Path3D(p3, p4, p8, p7);

  // Color
  path1.fill = "red";
  path1.stroke = "#000";
  path1.strokeWidth = "1";
  path2.fill = "green";
  path2.stroke = "#000";
  path2.strokeWidth = "1";
  path3.fill = "blue";
  path3.stroke = "#000";
  path3.strokeWidth = "1";
  path4.fill = "yellow";
  path4.stroke = "#000";
  path4.strokeWidth = "1";
  path5.fill = "cyan";
  path5.stroke = "#000";
  path5.strokeWidth = "1";
  path6.fill = "magenta";
  path6.stroke = "#000";
  path6.strokeWidth = "1";

  return new Object3D(path1, path2, path3, path4, path5, path6);
}

var svgElem = document.querySelector("svg")!;
var svg = new SVG3D(svgElem);

// Create cubes
const cube = createCuboid(-100, -100, -100, 200, 200, 200);
const cube2 = createCuboid(-100, -100, -100, 200, 200, 200);

// Tanslate cubes
cube2.translate(-100,100)
cube2.rotate(Math.PI/4)

svg.insert(cube);
svg.insert(cube2)
svg.Perspective = 5e2;

// Animate cubes
function animate() {
  // cube.rotate(8e-3, 6e-3, 2.5e-3);
  console.log(cube.AABB)
  // cube2.rotate(-8e-3, -6e-3, -2.5e-3)
  svg.display();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// Rotate cube
var mousePressed = false;

svgElem.onmousedown = function () {
  mousePressed = true;
};
svgElem.onmouseup = function () {
  mousePressed = false;
};
svgElem.onmousemove = function ({ movementX, movementY }) {
  if (mousePressed) {
    cube.rotate(movementY * 8e-3, -movementX * 6e-3, 0);
  }
};

// Try removing if you have issues with hot-reloading
if (module.hot) module.hot.accept();

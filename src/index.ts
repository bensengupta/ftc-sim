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

function Sphere(r: number, lo: number, la: number) {
  // Points
  const ps: { [key: string]: Point } = {};
  for (let lat = 0; lat < la; lat++)
    for (let lon = 0; lon < lo; lon++) {
      var angLO = lon/lo*Math.PI*2, angLA = lat/la*2*Math.PI
      var x = Math.cos(angLO) * Math.cos(angLA) * r;
      var y = Math.sin(angLA) * r;
      var z = Math.sin(angLO) * Math.cos(angLA) * r;
      ps[lat + ',' + lon] = new Point(x, y, z)
    }

  // Surfaces
  const paths = []
  for (let lat = 0; lat < la; lat++)
    for (let lon = 0; lon < lo; lon++) {
      var la1=((lat+1)%la),lo1=((lon+1)%lo);
      paths.push(
        new Path3D(
          ps[lat + ',' + lon],
          ps[la1 + ',' + lon],
          ps[la1 + ',' + lo1],
          ps[lat + ',' + lo1])
      )
      console.log(paths[paths.length-1])
    }

  // Color
  for (let path of paths)
    path.fill = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
    paths[paths.length-1].fill='#ff0'

  return new Object3D(...paths);
}

var svgElem = document.querySelector("svg")!;
var svg = new SVG3D(svgElem);

// Create objects
const cube = createCuboid(-100, -100, -100, 200, 200, 200);
const cube2 = createCuboid(-100, -100, -100, 200, 200, 200);
// const sphere = Sphere(100,20,30);
// console.log(sphere)

// Tanslate objects
cube2.translate(-100, 100)

svg.insert(cube);
svg.insert(cube2)
// svg.insert(sphere)
svg.Perspective = 5e2;

// Animate objects
function animate() {
  // sphere.rotate(16e-3)
  // cube.rotate(8e-3, 6e-3, 2.5e-3);
  // console.log(cube.AABB)
  // for (let path of cube.unrotated3dPlane)console.log(path.affine3dFunction())
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
    // cube2.translate(movementX/5,-movementY/5)
    cube2.rotate(movementY * 8e-3, -movementX * 6e-3)
  }
};

// Try removing if you have issues with hot-reloading
if (module.hot) module.hot.accept();

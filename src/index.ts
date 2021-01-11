import { SVG3D, Object3D, Path3D, Point } from "./lib";

var svg = new SVG3D(document.querySelector("svg")!);
// console.log(svg.svg)
// document.querySelector('svg') = svg.svg;
var point = new Point(1, 1, 1);
var points = [
  new Point(1, 1, 1),
  new Point(1, 1, -1),
  new Point(-1, -1, -1),
  new Point(-1, -1, 1),
];
var points2 = [
  new Point(100, 100, 100),
  new Point(100, -100, 100),
  new Point(-100, -100, 100),
  new Point(-100, 100, 100),
];
var points3 = [
  new Point(100, 100, -100),
  new Point(100, -100, -100),
  new Point(-100, -100, -100),
  new Point(-100, 100, -100),
];
var points4 = [
  new Point(100, 100, 100),
  new Point(100, 100, -100),
  new Point(100, -100, -100),
  new Point(100, -100, 100),
];
var points5 = [
  new Point(-100, 100, 100),
  new Point(-100, 100, -100),
  new Point(-100, -100, -100),
  new Point(-100, -100, 100),
];
var path1 = new Path3D(...points2);
var path2 = new Path3D(...points3);
var path3 = new Path3D(...points4);
var path4 = new Path3D(...points5);
var obj = new Object3D(path1, path2, path3, path4);
console.log(obj);
var path2d = document.createElement("path");
path1.fill = "yellow";
path1.stroke = "#0000";
path1.strokeWidth = "1";
path2.fill = "red";
path2.stroke = "#0000";
path2.strokeWidth = "1";
path3.fill = "green";
path3.stroke = "#0000";
path3.strokeWidth = "1";
path4.fill = "blue";
path4.stroke = "#0000";
path4.strokeWidth = "1";
console.log([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].indexOf(0) === 0);
svg.insert(obj);
svg.Perspective = 5e2;
obj.rotate();

svg.display();

function animate() {
  svg.insert(obj);
  obj.rotate(8e-3, 6e-3, 2.5e-3);
  svg.display();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

//  @ts-nocheck

import { SVG3D, Object3D, Path3D, Point } from "./lib";

var svg = new SVG3D(document.querySelector("svg"));
// console.log(svg.svg)
// document.querySelector('svg') = svg.svg;
var point = new Point(1, 1, 1);
console.log(point.rotate());
var sy = Symbol();
var sy2 = Symbol();
var obj = {
  t: "test",
  [sy]: "hi",
  [sy2]: "hello",
};
console.log(obj[sy]);
console.log(obj[sy2]);
for (i in obj) console.log(i);
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
  new Point(100, -100, -100),
  new Point(-100, -100, 100),
  new Point(-100, 100, -100),
];
var path3D = new Path3D(...points2);
var path2 = new Path3D(...points3);
var path3 = new Path3D(...points4);
var obj = new Object3D(path3D, path2 /*, path3*/);
console.log(obj);
var path2d = document.createElement("path");
path3D.fill = "none";
path3D.stroke = "#000";
path3D.strokeWidth = "5";
path2.fill = "none";
path2.stroke = "#000";
path2.strokeWidth = "5";
path3.fill = "none";
path3.stroke = "#000";
path3.strokeWidth = "5";
console.log(toString(path3D.path2D), path3D.path2D, path3D.path2D + "");
console.log([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].indexOf(0) === 0);
svg.insert(obj);
obj.rotate(Math.PI / 4, Math.PI / 4, Math.PI / 4);
svg.display();

setInterval(async function () {
  svg.insert(obj);
  obj.rotate(3e-2, 3e-2, 3e-2);
  svg.display();
}, 100);

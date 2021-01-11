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
var obj = new Object3D(path1, path2 , path3, path4);
console.log(obj);
var path2d = document.createElement("path");
path1.fill = "none";
path1.stroke = "#000";
path1.strokeWidth = "5";
path2.fill = "none";
path2.stroke = "#000";
path2.strokeWidth = "5";
path3.fill = "none";
path3.stroke = "#000";
path3.strokeWidth = "5";
path4.fill = "none";
path4.stroke = "#000";
path4.strokeWidth = "5";
console.log([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].indexOf(0) === 0);
svg.insert(obj);
svg.Perspective = 5E2
obj.rotate()
svg.display();

setInterval(async function () {
  svg.insert(obj);
  obj.rotate(3e-2, 2e-2, 1e-2);
  svg.display();
}, 100);

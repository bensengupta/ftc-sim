var pi = Math.PI,
  cos = Math.cos,
  sin = Math.sin,
  asin = Math.asin,
  round = (number: number) => {
    return Math.round(number * 1e9) * 1e-9;
  };
var pd2 = pi / 2,
  pm2 = pi * 2,
  pm4 = pi * 4;

class Point {
  i: Symbol;
  constructor(public x = 0, public y = 0, public z = 0) {
    this.i = Symbol();
  }
  rotate(rx = 0, ry = 0, rz = 0, origin = { x: 0, y: 0, z: 0 }) {
    var x = this.x - origin.x,
      y = this.y - origin.y,
      z = this.z - origin.z;
    // Rotation x:
    var r = Math.hypot(y, z);
    if (r != 0) {
      var angle = pd2 - (y < 0 ? -1 : 1) * (pd2 - asin(z / r)) + rx;
      y = cos(angle) * r;
      z = sin(angle) * r;
    }
    // Rotation y:
    var r = Math.hypot(x, z);
    if (r != 0) {
      var angle = pd2 - (x < 0 ? -1 : 1) * (pd2 - asin(z / r)) + ry;
      x = cos(angle) * r;
      z = sin(angle) * r;
    }
    // Rotation z:
    var r = Math.hypot(x, y);
    if (r != 0) {
      var angle = pd2 - (x < 0 ? -1 : 1) * (pd2 - asin(y / r)) + rz;
      x = cos(angle) * r;
      y = sin(angle) * r;
    }
    (this.x = x + origin.x), (this.y = y + origin.y), (this.z = z + origin.z);
    return this;
  }
  translate(tx = 0, ty = 0, tz = 0) {
    this.x += tx;
    this.y += ty;
    this.z += tz;
    return this;
  }
  affineFunction(point2: Point) {
    /*** Finds the affine function of the line that goes between this ans point2 ***/
    var a = (point2.x - this.x) / (this.y - point2.y);
    var b = point2.y - a * point2.x;
    return { CM: a, oo: b };
  }
}

class Path3D {
  unrotated3dPlane: Point[]; // We could possibly change the name unrotated3dPlane to something shorter and more appealing
  start: Point[];
  path2D: SVGPathElement;
  rotateX = 0;
  rotateY = 0;
  rotateZ = 0;
  origin = new Point(0, 0);
  perspective: number;
  zIndex: number = 0;
  constructor(...points: Point[]) {
    this.unrotated3dPlane = this.start = points;
    this.path2D = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    this.perspective = 0;
    this.calculateZIndex();
    // On calcule une fonction affine : z = CMx*x + CMy*y + oo qui sert à déterminer si tous les points du path forment quelque chose de plat
    /* Ce n'est pas terminé encore, il y a quelques problèmes quand CMx, CMy ou oo = Infinity ou -Infinity */
    if (points.length > 3) {
      var a = this.affine3dFunction();
      for (let p of points) {
        console.log(a, p);
        var equ =
          ((a?.CMx ?? 0) * p.x === Infinity &&
            (a?.CMy ?? 0) * p.y === -Infinity) ||
          ((a?.CMx ?? 0) * p.x === -Infinity &&
            (a?.CMy ?? 0) * p.y === Infinity)
            ? a?.oo
            : ((a?.CMx ?? 0) * p.x === Infinity && a?.oo === -Infinity) ||
              ((a?.CMx ?? 0) * p.x === -Infinity && a?.oo === Infinity)
            ? a?.CMy * p.y
            : ((a?.CMy ?? 0) * p.y === Infinity && a?.oo === -Infinity) ||
              ((a?.CMy ?? 0) * p.y === -Infinity && a?.oo === Infinity)
            ? a?.CMx * p.x
            : (a?.CMx ?? 0) * p.x + (a?.CMy ?? 0) * p.y + (a?.oo ?? 0);
        console.log(
          a?.CMx === Infinity,
          a?.CMx === -Infinity,
          a?.CMy === Infinity,
          a?.CMy === -Infinity,
          a?.oo === Infinity,
          a?.oo === -Infinity
        );
        var str =
          (a?.CMx ?? 0) * p.x +
          "+" +
          (a?.CMy ?? 0) * p.y +
          "+" +
          (a?.oo ?? 0) +
          " = " +
          equ;
        if (equ != p.z) {
          console.log(str, p.z);
          //console.error("Path " + this + " is not flat: \n", 'Bumpy paths may appear distorted'); break
        }
      }
    }
  }
  private calculateZIndex() {
    /*** Maybe we could make this a getter? ***/
    let z = 0;
    for (let point of this.unrotated3dPlane) {
      z += point.z; // It could be good if we had a viewer in SVG3D and then we find the distance between the viewer and the path
    }
    z /= this.unrotated3dPlane.length;
    this.zIndex = z;
  }
  // get rotated3dPlane() {    /*** Useless yet ***/
  //   var result = [];
  //   for (let point of this.unrotated3dPlane)
  //     result.push(
  //       point.rotate(this.rotateX, this.rotateY, this.rotateZ, this.origin)
  //     );
  //   return result;
  // }
  rotate(rx = 0, ry = 0, rz = 0, origin = { x: 0, y: 0, z: 0 }) {
    console.log(origin);
    var result: Point[] = [];
    for (let point of this.unrotated3dPlane)
      result.push(point.rotate(rx, ry, rz, origin));
    this.unrotated3dPlane = result;
    this.calculateZIndex();
    return this;
  }
  translate(tx = 0, ty = 0, tz = 0) {
    var result = [];
    for (let point of this.unrotated3dPlane) {
      result.push(point.translate(tx, ty, tz));
    }
    this.unrotated3dPlane = result;
    this.origin.x += tx;
    this.origin.y += ty;
    this.origin.z += tz;
    return this;
  }
  display(origin = { x: 0, y: 0 }) {
    // console.log(origin, this.unrotated3dPlane);
    var str = "";
    for (let point of this.unrotated3dPlane) {
      var coef = this.perspective > 0.003 ? 1 + point.z / this.perspective : 1;
      str +=
        (this.unrotated3dPlane.indexOf(point) === 0 ? "M " : " L ") +
        (origin.x + point.x * coef) +
        "," +
        (origin.y - point.y * coef);
      // console.log(str);
    }
    this.path2D.setAttribute("d", str + " z");
    return this.path2D;
  }
  intersects(path2: Path3D) {
    for (let p of this.unrotated3dPlane) {
      var aff = p.affineFunction(
        this.unrotated3dPlane[
          (this.unrotated3dPlane.indexOf(p) + 1) % this.unrotated3dPlane.length
        ]
      );
      for (let p2 of path2.unrotated3dPlane) {
        var aff2 = p2.affineFunction(
          path2.unrotated3dPlane[
            (path2.unrotated3dPlane.indexOf(p2) + 1) %
              path2.unrotated3dPlane.length
          ]
        );
        var x = (aff.oo - aff2.oo) / (aff2.CM - aff.CM);
        var y = aff.CM * x + aff.oo;
      }
    }
  }
  set rotation(r: { x: number; y: number; z: number }) {
    this.unrotated3dPlane = this.start;
    this.rotate((r.x, r.y, r.z));
  }
  set fill(f: string) {
    this.path2D.style.fill = f;
  }
  set stroke(s: string) {
    this.path2D.style.stroke = s;
  }
  set strokeWidth(w: string) {
    this.path2D.style.strokeWidth = w;
  }
  affine3dFunction() {
    if (this.unrotated3dPlane.length < 3) return null;
    var A = this.unrotated3dPlane[0],
      B = this.unrotated3dPlane[1],
      C = this.unrotated3dPlane[2];
    var a = (A.y - C.y) / (B.y - A.y < 0.001 ? 0.001 : B.y - A.y),
      b = (A.x - C.x) / (B.x - A.x < 0.001 ? 0.001 : B.x - A.x);
    var c = (a * (B.z - A.z) + C.z - A.z) / (a * (B.x - A.x) + C.x - A.x);
    var d = (b * (B.z - A.z) + C.z - A.z) / (b * (B.y - A.y) + C.y - A.y);
    var CMx = c,
      CMy = d,
      oo = A.z - c * A.x - d * A.y;
    return { CMx: CMx, CMy: CMy, oo: oo };
  }
}

class Object3D {
  unrotated3dPlane: Path3D[];
  id: string;
  rotateX = 0;
  rotateY = 0;
  rotateZ = 0;
  origin = new Point(0, 0);
  constructor(...paths: Path3D[]) {
    this.unrotated3dPlane = paths;
    this.id = new ID().value;
  }
  // get rotated3dPlane() {  /*** Useless yet ***/
  //   var result = [];
  //   for (let path of this.unrotated3dPlane)
  //     result.push(path.rotate(this.rotateX, this.rotateY, this.rotateZ, this.origin));
  //   return result;
  // }
  rotate(rx = 0, ry = 0, rz = 0, origin = this.defaultOrigin) {
    var result = [];
    // console.log(origin)
    for (let path of this.unrotated3dPlane)
      result.push(path.rotate(rx, ry, rz, origin));
    this.unrotated3dPlane = result;
  }
  set rotation(r: { x: number; y: number; z: number }) {
    for (let path of this.unrotated3dPlane) path.rotation = r;
  }
  translate(tx = 0, ty = 0, tz = 0) {
    var result = [];
    for (let path of this.unrotated3dPlane)
      result.push(path.translate(tx, ty, tz));
    this.unrotated3dPlane = result;
    this.origin.x += tx;
    this.origin.y += ty;
    this.origin.z += tz;
  }
  get AABB() {
    var result = {
      x: Infinity,
      y: Infinity,
      z: Infinity,
      x1: -Infinity,
      y1: -Infinity,
      z1: -Infinity,
    };
    for (let path of this.unrotated3dPlane)
      for (let point of path.unrotated3dPlane) {
        result.x = result.x > point.x ? point.x : result.x;
        result.y = result.y > point.y ? point.y : result.y;
        result.z = result.z > point.z ? point.z : result.z;
        result.x1 = result.x1 < point.x ? point.x : result.x1;
        result.y1 = result.y1 < point.y ? point.y : result.y1;
        result.z1 = result.z1 < point.z ? point.z : result.z1;
      }
    return result;
  }
  get defaultOrigin() {
    var aabb = this.AABB;
    return new Point(
      (aabb.x + aabb.x1) / 2,
      (aabb.y + aabb.y1) / 2,
      (aabb.z + aabb.z1) / 2
    );
  }
}

class SVG3D {
  svg: SVGSVGElement;
  elements: { [key: string]: Path3D[] } = {};
  o: { x: number; y: number };
  constructor(
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    origin = { x: 0.5, y: 0.5 }
  ) {
    this.svg = svg;
    this.o = origin;
  }
  insert(...objects: Object3D[]) {
    for (let object of objects)
      this.elements[object.id] = object.unrotated3dPlane;
  }
  remove(...objects: Object3D[]) {
    for (let object of objects) delete this.elements[object.id];
  }
  display() {
    this.svg.innerHTML = "";
    const paths = Object.values(this.elements)
      .flat()
      .sort((p1, p2) => p1.zIndex - p2.zIndex);
    for (let path of paths) {
      var div = document.createElement("div");
      div.insertAdjacentElement("afterbegin", path.display(this.origin));
      this.svg.insertAdjacentHTML("beforeend", div.innerHTML);
    }
    // console.log(this.svg.innerHTML);
  }
  get origin() {
    var rect = this.svg.getBoundingClientRect();
    // console.log(rect, this.o);
    return { x: rect.width * this.o.x, y: rect.height * this.o.y };
  }
  set Perspective(p: number) {
    for (let id in this.elements)
      for (let path of this.elements[id]) path.perspective = p;
  }
  set viewer(viewer: Camera3D) {
    this.display();
  }
}

class Camera3D {
  position: Point;
  orientation: Point;
  constructor(p = new Point(0, 0, 0), o = new Point(0, 0, 1)) {
    this.position = p;
    this.orientation = o;
  }
  get vector() {
    return new Vector(this.position, this.orientation);
  }
  LonLat(ocs: OCS = new OCS(this.position)) {
    return {};
  }
  set Orientation(o: Point) {
    this.orientation = o;
  }
}

class Vector {
  x: number;
  y: number;
  z: number;
  constructor(A: Point, B: Point | undefined = undefined) {
    if (B === undefined) {
      this.x = A.x;
      this.y = A.y;
      this.z = A.z;
    } else {
      this.x = B.x - A.x;
      this.y = B.y - A.y;
      this.z = B.z - A.z;
    }
  }
  add(v2: Vector) {
    this.x += v2.x;
    this.y += v2.y;
    this.z += v2.z;
    return this;
  }
  subtract(v2: Vector) {
    return this.add(v2.multiply(-1));
  }
  multiply(l: number) {
    this.x *= l;
    this.y *= l;
    this.z *= l;
    return this;
  }
  divide(l: number) {
    return this.multiply(1 / l);
  }
  get norme() {
    return (this.x ** 2 + this.y ** 2 + this.z ** 2) ** (1 / 2);
  }
}

class OCS {
  /*** Orthonormal Coordinate System ***/ // Can be used for origin /// Not so useful yet
  x: number;
  y: number;
  z: number;
  O: Point;
  i: number;
  j: number;
  k: number;
  constructor(
    O: Point = new Point(),
    ǁiǁ: number = 1,
    ǁjǁ: number = 1,
    ǁkǁ: number = 1
  ) {
    this.O = O;
    this.i = ǁiǁ;
    this.j = ǁjǁ;
    this.k = ǁkǁ;
    (this.x = O.x), (this.y = O.y), (this.z = O.z);
  }
}

class Direction {}

class ID {
  value: string;
  static i = ID.ids();
  constructor() {
    this.value = ID.i.next().value;
  }
  static *ids(): Generator<string> {
    var id = 0;
    while (true) yield (id++).toString(36);
  }
}

export { ID, Object3D, Path3D, Point, SVG3D, Vector, Camera3D, OCS };

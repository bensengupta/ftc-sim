import { Point } from "../math/Point";
import { Vector3 } from "../math/Vector3";

class Path3D {
  vertices: Vector3[];
  start: Vector3[];
  path2D: SVGPathElement;
  rotateX = 0;
  rotateY = 0;
  rotateZ = 0;
  origin = new Point(0, 0);
  perspective: number;
  zIndex: number = 0;
  constructor(...points: Vector3[]) {
    this.vertices = this.start = points;
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
        // console.log(
        //   a?.CMx === Infinity,
        //   a?.CMx === -Infinity,
        //   a?.CMy === Infinity,
        //   a?.CMy === -Infinity,
        //   a?.oo === Infinity,
        //   a?.oo === -Infinity
        // );
        var str =
          (a?.CMx ?? 0) * p.x +
          "+" +
          (a?.CMy ?? 0) * p.y +
          "+" +
          (a?.oo ?? 0) +
          " = " +
          equ;
        if (equ != p.z) {
          // console.log(str, p.z);
          //console.error("Path " + this + " is not flat: \n", 'Bumpy paths may appear distorted'); break
        }
      }
    }
  }
  private calculateZIndex() {
    /*** Maybe we could make this a getter? ***/
    let z = 0;
    for (let point of this.vertices) {
      z += point.z; // It could be good if we had a viewer in SVG3D and then we find the distance between the viewer and the path
    }
    z /= this.vertices.length;
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
    // console.log(origin);
    var result: Vector3[] = [];
    for (let point of this.vertices)
      result.push(point.rotate(rx, ry, rz, origin));
    this.vertices = result;
    this.calculateZIndex();
    return this;
  }
  translate(tx = 0, ty = 0, tz = 0) {
    var result = [];
    for (let point of this.vertices) {
      result.push(point.translate(tx, ty, tz));
    }
    this.vertices = result;
    this.origin.x += tx;
    this.origin.y += ty;
    this.origin.z += tz;
    return this;
  }
  display(origin = { x: 0, y: 0 }) {
    // console.log(origin, this.unrotated3dPlane);
    var str = "";
    for (let point of this.vertices) {
      var coef = this.perspective > 0.003 ? 1 + point.z / this.perspective : 1;
      str +=
        (this.vertices.indexOf(point) === 0 ? "M " : " L ") +
        (origin.x + point.x * coef) +
        "," +
        (origin.y - point.y * coef);
      // console.log(str);
    }
    this.path2D.setAttribute("d", str + " z");
    return this.path2D;
  }
  intersects(path2: Path3D) {
    for (let p of this.vertices) {
      var aff = p.affineFunction(
        this.vertices[
          (this.vertices.indexOf(p) + 1) % this.vertices.length
        ]
      );
      for (let p2 of path2.vertices) {
        var aff2 = p2.affineFunction(
          path2.vertices[
            (path2.vertices.indexOf(p2) + 1) %
              path2.vertices.length
          ]
        );
        var x = (aff.oo - aff2.oo) / (aff2.CM - aff.CM);
        var y = aff.CM * x + aff.oo;
      }
    }
  }
  set rotation(r: { x: number; y: number; z: number }) {
    this.vertices = this.start;
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
    if (this.vertices.length < 3) return null;
    var A = this.vertices[0],
      B = this.vertices[1],
      C = this.vertices[2];
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

export { Path3D };

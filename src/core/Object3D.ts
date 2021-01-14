import { Path3D } from "../geometry/Path3D";
import { MathUtils } from "../math/MathUtils";
import { Point } from "../math/Point";

class Object3D {
  unrotated3dPlane: Path3D[];
  id: string;
  rotateX = 0;
  rotateY = 0;
  rotateZ = 0;
  origin = new Point(0, 0);
  constructor(...paths: Path3D[]) {
    this.unrotated3dPlane = paths;
    this.id = MathUtils.id();
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

export { Object3D };

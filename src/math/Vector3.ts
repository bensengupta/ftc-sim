import { Matrix4 } from "./Matrix4";
import { Vector4 } from "./Vector4";

class Vector3 {
  constructor(public x = 0, public y = 0, public z = 0) {}
  setFromVectorDiff(A: Vector3, B: Vector3) {
    this.x = B.x - A.x;
    this.y = B.y - A.y;
    this.z = B.z - A.z;
  }
  add(v2: Vector3) {
    this.x += v2.x;
    this.y += v2.y;
    this.z += v2.z;
    return this;
  }
  subtract(v2: Vector3) {
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
  rotate(rx = 0, ry = 0, rz = 0, origin = { x: 0, y: 0, z: 0 }) {
    const PI2 = Math.PI / 2;
    let x = this.x - origin.x;
    let y = this.y - origin.y;
    let z = this.z - origin.z;

    // Rotation x:
    var r = Math.hypot(y, z);
    if (r != 0) {
      var theta = PI2 - (y < 0 ? -1 : 1) * (PI2 - Math.asin(z / r)) + rx;
      y = Math.cos(theta) * r;
      z = Math.sin(theta) * r;
    }
    // Rotation y:
    var r = Math.hypot(x, z);
    if (r != 0) {
      var theta = PI2 - (x < 0 ? -1 : 1) * (PI2 - Math.asin(z / r)) + ry;
      x = Math.cos(theta) * r;
      z = Math.sin(theta) * r;
    }
    // Rotation z:
    var r = Math.hypot(x, y);
    if (r != 0) {
      var theta = PI2 - (x < 0 ? -1 : 1) * (PI2 - Math.asin(y / r)) + rz;
      x = Math.cos(theta) * r;
      y = Math.sin(theta) * r;
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
  affineFunction(point2: Vector3) {
    /*** Finds the affine function of the line that goes between this and point2 ***/
    var a = (point2.x - this.x) / (this.y - point2.y);
    var b = point2.y - a * point2.x;
    return { CM: a, oo: b };
  }
  get norm() {
    return (this.x ** 2 + this.y ** 2 + this.z ** 2) ** (1 / 2);
  }

  /**
   * Get translation Matrix from this Vector.
   */
  toTransformMatrix() {
    return new Matrix4([
      1, 0, 0, this.x,
      0, 1, 0, this.y,
      0, 0, 1, this.z,
      0, 0, 0, 1,
    ])
  }

  /**
   * Get Vector4 from this Vector.
   * @param w W component of the Vector4
   */
  toVector4(w = 1) {
    return new Vector4(
      this.x,
      this.y,
      this.z,
      w
    );
  }
}

export { Vector3 };

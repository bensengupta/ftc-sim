import { Matrix4 } from "./Matrix4";
import { Point } from "./Point";

class Vector4 {
  constructor(public x = 0, public y = 0, public z = 0, public w = 1) {}
  add(v2: Vector4) {
    this.x += v2.x;
    this.y += v2.y;
    this.z += v2.z;
    this.w += v2.w;
    return this;
  }
  subtract(v2: Vector4) {
    return this.add(v2.multiply(-1));
  }
  multiply(l: number) {
    this.x *= l;
    this.y *= l;
    this.z *= l;
    this.w *= l;
    return this;
  }
  divide(l: number) {
    return this.multiply(1 / l);
  }
  get norm() {
    return (this.x ** 2 + this.y ** 2 + this.z ** 2) ** (1 / 2);
  }
  /**
   * Multiplies this vector by a given matrix.
   */
  multiplyMatrix(mat: Matrix4) {
    const m = mat.elements;
    
    const x = m[0]  * this.x + m[1]  * this.y + m[2]  * this.z + m[3]  * this.w;
    const y = m[4]  * this.x + m[5]  * this.y + m[6]  * this.z + m[7]  * this.w;
    const z = m[8]  * this.x + m[9]  * this.y + m[10] * this.z + m[11] * this.w;
    const w = m[12] * this.x + m[13] * this.y + m[14] * this.z + m[15] * this.w;

    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;

    return this;
  }
}

export { Vector4 };

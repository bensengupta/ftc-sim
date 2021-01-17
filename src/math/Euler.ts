import { Matrix4 } from "./Matrix4";

/**
 * Stores Euler angles.
 */
class Euler {
  /**
   * Initialize new Euler angles.
   */
  constructor(public x: number, public y: number, public z: number) {}

  /**
   * Rotates this angle around the x axis.
   */
  rotateX(theta: number) {
    this.x += theta;
  }

  /**
   * Rotates this angle around the y axis.
   */
  rotateY(theta: number) {
    this.y += theta;
  }

  /**
   * Rotates this angle around the z axis.
   */
  rotateZ(theta: number) {
    this.z += theta;
  }

  /**
   * Rotates this angle by x, y and z.
   */
  rotate(x: number, y: number, z: number) {
    this.x += x;
    this.y += y;
    this.z += z;
  }

  /**
   * Rotates this angle by another set of Euler angles.
   */
  rotateEuler(angles: Euler) {
    this.x += angles.x;
    this.y += angles.y;
    this.z += angles.z;
  }

  /**
   * Converts the Euler angle to a rotation matrix.
   */
  toRotationMatrix() {
    const a = Math.cos(this.x), b = Math.sin(this.x);
    const c = Math.cos(this.y), d = Math.sin(this.y);
    const e = Math.cos(this.z), f = Math.sin(this.z);

    const ae = a * e, af = a * f, be = b * e, bf = b * f;

    const a11 = c * e;
    const a21 = -c * f;
    const a31 = d;

    const a12 = af + be * d;
    const a22 = ae - bf * d;
    const a32 = -b * c;

    const a13 = bf - ae * d;
    const a23 = be + af * d;
    const a33 = a * c;

    return new Matrix4([
      a11, a12, a13, 0,
      a21, a22, a23, 0,
      a31, a32, a33, 0,
      0,   0,   0,   1,
    ]);
  }
}

export { Euler };

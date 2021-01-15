import { Point } from "./Point";

class Vector3 {
  constructor(public x = 0, public y = 0, public z = 0) {}
  setFromPoints(A: Point, B: Point) {
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
  get norm() {
    return (this.x ** 2 + this.y ** 2 + this.z ** 2) ** (1 / 2);
  }
}

export { Vector3 };

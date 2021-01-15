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
}

export { Vector4 };

const pi = Math.PI,
  cos = Math.cos,
  sin = Math.sin,
  asin = Math.asin,
  round = (number: number) => {
    return Math.round(number * 1e9) * 1e-9;
  };
const pd2 = pi / 2,
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
    /*** Finds the affine function of the line that goes between this and point2 ***/
    var a = (point2.x - this.x) / (this.y - point2.y);
    var b = point2.y - a * point2.x;
    return { CM: a, oo: b };
  }
}

export { Point };

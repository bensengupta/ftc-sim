import { Point } from "./Point";

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

export { OCS };

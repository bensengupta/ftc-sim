import { OCS } from "../math/OCS";
import { Point } from "../math/Point";
import { Vector3 } from "../math/Vector3";

class Camera3D {
  // temporary, will be replaced by matrixes later
  constructor(public position = new Point(0, 0, 0), public orientation = new Point(0, 0, 1), public perspective = 0) {
  }
  get vector() {
    return new Vector3().setFromPoints(this.position, this.orientation);
  }
  LonLat(ocs: OCS = new OCS(this.position)) {
    return {};
  }
  set Orientation(o: Point) {
    this.orientation = o;
  }
}

export { Camera3D };

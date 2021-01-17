import { Path3D } from "../geometry/Path3D";
import { Euler } from "../math/Euler";
import { MathUtils } from "../math/MathUtils";
import { Matrix4 } from "../math/Matrix4";
import { Point } from "../math/Point";
import { Vector3 } from "../math/Vector3";

type ObjectOptions = {
  position?: Vector3;
  orientation?: Euler;
  size?: number;
}

/**
 * Base class for all 3D objects passed to the renderer.
 */
class Object3D {
  /**
   * Unique string identifying the object.
   */
  id: string;

  /**
   * Position of the object.
   * @default new Vector(0, 0, 0)
   */
  position: Vector3;

  /**
   * Orientation, in Euler angles, of the object.
   * @default new Euler(0, 0, 0)
   */
  orientation: Euler;

  /**
   * Paths that compose the object.
   */
  paths: Path3D[];

  /**
   * Number that indicates how big the object should be.
   * @default 1
   */
  size: number;

  /**
   * Initialize a new object.
   * @param paths Paths to initialize the object with
   * @param options Optional options to give the object
   */
  constructor(paths: Path3D[], options: ObjectOptions = {}) {
    this.id = MathUtils.id();
    this.paths = paths;

    this.position = options.position ?? new Vector3(0, 0, 0);
    this.orientation = options.orientation ?? new Euler(0, 0, 0);
    this.size = options.size ?? 1;
  }

  /**
   * Rotates the object in place, around the X axis.
   */
  rotateX(rot: number) {
    this.orientation.rotateX(rot);
  }

  /**
   * Rotates the object in place, around the Y axis.
   */
  rotateY(rot: number) {
    this.orientation.rotateY(rot);
  }

  /**
   * Rotates the object in place, around the Z axis.
   */
  rotateZ(rot: number) {
    this.orientation.rotateZ(rot);
  }

  /**
   * Rotates the object in place, changing the orientation.
   */
  rotate(rx: number, ry: number, rz: number) {
    this.orientation.rotate(rx, ry, rz);
  }

  /**
   * Rotates the object around a point.
   */
  rotateAroundPoint(rx: number, ry: number, rz: number, point: Vector3) {
    this.position.rotate(rx, ry, rz, point);
  }

  /**
   * Translates the object.
   */
  translate(tx = 0, ty = 0, tz = 0) {
    this.position.translate(tx, ty, tz);
  }

  /**
   * Calculates model Matrix.
   */
  getModelMatrix() {
    return new Matrix4().compose(this.position, this.orientation, this.size);
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
    for (let path of this.paths)
      for (let point of path.vertices) {
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

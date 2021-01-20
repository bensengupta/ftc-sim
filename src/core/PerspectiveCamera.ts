import { Euler } from "../math/Euler";
import { MathUtils } from "../math/MathUtils";
import { Matrix4 } from "../math/Matrix4";
import { OCS } from "../math/OCS";
import { Point } from "../math/Point";
import { Vector3 } from "../math/Vector3";

type CameraOptions = {
  x?: number;
  y?: number;
  z?: number;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  fov?: number;
  aspectRatio?: number;
  renderDistance?: number;
}

/**
 * The PerspectiveCamera allows you to view your scene with perspective.
 */
class PerspectiveCamera {
  /**
   * Camera position in the Scene.
   * @default new Vector3(0, 0, 0)
   */
  position: Vector3;

  /**
   * Camera's orientation in the Scene.
   * @default new Euler(0, 0, 0)
   */
  orientation: Euler;

  /**
   * Field of View in degrees, controls how much of the scene the Camera can view.
   * @default 90
   */
  fov: number;

  /**
   * Aspect Ratio of screen.
   * @default 1
   */
  aspectRatio: number;

  /**
   * Render distance is the distance from the Camera after which
   * no objects will be rendered.
   * @default 1000
   */
  renderDistance: number;

  /**
   * Camera projection Matrix, generated with CameraOptions.
   */
  projection: Matrix4;

  /**
   * Initialize Perspective Camera.
   * @param options Optional Parameters
   */
  constructor(options: CameraOptions = {}) {
    this.position = new Vector3(
      options.x ?? 0,
      options.y ?? 0,
      options.z ?? 0,
    );
    this.orientation = new Euler(
      options.rotX ?? 0,
      options.rotY ?? 0,
      options.rotZ ?? 0,
    );
    this.fov = options.fov ?? 90;
    this.aspectRatio = options.aspectRatio ?? 1;
    this.renderDistance = options.renderDistance ?? 100;
    this.projection = this.calculateProjectionMatrix();
  }

  /**
   * Move the camera.
   */
  translate(tx: number, ty: number, tz: number) {
    this.position.translate(tx, ty, tz);
  }

  /**
   * Rotate the camera.
   */
  rotate(rx: number, ry: number, rz: number) {
    this.orientation.rotate(rx, ry, rz);
  }

  /**
   * Calculates View matrix of the Camera to the origin.
   */
  getViewMatrix() {
    const view = new Matrix4();
    return view.compose(this.position, this.orientation);
  }
  
  /**
   * Calculate Camera's projection matrix.
   */
  private calculateProjectionMatrix() {
    // From scratchapixel.com (https://bit.ly/39ALRDg)
    const near = 0.1;
    const far = this.renderDistance;
    const farmnear = far - near;

    const yScale = 1 / Math.tan(this.fov * MathUtils.DEG2RAD / 2);
    const xScale = yScale / this.aspectRatio;

    const a11 = yScale;
    const a22 = xScale;
    const a33 = -far / farmnear;
    const a34 = -far * near / farmnear;

    return new Matrix4([
      a11, 0,   0,   0,
      0,   a22, 0,   0,
      0,   0,   a33, a34,
      0,   0,   -1,  0,
    ]);
  }
}

export { PerspectiveCamera };

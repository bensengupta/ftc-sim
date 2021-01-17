import { Euler } from "../math/Euler";
import { MathUtils } from "../math/MathUtils";
import { Matrix4 } from "../math/Matrix4";
import { OCS } from "../math/OCS";
import { Point } from "../math/Point";
import { Vector3 } from "../math/Vector3";

type CameraOptions = {
  position?: Vector3;
  orientation?: Euler;
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
    this.position = options.position ?? new Vector3(0, 0, 0);
    this.orientation = options.orientation ?? new Euler(0, 0, 0);
    this.fov = options.fov ?? 90;
    this.aspectRatio = options.aspectRatio ?? 1;
    this.renderDistance = options.renderDistance ?? 100;
    this.projection = this.calculateProjectionMatrix();
  }

  /**
   * Calculates View matrix of the Camera to the origin.
   */
  getViewMatrix() {
    const view = new Matrix4();
    return view.compose(this.position, this.orientation);
  }
  
  private calculateProjectionMatrix() {
    // From scratchapixel.com (https://bit.ly/39ALRDg)
    const near = 0.1;
    const far = this.renderDistance;
    const farmnear = far - near;

    const yScale = 1 / Math.tan(this.fov * MathUtils.DEG2RAD / 2);
    const xScale = yScale / this.aspectRatio;

    // double yScale = 1.0 / tan(D2R * fov / 2);
    // double xScale = yScale / aspect;
    // double nearmfar = near - far;
    // double m[] = {
    //     xScale, 0, 0, 0,
    //     0, yScale, 0, 0,
    //     0, 0, (far + near) / nearmfar, -1,
    //     0, 0, 2*far*near / nearmfar, 0 
    // };

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

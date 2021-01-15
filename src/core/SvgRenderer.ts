import { Matrix3 } from "../math/Matrix3";
import { Point } from "../math/Point";
import { Vector3 } from "../math/Vector3";
import { Camera3D } from "./Camera3D";
import { Scene } from "./Scene";

type SvgRendererOptions = {
  svg?: SVGSVGElement;
  domDimensions?: Point;
};

/**
 * The SvgRenderer displays your scene using Svg paths.
 */
class SvgRenderer {
  /**
   * An SVG that the renderer uses to draw the scene.
   * @default document.createElementNS("http://www.w3.org/2000/svg", "svg")
   */
  domElement: SVGSVGElement;

  /**
   * Dimensions of the SVG element.
   */
  domDimensions: Point;

  /**
   * Initialize the renderer.
   * @param options Optional parameters used to initialize the renderer
   */
  constructor(options: SvgRendererOptions = {}) {
    this.domElement =
      options.svg ??
      document.createElementNS("http://www.w3.org/2000/svg", "svg");
    if (options.domDimensions) {
      this.domDimensions = options.domDimensions;
    } else {
      const rect = this.domElement.getBoundingClientRect();
      this.domDimensions = new Point(rect.width, rect.height);
    }
  }

  /**
   * Renders a given scene with a camera.
   */
  render(scene: Scene, camera: Camera3D) {
    // Reset svg
    this.domElement.innerHTML = "";

    // Collect all paths from objects in scene
    const paths = scene.objects
      .flatMap((obj) => obj.unrotated3dPlane)
      .sort((p1, p2) => p2.zIndex - p1.zIndex);

    const div = document.createElement("div");

    for (let path of paths) {
      // console.log(origin, this.unrotated3dPlane);
      let str = "";
      for (let point of path.unrotated3dPlane) {
        var coef =
          camera.perspective > 0.003 ? 1 + point.z / camera.perspective : 1;
        str +=
          (path.unrotated3dPlane.indexOf(point) === 0 ? "M " : " L ") +
          (scene.origin.x * this.domDimensions.x + point.x * coef) +
          "," +
          (scene.origin.y * this.domDimensions.x - point.y * coef);
        // console.log(str);
      }
      path.path2D.setAttribute("d", str + " z")

      div.insertAdjacentElement("afterbegin", path.path2D);
      this.domElement.insertAdjacentHTML("beforeend", div.innerHTML);
    }
  }
}

export { SvgRenderer };
import { Matrix4 } from "../math/Matrix4";
import { Point } from "../math/Point";
import { Vector3 } from "../math/Vector3";
import { PerspectiveCamera } from "./PerspectiveCamera";
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
  render(scene: Scene, camera: PerspectiveCamera) {
    // Reset svg
    this.domElement.style.backgroundColor = scene.background;
    this.domElement.innerHTML = "";

    const div = document.createElement("div");

    const view = camera.getViewMatrix();
    // temporary: empty matrix, fix when someone understands projection matrix
    const projection = camera.projection;

    const screenX = scene.origin.x * this.domDimensions.x;
    const screenY = scene.origin.y * this.domDimensions.y;

    const sortedObjects = scene.objects.sort((obj1, obj2) => obj2.position.z - obj1.position.z);

    const paths: [z: number, path: SVGPathElement][] = [];

    // Step 1: Transform all vertices and track depth of paths
    for (const obj of sortedObjects) {
      const model = obj.getModelMatrix();

      const mvpMatrix = new Matrix4().multiplyMatrix(projection).multiplyMatrix(view).multiplyMatrix(model);


      for (const path of obj.paths) {
        let pathStr = "";
        let avgZ = 0;

        path.vertices.forEach((vertice, index) => {
          let newVert = vertice.toVector4().multiplyMatrix(mvpMatrix);
          avgZ += newVert.z;
          pathStr += `${index === 0 ? "M" : " L"} ${screenX + newVert.x}, ${screenY - newVert.y}`;
        });

        avgZ /= path.vertices.length;

        path.path2D.setAttribute("d", pathStr + " z");

        paths.push([avgZ, path.path2D]);
      }
    }

    // Step 2: Render all paths in order of depth
    const sortedPaths = paths.sort(([z1], [z2]) => z1 - z2).map(([z, domElem]) => domElem);

    for (const domElem of sortedPaths) {
      div.insertAdjacentElement("afterbegin", domElem);
      this.domElement.insertAdjacentHTML("beforeend", div.innerHTML);
    }
  }
}

export { SvgRenderer };
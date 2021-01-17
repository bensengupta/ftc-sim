import { Object3D } from "../core/Object3D";
import { Euler } from "../math/Euler";
import { Vector3 } from "../math/Vector3";
import { Path3D } from "./Path3D";

type BoxOptions = {
  x?: number;
  y?: number;
  z?: number;
  width?: number;
  height?: number;
  depth?: number;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
}

class Box extends Object3D {
  /**
   * Creates a Box.
   * @param options Optional parameters to initialize the Box
   */
  constructor(options: BoxOptions = {}) {
    const x = options.x ?? 0;
    const y = options.y ?? 0;
    const z = options.z ?? 0;
    const w = (options.width ?? 10) / 2;
    const h = (options.height ?? 10) / 2;
    const d = (options.depth ?? 10) / 2;
    const rotX = options.rotX ?? 0;
    const rotY = options.rotY ?? 0;
    const rotZ = options.rotZ ?? 0;

    // Points
    const p1 = new Vector3(-w, -h, -d);
    const p2 = new Vector3(-w, -h,  d);
    const p3 = new Vector3(-w,  h, -d);
    const p4 = new Vector3(-w,  h,  d);
    const p5 = new Vector3( w, -h, -d);
    const p6 = new Vector3( w, -h,  d);
    const p7 = new Vector3( w,  h, -d);
    const p8 = new Vector3( w,  h,  d);

    // Surfaces
    const path1 = new Path3D(p1, p2, p4, p3);
    const path2 = new Path3D(p2, p1, p5, p6);
    const path3 = new Path3D(p1, p3, p7, p5);
    const path4 = new Path3D(p4, p2, p6, p8);
    const path5 = new Path3D(p6, p5, p7, p8);
    const path6 = new Path3D(p3, p4, p8, p7);

    // Color
    path1.fill = "red";
    path1.stroke = "#000";
    path1.strokeWidth = "1";
    path2.fill = "green";
    path2.stroke = "#000";
    path2.strokeWidth = "1";
    path3.fill = "blue";
    path3.stroke = "#000";
    path3.strokeWidth = "1";
    path4.fill = "yellow";
    path4.stroke = "#000";
    path4.strokeWidth = "1";
    path5.fill = "cyan";
    path5.stroke = "#000";
    path5.strokeWidth = "1";
    path6.fill = "magenta";
    path6.stroke = "#000";
    path6.strokeWidth = "1";

    super(
      [path1, path2, path3, path4, path5, path6],
      {
        position: new Vector3(x, y, z),
        orientation: new Euler(rotX, rotY, rotZ),
      }
    );
  }
}

export { Box };

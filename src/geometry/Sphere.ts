import { Object3D } from "../core/Object3D";
import { Euler } from "../math/Euler";
import { Vector3 } from "../math/Vector3";
import { Path3D } from "./Path3D";

type EllipsoidOptions = {
  x?: number;
  y?: number;
  z?: number;
  radiusX?: number;
  radiuxY?: number;
  radiusZ?: number;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
}

class Ellipsoid extends Object3D {
  /**
   * Creates a Ellipsoid.
   * @param options Optional parameters to initialize the Ellipsoid
   */
  constructor(options: EllipsoidOptions = {}) {
    const x = options.x ?? 0;
    const y = options.y ?? 0;
    const z = options.z ?? 0;
    const radX = options.radiusX ?? 100;
    const radY = options.radiuxY ?? 100;
    const radZ = options.radiusZ ?? 100;
    const rotX = options.rotX ?? 0;
    const rotY = options.rotY ?? 0;
    const rotZ = options.rotZ ?? 0;

    const lo = 5;
    const la = 10;

    // Points
    const points: { [key: string]: Vector3 } = {};

    for (let lat = 0; lat < la; lat++)
      for (let lon = 0; lon < lo; lon++) {
        const angLO = (lon / lo) * Math.PI * 2;
        const angLA = (lat / la) * 2 * Math.PI;

        const point = new Vector3(
          Math.cos(angLO) * Math.cos(angLA) * radX,
          Math.sin(angLA) * radY,
          Math.sin(angLO) * Math.cos(angLA) * radZ,
        );

        points[lat + "," + lon] = point;
      }

    // Surfaces
    const paths = [];
    for (let lat = 0; lat < la; lat++)
      for (let lon = 0; lon < lo; lon++) {
        const la1 = (lat + 1) % la;
        const lo1 = (lon + 1) % lo;

        paths.push(
          new Path3D(
            points[lat + "," + lon],
            points[la1 + "," + lon],
            points[la1 + "," + lo1],
            points[lat + "," + lo1]
          )
        );
      }

    // Color
    for (let path of paths) {
      const c1 = Math.random() * 255;
      const c2 = Math.random() * 255;
      const c3 = Math.random() * 255;
      path.fill = `rgb(${c1},${c2},${c3})`
    }
    paths[paths.length - 1].fill = "#ff0";

    super(
      paths,
      {
        position: new Vector3(x, y, z),
        orientation: new Euler(rotX, rotY, rotZ),
      }
    );
  }  
}

export { Ellipsoid as Sphere };


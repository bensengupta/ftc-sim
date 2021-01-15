import { Vector3 } from "./Vector3";

class Matrix4 {
  /**
   * Matrix values stored in array.
   * @default [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0]
   */
  elements: number[];

  /**
   * Initialize a new Matrix.
   * @param elements Initial values of Matrix
   */
  constructor(elements?: number[]) {
    this.elements = elements ?? [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
    ]
  }
}

export { Matrix4  };

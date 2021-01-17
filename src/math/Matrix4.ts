import { Euler } from "./Euler";
import { Vector3 } from "./Vector3";

type Matrix4Array = [
  a11: number, a12: number, a13: number, a14: number,
  a21: number, a22: number, a23: number, a24: number,
  a31: number, a32: number, a33: number, a34: number,
  a41: number, a42: number, a43: number, a44: number,
]

class Matrix4 {
  /**
   * Matrix values stored in an array.
   * @default [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
   */
  elements: Matrix4Array;

  /**
   * Initialize a new Matrix.
   * @param elements Initial values of the Matrix
   */
  constructor(elements?: Matrix4Array) {
    this.elements = elements ?? [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];
  }

  /**
   * Multiplies this Matrix by another Matrix.
   */
  multiplyMatrix(mat: Matrix4) {
    const te = this.elements;
    const me = mat.elements;

    const a11 = te[0]  * me[0] + te[1]  * me[4] + te[2]  * me[8] + te[3]  * me[12];
    const a21 = te[4]  * me[0] + te[5]  * me[4] + te[6]  * me[8] + te[7]  * me[12];
    const a31 = te[8]  * me[0] + te[9]  * me[4] + te[10] * me[8] + te[11] * me[12];
    const a41 = te[12] * me[0] + te[13] * me[4] + te[14] * me[8] + te[15] * me[12];

    const a12 = te[0]  * me[1] + te[1]  * me[5] + te[2]  * me[9] + te[3]  * me[13];
    const a22 = te[4]  * me[1] + te[5]  * me[5] + te[6]  * me[9] + te[7]  * me[13];
    const a32 = te[8]  * me[1] + te[9]  * me[5] + te[10] * me[9] + te[11] * me[13];
    const a42 = te[12] * me[1] + te[13] * me[5] + te[14] * me[9] + te[15] * me[13];

    const a13 = te[0]  * me[2] + te[1]  * me[6] + te[2]  * me[10] + te[3]  * me[14];
    const a23 = te[4]  * me[2] + te[5]  * me[6] + te[6]  * me[10] + te[7]  * me[14];
    const a33 = te[8]  * me[2] + te[9]  * me[6] + te[10] * me[10] + te[11] * me[14];
    const a43 = te[12] * me[2] + te[13] * me[6] + te[14] * me[10] + te[15] * me[14];

    const a14 = te[0]  * me[3] + te[1]  * me[7] + te[2]  * me[11] + te[3]  * me[15];
    const a24 = te[4]  * me[3] + te[5]  * me[7] + te[6]  * me[11] + te[7]  * me[15];
    const a34 = te[8]  * me[3] + te[9]  * me[7] + te[10] * me[11] + te[11] * me[15];
    const a44 = te[12] * me[3] + te[13] * me[7] + te[14] * me[11] + te[15] * me[15];

    this.elements = [
      a11, a12, a13, a14,
      a21, a22, a23, a24,
      a31, a32, a33, a34,
      a41, a42, a43, a44,
    ]

    return this;
  }

  multiplyScalar(n: number) {
    const te = this.elements;

    this.elements = [
      te[0]  * n, te[1]  * n, te[2]  * n, te[3]  * n,
      te[4]  * n, te[5]  * n, te[6]  * n, te[7]  * n,
      te[8]  * n, te[9]  * n, te[10] * n, te[11] * n,
      te[12] * n, te[13] * n, te[14] * n, te[15] * n,
    ];

    return this;
  }

  /**
   * Compose transformation Matrix.
   * @param position Position Vector of the object
   * @param orientation Orientation of the object
   * @param size Size of the object
   */
  compose(position: Vector3, orientation: Euler, size = 1) {
    const translate = position.toTransformMatrix();
    const rotate = orientation.toRotationMatrix();
    const scale = new Matrix4().multiplyScalar(size);

    return this.multiplyMatrix(translate).multiplyMatrix(rotate).multiplyMatrix(scale);
  }
}

export { Matrix4 };

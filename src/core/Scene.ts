import { Point } from "../math/Point";
import { Object3D } from "./Object3D";

type SceneOptions = {
  background?: string;
  objects?: Object3D[];
  origin?: Point;
};

class Scene {
  background: string;
  objects: Object3D[] = [];
  origin: Point;

  constructor(options: SceneOptions = {}) {
    this.background = options.background ?? "#fff";
    this.objects = options.objects ?? [];
    this.origin = options.origin ?? new Point(0.5, 0.5);
  }

  add(object: Object3D) {
    this.objects.push(object);
  }

  remove(objectId: string) {
    this.objects = this.objects.filter((obj) => obj.id !== objectId);
  }
}

export { Scene };

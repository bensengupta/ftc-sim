import { SimInitParams, SimMod, SimRenderParams } from "../core";
import { drawArrow } from "../helpers";
import { Point } from "./purePursuit/Path";

export class RobotPose {
  constructor(public x: number, public y: number, public heading: number) {}

  toPoint(): Point {
    return new Point(this.x, this.y);
  }
}

type RobotModProperties = {
  /**
   * Initial x position of the robot.
   */
  x: number;
  /**
   * Initial y position of the robot.
   */
  y: number;
  /**
   * Initial heading of the robot.
   */
  heading: number;
  /**
   * Color of the robot.
   */
  color: string;
  /**
   * Width of the robot.
   */
  width: number;
  /**
   * Length of the robot.
   */
  length: number;
};

export class RobotMod extends SimMod {
  constructor(public properties: RobotModProperties) {
    super();
  }

  init({ resources }: SimInitParams<{ robotPose: RobotPose }>) {
    resources.robotPose = new RobotPose(
      this.properties.x,
      this.properties.y,
      this.properties.heading
    );
  }

  render({ ctx, resources }: SimRenderParams<{ robotPose: RobotPose }>) {
    ctx.fillStyle = this.properties.color;
    ctx.translate(resources.robotPose.x, resources.robotPose.y);
    ctx.rotate(resources.robotPose.heading + Math.PI);
    ctx.fillRect(
      -this.properties.width / 2,
      -this.properties.length / 2,
      this.properties.width,
      this.properties.length
    );

    ctx.lineWidth = 3;
    // Draw Directional Vector Arrow
    ctx.beginPath();
    drawArrow(ctx, 0, 0, 0, this.properties.length);
    ctx.stroke();

    // ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

import {
  SimInitParams,
  SimMod,
  SimRenderParams,
  SimUpdateParams,
} from "../core";
import { RobotPose } from "./robot";

type TraceRobotModProperties = {};

export class TraceRobotMod extends SimMod {
  prevX: number[] = [];
  prevY: number[] = [];

  constructor(public properties: TraceRobotModProperties = {}) {
    super();
  }

  init({ resources }: SimInitParams<{ robotPose: RobotPose }>) {
    if (!resources.robotPose) {
      console.error("TraceRobotMod must be initialised after RobotMod");
    }
  }

  fixedUpdate({ resources }: SimUpdateParams<{ robotPose: RobotPose }>) {
    const newX = resources.robotPose.x;
    const newY = resources.robotPose.y;
    const lastX = this.prevX[this.prevX.length - 1];
    const lastY = this.prevY[this.prevY.length - 1];
    if (newX !== lastX && newY !== lastY) {
      this.prevX.push(newX);
      this.prevY.push(newY);
    }
  }

  render({ ctx }: SimRenderParams<{ robotPose: RobotPose }>) {
    // Draw lines
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgb(224, 145, 54)";
    for (let i = 0; i < this.prevX.length - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(this.prevX[i], this.prevY[i]);
      ctx.lineTo(this.prevX[i + 1], this.prevY[i + 1]);
      ctx.stroke();
    }
  }
}

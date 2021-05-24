import { fromEvent } from "rxjs";
import {
  distinctUntilChanged,
  filter,
  groupBy,
  map,
  mergeAll,
  mergeWith,
  scan,
} from "rxjs/operators";
import {
  SimInitParams,
  SimMod,
  SimRenderParams,
  SimUpdateParams,
} from "../../core";
import { drawPoint } from "../../helpers";
import { Path, Point } from "./Path";
import { Movement } from "./Movement";
import { RobotPose } from "../robot";

type PurePursuitModProperties = {
  /**
   * Preferred Heading angle that the robot should face, in radians.
   */
  preferredHeading: number;
  /**
   * Velocity of the robot in mm/s.
   */
  frontSpeed: number;
  /**
   * Velocity of the robot in mm/s.
   */
  sidewaysSpeed: number;
  /**
   * Angular velocity of the robot in rad/s.
   */
  turnSpeed: number;
  /**
   * Waypoints to follow.
   */
  waypoints: Point[];
};

export class PurePursuitMod extends SimMod {
  path: Path;
  robot?: Movement;

  constructor(public properties: PurePursuitModProperties) {
    super();
    const path = new Path(properties.preferredHeading);
    properties.waypoints.forEach((p) => {
      path.addPoint(p.x, p.y);
    });
    this.path = path;
  }

  init({ resources, canvas }: SimInitParams<{ robotPose: RobotPose }>) {
    if (!resources.robotPose) {
      console.error("PurePursuitMod must be initialised after RobotMod");
    }
    const { frontSpeed, sidewaysSpeed, turnSpeed } = this.properties;
    this.robot = new Movement({
      frontSpeed,
      sidewaysSpeed,
      turnSpeed,
      pose: resources.robotPose,
    });

    const keydown = fromEvent<KeyboardEvent>(document, "keydown");
    const keyup = fromEvent<KeyboardEvent>(document, "keyup");
    const mouseup = fromEvent<MouseEvent>(document, "mouseup");

    keydown
      .pipe(
        // Merge keyup and keydown observables
        mergeWith(keyup),
        // Dedupe events
        groupBy((e) => e.code),
        map((group) =>
          group.pipe(
            distinctUntilChanged((prev, next) => prev.type === next.type)
          )
        ),
        mergeAll(),
        scan(
          (map, { code, type }) => map.set(code, type === "keydown"),
          new Map<string, boolean>()
        )
      )
      .subscribe((map) => {
        let f = 0,
          s = 0,
          t = 0;
        if (map.get("KeyW")) {
          f += 1;
        }
        if (map.get("KeyD")) {
          s -= 1;
        }
        if (map.get("KeyS")) {
          f -= 1;
        }
        if (map.get("KeyA")) {
          s += 1;
        }
        if (map.get("KeyE")) {
          t += 1;
        }
        if (map.get("KeyQ")) {
          t -= 1;
        }
        this.robot!.move(f, s, t);
      });

    mouseup
      .pipe(filter((ev) => ev.button === 0))
      .subscribe(({ clientX, clientY }) => {
        resources.robotPose.x = (clientX / canvas.width) * 3600;
        resources.robotPose.y = (clientY / canvas.height) * 3600;
      });
  }

  fixedUpdate({ deltaTime }: SimUpdateParams<{ robotPose: RobotPose }>) {
    // const debug = this.robot?.followPath(this.path, deltaTime);
    this.robot?.update(deltaTime);
  }

  render({ ctx, resources }: SimRenderParams<{ robotPose: RobotPose }>) {
    const { currentPointIndex, points } = this.path;

    // Draw lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgb(0, 200, 0)";
    for (let i = 0; i < points.length - 1; i++) {
      const point = points[i];
      const nextPoint = points[i + 1];

      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(nextPoint.x, nextPoint.y);
      ctx.stroke();
    }

    const debug = this.robot?.followPath(this.path);
    if (debug) {
      ctx.beginPath();
      ctx.moveTo(resources.robotPose.x, resources.robotPose.y);
      ctx.lineTo(
        resources.robotPose.x + debug.deltaX,
        resources.robotPose.y + debug.deltaY
      );
      ctx.stroke();
    }

    // Draw Points
    points.forEach((point, index) => {
      ctx.fillStyle =
        index === this.path.currentPointIndex + 1
          ? "rgb(200, 0, 0)"
          : "rgb(250, 200, 0)";
      ctx.beginPath();
      drawPoint({ context: ctx, x: point.x, y: point.y });
      ctx.fill();
    });

    if (this.robot) {
      // Draw Lookahead circle
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(
        resources.robotPose.x,
        resources.robotPose.y,
        points[currentPointIndex].lookaheadDistance,
        points[currentPointIndex].lookaheadDistance,
        0,
        0,
        2 * Math.PI
      );
      ctx.stroke();
    }
  }
}

export { Point };

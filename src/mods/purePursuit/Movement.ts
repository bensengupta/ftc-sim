import { clamp } from "lodash";
import { RobotPose } from "../robot";
import { DEG_TO_RAD, TWO_PI } from "../../helpers";
import { Path, PathPoint, lineCircleIntersection } from "./Path";

export type MovementProperties = {
  /**
   * Robot pose: position and orientation.
   */
  pose: RobotPose;
  /**
   * Velocity of the robot in mm/s.
   */
  frontSpeed: number;
  /**
   * Velocity of the robot in mm/s.
   */
  sidewaysSpeed: number;
  /**
   * Velocity of the robot in rad/s.
   */
  turnSpeed: number;
};

export class Movement {
  constructor(public robotProperties: MovementProperties) {}

  lastFront = 0;
  lastSideways = 0;
  lastTurn = 0;

  move(front: number, sideways: number, turn: number) {
    const combinedPower = Math.max(
      1,
      Math.abs(front) + Math.abs(sideways) + Math.abs(turn)
    );

    const { frontSpeed, sidewaysSpeed, turnSpeed } = this.robotProperties;

    const frontPower = (front / combinedPower) * frontSpeed;
    const sidewaysPower = (sideways / combinedPower) * sidewaysSpeed;
    const turnPower = (turn / combinedPower) * turnSpeed;

    this.lastFront = frontPower;
    this.lastSideways = sidewaysPower;
    this.lastTurn = turnPower;
  }

  update(deltaTime: number) {
    const { pose } = this.robotProperties;

    const front = this.lastFront * deltaTime;
    const sideways = this.lastSideways * deltaTime;
    const turn = this.lastTurn * deltaTime;

    const c = Math.cos(pose.heading);
    const s = Math.sin(pose.heading);

    pose.x += -sideways * c + front * s;
    pose.y += -sideways * s - front * c;
    pose.heading += turn;
  }

  followPath(path: Path) {
    // Short-circuit
    if (path.currentPointIndex === path.points.length - 1) {
      return;
    }

    const robotPosition = this.robotProperties.pose;

    for (let i = path.currentPointIndex; i < path.points.length; i++) {
      const point = path.points[i];
      if (
        point.inCircle(
          robotPosition.x,
          robotPosition.y,
          point.lookaheadDistance
        )
      ) {
        path.currentPointIndex = i;
      }
    }

    // Reached end of path
    if (path.currentPointIndex === path.points.length - 1) {
      this.move(0, 0, 0);
      return;
    }

    const pointInCircle = path.points[path.currentPointIndex];
    const pointOutsideCircle = path.points[path.currentPointIndex + 1];

    const intersections = lineCircleIntersection(
      robotPosition.toPoint(),
      pointOutsideCircle.lookaheadDistance,
      pointInCircle,
      pointOutsideCircle
    );

    let target: PathPoint;
    if (intersections.length === 0) {
      target = pointOutsideCircle;
    } else if (intersections.length === 1) {
      target = new PathPoint(pointOutsideCircle).setPoint(intersections[0]);
    } else {
      const closest =
        intersections[0].distanceTo(pointOutsideCircle) <
        intersections[1].distanceTo(pointOutsideCircle)
          ? intersections[0]
          : intersections[1];
      target = new PathPoint(pointOutsideCircle).setPoint(closest);
    }

    // Navigate to target
    const deltaX = target.x - robotPosition.x;
    const deltaY = target.y - robotPosition.y;
    const absoluteAngleToTarget = Math.atan2(deltaY, deltaX);
    const distanceToTarget =
      intersections.length === 0
        ? Math.hypot(deltaX, deltaY)
        : pointOutsideCircle.lookaheadDistance;

    const relativeAngleToTarget =
      (absoluteAngleToTarget - (robotPosition.heading - 180 * DEG_TO_RAD)) %
      TWO_PI;
    const relativeXToPoint = Math.cos(relativeAngleToTarget) * distanceToTarget;
    const relativeYToPoint = Math.sin(relativeAngleToTarget) * distanceToTarget;

    const totalComponent =
      Math.abs(relativeXToPoint) + Math.abs(relativeYToPoint);

    const movementXPower = relativeXToPoint / totalComponent;
    const movementYPower = relativeYToPoint / totalComponent;

    const relativeTurnAngle =
      relativeAngleToTarget - 90 * DEG_TO_RAD + path.preferredHeading;
    const turnPower = clamp(relativeTurnAngle / (30 * DEG_TO_RAD), -1, 1);

    this.move(
      movementYPower * target.robotMoveSpeed,
      movementXPower * target.robotMoveSpeed,
      turnPower * target.robotRotationSpeed
    );

    return {
      robotPosition,
      intersections,
      relativeXToPoint,
      relativeYToPoint,
      target,
      relativeTurnAngle,
      absoluteAngleToTarget,
      deltaX,
      deltaY,
    };
  }
}

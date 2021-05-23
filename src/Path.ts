export class Point {
  constructor(public x: number, public y: number) {}

  inCircle(circleX: number, circleY: number, circleRadius: number) {
    const dx = this.x - circleX;
    const dy = this.y - circleY;
    return dx ** 2 + dy ** 2 < circleRadius ** 2;
  }

  distanceTo(otherPoint: Point) {
    return Math.hypot(otherPoint.x - this.x, otherPoint.y - this.y);
  }
}

export class PathPoint extends Point {
  robotMoveSpeed: number;
  robotRotationSpeed: number;
  lookaheadDistance: number;

  constructor(
    x: number,
    y: number,
    robotMoveSpeed: number,
    robotRotationSpeed: number,
    lookaheadDistance: number
  );
  constructor(otherPoint: PathPoint);
  constructor(
    xOrPoint: number | PathPoint,
    y?: number,
    robotMoveSpeed?: number,
    robotRotationSpeed?: number,
    lookaheadDistance?: number
  ) {
    if (xOrPoint instanceof PathPoint) {
      const point = xOrPoint;
      super(point.x, point.y);
      this.robotMoveSpeed = point.robotMoveSpeed;
      this.robotRotationSpeed = point.robotRotationSpeed;
      this.lookaheadDistance = point.lookaheadDistance;
    } else {
      super(xOrPoint, y!);
      this.robotMoveSpeed = robotMoveSpeed!;
      this.robotRotationSpeed = robotRotationSpeed!;
      this.lookaheadDistance = lookaheadDistance!;
    }
  }

  setPoint(point: Point): PathPoint {
    this.x = point.x;
    this.y = point.y;
    return this;
  }
}

export class Path {
  points: PathPoint[] = [];
  currentPointIndex = 0;
  constructor(public preferredHeading: number) {}

  addPoint(x: number, y: number): Path {
    this.points.push(new PathPoint(x, y, 0.6, 0.3, 500));
    return this;
  }

  addPoints(points: Point[]): Path {
    points.forEach((p) => {
      this.points.push(new PathPoint(p.x, p.y, 0.6, 0.3, 500));
    });
    return this;
  }
}

export function lineCircleIntersection(
  circleCenter: Point,
  radius: number,
  linePoint1: Point,
  linePoint2: Point
): Point[] {
  const dx = linePoint1.x - circleCenter.x;
  const dy = linePoint1.y - circleCenter.y;

  if (Math.abs(linePoint2.x - linePoint1.x) <= 0.01) {
    linePoint2.x += 0.01;
  }

  const m = (linePoint2.y - linePoint1.y) / (linePoint2.x - linePoint1.x);
  const p = linePoint1.y - m * linePoint1.x;

  const a = m * m + 1;
  const b = -circleCenter.x * 2 + m * (p - circleCenter.y) * 2;
  const c = circleCenter.x ** 2 + (p - circleCenter.y) ** 2 - radius ** 2;

  const d = b * b - 4 * a * c;

  if (d >= 0) {
    // insert into quadratic formula
    const intersectX = [
      (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a),
      (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a),
    ];
    const intersections = intersectX.map((x) => new Point(x, m * x + p));
    if (d == 0) {
      // only 1 intersection
      return [intersections[0]];
    }
    return intersections;
  }
  // no intersection
  return [];
}

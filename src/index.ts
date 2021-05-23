import { Path, Point } from "./Path";
import { Robot, RobotPose } from "./Robot";
import { drawArrow, drawPoint } from "./helpers";
import { fromEvent } from "rxjs";
import {
  scan,
  map,
  groupBy,
  distinctUntilChanged,
  mergeWith,
  mergeAll,
  filter,
} from "rxjs/operators";

type FtcSimOptions = {
  useKeyboard: boolean;
};

class FtcSim {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  resources: Record<string, any> = {};
  modules: FtcSimulatorModule[] = [];

  constructor(public options: FtcSimOptions) {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";

    this.canvas = canvas;
    this.ctx = ctx;
  }

  use(module: FtcSimulatorModule) {
    module.init({
      canvas: this.canvas,
      ctx: this.ctx,
      resources: this.resources,
    });
    this.modules.push(module);
    return this;
  }

  private fixedUpdate(deltaTime: number) {
    this.modules.forEach((module) => {
      module.fixedUpdate({
        canvas: this.canvas,
        ctx: this.ctx,
        resources: this.resources,
        deltaTime,
      });
    });
  }

  private render() {
    this.ctx.clearRect(0, 0, 3600, 3600);
    this.modules.forEach((module) => {
      this.ctx.setTransform(
        this.canvas.width / 3600,
        0,
        0,
        this.canvas.height / 3600,
        0,
        0
      );
      module.render({
        canvas: this.canvas,
        ctx: this.ctx,
        resources: this.resources,
      });
    });
  }

  start() {
    const fps = 60;
    const interval = 1000 / fps;

    let then = window.performance.now();

    function loop(now: number) {
      requestAnimationFrame(loop);

      sim.render();

      const elapsed = now - then;

      if (elapsed > interval) {
        sim.fixedUpdate(elapsed / 100);

        then = now;
      }
    }
    loop(then);
  }
}

type SimContext<R extends Record<string, unknown>> = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  resources: R;
};

type SimInitParams<R extends Record<string, unknown> = {}> = SimContext<R>;
type SimUpdateParams<R extends Record<string, unknown> = {}> = SimContext<R> & {
  deltaTime: number;
};
type SimRenderParams<R extends Record<string, unknown> = {}> = SimContext<R>;

abstract class FtcSimulatorModule {
  init(params: SimInitParams) {}
  fixedUpdate(params: SimUpdateParams) {}
  render(params: SimRenderParams) {}
}

type RobotModuleProperties = {
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

class RobotModule extends FtcSimulatorModule {
  constructor(public properties: RobotModuleProperties) {
    super();
  }

  init({ resources }: SimInitParams<{ robotPose: RobotPose }>) {
    resources.robotPose = new RobotPose(0, 0, Math.PI);
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

    // Draw Directional Vector Arrow
    ctx.beginPath();
    drawArrow(ctx, 0, 0, 0, this.properties.length);
    ctx.stroke();

    // ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

type PurePursuitModuleProperties = {
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

class PurePursuitModule extends FtcSimulatorModule {
  path: Path;
  robot?: Robot;

  constructor(public properties: PurePursuitModuleProperties) {
    super();
    const path = new Path(0);
    properties.waypoints.forEach((p) => {
      path.addPoint(p.x, p.y);
    });
    this.path = path;
  }

  init({ resources, canvas }: SimInitParams<{ robotPose: RobotPose }>) {
    if (!resources.robotPose) {
      console.error("PurePursuitModule must be initialised after RobotModule");
    }
    const { frontSpeed, sidewaysSpeed, turnSpeed } = this.properties;
    this.robot = new Robot({
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
          s += 1;
        }
        if (map.get("KeyS")) {
          f -= 1;
        }
        if (map.get("KeyA")) {
          s -= 1;
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
      ctx.fillStyle = "rgb(0, 100, 100)";
      ctx.beginPath();
      drawPoint({
        context: ctx,
        x: debug.target.x,
        y: debug.target.y,
      });
      ctx.fill();

      ctx.lineWidth = 5;
      ctx.beginPath();
      const angle = resources.robotPose.heading - Math.PI / 2;
      ctx.arc(
        resources.robotPose.x,
        resources.robotPose.y,
        300,
        angle,
        angle + debug.relativeTurnAngle,
        false
      );
      ctx.stroke();

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
        index === this.path.currentPointIndex
          ? "rgb(200, 0, 0)"
          : "rgb(250, 200, 0)";
      ctx.beginPath();
      drawPoint({ context: ctx, x: point.x, y: point.y });
      ctx.fill();
    });

    if (this.robot) {
      // Draw Lookahead circle
      ctx.lineWidth = 4;
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

const sim = new FtcSim({ useKeyboard: true })
  .use(
    new RobotModule({
      color: "rgb(200, 0, 0)",
      length: 300,
      width: 300,
    })
  )
  .use(
    new PurePursuitModule({
      preferredHeading: 0,
      frontSpeed: 100,
      sidewaysSpeed: 100,
      turnSpeed: Math.PI / 8,
      waypoints: [
        new Point(100, 100),
        new Point(500, 200),
        new Point(500, 800),
        new Point(1000, 200),
        new Point(1000, 800),
        new Point(500, 2000),
        new Point(800, 2200),
        new Point(300, 2500),
        new Point(500, 2600),
        new Point(550, 2650),
        new Point(570, 2675),
        new Point(600, 2800),
        new Point(3000, 3000),
        new Point(3000, 500),
      ],
    })
  );

sim.start();

// Try removing if you have issues with hot-reloading
if (module.hot) module.hot.accept();

import { Sim } from "./core";
import { RobotMod } from "./mods/robot";
import { PurePursuitMod, Point } from "./mods/purePursuit";
import { TraceRobotMod } from "./mods/traceRobot";

const sim = new Sim()
  .use(
    new RobotMod({
      color: "rgb(200, 0, 0)",
      length: 300,
      width: 300,
    })
  )
  .use(
    new PurePursuitMod({
      preferredHeading: 0,
      frontSpeed: 1200,
      sidewaysSpeed: 600,
      turnSpeed: (Math.PI * 3) / 2,
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
  )
  .use(new TraceRobotMod());

sim.start();

// Try removing if you have issues with hot-reloading
if (module.hot) module.hot.accept();

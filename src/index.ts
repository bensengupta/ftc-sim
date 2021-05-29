import { Sim } from "./core";
import { RobotMod } from "./mods/robot";
import { PurePursuitMod, Point } from "./mods/purePursuit";
import { TraceRobotMod } from "./mods/traceRobot";

const sim = new Sim()
  .use(
    new RobotMod({
      x: 3000,
      y: 1400,
      heading: Math.PI,
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
        new Point(2100, 100),
        new Point(2100, 2100),
        new Point(100, 2100),
        new Point(100, 100),
      ],
    })
  )
  .use(new TraceRobotMod());

sim.start();

// Try removing if you have issues with hot-reloading
if (module.hot) module.hot.accept();

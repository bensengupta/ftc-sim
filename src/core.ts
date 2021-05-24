type SimOptions = {
  canvasId?: string;
};

export class Sim {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  resources: Record<string, any> = {};
  mods: SimMod[] = [];

  constructor(public options: SimOptions = {}) {
    const canvas = document.getElementById(
      options.canvasId ?? "canvas"
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    this.canvas = canvas;
    this.ctx = ctx;
  }

  use(mod: SimMod) {
    mod.init({
      canvas: this.canvas,
      ctx: this.ctx,
      resources: this.resources,
    });
    this.mods.push(mod);
    return this;
  }

  private fixedUpdate(deltaTime: number) {
    this.mods.forEach((mod) => {
      mod.fixedUpdate({
        canvas: this.canvas,
        ctx: this.ctx,
        resources: this.resources,
        deltaTime,
      });
    });
  }

  private render() {
    this.ctx.clearRect(0, 0, 3600, 3600);
    this.mods.forEach((mod) => {
      this.ctx.setTransform(
        this.canvas.width / 3600,
        0,
        0,
        this.canvas.height / 3600,
        0,
        0
      );
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "rgb(0, 0, 0)";
      mod.render({
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

    const sim = this;

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

export type SimContext<R extends Record<string, unknown>> = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  resources: R;
};

export type SimInitParams<R extends Record<string, unknown> = {}> =
  SimContext<R>;
export type SimUpdateParams<R extends Record<string, unknown> = {}> =
  SimContext<R> & {
    deltaTime: number;
  };
export type SimRenderParams<R extends Record<string, unknown> = {}> =
  SimContext<R>;

export abstract class SimMod {
  init(params: SimInitParams) {}
  fixedUpdate(params: SimUpdateParams) {}
  render(params: SimRenderParams) {}
}

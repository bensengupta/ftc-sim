export function drawArrow(
  context: CanvasRenderingContext2D,
  fromx: number,
  fromy: number,
  tox: number,
  toy: number
) {
  var headlen = 50; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 6),
    toy - headlen * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 6),
    toy - headlen * Math.sin(angle + Math.PI / 6)
  );
}

export function drawPoint({
  context,
  x,
  y,
  size,
}: {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  size?: number;
}) {
  context.ellipse(
    // -this.robotProperties.width / 2,
    // -this.robotProperties.length / 2,
    x,
    y,
    size ?? 30,
    size ?? 30,
    0,
    0,
    2 * Math.PI
  );
}

export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;
export const TWO_PI = 2 * Math.PI;

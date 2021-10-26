import Point from './point.js';

export function generateRandomColor() {
  return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
    Math.random() * 255
  })`;
}

export function drawPoint(
  point,
  context,
  pointSize = 5,
  strokeColor = '#00ff00',
  fillColor = '#ffffff'
) {
  context.save();
  context.translate(point.x, point.y);

  context.strokeStyle = strokeColor;
  context.lineWidth = 2;
  context.fillStyle = fillColor;

  context.beginPath();
  context.arc(0, 0, pointSize, 0, Math.PI * 2, false);

  context.fill();
  context.stroke();

  context.restore();
}

export function drawLine(pointA, pointB, context, color = '#ff0000') {
  context.save();

  context.strokeStyle = color;

  context.beginPath();
  context.moveTo(pointA.x, pointA.y);
  context.lineTo(pointB.x, pointB.y);

  context.stroke();

  context.restore();
}

export function drawControlPoints(points, context, pointSize, activePoint) {
  for (let i = 0; i < points.length; i++) {
    drawPoint(
      points[i],
      context,
      pointSize,
      activePoint == points[i] ? '#0000ff' : '#00ff00'
    );
    if (i < points.length - 1) {
      context.save();
      context.globalAlpha = 0.5;
      drawLine(points[i], points[i + 1], context);
      context.restore();
    }
  }
}

export function drawIntermediateLines(curve, context, t, color) {
  let points = [...curve.controlPoints];
  for (let j = 1; j < points.length; j++) {
    for (let k = 0; k < points.length - j; k++) {
      points[k] = Point.lerp(points[k], points[k + 1], t);
    }

    for (let k = 0; k < points.length - j - 1; k++) {
      drawLine(
        points[k],
        points[k + 1],
        context,
        color ||
          `rgb(${Math.sin(points[k].y) * 255}, 25, ${
            Math.sin(points[k].x) * 255
          })`
      );
    }
  }
}

export function drawBezierCurve(curveMesh, context, color = '#0000ff') {
  context.save();

  context.strokeStyle = color;
  context.beginPath();

  let currPoint = curveMesh.points[0];
  context.moveTo(currPoint.x, currPoint.y);
  for (let i = 1; i < curveMesh.points.length; i++) {
    currPoint = curveMesh.points[i];
    context.lineTo(currPoint.x, currPoint.y);
  }

  context.stroke();
  context.restore();
}

export default {
  drawPoint,
  drawLine,
  drawControlPoints,
  drawIntermediateLines,
  drawBezierCurve,
};

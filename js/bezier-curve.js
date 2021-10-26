import Point from './point.js';

export class BezierCurve {
  constructor(controlPoints) {
    if (!controlPoints || controlPoints.length < 2) {
      throw new Error('controlPoints are required!');
    }

    this.controlPoints = controlPoints;
  }

  pointAt(t) {
    let points = [...this.controlPoints];
    for (let j = 1; j < points.length; j++) {
      for (let i = 0; i < points.length - j; i++) {
        points[i] = Point.lerp(points[i], points[i + 1], t);
      }
    }

    return points[0];
  }
}

export default BezierCurve;

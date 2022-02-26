export class Point {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  copy() {
    return new Point(this.x, this.y);
  }

  length() {
    return Math.sqrt(this.lengthSq());
  }

  lengthSq() {
    return this.x ** 2 + this.y ** 2;
  }

  liesBetweenPoints(a, b) {
    return (
      Math.min(a.x, b.x) <= this.x &&
      this.x <= Math.max(a.x, b.x) &&
      Math.min(a.y, b.y) <= this.y &&
      this.y <= Math.max(a.y, b.y)
    );
  }

  liesOnLine(start, end, maxError = 100) {
    let error =
      (end.x - start.x) * (this.y - start.y) -
      (this.x - start.x) * (end.y - start.y);
    let isCollinear = Math.abs(error) <= maxError;

    return isCollinear && this.liesBetweenPoints(start, end);
  }

  static dot(a, b) {
    return a.x * b.x + a.y * b.y;
  }

  static add(a, b) {
    return new Point(a.x + b.x, a.y + b.y);
  }

  static sub(a, b) {
    return new Point(a.x - b.x, a.y - b.y);
  }

  static distance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  static scalarMul(point, k) {
    return new Point(point.x * k, point.y * k);
  }

  static lerp(a, b, t) {
    return Point.add(Point.scalarMul(a, 1 - t), Point.scalarMul(b, t));
  }
}

export default Point;

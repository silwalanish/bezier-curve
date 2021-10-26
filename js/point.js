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

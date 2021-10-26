import Point from './point.js';
import { BezierCurveMesh } from './bezier-visualization.js';

function distanceToSegment(point, segment) {
  let segmentVec = Point.sub(segment[1], segment[0]);
  let lineToPointVec = Point.sub(point, segment[0]);

  let dot = Point.dot(segmentVec, lineToPointVec);
  let segmentLengthSq = segmentVec.lengthSq();
  // |a|cos(theta)=(a.b)/|b|
  let projectionComponent = segmentLengthSq > 0 ? dot / segmentLengthSq : -1;

  let nearestPointOnSegment;
  if (projectionComponent < 0) {
    nearestPointOnSegment = segment[0];
  } else if (projectionComponent > 1) {
    nearestPointOnSegment = segment[1];
  } else {
    nearestPointOnSegment = Point.add(
      segment[0],
      Point.scalarMul(segmentVec, projectionComponent)
    );
  }

  return {
    distance: Point.distance(nearestPointOnSegment, point),
    nearestPoint: nearestPointOnSegment,
  };
}

export class BezierCurveCollider {
  constructor(curve, details) {
    this.curve = curve;
    this.details = details;
    this.mesh = new BezierCurveMesh(this.curve, this.details);
  }

  containsPoint(point, error) {
    let minDistance = Number.MAX_VALUE;
    let nearestPoint = null;
    for (let i = 0; i < this.mesh.points.length - 1; i++) {
      let dist = distanceToSegment(point, [
        this.mesh.points[i],
        this.mesh.points[i + 1],
      ]);
      if (dist.distance < minDistance) {
        minDistance = dist.distance;
        nearestPoint = dist.nearestPoint;
      }
    }

    return {
      result: minDistance < error,
      minDistnace: minDistance,
      nearestPoint: nearestPoint,
      collidingWith: point
    };
  }
}

export default BezierCurveCollider;

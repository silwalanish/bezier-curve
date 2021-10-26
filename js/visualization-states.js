import { generateRandomColor } from './drawing-utils.js';
import BezierCurveCollider from './bezier-curve-colider.js';
import { BezierCurveMesh } from './bezier-visualization.js';

export class VisualizationState {
  constructor(curves, options) {
    this.width = options.width;
    this.height = options.height;
    this.detail = options.detail;
    this.animate = options.animate;
    this.controlPointSize = options.controlPointSize;
    this.animationSpeed = options.animationSpeed;
    this.showCollisionTest = options.showCollisionTest;

    this.curves = (curves && (Array.isArray(curves) ? curves : [curves])) || [];
    this.curveMeshMap = new Map();

    this.selectedCurve = null;
    this.selectedControlPoint = null;
    this.selectedControlPointCopy = null;

    this.updateCurveMeshesMap();
  }

  setCurveMeshMap(curve) {
    let previous = this.curveMeshMap.get(curve);

    this.curveMeshMap.set(curve, {
      mesh: new BezierCurveMesh(curve, this.detail),
      colider: new BezierCurveCollider(curve, this.detail * 0.6),
      color: previous ? previous.color : generateRandomColor(),
    });
  }

  updateCurveMeshesMap() {
    this.curves.forEach(this.setCurveMeshMap.bind(this));
  }

  setWidth(width) {
    this.width = width;
  }

  setHeight(height) {
    this.height = height;
  }

  setDetail(detail) {
    if (this.detail != detail) {
      this.detail = detail;
      this.updateCurveMeshesMap();
    }
  }

  setControlPointSize(pointSize) {
    this.controlPointSize = pointSize;
  }

  setAnimationSpeed(speed) {
    this.animationSpeed = speed;
  }

  setAnimate(animate) {
    this.animate = animate;
  }

  setShowCollisionTest(showCollisionTest) {
    this.showCollisionTest = showCollisionTest;
  }

  addNewControlPoint(point) {
    if (this.selectedCurve && point) {
      this.selectedCurve.controlPoints.push(point);
      this.setCurveMeshMap(this.selectedCurve);
    }
  }

  addNewCurve(curve) {
    if (curve) {
      this.curves.push(curve);
      this.setCurveMeshMap(curve);
    }
  }

  selectCurve(curve) {
    this.selectedCurve = curve;
  }

  removeSelectedCurve() {
    if (this.selectedCurve) {
      this.curveMeshMap.delete(this.selectedCurve);

      this.curves = this.curves.filter((curve) => {
        return curve != this.selectedCurve;
      });

      this.unselectCurve();
    }
  }

  unselectCurve() {
    this.selectedCurve = null;
  }

  selectControlPoint(point) {
    this.selectedControlPoint = point;
    this.selectedControlPointCopy = this.selectedControlPoint.copy();
  }

  updateSelectedControlPoint(updatedPoint) {
    this.selectedControlPoint.x = updatedPoint.x;
    this.selectedControlPoint.y = updatedPoint.y;

    this.setCurveMeshMap(this.selectedCurve);
  }

  resetSelectedControlPoint() {
    this.selectedControlPoint.x = this.selectedControlPointCopy.x;
    this.selectedControlPoint.y = this.selectedControlPointCopy.y;

    this.setCurveMeshMap(this.selectedCurve);
  }

  resetSelectedControlPointCopy() {
    this.selectedControlPointCopy = this.selectedControlPoint.copy();
  }

  removeSelectedControlPoint() {
    if (this.selectedControlPoint) {
      this.selectedCurve.controlPoints =
        this.selectedCurve.controlPoints.filter((point) => {
          return point != this.selectedControlPoint;
        });

      this.unselectControlPoint();
      this.setCurveMeshMap(this.selectedCurve);
    }
  }

  unselectControlPoint() {
    this.selectedControlPoint = null;
    this.selectedControlPointCopy = null;
  }
}

export default VisualizationState;

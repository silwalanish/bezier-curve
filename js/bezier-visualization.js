import Point from './point.js';
import {
  drawPoint,
  drawControlPoints,
  drawIntermediateLines,
  drawBezierCurve,
  drawLine,
} from './drawing-utils.js';
import VisualizationState from './visualization-states.js';
import VisualizationSettings from './visualization-settings.js';
import VisualizationUserInputManager from './visualization-user-input-manager.js';

function animateBezierCurve(curve, context, t, pointSize) {
  drawPoint(curve.pointAt(t), context, pointSize, '#ffffff');
  drawIntermediateLines(curve, context, t, '#00ff00');
}

const DEFAULT_OPTIONS = {
  width: 800,
  height: 600,
  detail: 0.01,
  animate: false,
  controlPointSize: 5,
  animationSpeed: 0.2,
  showCollisionTest: false,
};

export class BezierCurveMesh {
  constructor(curve, details) {
    this.curve = curve;
    this.details = details;
    this.points = [];

    this.createMesh();
  }

  createMesh() {
    this.points = [];
    let i = 0;
    while (i < 1) {
      this.points.push(this.curve.pointAt(i));
      i += this.details;
    }
    this.points.push(this.curve.pointAt(1));
  }
}

export class BezierCurveVisualization {
  constructor(container, curves = [], options = {}) {
    options = Object.assign({}, DEFAULT_OPTIONS, options);

    this.isRunning = false;
    this.animation = null;
    this.time = 0;
    this.startTime = Date.now();
    this.deltaTime = 0;

    this.container = container;
    this.colisionTestResults = new Map();

    this.canvas = document.createElement('canvas');
    this.canvas.width = options.width;
    this.canvas.height = options.height;

    this.context = this.canvas.getContext('2d');

    this.container.appendChild(this.canvas);

    this.state = new VisualizationState(curves, options);
    this.userInputManager = new VisualizationUserInputManager(this);
    this.settings = new VisualizationSettings(this);
  }

  getCurvesNear(pos, nearDistance = 10) {
    this.colisionTestResults = new Map();
    return this.state.curves
      .filter((curve) => {
        let colisionTestResult = this.state.curveMeshMap
          .get(curve)
          .colider.containsPoint(pos, nearDistance);
        this.colisionTestResults.set(curve, colisionTestResult);

        return colisionTestResult.result;
      })
      .sort((a, b) => {
        return (
          this.colisionTestResults.get(a).minDistance -
          this.colisionTestResults.get(b).minDistance
        );
      });
  }

  getCurvesAt(pos) {
    let curves = this.getCurvesNear(pos, this.state.controlPointSize * 1.5);
    if (curves.length === 0) {
      return;
    }

    return curves[0];
  }

  getControlPointsNear(pos, nearDistance = 10) {
    return this.state.selectedCurve.controlPoints
      .filter((point) => {
        return Point.distance(point, pos) <= nearDistance;
      })
      .sort((a, b) => {
        return Point.distance(a, pos) - Point.distance(b, pos);
      });
  }

  getControlPointAt(pos) {
    let points = this.getControlPointsNear(
      pos,
      this.state.controlPointSize * 1.5
    );

    if (points.length === 0) {
      return;
    }

    return points[0];
  }

  clear() {
    this.context.save();
    this.context.fillStyle = '#ffffff';
    this.context.fillRect(0, 0, this.state.width, this.state.height);
    this.context.restore();
  }

  drawCollisionResult(colisionTestResult) {
    let color = colisionTestResult.result ? '#00ff00' : '#ff0000';
    drawPoint(
      colisionTestResult.collidingWith,
      this.context,
      this.state.controlPointSize,
      color
    );
    drawPoint(
      colisionTestResult.nearestPoint,
      this.context,
      this.state.controlPointSize,
      color,
      color
    );
    drawLine(
      colisionTestResult.collidingWith,
      colisionTestResult.nearestPoint,
      this.context,
      color
    );
  }

  drawCurve(curve) {
    let curveMeshMap = this.state.curveMeshMap.get(curve);
    let isCurveSelected = curve === this.state.selectedCurve;
    let isCurveHovered = this.userInputManager.hoveredCurve === curve;
    let isUserFocused = this.userInputManager.isFocused;
    let colisionTestResult = this.colisionTestResults.get(curve);
    let color =
      isCurveHovered && !isUserFocused ? '#ffffff' : curveMeshMap.color;
    let isMousePosInControlLine = !!this.state.hoveringControlLine;

    this.context.save();
    this.context.globalAlpha = isUserFocused && !isCurveSelected ? 0.2 : 1.0;

    drawBezierCurve(curveMeshMap.mesh, this.context, color);

    if (this.state.showCollisionTest && colisionTestResult) {
      this.drawCollisionResult(colisionTestResult);
    }

    if (isCurveSelected) {
      drawControlPoints(
        curve.controlPoints,
        this.context,
        this.state.controlPointSize,
        this.state.selectedControlPoint
      );

      if (isMousePosInControlLine) {
        drawPoint(
          this.userInputManager.mousePos,
          this.context,
          this.state.controlPointSize,
          '#440000ff'
        );
      }
    }

    if (this.state.animate) {
      animateBezierCurve(
        curve,
        this.context,
        this.time,
        this.state.controlPointSize
      );
    }

    this.context.restore();
  }

  draw() {
    this.context.save();
    this.context.translate(this.state.width / 2, this.state.height / 2);

    this.state.curves.forEach(this.drawCurve.bind(this));

    this.context.restore();

    this.time += this.state.animationSpeed * this.deltaTime;
    this.time %= 1.0;
  }

  update() {
    this.state.hoveringControlLine = null;

    if (this.state.selectedCurve && this.userInputManager.mousePos) {
      let curve = this.state.selectedCurve;

      for (let i = 0; i < curve.controlPoints.length - 1; i++) {
        let start = curve.controlPoints[i];
        let end = curve.controlPoints[i + 1];
        if (this.userInputManager.mousePos.liesOnLine(start, end)) {
          this.state.setHoveringControlLine(start, end);
          break;
        }
      }
    }
  }

  loop() {
    this.clear();
    this.update();
    this.draw();

    this.currentTime = Date.now();
    this.deltaTime = (this.currentTime - this.startTime) / 1000;
    this.startTime = this.currentTime;

    if (this.isRunning) {
      this.animation = window.requestAnimationFrame(this.loop.bind(this));
    }
  }

  start() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.time = 0;
    this.startTime = Date.now();
    this.deltaTime = 0;

    this.animation = window.requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    this.isRunning = false;
    if (this.animation) {
      window.cancelAnimationFrame(this.animation);
      this.animation = null;
    }
  }
}

export default BezierCurveVisualization;

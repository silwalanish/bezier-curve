'use strict';

import Point from './point.js';
import BezierCurve from './bezier-curve.js';
import BezierCurveVisualization from './bezier-visualization.js';
import faceJson from './face.js';

function parsePoint(pointJSON) {
  return new Point(pointJSON.x, pointJSON.y);
}

function parseCurves(curveJSON) {
  return new BezierCurve(curveJSON.controlPoints.map(parsePoint));
}

let curves = faceJson.map(parseCurves);

let visualization = new BezierCurveVisualization(
  document.querySelector('#visualization'),
  curves
);
visualization.start();
visualization.settings.show();

window.visualization = visualization;

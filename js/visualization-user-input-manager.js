import BezierCurve from './bezier-curve.js';
import Point from './point.js';

export class VisualizationUserInputManager {
  constructor(visualizer) {
    this.visualizer = visualizer;

    this.mousePos = null;
    this.hoveredCurve = null;
    this.isMouseDown = false;
    this.isFocused = false;
    this.lockMouse = false;

    this.setupUserInput();
  }

  calcMousePos(e) {
    let boundingRect = this.visualizer.canvas.getBoundingClientRect();
    this.mousePos = new Point(e.clientX, e.clientY);
    this.mousePos = Point.add(
      this.mousePos,
      new Point(
        -boundingRect.left - this.visualizer.state.width / 2,
        -boundingRect.top - this.visualizer.state.height / 2
      )
    );

    this.hoveredCurve = this.visualizer.getCurvesAt(this.mousePos);
  }

  onMouseDown(e) {
    this.isMouseDown = true;
    this.calcMousePos(e);

    if (this.lockMouse) {
      this.lockMouse = false;
      return;
    }

    let selectedCurve = this.visualizer.state.selectedCurve;
    if (selectedCurve) {
      let controlPoint = this.visualizer.getControlPointAt(this.mousePos);
      if (controlPoint) {
        // Select the point clicked.
        this.visualizer.state.selectControlPoint(controlPoint);
      } else if (this.visualizer.state.selectedControlPoint) {
        // Unselect previously selected point if clicked on a empty space.
        this.visualizer.state.unselectControlPoint();
      } else {
        // Add a new control point at mouse position if no point is selected.
        this.visualizer.state.addNewControlPoint(this.mousePos.copy());
      }
    } else {
      if (this.hoveredCurve) {
        // If no curve is selected, select the hovered curve.
        this.visualizer.state.selectCurve(this.hoveredCurve);
        this.isFocused = true;
      } else {
        // If no curve is hovered, add a new curve at that point
        // and select the curve.
        let points = [
          Point.add(this.mousePos, new Point(-50, -50)),
          Point.add(this.mousePos, new Point(50, 50)),
          this.mousePos.copy(),
        ];
        let curve = new BezierCurve(points);
        this.visualizer.state.addNewCurve(curve);
        this.visualizer.state.selectCurve(curve);
        this.visualizer.state.selectControlPoint(points[2]);

        this.lockMouse = true;
        this.isFocused = true;
      }
    }
  }

  onMouseMove(e) {
    this.calcMousePos(e);

    if (this.visualizer.state.selectedControlPoint && this.isMouseDown) {
      this.visualizer.state.updateSelectedControlPoint(this.mousePos);
    }
  }

  onMouseUp(e) {
    if (this.lockMouse) return;

    this.isMouseDown = false;
    this.calcMousePos(e);

    if (this.visualizer.state.selectedControlPoint) {
      this.visualizer.state.resetSelectedControlPointCopy();
    }
  }

  onMouseLeave(e) {
    this.isMouseDown = false;
    this.mousePos = null;
    this.hoveredCurve = null;

    if (this.visualizer.state.selectedControlPoint) {
      this.visualizer.state.resetSelectedControlPoint();
    }
  }

  onKeyDown(e) {
    switch (e.key) {
      case 'Delete':
        if (this.visualizer.state.selectedControlPoint) {
          this.visualizer.state.removeSelectedControlPoint();
        } else if (this.visualizer.state.selectedCurve) {
          this.visualizer.state.removeSelectedCurve();
          this.isFocused = false;
        }
        break;
      case 'Esc':
      case 'Escape':
        this.visualizer.state.unselectControlPoint();
        this.visualizer.state.unselectCurve();
        this.isFocused = false;
        break;
      default:
        break;
    }
  }

  setupUserInput() {
    this.visualizer.canvas.addEventListener(
      'mousedown',
      this.onMouseDown.bind(this)
    );
    this.visualizer.canvas.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this)
    );
    this.visualizer.canvas.addEventListener(
      'mouseup',
      this.onMouseUp.bind(this)
    );
    this.visualizer.canvas.addEventListener(
      'mouseleave',
      this.onMouseLeave.bind(this)
    );
    window.addEventListener('keydown', this.onKeyDown.bind(this));
  }
}

export default VisualizationUserInputManager;

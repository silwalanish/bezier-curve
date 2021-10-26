export class VisualizationSettings {
  constructor(visualizer) {
    this.visualizer = visualizer;
    this.container = document.createElement('div');
    this.container.style = 'display: none;';

    this.pointSizeRange = [3, 15];

    this.addControls();
    this.visualizer.container.appendChild(this.container);
  }

  show() {
    this.container.style = 'display: block;';
  }

  hide() {
    this.container.style = 'display: none;';
  }

  onWidthChange(e) {
    let width = parseInt(e.target.value) || this.visualizer.state.width;
    this.visualizer.state.setWidth(width);
    this.visualizer.canvas.width = width;
  }

  onHeightChange(e) {
    let height = parseInt(e.target.value) || this.visualizer.state.height;
    this.visualizer.state.setHeight(height);
    this.visualizer.canvas.height = height;
  }

  onDetailChange(e) {
    this.visualizer.state.setDetail(1 / Math.pow(2, e.target.value / 10));
  }

  onControlPointSizeChange(e) {
    this.visualizer.state.setControlPointSize(
      this.pointSizeRange[0] +
        (e.target.value / 100) *
          (this.pointSizeRange[1] - this.pointSizeRange[0])
    );
  }

  onAnimationSpeedChange(e) {
    this.visualizer.state.setAnimationSpeed(e.target.value / 100);
  }

  onAnimationToggle(e) {
    this.visualizer.state.setAnimate(e.target.checked);
  }

  onShowCollisionTestToggle(e) {
    this.visualizer.state.setShowCollisionTest(e.target.checked);
  }

  addInput(label, value, onChangeFunc) {
    let divContainer = document.createElement('div');

    let labelElem = document.createElement('label');
    labelElem.textContent = label;

    let inputElem = document.createElement('input');
    inputElem.value = value;
    inputElem.addEventListener('change', onChangeFunc);

    divContainer.appendChild(labelElem);
    divContainer.appendChild(inputElem);
    this.container.appendChild(divContainer);
  }

  addCheckBox(label, isChecked, onChangeFunc) {
    let divContainer = document.createElement('div');

    let labelElem = document.createElement('label');
    labelElem.textContent = label;

    let inputElem = document.createElement('input');
    inputElem.type = 'checkbox';
    inputElem.checked = isChecked;
    inputElem.addEventListener('change', onChangeFunc);

    divContainer.appendChild(labelElem);
    divContainer.appendChild(inputElem);
    this.container.appendChild(divContainer);
  }

  addSlider(label, value, onChangeFunc) {
    let divContainer = document.createElement('div');

    let labelElem = document.createElement('label');
    labelElem.textContent = label;

    let inputElem = document.createElement('input');
    inputElem.type = 'range';
    inputElem.min = 0;
    inputElem.max = 100;
    inputElem.value = value;
    inputElem.addEventListener('change', onChangeFunc);

    divContainer.appendChild(labelElem);
    divContainer.appendChild(inputElem);
    this.container.appendChild(divContainer);
  }

  addControls() {
    this.addInput(
      'Width: ',
      this.visualizer.state.width,
      this.onWidthChange.bind(this)
    );

    this.addInput(
      'Height: ',
      this.visualizer.state.height,
      this.onHeightChange.bind(this)
    );

    this.addSlider(
      'Curve Detail: ',
      Math.log2(1 / this.visualizer.state.detail) * 10,
      this.onDetailChange.bind(this)
    );

    this.addSlider(
      'Control Point Size: ',
      ((this.visualizer.state.controlPointSize - this.pointSizeRange[0]) *
        (this.pointSizeRange[1] - this.pointSizeRange[0])) /
        100,
      this.onControlPointSizeChange.bind(this)
    );

    this.addCheckBox(
      'Animation: ',
      this.visualizer.state.animate,
      this.onAnimationToggle.bind(this)
    );

    this.addSlider(
      'Animation Speed: ',
      this.visualizer.state.animationSpeed * 100,
      this.onAnimationSpeedChange.bind(this)
    );

    this.addCheckBox(
      'Show Collision Test With Mouse: ',
      this.visualizer.state.showCollisionTest,
      this.onShowCollisionTestToggle.bind(this)
    );
  }
}

export default VisualizationSettings;

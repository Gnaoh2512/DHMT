export const sliderDefs = {
  sphere: [
    { id: "radius", label: "Radius", min: 0.1, max: 4, step: 0.1, value: 2 },
    { id: "latBands", label: "Latitude Bands", min: 3, max: 100, step: 1, value: 20 },
    { id: "longBands", label: "Longitude Bands", min: 3, max: 100, step: 1, value: 20 },
  ],
  ellipsoid: [
    { id: "radiusX", label: "Radius X", min: 0.1, max: 4, step: 0.1, value: 2 },
    { id: "radiusY", label: "Radius Y", min: 0.1, max: 4, step: 0.1, value: 1.4 },
    { id: "radiusZ", label: "Radius Z", min: 0.1, max: 4, step: 0.1, value: 1 },
    { id: "latBands", label: "Latitude Bands", min: 3, max: 100, step: 1, value: 20 },
    { id: "longBands", label: "Longitude Bands", min: 3, max: 100, step: 1, value: 20 },
  ],
  hyperboloid: [
    { id: "a", label: "A", min: 0.1, max: 3, step: 0.1, value: 1 },
    { id: "b", label: "B", min: 0.1, max: 3, step: 0.1, value: 1 },
    { id: "c", label: "C", min: 0.1, max: 3, step: 0.1, value: 1 },
    { id: "height", label: "Height", min: 0.1, max: 10, step: 0.1, value: 5 },
    { id: "segments", label: "Segments", min: 3, max: 100, step: 1, value: 20 },
  ],
  toroid: [
    { id: "tubeRadius", label: "Tube Radius", min: 0.1, max: 3, step: 0.1, value: 2.7 },
    { id: "ringRadius", label: "Ring Radius", min: 0.1, max: 2, step: 0.1, value: 1.2 },
    { id: "tubeSeg", label: "Tube Segments", min: 3, max: 100, step: 1, value: 20 },
    { id: "ringSeg", label: "Ring Segments", min: 3, max: 100, step: 1, value: 20 },
  ],
  cube: [{ id: "size", label: "Size", min: 0.1, max: 6, step: 0.1, value: 2 }],
  cone: [
    { id: "radius", label: "Base Radius", min: 0.1, max: 5, step: 0.1, value: 2 },
    { id: "height", label: "Height", min: 0.1, max: 5, step: 0.1, value: 5 },
    { id: "segments", label: "Radial Segments", min: 3, max: 100, step: 1, value: 20 },
  ],
  cylinder: [
    { id: "radius", label: "Radius", min: 0.1, max: 5, step: 0.1, value: 2 },
    { id: "height", label: "Height", min: 0.1, max: 6, step: 0.1, value: 5 },
    { id: "radialSegments", label: "Radial Segments", min: 3, max: 100, step: 1, value: 20 },
    { id: "heightSegments", label: "Height Segments", min: 1, max: 100, step: 1, value: 10 },
  ],
};

export function controlDisplay() {
  const shapeSelector = document.getElementById("shapeSelector");
  const sliderContainer = document.getElementById("dynamic-sliders");

  function createSliders(shapeType) {
    sliderContainer.innerHTML = "";

    const sliders = sliderDefs[shapeType];
    if (!sliders) return;

    sliders.forEach(({ id, label, min, max, step, value }) => {
      const wrapper = document.createElement("div");
      wrapper.className = "slider-container";

      const labelEl = document.createElement("label");
      labelEl.setAttribute("for", id);
      labelEl.innerText = label;

      const input = document.createElement("input");
      input.type = "range";
      input.id = id;
      input.min = min;
      input.max = max;
      input.step = step;
      input.value = value;

      const valueSpan = document.createElement("span");
      valueSpan.className = "slider-value";
      valueSpan.innerText = value;

      input.addEventListener("input", () => {
        valueSpan.innerText = input.value;
      });

      wrapper.appendChild(labelEl);
      wrapper.appendChild(input);
      wrapper.appendChild(valueSpan);

      sliderContainer.appendChild(wrapper);
    });
  }

  function handleShapeChange() {
    const selectedShape = shapeSelector.value;
    createSliders(selectedShape);
  }

  shapeSelector.addEventListener("change", handleShapeChange);

  handleShapeChange();
}

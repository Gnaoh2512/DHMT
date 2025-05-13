import { createCone, createCube, createCylinder, createEllipsoid, createHyperboloid, createSphere, createToroid } from "./visual/shapes.js";
import { loadShader, createProgram, makeLookAt, makePerspective, makeRotationX, makeRotationY, makeRotationZ, multiplyMatrices } from "./utils/helpers.js";
import { controlDisplay, sliderDefs } from "./utils/controlDisplay.js";

// Setup WebGL context and canvas
const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl");

if (!gl) alert("WebGL not supported");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables for rendering
let currentMesh = createCube(2, 10);
let indices = [];
let program, uModelViewMatrix, uProjectionMatrix, indexBuffer;
let [rotationX, rotationY, rotationZ] = [0, 0, 0];
let animationFrameId = null;

initWebGL();

// Initialize WebGL and shaders
async function initWebGL() {
  const [vs, fs] = await Promise.all([fetch("shaders/vertex.glsl").then((r) => r.text()), fetch("shaders/fragment.glsl").then((r) => r.text())]);

  // Create shader program
  program = createProgram(gl, loadShader(gl, gl.VERTEX_SHADER, vs), loadShader(gl, gl.FRAGMENT_SHADER, fs));
  gl.useProgram(program);

  // Get uniform locations
  uModelViewMatrix = gl.getUniformLocation(program, "uModelViewMatrix");
  uProjectionMatrix = gl.getUniformLocation(program, "uProjectionMatrix");
  indexBuffer = gl.createBuffer();

  // Initialize controls and shape selector
  controlDisplay();
  setupShapeSelector();
  uploadMesh(currentMesh);

  // Handle color picker
  setupColorPicker();

  // Start the rendering loop
  draw();
}

// Setup color picker and update color
function setupColorPicker() {
  const uColorLocation = gl.getUniformLocation(program, "uColor");
  const colorPicker = document.getElementById("colorPicker");
  const defaultColor = hexToRGB(colorPicker.value);
  gl.uniform3f(uColorLocation, defaultColor.r, defaultColor.g, defaultColor.b);

  colorPicker.addEventListener("input", () => {
    const hex = colorPicker.value;
    const rgb = hexToRGB(hex);
    gl.useProgram(program);
    gl.uniform3f(uColorLocation, rgb.r, rgb.g, rgb.b);
  });
}

// Buffer data for attributes
function bufferData(attribute, data, size) {
  const loc = gl.getAttribLocation(program, attribute);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(loc);
}

// Upload mesh data to GPU
function uploadMesh({ positions, normals, indices: idx }) {
  indices = idx;
  bufferData("aPosition", positions, 3);
  bufferData("aNormal", normals, 3);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}

// Rendering loop
function draw() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  const projection = makePerspective(Math.PI / 3, canvas.width / canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(uProjectionMatrix, false, new Float32Array(projection));

  // Update rotation
  rotationX += 0.01;
  rotationY += 0.015;
  rotationZ += 0.02;
  const rotMatrix = multiplyMatrices(makeRotationZ(rotationZ), multiplyMatrices(makeRotationY(rotationY), makeRotationX(rotationX)));

  // Apply model-view matrix
  const modelViewMatrix = multiplyMatrices(rotMatrix, makeLookAt([0, 0, 8], [0, 0, 0], [0, 1, 0]));
  gl.uniformMatrix4fv(uModelViewMatrix, false, new Float32Array(modelViewMatrix));

  // Handle wireframe mode
  const wireframeEnabled = document.getElementById("wireframeToggle").checked;
  const uWireframeMode = gl.getUniformLocation(program, "uWireframeMode");
  gl.uniform1i(uWireframeMode, wireframeEnabled ? 1 : 0);

  // Draw shape (solid or wireframe)
  if (wireframeEnabled) {
    gl.drawElements(gl.LINE_STRIP, indices.length, gl.UNSIGNED_SHORT, 0); // Wireframe mode using LINES
  } else {
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0); // Solid mode using TRIANGLES
  }

  animationFrameId = requestAnimationFrame(draw);
}

// Shape selector setup
function setupShapeSelector() {
  document.querySelectorAll("#controls input").forEach((input) => input.addEventListener("input", updateMeshFromSelector));

  document.getElementById("shapeSelector").addEventListener("change", () => {
    updateMeshFromSelector();
    controlDisplay();
    setTimeout(() => {
      document.querySelectorAll("#controls input").forEach((input) => input.addEventListener("input", updateMeshFromSelector));
    }, 0);
  });

  // Listen for wireframe toggle change
  document.getElementById("wireframeToggle").addEventListener("change", draw);
}

// Update mesh based on shape selector
function updateMeshFromSelector() {
  const shape = document.getElementById("shapeSelector").value;
  currentMesh = createShapeFromInputs(shape);
  uploadMesh(currentMesh);
}

// Create shape based on selected inputs
function createShapeFromInputs(shape) {
  const sliders = sliderDefs[shape];
  if (!sliders) return currentMesh;

  const values = Object.fromEntries(
    sliders.map(({ id }) => {
      const el = document.getElementById(id);
      return [id, el ? parseFloat(el.value) : undefined];
    })
  );

  switch (shape) {
    case "sphere":
      return createSphere(values.radius, values.latBands, values.longBands);
    case "ellipsoid":
      return createEllipsoid(values.radiusX, values.radiusY, values.radiusZ, values.latBands, values.longBands);
    case "hyperboloid":
      return createHyperboloid(values.a, values.b, values.c, values.height, values.segments);
    case "toroid":
      return createToroid(values.tubeRadius, values.ringRadius, values.tubeSeg, values.ringSeg);
    case "cube":
      return createCube(values.size);
    case "cone":
      return createCone(values.radius, values.height, values.segments);
    case "cylinder":
      return createCylinder(values.radius, values.height, values.radialSegments, values.heightSegments);
    default:
      return currentMesh;
  }
}

// Convert hex color to RGB
function hexToRGB(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255,
  };
}

// Handle window resize and update canvas size
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
});

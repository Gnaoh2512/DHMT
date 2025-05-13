export function createCone(radius, height, segments) {
  const positions = [0, height, 0]; // tip
  const normals = [0, 1, 0]; // normal for the tip
  const indices = [];

  // Create vertices for the side of the cone
  for (let i = 0; i <= segments; ++i) {
    const angle = (2 * Math.PI * i) / segments;
    const x = Math.cos(angle);
    const z = Math.sin(angle);
    positions.push(radius * x, 0, radius * z);
    normals.push(x, 0.5, z); // approximate normal direction for the sides
  }

  // Create indices for the side of the cone
  for (let i = 1; i <= segments; ++i) {
    indices.push(0, i, i + 1 > segments ? 1 : i + 1);
  }

  // Create the bottom cap
  const bottomCenterIndex = positions.length / 3; // The center vertex index for the bottom cap
  positions.push(0, 0, 0); // Center of the bottom cap
  normals.push(0, -1, 0); // Normal pointing downwards for the bottom cap

  // Generate the perimeter vertices of the bottom cap
  for (let i = 0; i <= segments; ++i) {
    const angle = (2 * Math.PI * i) / segments;
    const x = Math.cos(angle);
    const z = Math.sin(angle);

    positions.push(radius * x, 0, radius * z);
    normals.push(0, -1, 0); // Normal pointing downward for the bottom cap
  }

  // Create indices for the bottom cap
  for (let i = 0; i < segments; ++i) {
    const a = bottomCenterIndex; // Center of the bottom cap
    const b = bottomCenterIndex + i + 1;
    const c = bottomCenterIndex + ((i + 1) % segments) + 1;

    indices.push(a, b, c);
  }

  return { positions, normals, indices };
}

export function createCube(size) {
  const positions = [];
  const normals = [];
  const indices = [];

  const s = size / 2;

  const vertices = [
    // Front face
    [-s, -s, s],
    [s, -s, s],
    [s, s, s],
    [-s, s, s],
    // Back face
    [-s, -s, -s],
    [s, -s, -s],
    [s, s, -s],
    [-s, s, -s],
    // Top face
    [-s, s, -s],
    [s, s, -s],
    [s, s, s],
    [-s, s, s],
    // Bottom face
    [-s, -s, -s],
    [s, -s, -s],
    [s, -s, s],
    [-s, -s, s],
    // Right face
    [s, -s, -s],
    [s, -s, s],
    [s, s, s],
    [s, s, -s],
    // Left face
    [-s, -s, -s],
    [-s, -s, s],
    [-s, s, s],
    [-s, s, -s],
  ];

  const faceNormals = [
    [0, 0, 1],
    [0, 0, -1],
    [0, 1, 0],
    [0, -1, 0],
    [1, 0, 0],
    [-1, 0, 0],
  ];

  const faceIndices = [
    // Front
    [0, 1, 2, 0, 2, 3],
    // Back
    [4, 5, 6, 4, 6, 7],
    // Top
    [8, 9, 10, 8, 10, 11],
    // Bottom
    [12, 13, 14, 12, 14, 15],
    // Right
    [16, 17, 18, 16, 18, 19],
    // Left
    [20, 21, 22, 20, 22, 23],
  ];

  // Loop through each face and add the positions, normals, and indices
  for (let i = 0; i < 6; i++) {
    const normal = faceNormals[i];
    const faceVertices = vertices.slice(i * 4, (i + 1) * 4);
    const indicesForFace = faceIndices[i];

    // Add positions and normals
    faceVertices.forEach((vertex) => {
      positions.push(...vertex);
      normals.push(...normal);
    });

    // Add indices
    indices.push(...indicesForFace);
  }

  return { positions, normals, indices };
}

export function createCylinder(radius, height, radialSegments, heightSegments) {
  const positions = [];
  const normals = [];
  const indices = [];

  for (let y = 0; y <= heightSegments; y++) {
    const v = y / heightSegments;
    const py = v * height - height / 2;

    for (let i = 0; i <= radialSegments; i++) {
      const u = i / radialSegments;
      const theta = u * 2 * Math.PI;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      const x = cosTheta * radius;
      const z = sinTheta * radius;
      positions.push(x, py, z);
      normals.push(cosTheta, 0, sinTheta);
    }
  }

  // Side indices
  for (let y = 0; y < heightSegments; y++) {
    for (let i = 0; i < radialSegments; i++) {
      const a = y * (radialSegments + 1) + i;
      const b = a + radialSegments + 1;

      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }

  // Top cap
  const topCenterIndex = positions.length / 3;
  positions.push(0, height / 2, 0);
  normals.push(0, 1, 0);
  for (let i = 0; i <= radialSegments; i++) {
    const theta = (i / radialSegments) * 2 * Math.PI;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    positions.push(x, height / 2, z);
    normals.push(0, 1, 0);
  }
  for (let i = 0; i < radialSegments; i++) {
    indices.push(topCenterIndex, topCenterIndex + i + 1, topCenterIndex + i + 2);
  }

  // Bottom cap
  const bottomCenterIndex = positions.length / 3;
  positions.push(0, -height / 2, 0);
  normals.push(0, -1, 0);
  for (let i = 0; i <= radialSegments; i++) {
    const theta = (i / radialSegments) * 2 * Math.PI;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    positions.push(x, -height / 2, z);
    normals.push(0, -1, 0);
  }
  for (let i = 0; i < radialSegments; i++) {
    indices.push(bottomCenterIndex, bottomCenterIndex + i + 2, bottomCenterIndex + i + 1);
  }

  return { positions, normals, indices };
}

export function createEllipsoid(rx, ry, rz, latBands, longBands) {
  const positions = [];
  const normals = [];
  const indices = [];

  for (let lat = 0; lat <= latBands; ++lat) {
    const theta = (lat * Math.PI) / latBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon <= longBands; ++lon) {
      const phi = (lon * 2 * Math.PI) / longBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;

      positions.push(rx * x, ry * y, rz * z);
      normals.push(x, y, z);
    }
  }

  for (let lat = 0; lat < latBands; ++lat) {
    for (let lon = 0; lon < longBands; ++lon) {
      const first = lat * (longBands + 1) + lon;
      const second = first + longBands + 1;
      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  return { positions, normals, indices };
}

export function createHyperboloid(a, b, c, height, segments) {
  const positions = [];
  const normals = [];
  const indices = [];
  const stacks = segments;

  for (let i = 0; i <= stacks; i++) {
    const y = height * (i / stacks - 0.5);
    const xzScale = Math.sqrt(1 + (y * y) / (c * c));

    for (let j = 0; j <= segments; j++) {
      const theta = (2 * Math.PI * j) / segments;
      const x = a * xzScale * Math.cos(theta);
      const z = b * xzScale * Math.sin(theta);
      positions.push(x, y, z);
      normals.push(x, 0, z);
    }
  }

  for (let i = 0; i < stacks; i++) {
    for (let j = 0; j < segments; j++) {
      const first = i * (segments + 1) + j;
      const second = first + segments + 1;
      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  return { positions, normals, indices };
}

export function createSphere(radius, latBands, longBands) {
  const positions = [];
  const normals = [];
  const indices = [];

  for (let lat = 0; lat <= latBands; ++lat) {
    const theta = (lat * Math.PI) / latBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon <= longBands; ++lon) {
      const phi = (lon * 2 * Math.PI) / longBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;

      positions.push(radius * x, radius * y, radius * z);
      normals.push(x, y, z);
    }
  }

  for (let lat = 0; lat < latBands; ++lat) {
    for (let lon = 0; lon < longBands; ++lon) {
      const first = lat * (longBands + 1) + lon;
      const second = first + longBands + 1;
      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  return { positions, normals, indices };
}

export function createToroid(majorRadius, minorRadius, majorSegments, minorSegments) {
  const positions = [];
  const normals = [];
  const indices = [];

  for (let i = 0; i <= majorSegments; ++i) {
    const theta = (2 * Math.PI * i) / majorSegments;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    for (let j = 0; j <= minorSegments; ++j) {
      const phi = (2 * Math.PI * j) / minorSegments;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);

      const x = (majorRadius + minorRadius * cosPhi) * cosTheta;
      const y = minorRadius * sinPhi;
      const z = (majorRadius + minorRadius * cosPhi) * sinTheta;

      const nx = cosPhi * cosTheta;
      const ny = sinPhi;
      const nz = cosPhi * sinTheta;

      positions.push(x, y, z);
      normals.push(nx, ny, nz);
    }
  }

  for (let i = 0; i < majorSegments; ++i) {
    for (let j = 0; j < minorSegments; ++j) {
      const a = i * (minorSegments + 1) + j;
      const b = a + minorSegments + 1;
      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }

  return { positions, normals, indices };
}

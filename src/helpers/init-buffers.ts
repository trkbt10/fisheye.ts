//
// initBuffers
//
export function initBuffers(gl: WebGLRenderingContext) {
  // Map the texture onto the rect's face.
  const rectVerticesTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rectVerticesTextureCoordBuffer);

  const textureCoordinates = [
    // Front
    0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,
  ];

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoordinates),
    gl.STATIC_DRAW
  );

  // Create a buffer for the rect's vertices.
  const rectVerticesBuffer = gl.createBuffer();

  // Select the this.rectVerticesBuffer as the one to apply vertex
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, rectVerticesBuffer);

  // Now create an array of vertices for the rect. Note that the Z
  // coordinate is always 0 here.
  const vertices = [
    -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0, 0.0, 1.0, 1.0, 0.0,
  ];

  // Now pass the list of vertices into WebGL to build the shape. We
  // do this by creating a Float32Array from the JavaScript array,
  // then use it to fill the current vertex buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  return {
    rectVerticesTextureCoordBuffer,
    rectVerticesBuffer,
  };
}

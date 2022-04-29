//
// getShader
//
export function getShader(
  gl: WebGLRenderingContext,
  source: string,
  type: number
) {
  // Now figure out what type of shader script we have,
  // based on its MIME type.
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Unable to create shader.");
  }
  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
  }

  return shader;
}

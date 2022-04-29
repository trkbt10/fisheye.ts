import { getShader } from "./get-shader";

//
// create gl program
//
export function createProgram(
  gl: WebGLRenderingContext,
  { vertex, fragment }: { vertex: string; fragment: string }
) {
  const vertexShader = getShader(gl, vertex, gl.VERTEX_SHADER);
  const fragmentShader = getShader(gl, fragment, gl.FRAGMENT_SHADER);

  // Create the shader programs
  const program = gl.createProgram();
  if (!program) {
    throw new Error("createProgram failed");
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error("Unable to initialize the shader program.");
  }

  return program;
}

export function initWebGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", {
    depth: false,
    preserveDrawingBuffer: true,
  });
  if (!gl) {
    throw new Error(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
  }
  return gl;
}

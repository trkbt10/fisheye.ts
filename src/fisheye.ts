/**
 * The MIT License (MIT)
 * Copyright (c) 2020 trkbt10
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Eric Leong
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { createProgram } from "./helpers/create-program";
import * as fishEyeShader from "./helpers/fisheye-shader";
import { initBuffers } from "./helpers/init-buffers";
import { initTextures } from "./helpers/init-textures";
import { initWebGL } from "./helpers/init-webgl";
export class Fisheye {
  private program: WebGLProgram;
  private gl: WebGLRenderingContext;
  private uDistortion: WebGLUniformLocation | null;
  private uRatio: WebGLUniformLocation | null;
  private uImage: WebGLUniformLocation | null;
  private aVertexPosition: number;
  private aTextureCoord: number;
  private rectVerticesTextureCoordBuffer: WebGLBuffer | null;
  private rectVerticesBuffer: WebGLBuffer | null;
  private imageTexture: WebGLTexture | null;
  constructor(canvas: HTMLCanvasElement) {
    this.gl = initWebGL(canvas);
    this.gl.enable(this.gl.BLEND);
    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.

    this.program = createProgram(this.gl, fishEyeShader);

    // fragment shader uniforms
    this.uDistortion = this.gl.getUniformLocation(this.program, "uDistortion");
    this.uRatio = this.gl.getUniformLocation(this.program, "uRatio");

    // textures
    this.uImage = this.gl.getUniformLocation(this.program, "uImage");

    // vertex attributes
    this.aVertexPosition = this.gl.getAttribLocation(
      this.program,
      "aVertexPosition"
    );
    this.gl.enableVertexAttribArray(this.aVertexPosition);

    this.aTextureCoord = this.gl.getAttribLocation(
      this.program,
      "aTextureCoord"
    );
    this.gl.enableVertexAttribArray(this.aTextureCoord);

    // Here's where we call the routine that builds all the objects
    // we'll be drawing.

    const { rectVerticesTextureCoordBuffer, rectVerticesBuffer } = initBuffers(
      this.gl
    );
    this.rectVerticesTextureCoordBuffer = rectVerticesTextureCoordBuffer;
    this.rectVerticesBuffer = rectVerticesBuffer;
    // Load and set up the textures we'll be using.

    this.imageTexture = initTextures(this.gl);

    // Set default distortion

    this.setDistortion(0.0, 0.0, 0.0);
  }
  private setDistortion(
    red: number = 0,
    green: number = red,
    blue: number = red
  ) {
    this.gl.useProgram(this.program);
    this.gl.uniform3fv(this.uDistortion, [red, green, blue]);
  }
  //
  // draw
  //
  public draw(image: HTMLImageElement) {
    this.gl.useProgram(this.program);

    // Draw the rect by binding the array buffer to the rect's vertices
    // array, setting attributes, and pushing it to this.GL.
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.rectVerticesBuffer);
    this.gl.vertexAttribPointer(
      this.aVertexPosition,
      3,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    // Set the texture coordinates attribute for the vertices.
    this.gl.bindBuffer(
      this.gl.ARRAY_BUFFER,
      this.rectVerticesTextureCoordBuffer
    );
    this.gl.vertexAttribPointer(
      this.aTextureCoord,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    // Update the aspect ratio.
    if (image.naturalWidth > 0 && image.naturalHeight > 0) {
      this.gl.uniform1f(this.uRatio, image.naturalWidth / image.naturalHeight);
    } else if (image.width > 0 && image.height > 0) {
      this.gl.uniform1f(this.uRatio, image.width / image.height);
    } else {
      this.gl.uniform1f(this.uRatio, 1.0);
    }

    // Specify the texture to map onto the face.
    this.gl.uniform1i(this.uImage, 0);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.imageTexture);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      image
    );

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
  //
  // update viewport
  //
  public setViewport(width: number, height: number) {
    this.gl.viewport(0, 0, width, height);
  }

  //
  // clear
  //
  public clear() {
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}

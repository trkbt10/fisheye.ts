export const vertex = `
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

varying highp vec2 vTextureCoord;

void main(void) {
	gl_Position = vec4(aVertexPosition, 1.0);

	vTextureCoord = aTextureCoord;
}
`;

export const fragment = `
precision mediump float;

varying highp vec2 vTextureCoord;

uniform sampler2D uImage;
uniform mediump vec3 uDistortion;
uniform mediump float uRatio;

float computeScale(float distortion, float rsqLimit) {
  if (distortion >= 0.0) {
    return 1.0 + distortion * rsqLimit;
  } else {
    return 1.0 / (1.0 - distortion * rsqLimit);
  }
}

void main(void) {

  float rsq;
  float rsqLimit;
  if (uRatio < 1.0) {
    rsq = pow((vTextureCoord.x - 0.5) * uRatio, 2.0) + pow(vTextureCoord.y - 0.5, 2.0);
    rsqLimit = (pow(0.5 * uRatio, 2.0) + pow(0.5, 2.0)) / (2.0 / uRatio);
  } else {
    rsq = pow(vTextureCoord.x - 0.5, 2.0) + pow((vTextureCoord.y - 0.5) / uRatio, 2.0);
    rsqLimit = (pow(0.5, 2.0) + pow(0.5 / uRatio, 2.0)) / (2.0 * uRatio);
  }

  vec3 scale = vec3(computeScale(uDistortion.r, rsqLimit),
            computeScale(uDistortion.g, rsqLimit),
            computeScale(uDistortion.b, rsqLimit));

  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);

  vec2 redCoord = vec2(0.5 + (vTextureCoord.x - 0.5) * (1.0 + uDistortion.r * rsq) / scale.r,
              0.5 + (vTextureCoord.y - 0.5) * (1.0 + uDistortion.r * rsq) / scale.r);

  if (redCoord.x >= 0.0 && redCoord.x <= 1.0 && redCoord.y >= 0.0 && redCoord.y <= 1.0) {
    gl_FragColor.r = texture2D(uImage, redCoord).r;
    gl_FragColor.a += texture2D(uImage, redCoord).a / 3.0;
  }

  vec2 greenCoord = vec2(0.5 + (vTextureCoord.x - 0.5) * (1.0 + uDistortion.g * rsq) / scale.g,
                0.5 + (vTextureCoord.y - 0.5) * (1.0 + uDistortion.g * rsq) / scale.g);

  if (greenCoord.x >= 0.0 && greenCoord.x <= 1.0 && greenCoord.y >= 0.0 && greenCoord.y <= 1.0) {
    gl_FragColor.g = texture2D(uImage, greenCoord).g;
    gl_FragColor.a += texture2D(uImage, greenCoord).a / 3.0;
  }

  vec2 blueCoord = vec2(0.5 + (vTextureCoord.x - 0.5) * (1.0 + uDistortion.b * rsq) / scale.b,
              0.5 + (vTextureCoord.y - 0.5) * (1.0 + uDistortion.b * rsq) / scale.b);

  if (blueCoord.x >= 0.0 && blueCoord.x <= 1.0 && blueCoord.y >= 0.0 && blueCoord.y <= 1.0) {
    gl_FragColor.b = texture2D(uImage, blueCoord).b;
    gl_FragColor.a += texture2D(uImage, blueCoord).a / 3.0;
  }
}
`;

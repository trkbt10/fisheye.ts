# fisheye.ts

fisheye.ts is a javascript library for drawing images to the canvas with [simple radial lens distortion](<https://en.wikipedia.org/wiki/Distortion_(optics)>) using WebGL.
This library was forked from [https://github.com/ericleong/fisheye.js](https://github.com/ericleong/fisheye.js).

Visit [trkbt10.github.io/fisheye.ts](http://trkbt10.github.io/fisheye.ts) for a demo.

## install

```bash
$ npm install git@github.com:trkbt10/fisheye.ts.git
```

## usage

Use it like this:

```typescript

import { Fisheye } from 'fisheye'

const canvas: HTMLCanvasElement = document.createElement('canvas') || document.querySelector('canvas');
const image : HTMLImageElement  = document.createElement('img') || document.querySelector('image');
const fisheye = new Fisheyecanvas);

const [r,g,b] = [0,0,0];
fisheye.setDistortion(r,g,b);
fisheye.draw(image);
```

### api

```typescript
const fisheye = new Fisheye(canvas as HTMLCanvasElement);
```

[`<canvas>` is an `HTMLCanvasElement`](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) where the distorted image should be displayed.

```typescript
fisheye.setDistortion(red as number, green as number, blue as number);
```

Each `<value>` is a number, use a positive value for barrel distortion and a negative value for pincushion distortion. If only the first argument is supplied, it is used for all colors. Use different amounts of distortion for each color channel to simulate [chromatic aberration](https://en.wikipedia.org/wiki/Chromatic_aberration).

```typescript
fisheye.draw(image as HTMLImageElement);
```

`<image>` is either an [`HTMLCanvasElement`](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) or an [`HTMLImageElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement). It is the undistorted image.

```typescript
fisheye.setViewport(width as number, height as number);
```

If the canvas size is changed, update the viewport size with this method.

```typescript
fisheye.clear();
```

When drawing a new image, you may need to call `clear()` to clear the existing canvas.

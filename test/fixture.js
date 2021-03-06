'use strict'

var fixture = {
	data: new Uint8Array([0,0,0,255,255,0,0,255,255,255,0,255,255,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0,255,0,255,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255]),
	width: 16,
	height: 8,
}

fixture.canvas2d = drawToCanvas(fixture)


var isBrowser = require('is-browser')
var gl
if (!isBrowser) {
    gl = require('gl')(fixture.width, fixture.height, {preserveDrawingBuffer: true})
}
else {
    var canvas = document.createElement('canvas')
    canvas.width = fixture.width
    canvas.height = fixture.height
    gl = canvas.getContext('webgl', {preserveDrawingBuffer: true})
}

var regl = require('regl')({gl: gl})
var draw = regl({
vert: `
  precision mediump float;
  attribute vec2 position;
  attribute vec4 color;
  uniform vec2 shape;
  varying vec4 fragColor;
  void main() {
    gl_PointSize = 1.;
    gl_Position = vec4( 2. * (position + .5) / shape - 1., 0, 1);
    gl_Position.y *= -1.;
    fragColor = color / 255.;
  }`,
frag: `
precision mediump float;
varying vec4 fragColor;
void main () {
  gl_FragColor = fragColor;
}`,
attributes: {
  color: [
    0,0,0,255, 255,0,0,255, 255,255,0,255, 255,0,255,255,
    0,255,0,255, 0,255,255,255,
    0,0,255,255
  ],
  position: [
    0,0, 1,0, 2,0, 3,0,
    0,1, 1,1,
    0,2
  ]
},
uniforms: {
  shape: [16, 8]
},
primitive: 'points',
count: 7
})
draw()

fixture.gl = gl
fixture.regl = regl
fixture.canvasGl = gl.canvas


// fixture.pngDataURL = drawToCanvas(fixture).toDataURL('image/png')
// fixture.jpgDataURL = drawToCanvas(fixture).toDataURL('image/jpeg', 1)
fixture.pngDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAAAM0lEQVQoU92PsREAMAgCn/2HJodOEO38AioEBdhEAbn9A+FESkYoA3rCDO3i+XrVf+LAA/NHIOnNxlR4AAAAAElFTkSuQmCC'
fixture.jpgDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAIABADAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABwr/xAAcEAEBAAIDAQEAAAAAAAAAAAAGBQQHAQMIAgD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAHxEAAwEAAgIDAQAAAAAAAAAABAUGAwIHAAESExQX/9oADAMBAAIRAxEAPwC3nzZ5k095R1QF1Fp4lFgwwwY2C67OKaHH0CSYZyLdLGy0fAg0SO8d+UiUrlH1JPHj5GPbXI/oqaPTaPM7rcRkoHJoPNTymQRtKAym5ziHm21W5uTU8/OatCz37R5S0tBrNSUmgZ2lm/pbulAmUutbUP2Ifo/mXEOwpeejzrHsCsSyuWmKL+hdg2nYzMHPQNWs+Gbu5e0Dj6sE6JAgAH9nflVTU7NzCrAKenEaxe//AJ48/9k='

fixture.pngURL = 'https://raw.githubusercontent.com/dy/get-pixel-data/master/test/test_pattern.png'
fixture.jpgURL = 'https://raw.githubusercontent.com/dy/get-pixel-data/master/test/test_pattern.jpg'



//draw buffer on the canvas
function drawToCanvas({data, width, height}) {
  if (typeof document === 'undefined') return null

    var canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    var context = canvas.getContext('2d')
    var idata = context.createImageData(canvas.width, canvas.height)
    for (var i = 0; i < data.length; i++) {
      idata.data[i] = data[i]
    }
    context.putImageData(idata, 0, 0)
    return canvas
}

fixture.draw = drawToCanvas

module.exports = fixture

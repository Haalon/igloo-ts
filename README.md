# ts-igloo

A TypeScript Port of [igloo.js](https://github.com/skeeto/igloojs) with better webGL2 support

## About Igloo

Igloo is a minimal, fluent, object-oriented wrapper API for WebGL. 
WebGL requires lots of boilerplate to use directly and the existing
abstraction wrappers are too high-level.

![](http://i.imgur.com/snY3Gh2.png)

Igloo is *not* intended to completely replace use of the
WebGLRenderingContext object, nor is it intended to hide details from
beginners. The WebGLRenderingContext object still needed for all the
enumerations, occasionally you may need to do something that Igloo
doesn't cover, and you still need to understand the intricacies of the
OpenGL API.

## Install


```
npm install ts-igloo
```

## Example Usage

```js
function Demo() {
    var igloo    = this.igloo = new Igloo($('#my-canvas')[0]);
    this.quad    = igloo.array(Igloo.QUAD2);        // create array buffer
    this.image   = igloo.texture($('#image')[0]);   // create texture
    this.program = igloo.program('src/project.vert', 'src/tint.frag');
}

Demo.prototype.draw = function() {
    this.image.bind(0);  // active texture 0
    this.program.use()
        .uniform('tint', [1, 0, 0])
        .uniform('scale', 1.2)
        .uniformi('image', 0)
        .attrib('points', this.quad, 2)
        .draw(this.igloo.gl.TRIANGLE_STRIP, Igloo.QUAD2.length / 2);
}
```

This example (shader code not shown) would display a scaled, tinted
image on the screen. No other WebGL calls are required to make this
work.


## Igloo Showcase
Usage of the iglooJS in my following demos inspired me to make this port
* [CELLS](https://haalon.com/cells/),
* [FOURIER](https://haalon.com/fourier/),


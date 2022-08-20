type WebGLAnyContext = WebGLRenderingContext | WebGL2RenderingContext

export class Texture {
    gl: WebGLAnyContext;
    texture: WebGLTexture | null;
    format: GLenum;
    internalFormat: GLint;
    type: GLenum;
    /**
     * Create a new texture, optionally filled blank.
     * @param {WebGLAnyContext} gl
     * @param {GLenum} [format=GL_RGBA]
     * @param {GLenum} [wrap=GL_CLAMP_TO_EDGE]
     * @param {GLenum} [filter=GL_LINEAR]
     * @param {GLenum} [type=UNSIGNED_BYTE]
     * @param {GLenum} [internalFormat=GL_RGBA]
     * @returns {Igloo.Texture}
     */
    constructor(gl : WebGLAnyContext, format : GLenum, wrap : GLint, filter : GLint, type : GLenum, internalFormat : GLint) {
        this.gl = gl;
        const texture = this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        wrap = wrap == null ? gl.CLAMP_TO_EDGE : wrap;
        filter = filter == null ? gl.LINEAR : filter;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
        this.format = format == null ? gl.RGBA : format;
        this.internalFormat = internalFormat == null ? gl.RGBA : internalFormat;
        this.type = type == null ? gl.UNSIGNED_BYTE : type;
    }

    /**
     * @param {?number} [unit] active texture unit to bind
     * @returns {Texture}
     */
    bind(unit?: number) : Texture {
        const gl = this.gl;
        if (unit != null && unit != undefined) {
            gl.activeTexture(gl.TEXTURE0 + unit);
        }
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        return this;
    }

    /**
     * Set texture to particular size, filled with vec4(0, 0, 0, 1).
     * @param {number} width
     * @param {number} height
     * @returns {Igloo.Texture}
     */
    blank(width: any, height: any) : Texture {
        const gl = this.gl;
        this.bind();
        gl.texImage2D(gl.TEXTURE_2D, 0, this.internalFormat, width, height,
                      0, this.format, this.type, null);
        return this;
    }

    /**
     * Set the texture to a particular image.
     * @param {Array|ArrayBufferView|TexImageSource} source
     * @param {number} [width]
     * @param {number} [height]
     * @returns {Igloo.Texture}
     */
    set(source?: Array<number> | ArrayBufferView | TexImageSource, 
        width?: number, height?: number) {

        const gl = this.gl;
        this.bind();
        if (source instanceof Array) {
            if (this.type == gl.FLOAT) {
                source = new Float32Array(source);
            } else {
                source = new Uint8Array(source);
            }
        }
        if (width != null && height != null) {
            gl.texImage2D(gl.TEXTURE_2D, 0, this.internalFormat,
                          width, height, 0, this.format,
                          this.type, source as ArrayBufferView | null);
        } else {
            gl.texImage2D(gl.TEXTURE_2D, 0, this.internalFormat,
                          this.format, this.type, source as TexImageSource);
        }
        return this;
    }

    /**
     * Set part of the texture to a particular image.
     * @param {Array|ArrayBufferView|TexImageSource} source
     * @param {number} xoff
     * @param {number} yoff
     * @param {number} [width]
     * @param {number} [height]
     * @returns {Igloo.Texture}
     */
    subset(source: ArrayBufferView | TexImageSource | Array<number> | null, 
        xoff: number, 
        yoff: number, 
        width: number | null, 
        height: number | null) : Texture {

        const gl = this.gl;
        this.bind();
        if (source instanceof Array) {
            if (this.type == gl.FLOAT) {
                source = new Float32Array(source);
            } else {
                source = new Uint8Array(source);
            }
        }
        if (width != null && height != null) {
            gl.texSubImage2D(gl.TEXTURE_2D, 0, xoff, yoff,
                             width, height,
                             this.format, this.type, source as ArrayBufferView | null);
        } else {
            gl.texSubImage2D(gl.TEXTURE_2D, 0, xoff, yoff,
                             this.format, this.type, source as TexImageSource);
        }
        return this;
    }

    /**
     * Copy part/all of the current framebuffer to this image.
     * @param {Array|ArrayBufferView|TexImageSource} source
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {Igloo.Texture}
     */
    copy(x: number, y: number, width: number, height: number) : Texture {
        const gl = this.gl;
        gl.copyTexImage2D(gl.TEXTURE_2D, 0, this.internalFormat, x, y, width, height, 0);
        return this;
    }
}

export class Framebuffer {
    gl: WebGLAnyContext;
    framebuffer: WebGLFramebuffer | null;
    renderbuffer: WebGLRenderbuffer | null;
    /**
     * @param {WebGLAnyContext} gl
     * @param {WebGLFramebuffer} [framebuffer] to be wrapped (null for default)
     * @returns {Framebuffer}
     */
    constructor(gl: WebGLAnyContext, framebuffer: WebGLFramebuffer | null = null) {
        this.gl = gl;
        this.framebuffer =
            arguments.length == 2 ? framebuffer : gl.createFramebuffer();
        this.renderbuffer = null;
    }

    /**
     * @returns {Framebuffer}
     */
    bind(): Framebuffer {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        return this;
    }

    /**
     * @returns {Framebuffer}
     */
    unbind(): Framebuffer {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        return this;
    }

    /**
     * @param {Texture} texture
     * @param {number} i color attachment to use
     * @returns {Framebuffer}
     */
    attach(texture: Texture, i=0): Framebuffer {
        const gl = this.gl;
        if (i==0) this.bind();
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0+i,
                                gl.TEXTURE_2D, texture.texture, 0);
        return this;
    }

    /**
     * Attach a renderbuffer as a depth buffer for depth-tested rendering.
     * @param {number} width
     * @param {number} height
     * @returns {Igloo.Framebuffer}
     */
    attachDepth(width: number, height: number) {
        const gl = this.gl;
        this.bind();
        if (this.renderbuffer == null) {
            this.renderbuffer = gl.createRenderbuffer();
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16,
                                   width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                                       gl.RENDERBUFFER, this.renderbuffer);
        }
        return this;
    }
    
}


export class Buffer {
    gl: WebGLAnyContext;
    buffer: WebGLBuffer | null;
    target: number;
    size: number;
    /**
     * Fluent WebGLBuffer wrapper.
     * @param {WebGLAnyContext} gl
     * @param {GLenum} [target] either GL_ARRAY_BUFFER or GL_ELEMENT_ARRAY_BUFFER
     * @returns {WebGLProgram}
     * @constructor
     */
    constructor(gl: WebGLAnyContext, target?: GLenum) {
        this.gl = gl;
        this.buffer = gl.createBuffer();
        this.target = (target == null ? gl.ARRAY_BUFFER : target);
        this.size = -1;
    }

    /**
     * Binds this buffer to ARRAY_BUFFER.
     * @returns {Buffer} this
     */
    bind(): Buffer {
        this.gl.bindBuffer(this.target, this.buffer);
        return this;
    }

    /**
     * @param {ArrayBuffer|ArrayBufferView} data
     * @param {GLenum} [usage]
     * @returns {Buffer} this
     */
    update(data: BufferSource, usage?: GLenum): Buffer {
        const gl = this.gl;
        if (data instanceof Array) {
            data = new Float32Array(data);
        }
        usage = usage == null ? gl.DYNAMIC_DRAW : usage;
        this.bind();
        if (this.size !== data.byteLength) {
            gl.bufferData(this.target, data, usage);
            this.size = data.byteLength;
        } else {
            gl.bufferSubData(this.target, 0, data);
        }
        return this;
    }
}

export class Program {
    gl: WebGLAnyContext;
    program: WebGLProgram;
    vars: {[index: string]: WebGLUniformLocation};
    /**
     * Fluent WebGLProgram wrapper for managing variables and data. The
     * constructor compiles and links a program from a pair of shaders.
     * Throws an exception if compiling or linking fails.
     * @param {WebGLAnyContext} gl
     * @param {string} vertex Shader source
     * @param {string} fragment Shader source
     * @constructor
     */
    constructor(gl: WebGLAnyContext, vertex: string, fragment: string) {
        this.gl = gl;
        const p = gl.createProgram();
        if (!p) throw new Error("Failed to create program");
        this.program = p;

        gl.attachShader(p, this.makeShader(gl.VERTEX_SHADER, vertex));
        gl.attachShader(p, this.makeShader(gl.FRAGMENT_SHADER, fragment));
        gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(p) || "Failed to link program");
        }
        this.vars = {};
    }

    /**
     * Compile a shader from source.
     * @param {number} type
     * @param {string} source
     * @returns {WebGLShader}
     */
    makeShader(type: number, source: string): WebGLShader {
        const gl = this.gl;
        const shader = gl.createShader(type);

        if (!shader) throw new Error("Failed to create shader");

        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return shader;
        } else {
            throw new Error(gl.getShaderInfoLog(shader) || "Failed to compile shader");
        }
    }

    /**
     * Tell WebGL to use this program right now.
     * @returns {Program} this
     */
    use(): Program {
        this.gl.useProgram(this.program);
        return this;
    }

    /**
     * Declare/set a uniform or set a uniform's data.
     * @param {string} name uniform variable name
     * @param {number|Array<number>} [value]
     * @param {boolean} [i] if true use the integer version
     * @param {number} [dim] dimension of the variable
     * @returns {Program} this
     */
    uniform(name: string, value: number|Array<number>, i?: boolean, dim?: number): Program {

        if (this.vars[name] == null) {
            const loc = this.gl.getUniformLocation(this.program, name);
            if (!loc) throw new Error(`Failed to locate uniform '${name}'`);

            this.vars[name] = loc
        }

        const v = this.vars[name];
        if (Igloo.isArray(value)) {
            const arrVal = value as Array<number>;
            const l = dim ? dim : arrVal.length;
            const method = "uniform" + l + (i ? "i" : "f") + "v";
            // hack to dynamically access method
            (this.gl as any)[method](v, arrVal);
        } else if (typeof value === "number" || typeof value === "boolean") {
            if (i) {
                this.gl.uniform1i(v, value);
            } else {
                this.gl.uniform1f(v, value);
            }
        } else {
            throw new Error("Invalid uniform value: " + value);
        }
        
        return this;
    }

    /**
     * Set a uniform's data to a specific matrix.
     * @param {string} name uniform variable name
     * @param {Array|ArrayBufferView} matrix
     * @param {boolean} [transpose=false]
     * @returns {Program} this
     */
    matrix(name: string, matrix: Array<number>, transpose?: boolean): Program {
        if (this.vars[name] == null) {
            const loc = this.gl.getUniformLocation(this.program, name);
            if (!loc) throw new Error(`Failed to locate uniform '${name}'`);

            this.vars[name] = loc
        }

        const method = "uniformMatrix" + Math.sqrt(matrix.length) + "fv";
        (this.gl as any)[method](this.vars[name], Boolean(transpose), matrix);
        return this;
    }

    /**
     * Like the uniform() method, but using integers.
     * @param {string} name uniform variable name
     * @param {number|Array<number>} [value]
     * @returns {Program} this
     */
    uniformi(name: string, value: number | number[]): Program {
        return this.uniform(name, value, true);
    }

    /**
     * Declare an attrib or set an attrib's buffer.
     * @param {string} name attrib variable name
     * @param {Buffer} [value]
     * @param {number} [size] element size (required if value is provided)
     * @param {number} [stride=0]
     * @returns {Program} this
     */
    attrib(name: string, value: Buffer, size: number, stride: number): Program {
        const gl = this.gl;
        if (this.vars[name] == null) {
            this.vars[name] = gl.getAttribLocation(this.program, name);
        }

        value.bind();
        gl.enableVertexAttribArray(this.vars[name] as number);
        gl.vertexAttribPointer(this.vars[name] as number, size, gl.FLOAT,
                            false, stride == null ? 0 : stride, 0);
        return this;
    }

    /**
     * Call glDrawArrays or glDrawElements with this program.
     * @param {number} mode
     * @param {number} count the number of vertex attribs to render
     * @param {GLenum} [type] use glDrawElements of this type
     * @returns {Program} this
     */
    draw(mode: number, count: number, type?: GLenum): Program {
        const gl = this.gl;
        if (type == null) {
            gl.drawArrays(mode, 0, count);
        } else {
            gl.drawElements(mode, count, type, 0);
        }
        if (gl.getError() !== gl.NO_ERROR) {
            throw new Error("WebGL rendering error");
        }
        return this;
    }

    /**
     * Disables all attribs from this program.
     * @returns {Program} this
     */
    disable(): Program {
        for (const attrib in this.vars) {
            const location = this.vars[attrib];
            if (this.vars.hasOwnProperty(attrib)) {
                if (typeof location === "number") {
                    this.gl.disableVertexAttribArray(location);
                }
            }
        }
        return this;
    }
}



export class Igloo {
    static Framebuffer = Framebuffer;
    static Texture = Texture;
    static Program = Program;
    static Buffer = Buffer;

    gl: WebGLAnyContext;
    canvas: HTMLCanvasElement;
    defaultFramebuffer: any;

    static QUAD2 = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    /**
     * Wrap WebGLAnyContext objects with useful behavior.
     * @param {WebGLAnyContext|HTMLCanvasElement} gl
     * @param {Record<string, unknown>} [options] to pass to getContext()
     * @returns {Igloo}
     * @namespace
     */
    constructor(gl:WebGLAnyContext|HTMLCanvasElement, options?:Record<string, unknown>) {
        let canvas : HTMLCanvasElement;
        if (gl instanceof HTMLCanvasElement) {
            canvas = gl;
            const temp = Igloo.getContext(gl, options);
            if (temp) gl = temp;
            
        } else {
            canvas = gl.canvas;
        }
        this.gl = gl as WebGLAnyContext;
        this.canvas = canvas;
        this.defaultFramebuffer = new Igloo.Framebuffer(this.gl, null);
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Record<string, unknown>} [options] to pass to getContext()
     * @param {boolean} [noerror] If true, return null instead of throwing
     * @returns {?WebGLAnyContext} a WebGL rendering context.
     */
    static getContext(canvas:HTMLCanvasElement, options?:Record<string, unknown>, noerror?:boolean) : WebGLAnyContext | null {
        let gl : WebGLAnyContext | null;
        try {
            gl = canvas.getContext("webgl2", options || {}) as WebGLAnyContext;
        } catch (e) {
            gl = null;
        }
        if (gl == null && !noerror) {
            throw new Error("Could not create WebGL context.");
        } else {
            return gl;
        }
    }

    /**
     * Asynchronously or synchronously fetch data from the server.
     * @param {string} url
     * @param {Function} [callback] if provided, call is asynchronous
     * @returns {string}
     */
    static fetch = function(url: string | URL, callback?: ((arg0: string) => void)) : string {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, Boolean(callback));
        if (callback != null) {
            xhr.onload = function() {
                callback(xhr.responseText);
            };
        }
        xhr.send();
        return xhr.responseText;
    };

    /**
     * @param {string} string
     * @returns {boolean} True if the string looks like a URL
     */
    static looksLikeURL(string: string) : boolean {
        return /\s/.exec(string) == null;
    }

    /**
     * @param {*} object
     * @returns {boolean} true if object is an array or typed array
     */
    static isArray(object : any) : boolean {
        const name = Object.prototype.toString.apply(object, []),
            re = / (Float(32|64)|Int(16|32|8)|Uint(16|32|8(Clamped)?))?Array]$/;
        return re.exec(name) != null;
    }

    /**
     * Creates a program from a program configuration.
     *
     * @param {string} vertex URL or source of the vertex shader
     * @param {string} fragment URL or source of the fragment shader
     * @param {Function} [transform] Transforms the shaders before compilation
     * @returns {Program}
     */
    program(vertex:string, fragment:string, transform?: ((arg0: string) => string)): Program {
        if (Igloo.looksLikeURL(vertex)) vertex = Igloo.fetch(vertex);
        if (Igloo.looksLikeURL(fragment)) fragment = Igloo.fetch(fragment);
        if (transform != null) {
            vertex = transform(vertex);
            fragment = transform(fragment);
        }
        return new Igloo.Program(this.gl, vertex, fragment);
    }

    /**
     * Create a new GL_ARRAY_BUFFER with optional data.
     * @param {BufferSource} [data]
     * @param {GLenum} [usage]
     * @returns {Buffer}
     */
    array(data?: BufferSource, usage?: GLenum): Buffer {
        const gl = this.gl,
            buffer = new Igloo.Buffer(gl, gl.ARRAY_BUFFER);
        if (data != null) {
            buffer.update(data, usage == null ? gl.STATIC_DRAW : usage);
        }
        return buffer;
    }

    /**
     * Create a new GL_ELEMENT_ARRAY_BUFFER with optional data.
     * @param {BufferSource} [data]
     * @param {GLenum} [usage]
     * @returns {Buffer}
     */
    elements(data?: BufferSource, usage?: GLenum): Buffer {
        const gl = this.gl,
            buffer = new Igloo.Buffer(gl, gl.ELEMENT_ARRAY_BUFFER);
        if (data != null) {
            buffer.update(data, usage == null ? gl.STATIC_DRAW : usage);
        }
        return buffer;
    }

    /**
     * @param {TexImageSource} [source]
     * @param {GLenum} [format=GL_RGBA]
     * @param {GLenum} [wrap=GL_CLAMP_TO_EDGE]
     * @param {GLenum} [filter=GL_LINEAR]
     * @param {GLenum} [type=UNSIGNED_BYTE]
     * @param {GLenum} [internalFormat=GL_RGBA]
     * @param {Object} [options = {type: 'ArrayBufferView', width, height} || {}]
     * @returns {Texture}
     */
    texture(source: ArrayBufferView | TexImageSource | number[] | null,
        format: GLenum, 
        wrap: GLenum, 
        filter: GLenum, 
        type: GLenum, 
        internalFormat: GLint, 
        options: { type: "ArrayBufferView" | "TexImageSource"; 
            width?: number; 
            height?: number; }): Texture {

        const texture = new Igloo.Texture(this.gl, format, wrap, filter, type, internalFormat);
        if (source != null) {
            if (options && options.type === "ArrayBufferView") {
                texture.set(source, options.width, options.height);
            }
            else {
                texture.set(source);
            }
        }
        return texture;
    }

    /**
     * @param {Texture} [texture]
     * @returns {Framebuffer}
     */
    framebuffer(texture: Texture): Framebuffer {
        const framebuffer = new Igloo.Framebuffer(this.gl);
        if (texture != null) framebuffer.attach(texture);
        return framebuffer;
    }
}
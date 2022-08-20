declare type WebGLAnyContext = WebGLRenderingContext | WebGL2RenderingContext;
export declare class Texture {
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
    constructor(gl: WebGLAnyContext, format: GLenum, wrap: GLint, filter: GLint, type: GLenum, internalFormat: GLint);
    /**
     * @param {?number} [unit] active texture unit to bind
     * @returns {Texture}
     */
    bind(unit?: number): Texture;
    /**
     * Set texture to particular size, filled with vec4(0, 0, 0, 1).
     * @param {number} width
     * @param {number} height
     * @returns {Igloo.Texture}
     */
    blank(width: any, height: any): Texture;
    /**
     * Set the texture to a particular image.
     * @param {Array|ArrayBufferView|TexImageSource} source
     * @param {number} [width]
     * @param {number} [height]
     * @returns {Igloo.Texture}
     */
    set(source?: Array<number> | ArrayBufferView | TexImageSource, width?: number, height?: number): this;
    /**
     * Set part of the texture to a particular image.
     * @param {Array|ArrayBufferView|TexImageSource} source
     * @param {number} xoff
     * @param {number} yoff
     * @param {number} [width]
     * @param {number} [height]
     * @returns {Igloo.Texture}
     */
    subset(source: ArrayBufferView | TexImageSource | Array<number> | null, xoff: number, yoff: number, width: number | null, height: number | null): Texture;
    /**
     * Copy part/all of the current framebuffer to this image.
     * @param {Array|ArrayBufferView|TexImageSource} source
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {Igloo.Texture}
     */
    copy(x: number, y: number, width: number, height: number): Texture;
}
export declare class Framebuffer {
    gl: WebGLAnyContext;
    framebuffer: WebGLFramebuffer | null;
    renderbuffer: WebGLRenderbuffer | null;
    /**
     * @param {WebGLAnyContext} gl
     * @param {WebGLFramebuffer} [framebuffer] to be wrapped (null for default)
     * @returns {Framebuffer}
     */
    constructor(gl: WebGLAnyContext, framebuffer?: WebGLFramebuffer | null);
    /**
     * @returns {Framebuffer}
     */
    bind(): Framebuffer;
    /**
     * @returns {Framebuffer}
     */
    unbind(): Framebuffer;
    /**
     * @param {Texture} texture
     * @param {number} i color attachment to use
     * @returns {Framebuffer}
     */
    attach(texture: Texture, i?: number): Framebuffer;
    /**
     * Attach a renderbuffer as a depth buffer for depth-tested rendering.
     * @param {number} width
     * @param {number} height
     * @returns {Igloo.Framebuffer}
     */
    attachDepth(width: number, height: number): this;
}
export declare class Buffer {
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
    constructor(gl: WebGLAnyContext, target?: GLenum);
    /**
     * Binds this buffer to ARRAY_BUFFER.
     * @returns {Buffer} this
     */
    bind(): Buffer;
    /**
     * @param {ArrayBuffer|ArrayBufferView} data
     * @param {GLenum} [usage]
     * @returns {Buffer} this
     */
    update(data: BufferSource, usage?: GLenum): Buffer;
}
export declare class Program {
    gl: WebGLAnyContext;
    program: WebGLProgram;
    vars: {
        [index: string]: WebGLUniformLocation;
    };
    /**
     * Fluent WebGLProgram wrapper for managing variables and data. The
     * constructor compiles and links a program from a pair of shaders.
     * Throws an exception if compiling or linking fails.
     * @param {WebGLAnyContext} gl
     * @param {string} vertex Shader source
     * @param {string} fragment Shader source
     * @constructor
     */
    constructor(gl: WebGLAnyContext, vertex: string, fragment: string);
    /**
     * Compile a shader from source.
     * @param {number} type
     * @param {string} source
     * @returns {WebGLShader}
     */
    makeShader(type: number, source: string): WebGLShader;
    /**
     * Tell WebGL to use this program right now.
     * @returns {Program} this
     */
    use(): Program;
    /**
     * Declare/set a uniform or set a uniform's data.
     * @param {string} name uniform variable name
     * @param {number|Array<number>} [value]
     * @param {boolean} [i] if true use the integer version
     * @param {number} [dim] dimension of the variable
     * @returns {Program} this
     */
    uniform(name: string, value: number | Array<number>, i?: boolean, dim?: number): Program;
    /**
     * Set a uniform's data to a specific matrix.
     * @param {string} name uniform variable name
     * @param {Array|ArrayBufferView} matrix
     * @param {boolean} [transpose=false]
     * @returns {Program} this
     */
    matrix(name: string, matrix: Array<number>, transpose?: boolean): Program;
    /**
     * Like the uniform() method, but using integers.
     * @param {string} name uniform variable name
     * @param {number|Array<number>} [value]
     * @returns {Program} this
     */
    uniformi(name: string, value: number | number[]): Program;
    /**
     * Declare an attrib or set an attrib's buffer.
     * @param {string} name attrib variable name
     * @param {Buffer} [value]
     * @param {number} [size] element size (required if value is provided)
     * @param {number} [stride=0]
     * @returns {Program} this
     */
    attrib(name: string, value: Buffer, size: number, stride: number): Program;
    /**
     * Call glDrawArrays or glDrawElements with this program.
     * @param {number} mode
     * @param {number} count the number of vertex attribs to render
     * @param {GLenum} [type] use glDrawElements of this type
     * @returns {Program} this
     */
    draw(mode: number, count: number, type?: GLenum): Program;
    /**
     * Disables all attribs from this program.
     * @returns {Program} this
     */
    disable(): Program;
}
export declare class Igloo {
    static Framebuffer: typeof Framebuffer;
    static Texture: typeof Texture;
    static Program: typeof Program;
    static Buffer: typeof Buffer;
    gl: WebGLAnyContext;
    canvas: HTMLCanvasElement;
    defaultFramebuffer: any;
    static QUAD2: Float32Array;
    /**
     * Wrap WebGLAnyContext objects with useful behavior.
     * @param {WebGLAnyContext|HTMLCanvasElement} gl
     * @param {Record<string, unknown>} [options] to pass to getContext()
     * @returns {Igloo}
     * @namespace
     */
    constructor(gl: WebGLAnyContext | HTMLCanvasElement, options?: Record<string, unknown>);
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Record<string, unknown>} [options] to pass to getContext()
     * @param {boolean} [noerror] If true, return null instead of throwing
     * @returns {?WebGLAnyContext} a WebGL rendering context.
     */
    static getContext(canvas: HTMLCanvasElement, options?: Record<string, unknown>, noerror?: boolean): WebGLAnyContext | null;
    /**
     * Asynchronously or synchronously fetch data from the server.
     * @param {string} url
     * @param {Function} [callback] if provided, call is asynchronous
     * @returns {string}
     */
    static fetch: (url: string | URL, callback?: ((arg0: string) => void) | undefined) => string;
    /**
     * @param {string} string
     * @returns {boolean} True if the string looks like a URL
     */
    static looksLikeURL(string: string): boolean;
    /**
     * @param {*} object
     * @returns {boolean} true if object is an array or typed array
     */
    static isArray(object: any): boolean;
    /**
     * Creates a program from a program configuration.
     *
     * @param {string} vertex URL or source of the vertex shader
     * @param {string} fragment URL or source of the fragment shader
     * @param {Function} [transform] Transforms the shaders before compilation
     * @returns {Program}
     */
    program(vertex: string, fragment: string, transform?: ((arg0: string) => string)): Program;
    /**
     * Create a new GL_ARRAY_BUFFER with optional data.
     * @param {BufferSource} [data]
     * @param {GLenum} [usage]
     * @returns {Buffer}
     */
    array(data?: BufferSource, usage?: GLenum): Buffer;
    /**
     * Create a new GL_ELEMENT_ARRAY_BUFFER with optional data.
     * @param {BufferSource} [data]
     * @param {GLenum} [usage]
     * @returns {Buffer}
     */
    elements(data?: BufferSource, usage?: GLenum): Buffer;
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
    texture(source: ArrayBufferView | TexImageSource | number[] | null, format: GLenum, wrap: GLenum, filter: GLenum, type: GLenum, internalFormat: GLint, options: {
        type: "ArrayBufferView" | "TexImageSource";
        width?: number;
        height?: number;
    }): Texture;
    /**
     * @param {Texture} [texture]
     * @returns {Framebuffer}
     */
    framebuffer(texture: Texture): Framebuffer;
}
export {};

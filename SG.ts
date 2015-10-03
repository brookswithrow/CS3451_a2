// utility function to make sure we don't have too small numbers
function epsilon( value: number ): number {
    return Math.abs( value ) < 0.000001 ? 0 : value;
}

// convert degrees to radians
var degreeToRadiansFactor = Math.PI / 180;
function degToRad( degrees: number): number {
    return degrees * degreeToRadiansFactor;
}

// convert radians to degress
var radianToDegreesFactor = 180 / Math.PI;
function radToDeg( radians: number): number {
    return radians * radianToDegreesFactor;
}    
	
/////////////////////////////
// classes adapted from a1, the Typescript RayTracer sample
export class Vector {
    constructor(public x: number,
                public y: number,
                public z: number) {
    }
    static times(k: number, v: Vector) { return new Vector(k * v.x, k * v.y, k * v.z); }
    static minus(v1: Vector, v2: Vector) { return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z); }
    static plus(v1: Vector, v2: Vector) { return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z); }
    static dot(v1: Vector, v2: Vector) { return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z; }
    static mag(v: Vector) { return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z); }
    static norm(v: Vector) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    }
    static cross(v1: Vector, v2: Vector) {
        return new Vector(v1.y * v2.z - v1.z * v2.y,
                          v1.z * v2.x - v1.x * v2.z,
                          v1.x * v2.y - v1.y * v2.x);
    }
}

export class Color {
    constructor(public r: number,
                public g: number,
                public b: number) {
    }
    static scale(k: number, v: Color) { return new Color(k * v.r, k * v.g, k * v.b); }
    static plus(v1: Color, v2: Color) { return new Color(v1.r + v2.r, v1.g + v2.g, v1.b + v2.b); }
    static times(v1: Color, v2: Color) { return new Color(v1.r * v2.r, v1.g * v2.g, v1.b * v2.b); }
    static white = new Color(1.0, 1.0, 1.0);
    static grey = new Color(0.5, 0.5, 0.5);
    static black = new Color(0.0, 0.0, 0.0);
    static background = Color.black;
    static defaultColor = Color.black;
    static random = new Color (Math.random(), Math.random(), Math.random());
    static toDrawingColor(c: Color) {
        var legalize = d => d > 1 ? 1 : d;
        return {
            r: Math.floor(legalize(c.r) * 255),
            g: Math.floor(legalize(c.g) * 255),
            b: Math.floor(legalize(c.b) * 255)
        }
    }
}

///////////////////////////////////////////
// new minimal matrix class
export class Matrix {
    // the matrix elements
    elements: number[];
    
    // construct a new matrix (including copying one and creating an identity matrix)
	constructor ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {
    	this.elements = new Array<number>( 16 );
        var te = this.elements;
		te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
		te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
		te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
		te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;
		return this;
	}

    // transpose the matrix, returning a new matrix with the result
    static transpose(m: Matrix): Matrix {
        var n11 = m.elements[0]; var n12 = m.elements[1]; var n13 = m.elements[2]; var n14 = m.elements[3];
        var n21 = m.elements[4]; var n22 = m.elements[5]; var n23 = m.elements[6]; var n24 = m.elements[7];
        var n31 = m.elements[8]; var n32 = m.elements[9]; var n33 = m.elements[10]; var n34 = m.elements[11];
        var n41 = m.elements[12]; var n42 = m.elements[12]; var n43 = m.elements[14]; var n44 = m.elements[15];
        return new Matrix( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 );
    }     

    // copy the matrix to a new matrix
	static copy (m: Matrix): Matrix {
        var n11 = m.elements[0]; var n12 = m.elements[4]; var n13 = m.elements[8]; var n14 = m.elements[12];
        var n21 = m.elements[1]; var n22 = m.elements[5]; var n23 = m.elements[9]; var n24 = m.elements[13];
        var n31 = m.elements[2]; var n32 = m.elements[6]; var n33 = m.elements[10]; var n34 = m.elements[14];
        var n41 = m.elements[3]; var n42 = m.elements[7]; var n43 = m.elements[11]; var n44 = m.elements[15];
        return new Matrix( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 );
	}

    // return a new matrix containing the identify matrix
	static identity(): Matrix { 
        return new Matrix(1, 0, 0, 0, 
                          0, 1, 0, 0, 
                          0, 0, 1, 0, 
                          0, 0, 0, 1); 
    }

    // create a new rotation matrix from the input vector. 
    // eu.x, eu.y, eu.z contain the rotations in degrees around the three axes. 
    // Apply the rotations in the order x, y, z.
    static makeRotationFromEuler (eu: Vector): Matrix {
        var xd = degToRad(eu.x);
        var yd = degToRad(eu.y);
        var zd = degToRad(eu.z);
        
        var n11 = 1;    var n12 = 0;               var n13 = 0;                var n14 = 0;
        var n21 = 0;    var n22 = Math.cos(xd);    var n23 = -Math.sin(xd);    var n24 = 0;
        var n31 = 0;    var n32 = Math.sin(xd);    var n33 = Math.cos(xd);     var n34 = 0;
        var n41 = 0;    var n42 = 0;               var n43 = 0;                var n44 = 1;
        var xMatrix = new Matrix( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 );
        
        n11 = Math.cos(yd);     n12 = 0;    n13 = Math.sin(yd);     n14 = 0;
        n21 = 0;                n22 = 1;    n23 = 0;                n24 = 0;
        n31 = -Math.sin(yd);    n32 = 0;    n33 = Math.cos(yd);     n34 = 0;
        n41 = 0;                n42 = 0;    n43 = 0;                n44 = 1;
        var yMatrix = new Matrix( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 );
        
        n11 = Math.cos(zd);     n12 = -Math.sin(zd);    n13 = 0;    n14 = 0;
        n21 = Math.sin(zd);     n22 = Math.cos(zd);     n23 = 0;    n24 = 0;
        n31 = 0;                n32 = 0;                n33 = 1;    n34 = 0;
        n41 = 0;                n42 = 0;                n43 = 0;    n44 = 1;
        var zMatrix = new Matrix( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 );
        
        return (xMatrix.multiply(yMatrix)).multiply(zMatrix);
	}

    // create a new translation matrix from the input vector
    // t.x, t.y, t.z contain the translation values in each direction
	static makeTranslation(t: Vector): Matrix {
        var n11 = 1; var n12 = 0; var n13 = 0; var n14 = t.x;
        var n21 = 0; var n22 = 1; var n23 = 0; var n24 = t.y;
        var n31 = 0; var n32 = 0; var n33 = 1; var n34 = t.z;
        var n41 = 0; var n42 = 0; var n43 = 0; var n44 = 1;
        return new Matrix( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 );
	}

    // create a new scale matrix from the input vector
    // s.x, s.y, s.z contain the scale values in each direction
	static makeScale(s: Vector): Matrix {
        var n11 = s.x; var n12 = 0; var n13 = 0; var n14 = 0;
        var n21 = 0; var n22 = s.y; var n23 = 0; var n24 = 0;
        var n31 = 0; var n32 = 0; var n33 = s.z; var n34 = 0;
        var n41 = 0; var n42 = 0; var n43 = 0; var n44 = 1;
        return new Matrix( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 );
    }
        
    // compose transformations with multiplication.  Multiply this * b, 
    // returning the result in a new matrix
   	multiply (b: Matrix ): Matrix {
        var a0 = this.elements[0]; var a4 = this.elements[4]; var a8 = this.elements[8]; var a12 = this.elements[12];
        var a1 = this.elements[1]; var a5 = this.elements[5]; var a9 = this.elements[9]; var a13 = this.elements[13];
        var a2 = this.elements[2]; var a6 = this.elements[6]; var a10 = this.elements[10]; var a14 = this.elements[14];
        var a3 = this.elements[3]; var a7 = this.elements[7]; var a11 = this.elements[11]; var a15 = this.elements[15];
        
        var b0 = b.elements[0]; var b4 = b.elements[4]; var b8 = b.elements[8]; var b12 = b.elements[12];
        var b1 = b.elements[1]; var b5 = b.elements[5]; var b9 = b.elements[9]; var b13 = b.elements[13];
        var b2 = b.elements[2]; var b6 = b.elements[6]; var b10 = b.elements[10]; var b14 = b.elements[14];
        var b3 = b.elements[3]; var b7 = b.elements[7]; var b11 = b.elements[11]; var b15 = b.elements[15];
        
        var n11 = a0*b0 + a4*b1 + a8*b2 + a12*b3;
        var n12 = a0*b4 + a4*b5 + a8*b6 + a12*b7;
        var n13 = a0*b8 + a4*b9 + a8*b10 + a12*b11;
        var n14 = a0*b12 + a4*b13 + a8*b14 + a12*b15;
        
        var n21 = a1*b0 + a5*b1 + a9*b2 + a13*b3;
        var n22 = a1*b4 + a5*b5 + a9*b6 + a13*b7;
        var n23 = a1*b8 + a5*b9 + a9*b10 + a13*b11;
        var n24 = a1*b12 + a5*b13 + a9*b14 + a13*b15;
        
        
        var n31 = a2*b0 + a6*b1 + a10*b2 + a14*b3;
        var n32 = a2*b4 + a6*b5 + a10*b6 + a14*b7;
        var n33 = a2*b8 + a6*b9 + a10*b10 + a14*b11;
        var n34 = a2*b12 + a6*b13 + a10*b14 + a14*b15;
        
        var n41 = a3*b0 + a7*b1 + a11*b2 + a15*b3;
        var n42 = a3*b4 + a7*b5 + a11*b6 + a15*b7;
        var n43 = a3*b8 + a7*b9 + a11*b10 + a15*b11;
        var n44 = a3*b12 + a7*b13 + a11*b14 + a15*b15;
        return new Matrix( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 );
	}

    // get the translation/positional componenet out of the matrix
    getPosition(): Vector {
        return new Vector(this.elements[12], this.elements[13], this.elements[14]);
    }
    
    // get the x, y and z vectors out of the rotation part of the matrix
    getXVector(): Vector {
        return new Vector(this.elements[0], this.elements[1], this.elements[2]);
    }
    getYVector(): Vector {
        return new Vector(this.elements[4], this.elements[5], this.elements[6]);
    }
    getZVector(): Vector {
        return new Vector(this.elements[8], this.elements[9], this.elements[10]);
    }
}

// The nodes in the graph and the scene are inspired by the raytracer, but are different.
// All the nodes in the tree are Things
export class Thing {
    // the children of the node, and the parent
    children: Thing[];
    parent: Thing;
    
    // store position and scale as vectors, but orientation as a matrix, since there are many
    // ways to create an orientation matrix.
    position: Vector;
    rotation: Matrix;
    scale: Vector;
    
    // the transform should be computed as position * rotation * scale, and NOT be set by the 
    // programmer who is using this library
    transform: Matrix;
    
    // inverse should be computed 
    inverseTransform: Matrix;
    worldTransform: Matrix;
        
    constructor() {
        // we'll provide the constructor as a hint
        this.position = new Vector(0,0,0);
        this.rotation = Matrix.identity();
        this.scale = new Vector(1,1,1);
        
        this.parent = undefined;
        this.children = new Array();
        this.transform = Matrix.identity();
        this.inverseTransform = Matrix.identity();
        this.worldTransform = Matrix.identity();
    }

    // compute transform from position * rotation * scale and inverseTransform from their inverses 
    computeTransforms() {
        // Getting transform
        var pos = Matrix.makeTranslation(this.position);
        
        var sca = Matrix.makeScale(this.scale);
        
        var posTimesRot = pos.multiply(this.rotation);
        this.transform = posTimesRot.multiply(sca);
        
        // Getting inverses of rotation, scale, and position, in that order
        var invrot = Matrix.transpose(this.rotation);

        var invscavec = new Vector(1/this.scale.x, 1/this.scale.y, 1/this.scale.z);
        var invsca = Matrix.makeScale(invscavec);
        
        var invposvec = Vector.times(-1, this.position);
        var invpos = Matrix.makeTranslation(invposvec);
        
        // Getting inverse transform
        var scaTimesRot = invsca.multiply(invrot);
        this.inverseTransform = scaTimesRot.multiply(invpos);
        
        // Getting worldTransform using parent
        this.worldTransform = Matrix.identity();
        if (this.parent != undefined) {
            this.worldTransform = Matrix.copy(this.parent.worldTransform.multiply(this.transform));
        }
    }    

    // add a child to this Thing.  Be sure to take care of setting the Thing's parent to this
    add(c: Thing) {
        this.children.push(c);
        c.parent = this;
    }

    // remove a Thing    
    remove(c: Thing) {
        var index = this.children.indexOf(c);
        this.children[index].parent = null;
        this.children[index] = null;        
    }

    // traverse the graph, executing the provided callback on this node and it's children
    // execute the callback before traversing the children
	traverse ( callback: (obj: Thing ) => void ) {
        callback(this);
        this.children.forEach(child => {
            child.traverse(callback);
        });
	}    
}

// a simple interface for the surface color of a DIV.  We aren't doing any fancy lighting here.
export interface Surface {
    diffuse: Color;
}

// Things that are Drawable.  Only one here, the HTMLDivThing below.  
// A simple implementation is provided, as the class just holds some common data 
// for all drawable Things
export class Drawable extends Thing {
    surface: Surface;

    constructor() {
        super();
        this.surface = {diffuse: Color.white};
    }    
    
    setMaterial(s: Surface) {
        this.surface = s;
    }    
}

// The HTMLDivThing is simply a holder for the div being manipulated by the library.
// By having it be a class, we can recognize when a node is one of these and handle appropriately
export class HTMLDivThing extends Drawable {    
    constructor(public div: HTMLDivElement) {
        super();
        // set the position style of this to 'absolute' since we'll be moving it around
    	this.div.style.position = 'absolute';        
    }
}

// A simple Thing for a Light
export class Light extends Thing {
    constructor (public color: Color) {
       super(); 
    }
}

// The Camera Thing.  There must be one and only one in the Scene.
export class Camera extends Thing {
    // hint:  you will need to figure out and keep track of the inverse transform from
    // the camera up to the root of the scene.  
    worldInverseTransform: Matrix;
    
    constructor(public fovy: number) {
        super();
		this.worldInverseTransform = Matrix.identity();
    }

    // get the focal length (distance from the viewplane) for a window of a specified
    // height and the camera's fovy    
    getFocalLength (height: number): number {
        var theta = degToRad(this.fovy);
        return height/(2*Math.tan(theta/2));
    }
}
 
export class Scene {
    world: Thing;
    camera: Camera;
    
    // an ambient color. Default to the defaultColor
    ambient: Color = Color.defaultColor;
    
    // internal
    private domElement: HTMLDivElement;
    private width: number;
    private height: number;
            
    // cached
    private lights: Light[];
    
    // We are providing a constructor for convenience
    constructor(public container: HTMLDivElement) {
        this.lights = new Array();
        this.world = new Thing();
        this.camera = undefined;

        // we will create a NEW DOM element inside the provided container div
        this.domElement = document.createElement( 'div' );

        // uncomment this to clip the contents of the domElement to the boundaries of the 
        // domElement; otherwise, div's can go outside of it's boundaries (useful for 
        // debugging!)
        //this.domElement.style.overflow = 'hidden';

        // set the transform-style to "preserve-3d" so the 3D values inherit
        this.domElement.style.transformStyle
            = this.domElement.style["-webkit-transform-style"]
            = this.domElement.style["-moz-transform-style"]
            = this.domElement.style["-o-transform-style"]
            = this.domElement.style["-ms-transform-style"] = "preserve-3d";

        // add our new DOM element to the provided container
        this.container.appendChild(this.domElement);

        // get the size of the provided container, and set our DOM element to it's size       
        var rect = container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
		this.domElement.style.width = this.width + 'px';
		this.domElement.style.height = this.height + 'px';
        
        // CSS uses a weird +y is DOWN coordinate frame, so we're going to
        // scale by -1 in Y in each of the elements, and then undo that scale here.
        // By doing this, all of our transformations can by in the more common
        // +1 is UP coordinate frame 
        this.domElement.style.transform   			
                            = this.domElement.style["-webkit-transform"]
                            = this.domElement.style["-moz-transform"]
                            = this.domElement.style["-o-transform"]
                            = this.domElement.style["-ms-transform"] 
                            = "matrix3d(1,0,0,0, 0,-1,0,0, 0,0,1,0, 0,0,0,1)"; 
    }

    // internal function to compute the color of a Drawable.  The color is a simple
    // diffuse Lambertian color, as described in chapter 10.1.
    // This function should account for all lights and an ambient light
    private shade(thing: Drawable, pos: Vector, normal: Vector): Color {
        var res = new Color(0, 0, 0);
        var cr = thing.surface.diffuse;
        var ca = this.ambient;
        for (var i = 0; i < this.lights.length; i++) {
            var light = this.lights[i];
            var cl = light.color;
            var p = Vector.minus(light.worldTransform.getPosition(), pos);
            var l = Vector.norm(p);
            var a = Color.scale(Math.max(0, Vector.dot(normal, l)), cl);
            res = Color.plus(res, Color.times(cr, Color.plus(ca, a))); 
        }
        return res;
    }

    // convenience function provided so you don't have to fight with this.  
    // we invert Y here, as described above
    getObjectCSSMatrix( m: Matrix ): string {
		var elements = m.elements;

		return 'matrix3d(' +
			epsilon( elements[ 0 ]  ) + ',' +
			epsilon( elements[ 1 ]  ) + ',' +
			epsilon( elements[ 2 ]  ) + ',' +
			epsilon( elements[ 3 ]  ) + ',' +
			epsilon( - elements[ 4 ]  ) + ',' +
			epsilon( - elements[ 5 ]  ) + ',' +
			epsilon( - elements[ 6 ]  ) + ',' +
			epsilon( - elements[ 7 ]  ) + ',' +
			epsilon( elements[ 8 ]  ) + ',' +
			epsilon( elements[ 9 ]  ) + ',' +
			epsilon( elements[ 10 ]  ) + ',' +
			epsilon( elements[ 11 ]  ) + ',' +
			epsilon( elements[ 12 ]  ) + ',' +
			epsilon( elements[ 13 ]  ) + ',' +
			epsilon( elements[ 14 ]  ) + ',' +
			epsilon( elements[ 15 ]  ) +
		')';
	};
    
    // the render function.
    //
    // In here, you should:
    // - update all the Things' internal matrices
    // - update all the Things' worldTransforms
    // - find the Lights and save them
    // - find the Camera and save it, and figure out it's inverse transformation to the root
    // - set the perspective on this.domElement from the focalLength, as follows:
    //         this.domElement.style.perspective 
    //                = this.domElement.style["-webkit-perspective"]
    //                = this.domElement.style["-moz-perspective"]
    //                = this.domElement.style["-o-perpective"]
    //                = this.domElement.style["-ms-perspective"] 
    //                = focalLength.toString() + "px";
    // - for each object, figure out the entire transformation to that object
    //   (including the inverse camera transformation). 
    // - add the DIV's in the HTMLDivThings directly to this.domElement (do not use a
    //   heirarchy) and set the transformation as follows:
    //        const transformStr = this.getObjectCSSMatrix(m);
    //        obj.div.style.transform   			
    //                        = obj.div.style["-webkit-transform"]
    //                        = obj.div.style["-moz-transform"]
    //                        = obj.div.style["-o-transform"]
    //                        = obj.div.style["-ms-transform"] = transformStr; 
    //
    // hint: you will need to traverse the graph more than once to do this.
    //
    render() {
        this.lights = new Array();
        this.camera = undefined;
        
        // Calculating transforms, setting up lights & camera
        var renderPass1 = (obj: Thing) => {
            obj.computeTransforms();
            if (obj instanceof Light) {
                this.lights.push(obj);
            }
            if (obj instanceof Camera) {
                this.camera = obj;
                var trav = obj.parent;
                var matrix = Matrix.copy(obj.inverseTransform);
                while (trav != undefined) {
                    matrix = Matrix.copy(matrix.multiply(trav.inverseTransform));
                    trav = trav.parent;
                }
                this.camera.worldInverseTransform = Matrix.copy(matrix);
            }
        };
        
        this.world.traverse(renderPass1);
        
        this.domElement.style.perspective 
        = this.domElement.style["-webkit-perspective"]
        = this.domElement.style["-moz-perspective"]
        = this.domElement.style["-o-perpective"]
        = this.domElement.style["-ms-perspective"] 
        = this.camera.getFocalLength(this.height).toString() + "px";
        
        // Calculating entire transformation and color
        var renderPass2 = (obj: Thing) => {
            obj.transform = Matrix.copy(this.camera.worldInverseTransform.multiply(obj.worldTransform));
            if (obj instanceof HTMLDivThing) {
                var zvec = obj.worldTransform.getZVector();
                var n;
                if (Vector.mag(zvec) == 0) {
                    n = new Vector(0, 0, 1);
                }
                else {
                    n = Vector.norm(zvec);
                }
                var c = this.shade(obj, zvec, n);
                obj.div.style.backgroundColor = "rgb(" + c.r*100 + "%," + c.g*100 + "%," + c.b*100 + "%)";
                const transformStr = this.getObjectCSSMatrix(obj.transform);
                obj.div.style.transform 
                    = obj.div.style["-webkit-transform"]
                    = obj.div.style["-moz-transform"]
                    = obj.div.style["-o-transform"]
                    = obj.div.style["-ms-transform"] = transformStr;
                this.domElement.appendChild(obj.div);
            }
        };
        this.world.traverse(renderPass2);
    }
}
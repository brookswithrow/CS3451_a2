
import sg = require('./SG');

var s = new sg.Scene(<HTMLDivElement>document.getElementById("portfolio"));

///////////////////////////////////
// My scene. Contains a rotating cube with greetings in 6 languages
// (one for each face), two clickable divs that change size upon being
// clicked, and two divs for decoration.

//Camera
var cam = new sg.Camera(25);
cam.position = new sg.Vector(0,0,200); 
s.world.add(cam);

//Lights
var light1 = new sg.Light(new sg.Color(1,0,0));
light1.position = new sg.Vector(0,150,200); 
s.world.add(light1);

var light2 = new sg.Light(new sg.Color(0,1,0));
light2.position = new sg.Vector(400,150,200); 
s.world.add(light2);

var light3 = new sg.Light(new sg.Color(0,0,1));
light3.position = new sg.Vector(800,150,200); 
s.world.add(light3);

//Divs
var p1 = document.createElement("div");
p1.className = "panel";
p1.innerText = "Hello";

var n1 = new sg.HTMLDivThing(p1);
n1.position = new sg.Vector(300,100,50);
s.world.add(n1);

var p2 = document.createElement("div");
p2.className = "panel";
p2.innerText = "Hola";

var n2 = new sg.HTMLDivThing(p2);
n2.position = new sg.Vector(50,0,-50);
n2.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(0, 90, 0));
n1.add(n2);

var p3 = document.createElement("div");
p3.className = "panel";
p3.innerText = "Bonjour";

var n3 = new sg.HTMLDivThing(p3);
n3.position = new sg.Vector(50, 0, -50);
n3.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(0, 90, 0));
n2.add(n3);

var p4 = document.createElement("div");
p4.className = "panel";
p4.innerText = "Ciao";

var n4 = new sg.HTMLDivThing(p4);
n4.position = new sg.Vector(50, 0, -50);
n4.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(0, 90, 0));
n3.add(n4);

var p5 = document.createElement("div");
p5.className = "panel";
p5.innerText = "Konnichiwa";

var n5 = new sg.HTMLDivThing(p5);
n5.position = new sg.Vector(0, 50, -50);
n5.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(90, 0, 0));
n1.add(n5);

var p6 = document.createElement("div");
p6.className = "panel";
p6.innerText = "Ni Hao";

var n6 = new sg.HTMLDivThing(p6);
n6.position = new sg.Vector(0, -50, -50);
n6.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(-90, 0, 0));
n1.add(n6);

var p7 = document.createElement("div");
p7.className = "panel";
p7.innerText = "Click me!";

var n7 = new sg.HTMLDivThing(p7);
n7.position = new sg.Vector(-50, 100, 0);
s.world.add(n7);

var p8 = document.createElement("div");
p8.className = "panel";
p8.innerText = "Or me!";

var n8 = new sg.HTMLDivThing(p8);
n8.position = new sg.Vector(700, 100, 0);
s.world.add(n8);

var p9 = document.createElement("div");
p9.className = "panel";
p9.innerText = "My crazy";

var n9 = new sg.HTMLDivThing(p9);
n9.position = new sg.Vector(150, 200, 0);
n9.scale = new sg.Vector(1, 1.5, 1);
s.world.add(n9);

var p10 = document.createElement("div");
p10.className = "panel";
p10.innerText = "greeting cube!";

var n10 = new sg.HTMLDivThing(p10);
n10.position = new sg.Vector(500, 200, 0);
n10.scale = new sg.Vector(1, 1.5, 1);
s.world.add(n10);


//Transformations/Animation
var xRotation = 0;
var yRotation = 120;
var zRotation = 240;
var p7big = false;
var p8big = false;
var srenderFunc = function() {
	p7.onmousedown = (e) => {
		var big = new sg.Vector(2, 2, 2);
		var small = new sg.Vector(1, 1, 1);
		if (p7big == false && p8big == false) {
			n7.scale = big;
			p7big = true;
		}
		else if (p7big == true && p8big == false) {
			n7.scale = small;
			n8.scale = small;
			p7big = false;
		}
		else if (p7big == false && p8big == true) {
			n7.scale = big;
			p7big = true;
			n8.scale = small;
			p8big = false;
		}
	}
	p8.onmousedown = (e) => {
		var big = new sg.Vector(2, 2, 2);
		var small = new sg.Vector(1, 1, 1);
		if (p7big == false && p8big == false) {
			n8.scale = big;
			p8big = true;
		}
		else if (p7big == true && p8big == false) {
			n7.scale = small;
			p7big = false;
			n8.scale = big;
			p8big = true;
		}
		else if (p7big == false && p8big == true) {
			n7.scale = small;
			n8.scale = small;
			p8big = false;
		}
	}
	xRotation += 1;
	yRotation += 1;
	zRotation += 1;
	if (xRotation > 360) {
		xRotation -= 360;
	}
	if (yRotation > 360) {
		yRotation -= 360;
	}
	if (zRotation > 360) {
		zRotation -= 360;
	}
	n1.rotation = sg.Matrix.makeRotationFromEuler(new sg.Vector(xRotation, yRotation, zRotation)); 
	
	s.render();
	requestAnimationFrame(srenderFunc);
};
srenderFunc();
///////////////////////////////////

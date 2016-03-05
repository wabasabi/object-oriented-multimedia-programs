/************************************************************
/* Author: Ryan Harrington
/* Creation Date: 11/22/2015, 2/17/2016
/* Date edited by Student: 2/25/2016
/* Due Date: Friday, 3/4/2016
/* Course: CSC220 Object Oriented Multimedia Programming
/* Professor Name: Dr. Parson
/* Assignment: 1.
/* Sketch name: GeoCSC220Intro.js. This is the j5.ps translation
/*      of Processing sketch GeoCSC220Intro.
/* Purpose: Add 3D capabilities to an existing 2D project.
/*          Add camera perspective changes based on key input.
 *********************************************************/
// STUDENT: Support full screen, frozen mode, & demo mode per handout.
// STUDENT COMMENTS for tackling p5.js: See http://p5js.org/
// http://p5js.org/reference/ is the library reference, note the 3D
// primitive shapes. Unlike Processing, not all of the 2D
// primitives work in 3D mode (WEBGL being the 3rd argument to createCanvas()).
// https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5
// is a must read for working in 3D in p5.js.
var isPerspective = false;
var isfrozen = false;
var isdemo = false;
// These are the objects to plot.
var dealy = []; // populate with 3 below
var dealylength = 3;
var demodealy = null; // null means there is no object there yet.

var restartInterval = 60; // seconds between restarting the dealies.
var restartCounter = 0;

function setup() {
  // CSC220 STUDENT: We will use WEBGL to enable 3D shapes.
  var width = 800;
  var height = 600;
  createCanvas(width, height, WEBGL);

  /*
  background(0);
  */

  frameRate(30);

  // We need to construct dealies to populate the array.
  for (var i = 0; i < dealylength; i++) {
    dealy[i] = new GeometricDealy(random(0, width), random(0, height),
      random(1, width / 4), random(1, height / 4),
      random(0, 256), random(0, 256), random(0, 256));
  }
}

function draw() {
  rectMode(CENTER);

  //NEW: Added code to change the perspective.
  if (isPerspective == true) {
    perspective(60 / 180 * PI, width / height, 0.1, 100);
  } else {
    ortho(-width / 2, width / 2, height / 2, -height / 2, 0.1, 100);
  }

  if (isfrozen) {
    return;
  }
  // We need to support the erase option.
  if (keyIsPressed && key == 'e') {
    background(0);
  }
  // We need to support demo mode for your basic geometric shape.
  if (isdemo) {
    if (demodealy == null) {
      demodealy = new GeometricDealy(width / 2, height / 2,
        width / 4, height / 4, 128, 128, 128);
    }
    demodealy.displayDemo();
    return;
  }
  // STUDENT: fill a rectangle with an alpha < 255 in your background
  // color to get partial erase instead of full erase. The background
  // applies only in setup (to set initial background color) and in erase mode.
  demodealy = null;

  translate(0, 0, 100);
  fill(0, 0, 0, 100);
  plane(width, height);

  // This restart stuff is optional. I like restarting new dealies periodically.
  restartCounter += 1;
  if (restartCounter >= (restartInterval * frameRate)) {
    restartCounter = 0;
    rect(width / 2, height / 2, width, height);
  }
  for (var i = 0; i < dealy.length; i++) {
    dealy[i].display();
  }
}

// We must implement the frozen and demo commands
// using these keys. You must also implement the erase command,
// which shows up in draw(). Any others are optional, and if you add any key
// or mouse responses, make sure to document them in comments at the top
// of this file so I see them when I run your program.
function keyTyped() {
  if (key == 'f') {
    isfrozen = !isfrozen;
    console.log("Frozen? " + isfrozen);
  }
  if (key == 'd' && !isfrozen) {
    isdemo = !isdemo;
    console.log("Demo? " + isdemo);
  }
  if (key == 'r' && !(isdemo || isfrozen)) {
    for (var i = 0; i < dealy.length; i++) {
      dealy[i] = new GeometricDealy(random(0, width), random(0, height),
        random(1, width / 4), random(1, height / 4),
        random(0, 256), random(0, 256), random(0, 256));
    }
  }

  //NEW: Changes the perspective when 'c' key is pressed.
  if (key == 'c' & !isfrozen) {
    isPerspective = !isPerspective;
    console.log("isPerspective? " + isPerspective);
  }
}
// STUDENT: You must update class GeometricDealy.
// Some variable fields can be self-initializing like some
// you see here, and at least one must initialize from a constructor parameter.
// CSC220 STUDENT: This must go to a 3D sketch.
// javascript defines a class within its constructor definition:
function GeometricDealy(initialx, initialy, initialwidth, initialheight,
  r, g, b) {
  this.x = initialx;
  this.y = initialy;
  this.z = 1;
  this.w = initialwidth;
  this.h = initialheight;
  this.rr = r;
  this.gg = g;
  this.bb = b;
  this.aa = random(0, 256);
  this.speedx = (random(0, 20) - 10); // (random(-10.0, 10.1));
  if (this.speedx == 0) {
    this.speedx = 1;
  }
  this.speedy = (random(0, 20) - 10); // (random(-10.0, 10.1));
  if (this.speedy == 0) {
    this.speedy = 1;
  }
  this.speedw = 1;
  this.speedh = -1;
  this.rotation = 0.0;
  this.delta = random(-90, 90);
  this.s = .5;
  this.speedscale = random(-1, 1);
  // STUDENT You MUST use 3D translate() to move plotting around the
  // display and also around your dealy's "body", along with push()
  // and pop() as outlined below. You must use 2 to 4 geometric
  // forms (I use 3 -- ellipse, rectangle, and my own "dandelion seed head").
  // You must use 3D rotate() and scale(). You must use Processing's shearX()
  // and/or shearY() functions; I recommend using these 2D functions
  // before any rotation or sclaing in the 3rd dimension.
  this.display = function() {
      rectMode(CENTER);
      ellipseMode(CENTER);

      push();
      translate(this.x, this.y, this.z);
      rotateY(frameCount * 0.02);
      rotateZ(frameCount * 0.01);
      box(250, 250, 250);

      push();
      translate(300, 25, 0);
      cone(60, 90);

      pop();
      pop();

      push();
      translate(this.x - 250, this.y + 300, this.z - 50);
      rotateY(frameCount * 0.25);
      rotateZ(frameCount * 0.05);

      pop();

      push();
      translate(this.x + 250, this.y - 400, this.z);
      rotateX(frameCount * 0.01);
      rotateZ(frameCount * 0.01);
      cylinder(200, 200);

      pop();

      push();
      translate(this.x - 500, this.y - 500, this.z + 100);
      rotateY(frameCount * 2);
      rotateZ(frameCount * 0.5);
      sphere(300);

      pop();




      // STUDENT: After all display is completed, implement the move
      // functionality right here within display():
      if (mouseIsPressed) {
        if (mouseX < this.x) {
          this.x = this.x - 1;
        } else if (mouseX > this.x) {
          this.x = this.x + 1;
        }
        if (mouseY < this.y) {
          this.y = this.y - 1;
        } else if (mouseY > this.y) {
          this.y = this.y + 1;
        }
      } else {
        this.x = (this.x + this.speedx + width) % width;
        if (this.x <= 0 || this.x >= width - 1) {
          this.speedy = (random(0, 20) - 10); // (random(-10.0, 10.1));
          if (this.speedy == 0) {
            this.speedy = 1;
          }
        }
        this.y = (this.y + this.speedy);
        if (this.y > height) {
          this.y = height;
          this.speedy = -this.speedy;
          this.speedx = (random(0, 20) - 10); // (random(-10.0, 10.1));
          if (this.speedx == 0) {
            this.speedx = 1;
          }
        } else if (this.y < 0) {
          this.y = 0;
          this.speedy = -this.speedy;
          this.speedx = (random(0, 20) - 10); // (random(-10.0, 10.1));
          if (this.speedx == 0) {
            this.speedx = 1;
          }
        }
      }
      this.w += this.speedw;
      this.h += this.speedh;
      if (this.h <= 0) {
        this.h = 1;
        this.speedh = abs(this.speedh);
      } else if (this.h > height) {
        this.h = height;
        this.speedh = -abs(this.speedh);
      }
      if (this.w <= 0) {
        this.w = 1;
        this.speedw = abs(this.speedw);
      } else if (this.w > width) {
        this.w = width;
        this.speedw = -abs(this.speedw);
      }
      this.s += this.speedscale;
      if (this.s <= -2.0 || this.s >= 2.0) {
        this.s = 0.5;
        this.speedscale = ceil(random(-.01, .01));
        if (this.speedscale == 0.0) {
          this.speedscale = 1.0;
        } else if (this.speedscale >= -.05 && this.speedscale <= .05) {
          this.speedscale = .01;
        }
      }
      this.rotation += this.delta;
      if (this.rotation >= 360.0 || this.rotation < 0.0) {
        this.delta = random(-90.0, 90.0);
        while (this.rotation < 0.0) {
          this.rotation += 360.0;
        }
        while (this.rotation >= 360.0) {
          this.rotation -= 360.0;
        }
      }
      this.rr = abs(this.rr + 16) % 256;
      this.gg = abs(this.gg + 8) % 256;
      this.bb = abs(this.bb + 4) % 256;
      this.aa = abs(this.aa + 7) % 256;
    }
    // STUDENT: You must implement a second display function called
    // displayDemo that centers your demo object on the screen, and
    // sets variable fields to their default, predictable values if
    // possible, so we can demo your geometric forms and their relative
    // positions without animation or clutter. Call the regular display()
    // function within displayDemo after setting the variable fields to
    // default values.
  this.displayDemo = function() {
    if (isdemo) {
      this.aa = 255;
      this.speedx = 0;
      this.speedy = 0;
      this.speedh = 0;
      this.speedw = 0;
      this.delta = 0;
    }
    this.display();
  }
}

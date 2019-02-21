function setup() {
  createCanvas(640, 480);
}

function draw() {
  if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 80, 80);
}

function Rocket(x,y,accx,accy,R,G,B,height, width) {
  this.width = width || 5;
  this.height = height || 10;
  this.traj = [];
  this.count = 0;
  this.R = R || 0;
  this.G = G || 0;
  this.B = B || 0;
  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(accx, accy);
  this.mass = 10;
  this.Gravity = 1;

  this.draw = function() {
    /* Draw Rocket */
    push();
    noStroke();
    fill(this.R,this.G,this.B,250);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    rect(0, 0, this.width, this.height); 
    pop();
  }

  this.applyForce = function(force) {
    this.acc.add(force);
  }

  this.newton = function () {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.orbit = function(body) {
    //add orbit code here
  }

}

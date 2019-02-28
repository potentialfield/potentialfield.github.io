const balls = [];


function setup() {
  createCanvas(640, 480);
}


function draw() {
  background(200);
  for (const ball of balls) {
    ball.draw();
  }
}


class Ball {

  constructor(r, v, a, m) {
    this.r = r;
    this.v = v;
    this.a = a;
    this.m = m;
  }

  draw() {
    fill(color(255, 255, 255));
    circle(this.r.x, this.r.y, this.m);
  }
}


function mousePressed() {
  append(balls, new Ball(createVector(mouseX, mouseY), 0, 0, 10));
}

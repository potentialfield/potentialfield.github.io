const balls = [];
let prev_mouse_pos = null;


function setup() {
  createCanvas(640, 480);
}


function draw() {
  background(200);
  for (const ball of balls) {
    ball.draw();
  }
  moveBalls();
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
  prev_mouse_pos = createVector(mouseX, mouseY);
}


function mouseReleased() {
  if (prev_mouse_pos !== null) {
    const curr_mouse_pos = createVector(mouseX, mouseY);
    append(balls, new Ball(
        curr_mouse_pos,
        p5.Vector.sub(curr_mouse_pos, prev_mouse_pos).div(20),
        0,
        10,
    ));
    prev_mouse_pos = null;
  }
}


function moveBalls() {
  for (const ball of balls) {
    ball.r.add(ball.v);
  }
}

const balls = [];
const potentials = [];
const potential_keys = {"1": 1, "2": 2, "3": 3, "4": 4};
let prev_key = null;
let prev_mouse_pos = null;


function setup() {
  createCanvas(640, 480);
}


function draw() {
  background(200);
  for (const ball of balls) {
    ball.draw();
  }
  for (const pot of potentials) {
    pot.draw();
  }
  calculatePotential();
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


class Potential {

  constructor(r, k, m) {
    this.r = r;
    this.k = k;
    this.m = m;
  }

  draw() {
    switch (this.k) {
      case 1: fill(color(255, 0, 0)); break;
      case 2: fill(color(0, 255, 0)); break;
      case 3: fill(color(0, 0, 255)); break;
      case 4: fill(color(0, 0, 0)); break;
    }
    circle(this.r.x, this.r.y, this.m);
  }

  update(ball) {
    const dr = p5.Vector.sub(ball.r, this.r);
    const r = dr.mag();
    switch (this.k) {
    case 1:
      dr.mult(this.m / Math.pow(r, 1));
      break;
    case 2:
      dr.mult(this.m * 20 / Math.pow(r, 2));
      break;
    case 3:
      dr.mult(this.m * 400 / Math.pow(r, 3));
      break;
    case 4:
      dr.mult(this.m * 8000 / Math.pow(r, 4));
      break;
    }
    ball.v.sub(dr);
  }
}



function keyPressed() {
  prev_key = key;
}


function keyReleased() {
  prev_key = null;
}


function mousePressed() {
  const curr_mouse_pos = createVector(mouseX, mouseY);
  if (prev_key in potential_keys) {
    append(potentials, new Potential(
        curr_mouse_pos,
        potential_keys[prev_key],
        10,
    ));
  } else {
    prev_mouse_pos = curr_mouse_pos;
  }
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


function calculatePotential() {
  for (const ball of balls) {
    for (const pot of potentials) {
      pot.update(ball);
    }
  }
}


function moveBalls() {
  for (const ball of balls) {
    ball.r.add(ball.v);
  }
}

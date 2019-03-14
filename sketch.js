const ROCKET_HEIGHT = 20;
const ROCKET_WIDTH = 10;
const POTENTIAL_SIZE = 20;
const TRAJECTORY_SIZE = 4;
const TRAJECTORY_LENGTH = 255;
const TRAJECTORY_REFRESH = 10 * TRAJECTORY_LENGTH;

const rockets = [];
const potentials = [];
const potential_keys = {"1": 1, "2": 2, "3": 3, "4": 4};
let prev_key = null;
let prev_mouse_pos = null;


function setup() {
  createCanvas(2000, 2000);
}


function draw() {
  background(200);
  for (const rocket of rockets) {
    rocket.draw();
  }
  for (const pot of potentials) {
    pot.draw();
  }
  calculatePotential();
  moveRockets();
}



class Rocket {

  constructor(r, v, a) {
    this.r = r;
    this.v = v;
    this.a = a;
    this.traj = [];
    this.color = [floor(random(255)), floor(random(255)), floor(random(255))];
  }

  draw() {
    push();
    stroke(color(0, 0, 0));
    fill(...this.color);
    translate(this.r);
    rotate(this.v.heading());
    rect(0, 0, ROCKET_HEIGHT, ROCKET_WIDTH);
    pop();

    this.traj.push([this.r.x, this.r.y]);
    if (this.traj.length > TRAJECTORY_REFRESH) {
      this.traj.splice(this.traj.length - TRAJECTORY_LENGTH);
    }
    for (let i = 0; i < this.traj.length && i < TRAJECTORY_LENGTH; i++) {
      noStroke();
      fill(...this.color, 255 - i);
      circle(
          this.traj[this.traj.length - 1 - i][0],
          this.traj[this.traj.length - 1 - i][1],
          TRAJECTORY_SIZE,
      );
    }
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

  update(rocket) {
    const dr = p5.Vector.sub(rocket.r, this.r);
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
    rocket.v.sub(dr);
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
        POTENTIAL_SIZE,
    ));
  } else {
    prev_mouse_pos = curr_mouse_pos;
  }
}


function mouseReleased() {
  if (prev_mouse_pos !== null) {
    const curr_mouse_pos = createVector(mouseX, mouseY);
    append(rockets, new Rocket(
        curr_mouse_pos,
        p5.Vector.sub(curr_mouse_pos, prev_mouse_pos).div(20),
        0,
    ));
    prev_mouse_pos = null;
  }
}


function calculatePotential() {
  for (const rocket of rockets) {
    for (const pot of potentials) {
      pot.update(rocket);
    }
  }
}


function moveRockets() {
  for (const rocket of rockets) {
    rocket.r.add(rocket.v);
  }
}

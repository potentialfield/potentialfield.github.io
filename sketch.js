let ball_x = 384400; // km
let ball_y = 0;
let ball_s = 5;

let ball_vx = 0; // km / s
let ball_vy = 1;

let planet_x = 0;
let planet_y = 0;
let planet_s = 40;
let planet_m = 6.67408 * Math.pow(10,-11) * 5.972 * Math.pow(10, 24) * 7.347 * Math.pow(10,22); // N m^2

let time_step = 1000; // s

function setup() {
  createCanvas(2000, 2000);
}

function draw() {
  background(200);
  ellipse(ball_x/2000 + 300, ball_y/2000 + 300, ball_s, ball_s);
  ellipse(planet_x + 300, planet_y + 300, planet_s, planet_s);

  dist_x = ball_x - planet_x;
  dist_y = ball_y - planet_y;
  dist_sqr = dist_x * dist_x + dist_y * dist_y; // km^2
  dist_sqr1000 = dist_sqr * Math.pow(1000, 2); // m^2

  accel = planet_m / dist_sqr1000;  // N
  accel /= 7.347 * Math.pow(10,22); // m/s^2
  // print(accel); // .002697394385184527

  accel_y = - accel * dist_y / Math.pow(dist_sqr,0.5);
  accel_x = - accel * dist_x / Math.pow(dist_sqr,0.5);

  // print(Math.pow(dist_sqr, 0.5), theta);

  // print('Acceleration is' + accel_x + ', ' + accel_y);

  ball_vx += accel_x / 1000 * time_step; // km / s
  ball_vy += accel_y / 1000 * time_step; // km / s
  // print('Velocity is' + ball_vx + ', ' + ball_vy);

  ball_x += ball_vx * time_step;
  ball_y += ball_vy * time_step;
  // print('Position is' + ball_x + ', ' + ball_y);
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

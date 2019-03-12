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

let modulo = 0;
let count = 0;
let traj = [];
let R, G, B;

function setup() {
  createCanvas(2000, 2000);
  R = floor(random(255))
  G = floor(random(255))
  B = floor(random(255))
}

function draw() {
  background(200);

  fill(255,255,255);
  stroke(0,0,0);
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

  push();
  fill(R,G,B,250);
  translate(ball_x/2000+300, ball_y/2000+300);
  rotate(createVector(ball_vx, ball_vy).heading());
  rect(0, 0, 20, 10);
  pop();

  /* Draw trajectory */
  modulo++;
  if (modulo % 12 == 0) {
    traj.push(createVector(ball_x/2000+300,ball_y/2000+300));
  }
  for (var i = 0; i < traj.length && i < 64; i++) {
    fill(R,G,B,255-i*4);
    noStroke();
    ellipse(traj[traj.length - 1 - i].x, traj[traj.length - 1 - i].y, 4, 4);
  }
}

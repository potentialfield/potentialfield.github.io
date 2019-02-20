let ball_x = 384/2 + 300;
let ball_y = 250;
let ball_s = 5;

let ball_vx = 3.68/2;
let ball_vy = 0;

let planet_x = 300;
let planet_y = 250;
let planet_s = 40;
let planet_m = 6.67408 * Math.pow(10,-11) * 5.972 * Math.pow(10, 24) * 7.347 * Math.pow(10,22) / Math.pow(10, -3 * 3) / 8;

let time_step = 0.1;

function setup() {
  createCanvas(2000, 2000);
}


function draw() {
  background(200);
  ellipse(ball_x, ball_y, ball_s, ball_s);
  ellipse(planet_x, planet_y, planet_s, planet_s);

  dist_x = ball_x - planet_x;
  dist_y = ball_y - planet_y;
  dist_sqr = dist_x * dist_x + dist_y * dist_y;
  
  print(dist_sqr);

  if (dist_sqr < 100) {
    accel_x = 0;
    accel_y = 0;
  } else {
    accel_x = planet_m / dist_sqr;
    accel_y = planet_m / dist_sqr;
  } 

  if (dist_y > 0) {
    accel_y = -1 * accel_y;
  }
  if (dist_x > 0) {
    accel_x = -1 * accel_x;
  }
  
  // print('Acceleration is' + accel_x + ', ' + accel_y);

  ball_vx += accel_x * time_step;
  ball_vy += accel_y * time_step;
  // print('Velocity is' + ball_vx + ', ' + ball_vy);

  ball_x += ball_vx * time_step;
  ball_y += ball_vy * time_step;
  // print('Position is' + ball_x + ', ' + ball_y);
}



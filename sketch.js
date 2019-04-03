const SCREEN_WIDTH = 900;
const SCREEN_HEIGHT = 600;
const TOOLBAR_HEIGHT = 60;
const COLOUR_WHITE = 255;
const NUM_STARS = 250;
const STAR_SIZE = 1;

const BUTTON_SIZE = 10;
const BUTTON_TEXT_SIZE = 12;
const BUTTON_VERTICAL_POS = 570;
const BUTTON_HORIZONTAL_POS = 80;
const BUTTON_HORIZONTAL_SPACING = 90;
const BUTTON_VERTICAL_TEXT_OFFSET = 5;
const BUTTON_HORIZONTAL_TEXT_OFFSET = -60;

const POTENTIAL_MIN_RADIUS = 10;
const POTENTIAL_BIG_RADIUS = 125;
const POTENTIAL_MAX_RADIUS = 200;
const POTENTIAL_TEXT_OFFSET = -2;
const POTENTIAL_WARNING_MESSAGE_OFFSET = 15;

const ROCKET_HEIGHT = 20;
const ROCKET_WIDTH = 10;
const TRAJECTORY_SIZE = 1;
const TRAJECTORY_LENGTH = 255;  // Must be less than 256
const TRAJECTORY_REFRESH = 10 * TRAJECTORY_LENGTH;

const OUT_OF_BOUNDS = 10000;
const SCALE_DISPLACEMENT_VELOCITY = 1 / 20;
const SCALE_POTENTIAL_POWER = 30;
const SCALE_RADIUS_MASS = 1e-5;

let buttons = {};
const stars = new Set();
const rockets = new Set();
const potentials = new Set();


let VELOCITY = [3.5, 4, 4.2, 4.4];
let CENTER_X = [];
let CENTER_Y = [];
let HEIGHT = [];
let WIDTH = [];

const state = {
  prev_mouse_pos: null,
  pressed_button_key: null,
};

function setup() {
  // Ensure that the G and B values are above 75
  buttons = {
    1: {
      name: "r^-1",
      r: createVector(BUTTON_HORIZONTAL_POS, BUTTON_VERTICAL_POS),
      m: BUTTON_SIZE,
      color: color(101, 198, 196),
    },
    2: {
      name: "r^-2",
      r: createVector(
          BUTTON_HORIZONTAL_POS + BUTTON_HORIZONTAL_SPACING,
          BUTTON_VERTICAL_POS,
      ),
      m: BUTTON_SIZE,
      color: color(156, 41, 127),
    },
    3: {
      name: "r^-3",
      r: createVector(
          BUTTON_HORIZONTAL_POS + 2 * BUTTON_HORIZONTAL_SPACING,
          BUTTON_VERTICAL_POS,
      ),
      m: BUTTON_SIZE,
      color: color(206, 221, 239),
    },
  };
  createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  generateStars(NUM_STARS);
  textFont("Roboto");

  potentials.add(new Potential(
            createVector(150,300),
            "2",
            50,
  )); 

  for (const v of VELOCITY) {
    rockets.add(new Rocket(
          createVector(50, 300),
          createVector(0, -v),
    ));
  } 

  const u = 1125;
  const r = 100;
  for (const v of VELOCITY) {
    const h = v;
    const e = v*v/2 - u / r;
    const C = r*r * h*h / u;
    const E = Math.sqrt(1 + (2 * e * h*h*r*r) / (u*u));
    const rmax = C / (1-E);
    const rmin = C / (1+E);
    const rside = (rmax + rmin)*Math.sqrt(1-E*E);
    CENTER_X.push(150+rmax/2-rmin/2);
    CENTER_Y.push(300);
    HEIGHT.push(rside);
    WIDTH.push(rmin + rmax);
  }
}



class Rocket {

  constructor(r, v) {
    this.r = r;
    this.v = v;
    this.a = createVector(0, 0);
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
      this.traj = this.traj.splice(this.traj.length - TRAJECTORY_LENGTH);
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

  update() {
    this.v.add(this.a);
    this.r.add(this.v);
    this.a = createVector(0, 0);

    if (abs(this.r.x) > OUT_OF_BOUNDS || abs(this.r.y) > OUT_OF_BOUNDS) {
      rockets.delete(this);
    }
  }
}


class Potential {

  constructor(r, k, radius) {
    this.r = r;
    this.k = k;
    this.radius = radius;
    this.m = SCALE_RADIUS_MASS * Math.pow(this.radius, 3);
  }

  draw() {
    drawPlanetGradient(this.r.x, this.r.y, this.radius, buttons[this.k].color);
    fill(COLOUR_WHITE);
    noStroke();
    text(buttons[this.k].name, this.r.x + POTENTIAL_TEXT_OFFSET, this.r.y);
  }

  update(rocket) {
    const dr = p5.Vector.sub(rocket.r, this.r);
    const r = dr.mag();
    const da = dr.mult(this.m).div(-r);

    // da is a unit vector in the correct direction
    switch (this.k) {
    case "1":
      dr.mult(SCALE_POTENTIAL_POWER / r);
      break;
    case "2":
      dr.mult(Math.pow(SCALE_POTENTIAL_POWER / r, 2));;
      break;
    case "3":
      dr.mult(Math.pow(SCALE_POTENTIAL_POWER / r, 3));;
      break;
    case "4":
      dr.mult(Math.pow(SCALE_POTENTIAL_POWER / r, 4));;
      break;
    }
    rocket.a.add(da);
  }
}


/*
 * If the mouse is pressed over a button, then update
 *   the state with the currently pressed button.
 * Otherwise, start positioning a rocket or expanding a potential.
 */

function mousePressed() {
  const curr_mouse_pos = createVector(mouseX, mouseY);

  for (const [key, button] of Object.entries(buttons)) {
    if (button.r.dist(curr_mouse_pos) < button.m) {
      state.prev_mouse_pos = null;
      state.pressed_button_key = key;
      return;
    }
  }

  // Change cursor when positioning a rocket
  cursor(CROSS);
  state.prev_mouse_pos = curr_mouse_pos;
}


/*
 * If the mouse is released while positioning a rocket
 *   or expanding a potential, then create that object.
 * Display a warning message if the potential is too big or small.
 */

function mouseReleased() {
  const curr_mouse_pos = createVector(mouseX, mouseY);

  if (state.prev_mouse_pos !== null) {
    // Change cursor after the rocket or potential is created
    cursor(ARROW);

    if (state.pressed_button_key !== null) {
      const radius = curr_mouse_pos.dist(state.prev_mouse_pos);
      if (radius > POTENTIAL_MIN_RADIUS && radius < POTENTIAL_MAX_RADIUS) {
        potentials.add(new Potential(
            curr_mouse_pos,
            state.pressed_button_key,
            radius,
        ));
      }
      state.pressed_button_key = null;
    } else {
      rockets.add(new Rocket(
          curr_mouse_pos,
          p5.Vector.sub(curr_mouse_pos, state.prev_mouse_pos)
              .mult(SCALE_DISPLACEMENT_VELOCITY),
      ));
    }
  } else if (state.pressed_button_key != null) {
    // Change cursor after clicking on a button, to show that it is active
    cursor(CROSS);
  }

  state.prev_mouse_pos = null;
}


function draw() {

  // Render stars and background
  background(color(5, 22, 40));
  drawStars();

  for (const pot of potentials) {
    pot.draw();
  }
  for (const rocket of rockets) {
    rocket.draw();
  }

  noFill();
  stroke(COLOUR_WHITE);

  const u = 1125;
  const r = 100;
  for (let i = 0; i < VELOCITY.length; i++) {
    ellipse(CENTER_X[i], CENTER_Y[i], WIDTH[i], HEIGHT[i]);
  }
  noStroke();
  fill(5, 22, 40);

  // Click and drag to create planet
  // and display message if drawn
  // radius is out of range
  const curr_mouse_pos = createVector(mouseX, mouseY);
  if (state.prev_mouse_pos != null) {
    stroke(COLOUR_WHITE);
    line(curr_mouse_pos.x, curr_mouse_pos.y,
        state.prev_mouse_pos.x, state.prev_mouse_pos.y);
    noStroke();

    // Display message if drawing planet and it's out of set radius range
    if (state.pressed_button_key != null) {
      const currRadius = curr_mouse_pos.dist(state.prev_mouse_pos);
      fill(COLOUR_WHITE);
      if (currRadius < POTENTIAL_MIN_RADIUS) {
        text(
            "Radius too small",
            curr_mouse_pos.x + POTENTIAL_WARNING_MESSAGE_OFFSET,
            curr_mouse_pos.y + POTENTIAL_WARNING_MESSAGE_OFFSET,
        );
      } else if (currRadius > POTENTIAL_MAX_RADIUS) {
        text(
            "Radius too large",
            curr_mouse_pos.x + POTENTIAL_WARNING_MESSAGE_OFFSET,
            curr_mouse_pos.y + POTENTIAL_WARNING_MESSAGE_OFFSET,
        );
      }
    }
  }

  // Draw toolbar buttons over everything else
  for (const button of Object.values(buttons)) {
    drawButton(button);
  }

  calculatePotential();
  moveRockets();
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
    rocket.update();
  }
}


function drawButton(button) {
  textSize(BUTTON_TEXT_SIZE);
  fill(COLOUR_WHITE);
  text(
      `Add ${button.name}`,
      button.r.x + BUTTON_HORIZONTAL_TEXT_OFFSET,
      button.r.y + BUTTON_VERTICAL_TEXT_OFFSET,
  );
  fill(button.color);

  stroke(COLOUR_WHITE);
  circle(button.r.x, button.r.y, button.m);
  noStroke();
}

/*
* Drawing planets and stars and sky
*/

function drawPlanetGradient(x, y, radius, colour) {
  // TODO: fix this hack, come up with HSL way to draw gradient
  const color_string = colour.toString();
  const col = color_string.slice(5, -1).split(',');

  fill(color(
        Math.max(col[0] - radius, 10),
        Math.max(col[1] - radius, 43),
        Math.max(col[2] - radius, 90),
  ));

  for (let r = Math.floor(radius); r > 0; r--) {
    if (radius > POTENTIAL_BIG_RADIUS) {
      if (r % 4 == 0 || r == Math.floor(radius)) {
        fill(color(
            Math.max(col[0] - r, 15),
            Math.max(col[1] - r, 20),
            Math.max(col[2] - r, 40),
        ));
      }
    } else {
      if (r % 3 == 0 || r == Math.floor(radius)) {
        fill(color(
            Math.max(col[0] - r, 10),
            Math.max(col[1] - r, 43),
            Math.max(col[2] - r, 70),
        ));
      }
    }

    circle(x, y, r);
  }
}

// For generating stars in the background
function generateStars(numStars) {
  for (let i = 0; i < numStars; i++) {
    // Alternate between white and light yellow
    stars.add({
      r: createVector(
          random(SCREEN_WIDTH),
          random(SCREEN_HEIGHT - TOOLBAR_HEIGHT),
      ),
      colour: (i % 2) ? COLOUR_WHITE : color(255, 246, 221),
    });
  }
}

function drawStars() {
  for (const star of stars) {
    fill(star.colour);
    circle(star.r.x, star.r.y, STAR_SIZE);
  }
}

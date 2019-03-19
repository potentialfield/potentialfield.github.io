const MIN_RADIUS = 10;
const MAX_RADIUS = 200;
const ROCKET_HEIGHT = 20;
const ROCKET_WIDTH = 10;
const POTENTIAL_SIZE = 20;
const TRAJECTORY_SIZE = 1;
const TRAJECTORY_LENGTH = 255;
const TRAJECTORY_REFRESH = 10 * TRAJECTORY_LENGTH;

let buttons;
const stars = [];
const rockets = [];
const potentials = [];

let prev_mouse_pos = null;
let pressed_button = null;
let pressed = false;
let center_x = 0;
let center_y = 0;

function setup() {
  // Ensure that the G and B values are above 75
  buttons = {
    "1": {
      name: "r^-1",
      r: createVector(80, 570),
      m: 10,
      color: color(101, 198, 196),
    },
    "2": {
      name: "r^-2",
      r: createVector(170, 570),
      m: 10,
      color: color(156, 41, 127),
    },
    "3": {
      name: "r^-3",
      r: createVector(260, 570),
      m: 10,
      color: color(206, 221, 239),
    },
  };
  createCanvas(900, 600);
  generateStars(250);
  textFont("Roboto");
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
    drawPlanetGradient(this.r.x, this.r.y, this.m, buttons[this.k].color);
    fill(255);
    noStroke();
    text(buttons[this.k].name, this.r.x - 2, this.r.y);
  }

  update(rocket) {
    const dr = p5.Vector.sub(rocket.r, this.r);
    const r = dr.mag();
    switch (this.k) {
    case "1":
      dr.mult(this.m / Math.pow(r, 1) / 60);
      break;
    case "2":
      dr.mult(this.m / Math.pow(r, 2) / 5);
      break;
    case "3":
      dr.mult(5 * this.m / Math.pow(r, 3));
      break;
    case "4":
      dr.mult(60 * this.m / Math.pow(r, 4));
      break;
    }
    rocket.v.sub(dr);
  }
}



/*
* Check if one of the "add potential"
* buttons was clicked
*/
function mouseClicked() {
  for (const [key, button] of Object.entries(buttons)) {
    const curr_mouse_pos = createVector(mouseX, mouseY);
    const radius = button.r.dist(curr_mouse_pos);
    if (radius < button.m) {
      pressed_button = key;
      cursor(CROSS);
      break;
    }
  }
}

/*
* If the mouse is pressed and
* an "add potential" button was
* pressed, then start creating a planet
*/

function mousePressed() {
  prev_mouse_pos = createVector(mouseX, mouseY);
  if (pressed_button !== null) {
    pressed = true;
    center_x = mouseX;
    center_y = mouseY;
  }
}

/*
* Upon mouse release, if the user
* was making a planet, then add that
* planet to the circles array. Will only do this
* for radii within set bounds.
*/
function mouseReleased() {
  const curr_mouse_pos = createVector(mouseX, mouseY);
  if (pressed) {
    const radius = dist(mouseX, mouseY, center_x, center_y);
    if (radius > MIN_RADIUS && radius < MAX_RADIUS) {
      append(potentials, new Potential(
          curr_mouse_pos,
          pressed_button,
          radius,
      ));
    }
    pressed = false;
    pressed_button = null;
    cursor(ARROW);
  } else if (prev_mouse_pos !== null) {
    append(rockets, new Rocket(
        curr_mouse_pos,
        p5.Vector.sub(curr_mouse_pos, prev_mouse_pos).div(20),
        0,
    ));
  }
  prev_mouse_pos = null;
}

function draw() {

  // Render stars and background
  background(color(5, 22, 40));
  drawStars();

  // Click and drag to create planet
  // and display message if drawn
  // radius is out of range
  if (pressed) {
    let createPlanetStr = "";
    stroke(255);
    const currRadius = dist(mouseX, mouseY, center_x, center_y);
    line(center_x, center_y, mouseX, mouseY);
    noStroke();
    if (currRadius < MIN_RADIUS) {
      createPlanetStr = "Radius too small";
    } else if (currRadius > MAX_RADIUS) {
      createPlanetStr = "Radius too large";
    }
    // Display message if drawing planet
    // and it's out of set radius range
    fill(255);
    text(createPlanetStr, mouseX+15, mouseY+15);
  }

  for (const rocket of rockets) {
    rocket.draw();
  }
  for (const pot of potentials) {
    pot.draw();
  }

  // draw toolbar buttons over everything else
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
    rocket.r.add(rocket.v);
  }
}


function drawButton(button) {
  textSize(12);
  fill(255);
  text(`Add ${button.name}`, button.r.x - 60, button.r.y + 5);
  fill(button.color);

  stroke(255);
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

  const isBigPlanet = radius > 125;

  fill(color(
        Math.max(col[0]-radius, 10),
        Math.max(col[1]-radius, 43),
        Math.max(col[2]-radius, 90),
  ));

  for (let r = Math.floor(radius); r > 0; r--) {
    if (isBigPlanet) {
      if (r % 4 == 0) {
        fill(color(
            Math.max(col[0]-r, 15),
            Math.max(col[1]-r, 20),
            Math.max(col[2]-r, 40),
        ));
      }
    } else {
      if (r % 3 == 0) {
        fill(color(
            Math.max(col[0]-r, 10),
            Math.max(col[1]-r, 43),
            Math.max(col[2]-r, 70),
        ));
      }
    }

    circle(x, y, r);

  }
}

// For generating stars in the background
function generateStars(numStars) {
  for (let i = 0; i < numStars; i++) {
    const x = random(900);
    const y = random(540);
    stars.push([x,y]);
  }
}

function drawStars() {
  for (let i = 0; i < stars.length; i++) {
    // alternate between white and light yellow
    if (i % 2 == 0) {
      fill(255);
    } else {
      fill(color(255, 246, 221));
    }
    const x = stars[i][0];
    const y = stars[i][1];
    circle(x,y,1);
  }
}

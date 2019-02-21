
/*
* each item in buttons: [label, x, y, radius, rgb color1]
* ENSURE G AND B VALUES ARE ABOVE 75
*/

let buttons = [
['r^-1', 80, 570, 10, [101,198,196]],
['r^-2', 170, 570, 10, [156,41,127]],
['r^-3', 260, 570, 10, [206,221,239]]
];
let pressed_button = -1;

let pressed = false;
let center_x = 0;
let center_y = 0;

let circles = [];
let stars = [];

const MIN_RADIUS = 10;
const MAX_RADIUS = 200;

function setup() {
  createCanvas(900, 600);  
  generateStars(250);
  textFont("Roboto");

}

/*
* Check if one of the "add potential"
* buttons was clicked
*/
function mouseClicked() {
  for (let i = 0; i < buttons.length; i++) {
    button = buttons[i];
    r = dist(mouseX, mouseY, button[1], button[2]);
    if (r < button[3]) {
      pressed_button = i;
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
  if (pressed_button >= 0) {
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
  if (pressed) {
    let radius = dist(mouseX, mouseY, center_x, center_y);
    if (radius > MIN_RADIUS && radius < MAX_RADIUS) { 
    	circles.push([center_x, center_y, radius, pressed_button]);
	}
    pressed = false;
    pressed_button = -1;
    cursor(ARROW);
  }
}

function draw() {

  // Render stars and background
  background(color(5, 22, 40));
  drawStars();

  // Render circles
  for (crc of circles) {
  	
  	drawPlanet(crc);

    fill(255);
    noStroke();
    text(button[0], crc[0]-2, crc[1]);
  }
  
  // Click and drag to create planet
  // and display message if drawn
  // radius is out of range
  if (pressed) {
  	createPlanetStr = "";
	stroke(255);
	currRadius = dist(mouseX, mouseY, center_x, center_y);
	line(center_x, center_y, mouseX, mouseY);
	noStroke();
	if (currRadius < MIN_RADIUS) {
		createPlanetStr += "Radius too small";
	} else if (currRadius > MAX_RADIUS) {
		createPlanetStr += "Radius too large";
	}
	// Display message if drawing planet
  	// and it's out of set radius range
  	fill(255);
  	text(createPlanetStr, 300, 575);
  }

  // Draw toolbar buttons
  for (button of buttons) {
    drawButton(button);
  }



}

function drawButton(button) {
  textSize(12);
  fill(255);
  text('Add ' + button[0], button[1]-60, button[2]+5);
  fill(color(button[4][0],button[4][1],button[4][2]));
  
  stroke(255);
  circle(button[1], button[2], button[3]);
  noStroke();
}

/*
* Drawing planets and stars and sky
*/

function drawPlanet(crc) {
	button = buttons[crc[3]];
	startColor  = [button[4][0],button[4][1],button[4][2]];
  	drawPlanetGradient(crc[0], crc[1], crc[2], startColor);
}

function drawPlanetGradient(x, y, radius, col) {
	
	let isBigPlanet = radius > 125;

	fill(
		color(
			Math.max(col[0]-radius, 10),
			Math.max(col[1]-radius, 43),
			Math.max(col[2]-radius, 90),
		)
	);

	for (let r = Math.floor(radius); r > 0; r--) {
		if (isBigPlanet) {
			if (r % 4 == 0) {
				fill(
					color(
						Math.max(col[0]-r, 15),
						Math.max(col[1]-r, 20),
						Math.max(col[2]-r, 40),
					)
				);
			}
		} else {
			if (r % 3 == 0) {
				fill(
					color(
						Math.max(col[0]-r, 10),
						Math.max(col[1]-r, 43),
						Math.max(col[2]-r, 70),
					)
				);
			}
		}
		
		circle(x, y, r);
	
	}
}

// For generating stars in the background
function generateStars(numStars) {
	for (let i = 0; i < numStars; i++) {
		let x = random(900);
		let y = random(540);	
		stars.push([x,y]);
	}
}

function drawStars() {
	for (let i = 0; i < stars.length; i++) {
		// alternate between white and light yellow
		i % 2 == 0 ? fill(255) : fill(color(255,246,221));
		let x = stars[i][0];
		let y = stars[i][1];
		circle(x,y,1);
	}
}

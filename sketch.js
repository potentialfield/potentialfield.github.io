
/*
* each item in buttons: [label, x, y, radius, rgb color1]
* ENSURE G AND B VALUES ARE ABOVE 75
*/

let buttons = [
['r^-1', 80, 570, 10, [101,198,196]],
['r^-2', 170, 570, 10, [64,138,180]],
['r^-3', 260, 570, 10, [48,146,134]]
];
let pressed_button = -1;

let pressed = false;
let center_x = 0;
let center_y = 0;

let circles = [];
let stars = [];

function setup() {
  createCanvas(900, 600);  
  generateStars(250);
  textFont("Roboto");

}

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

function mousePressed() {
  if (pressed_button >= 0) {
    pressed = true;
    center_x = mouseX;
    center_y = mouseY;
  }
}

function mouseReleased() {
  if (pressed) {
    let radius = dist(mouseX, mouseY, center_x, center_y); 
    circles.push([center_x, center_y, radius, pressed_button]);
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
  if (pressed) {
	stroke(255);
	line(center_x, center_y, mouseX, mouseY);
	noStroke();
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
	let isBigPlanet = radius > 100;
	let red = Math.max(col[0]-radius, 17);
	let green = Math.max(col[1]-radius, 63);
	let blue = Math.max(col[2]-radius, 90);
	let counter = 0; // determine which colour to increment

	// Initialize fill colour
	fill(color(red, green, blue));

	for (let r = Math.floor(radius); r > 0; r--) {
	
		if (r % 3 == 0) {
			if (isBigPlanet) {
				if (counter % 3 == 0) {
					red += 1;
				} else if (counter % 3 == 1) {
					green += 1;
				} else {
					blue += 1;
				}
				fill(red, green, blue);
			} else {
				fill(
					color(
						Math.min(col[0]-r, col[0]),
						Math.min(col[1]-r, col[1]),
						Math.min(col[2]-r, col[2]),
					)
				);
			}
		}

		counter++;
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

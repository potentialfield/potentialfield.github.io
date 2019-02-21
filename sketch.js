var buttons = [['r^-1', 90, 455, 10]];
var pressed_button = -1;

var pressed = false;
var center_x = 0;
var center_y = 0;

var circles = [];

function setup() {
  createCanvas(640, 480);
}

function mouseClicked() {
  for (var i = 0; i < buttons.length; i++) {
    button = buttons[i];
    r = dist(mouseX, mouseY, button[1], button[2]);
    if (r < button[3]) {
      pressed_button = i;
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
    radius = dist(mouseX, mouseY, center_x, center_y); 
    circles.push([center_x, center_y, radius, pressed_button]);
    pressed = false;
    pressed_button = -1;
  }
}

function draw() {
  background(200);

  for (crc of circles) {
    circle(crc[0], crc[1], crc[2]);
    text("" + crc[3] , crc[0]-1, crc[1]);
  }
  
  if (pressed) {
    line(center_x, center_y, mouseX, mouseY);
  }

  for (button of buttons) {
    draw_button(button);
  }
}

function draw_button(button) {
  textSize(12);
  text('Add Planet ' + button[0], button[1]-100, button[2]);
  circle(button[1], button[2], button[3]);
}

let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;

let x = 0;
let y = 0;
let forwards = true;

function drawCircle(x, y) {
  ctx.fillStyle = "rgb(0, 128, 255)";
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2, false);
  ctx.fill();
}

function update() {
  if (forwards === true) {
    x += 5;
    y += 5;
  } 
  if (forwards === false) {
    x -= 5;
    y -= 5;
  }
  if (x >= 300) {
    forwards = false;
  }
  if (x < 0) {
    forwards = true;
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  drawCircle(x, y);
}

setInterval(() => {
  update();
  draw();
}, 50);

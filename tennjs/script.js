let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;

const MAX_COMPUTER_SPEED = 2;

const BALL_SIZE = 5;
let ballPosition;

let xSpeed;
let ySpeed;

function initBall() {
  ballPosition = {x: 20, y: 30};
  xSpeed = 4;
  ySpeed = 2;
}

const PADDLE_WIDTH = 5;
const PADDLE_HEIGHT = 20;
const PADDLE_OFFSET = 10;

let leftPaddleTop = 10;
let rightPaddleTop = 30;

let paddlesBallColors = "white";

let leftScore = 0;
let rightScore = 0;
let gameOver = false;

let time_out = 25;

document.addEventListener("mousemove", e => {
  rightPaddleTop = e.y - canvas.offsetTop;
});

function draw() {
  // fill the canvas with black
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);  

  // everything else will be white
  ctx.fillStyle = paddlesBallColors;

  // draw the ball
  ctx.fillRect(ballPosition.x, ballPosition.y, BALL_SIZE, BALL_SIZE);

  // draw the paddles
  ctx.fillRect(
    PADDLE_OFFSET,
    leftPaddleTop,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );
  ctx.fillRect(
    width - PADDLE_WIDTH - PADDLE_OFFSET,
    rightPaddleTop,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );

  // draw scores
  ctx.font = "30px monospace";
  ctx.textAlign = "left";
  ctx.fillText(leftScore.toString(), 50, 50);
  ctx.textAlign = "right";
  ctx.fillText(rightScore.toString(), width - 50, 50);
}

function followBall() {
  let ball = {
    top: ballPosition.y,
    bottom: ballPosition.y + BALL_SIZE
  };
  let leftPaddle = {
    top: leftPaddleTop,
    bottom: leftPaddleTop + PADDLE_HEIGHT
  };

  if (ball.top < leftPaddle.top) {
    leftPaddleTop -= MAX_COMPUTER_SPEED;
  } else if (ball.bottom > leftPaddle.bottom) {
    leftPaddleTop += MAX_COMPUTER_SPEED;
  }
}

function update() {
  ballPosition.x += xSpeed;
  ballPosition.y += ySpeed;
  followBall();
}

function checkPaddleCollision(ball, paddle) {
  // Check if the paddle and ball overlap vertically and horizontally
  return (
    ball.left   < paddle.right &&
    ball.right  > paddle.left &&
    ball.top    < paddle.bottom &&
    ball.bottom > paddle.top
  );
}

function adjustAngle(distanceFromTop, distanceFromBottom) {
  console.log(`top: ${distanceFromTop}, bottom: ${distanceFromBottom}`);
  if (distanceFromTop < 5) {
    // if ball hit near top of paddle, reduce ySpeed
    ySpeed -= 0.5;
    paddlesBallColors = "yellow";
    console.log("Top hit!");
  } else if (distanceFromBottom < 5) {
    // if ball hit near bottom of paddle, increase ySpeed
    ySpeed += 0.5;
    paddlesBallColors = "orange";
    console.log("Bottom hit!");
  }
}

function checkCollision() {
  let ball = {
    left: ballPosition.x,
    right: ballPosition.x + BALL_SIZE,
    top: ballPosition.y,
    bottom: ballPosition.y + BALL_SIZE
  }

  let leftPaddle = {
    left: PADDLE_OFFSET,
    right: PADDLE_OFFSET + PADDLE_WIDTH,
    top: leftPaddleTop,
    bottom: leftPaddleTop + PADDLE_HEIGHT
  };

  let rightPaddle = {
    left: width - PADDLE_WIDTH - PADDLE_OFFSET,
    right: width - PADDLE_OFFSET,
    top: rightPaddleTop,
    bottom: rightPaddleTop + PADDLE_HEIGHT
  };

  if (checkPaddleCollision(ball, leftPaddle)) {
    // Left paddle collision happened
    let distanceFromTop = ball.top - leftPaddle.top;
    let distanceFromBottom = leftPaddle.bottom - ball.bottom;
    adjustAngle(distanceFromTop, distanceFromBottom);
    xSpeed = Math.abs(xSpeed);
  }

  if (checkPaddleCollision(ball, rightPaddle)) {
    // Right paddle collision happend
    let distanceFromTop = ball.top - rightPaddle.top;
    let distanceFromBottom = rightPaddle.bottom - ball.bottom;
    adjustAngle(distanceFromTop, distanceFromBottom);
    xSpeed = -Math.abs(xSpeed);
  }

  if (ball.left < 0) {
    rightScore++;
    time_out -= 1;
    initBall();
  }
  if (ball.right > width) {
    leftScore++;
    time_out -= 1;
    initBall();
  }
  if (leftScore > 9 || rightScore > 9) {
    gameOver = true;
  }
  if (ball.top < 0 || ball.bottom > height) {
    ySpeed = -ySpeed;
  }
}

function drawGameOver() {
  ctx.fillStyle = "white";
  ctx.font = "30px monospace";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", width / 2, height / 2);
}

function gameLoop() {
  draw();
  update();
  checkCollision();
  if (gameOver) {
    draw();
    drawGameOver();
  } else {
    // call this function again after a timeout
    setTimeout(gameLoop, time_out);
  }
}

initBall();
gameLoop();
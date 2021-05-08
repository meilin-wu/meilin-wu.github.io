
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gameStates = {
    ERROR: "ERROR",
    PLAYING: "PLAYING",
    LOSE: "LOSE",
    WIN: "WIN"
};
let currentGameState = gameStates.PLAYING;

const brickStates = {
    ERROR: "ERROR",
    NOT_HIT: "NOT_HIT",
    HIT: "HIT"
};

//properties
const keyPressed = { LEFT: false, RIGHT: false };
const ballProps = {
    radius: 10,
    x: 240,
    y: 290,
    speed: 10,
    dx: 2,
    dy: -2,
    colour: "#ffb700"
};
const paddleProps = {
    width: 75,
    height: 10,
    x: 300,
    y: 410,
    speed: 7,
    colour: "#00c3ff"
};
const brickProps = {
    rows: 7,
    columns: 5,
    width: 80,
    height: 20,
    padding: 10,
    offsetTop: 40,
    offsetLeft: 30,
    colour: "#a16ad4"
};
const score = {
    x: 120,
    y: 20,
    value: 0,
    multiplier: 10,
    max: 350,
    font: "14px Segoe UI",
    colour: "#000000"
};
const tries = {
    x: 515,
    y: 20,
    value: 3,
    max: 3,
    font: "14px Segoe UI",
    colour: "#000000",
};
const initialValues = {
    ballProps: {
        x: ballProps.x,
        y: ballProps.y,
        dx: ballProps.dx,
        dy: ballProps.dy
    },
    paddleProps: {
        x: paddleProps.x,
        y: paddleProps.y
    },
    score: score.value,
    tries: tries.value
}

let brickArr = [];
for (let i = 0; i < brickProps.columns; i++) {
    brickArr[i] = [];
    for (let j = 0; j < brickProps.rows; j++) {
        brickArr[i][j] = { x: 0, y: 0, state: brickStates.NOT_HIT };
    }
}

//event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(event) {
    switch (event.keyCode) {
        case 39:
            keyPressed.RIGHT = true;
            break;
        case 37:
            keyPressed.LEFT = true;
            break;
        default:
            console.warn(`keyCode ${event.keyCode} not in use.`);
            break;
    }
}

function keyUpHandler(event) {
    switch (event.keyCode) {
        case 39:
            keyPressed.RIGHT = false;
            break;
        case 37:
            keyPressed.LEFT = false;
            break;
        default:
            console.warn(`keyCode ${event.keyCode} not in use.`);
            break;
    }
}

function mouseMoveHandler(event) {
    let relativeX = event.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleProps.x = relativeX - paddleProps.width / 2;
    }
}

function updateGameState(gameState, alertMessage) {
    currentGameState = gameState;
    if(gameState != gameStates.PLAYING) {
        ballProps.dx = 0;
        ballProps.dy = 0;
        alert(alertMessage);
        document.location.reload();
    }
}
//#endregion

//#region Physics
function collisionDetection() {
    for (let c = 0; c < brickProps.columns; c++) {
        for (let r = 0; r < brickProps.rows; r++) {
            let thisBrick = brickArr[c][r];

            if (thisBrick.state == brickStates.NOT_HIT) {
                if (ballProps.x > thisBrick.x &&
                    ballProps.x < thisBrick.x + brickProps.width &&
                    ballProps.y > thisBrick.y &&
                    ballProps.y < thisBrick.y + brickProps.height) {
                    
                    ballProps.dy = -ballProps.dy;
                    thisBrick.state = brickStates.HIT;
                    score.value += score.multiplier;

                    if(score.value == score.max) {
                        updateGameState(gameStates.WIN, "Yay you won!")
                    }
                }
            }
        }
    }
}
//#endregion

//#region Graphics
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballProps.x, ballProps.y, ballProps.radius, 0, Math.PI * 2);
    ctx.fillStyle = ballProps.colour;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleProps.x, paddleProps.y, paddleProps.width, paddleProps.height);
    ctx.fillStyle = paddleProps.colour;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickProps.columns; c++) {
        for (let r = 0; r < brickProps.rows; r++) {
            if (brickArr[c][r].state == brickStates.NOT_HIT) {
                brickArr[c][r].x = (r * (brickProps.width + brickProps.padding)) + brickProps.offsetLeft;
                brickArr[c][r].y = (c * (brickProps.height + brickProps.padding)) + brickProps.offsetTop;

                ctx.beginPath();
                ctx.rect(brickArr[c][r].x, brickArr[c][r].y, brickProps.width, brickProps.height);
                ctx.fillStyle = brickProps.colour;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = score.font;
    ctx.fillStyle = score.colour;
    ctx.fillText(`Score: ${score.value}`, score.x, score.y);
}

function drawTries() {
    ctx.font = tries.font;
    ctx.fillStyle = tries.colour;
    ctx.fillText(`Tries: ${tries.value}`, tries.x, tries.y);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawTries();
    collisionDetection();

    
    //bounce off left/right wall
    if (ballProps.x + ballProps.dx > canvas.width - ballProps.radius ||
        ballProps.x + ballProps.dx < ballProps.radius) {
        ballProps.dx = -ballProps.dx;
    }
    if (ballProps.y + ballProps.dy < ballProps.radius) {
        ballProps.dy = -ballProps.dy;
    }

    
    //bounce off top/bottom wall
    else if (ballProps.y + ballProps.dy > canvas.height - ballProps.radius) {
        //bounce off paddle
        if (ballProps.x > paddleProps.x &&
            ballProps.x < paddleProps.x + paddleProps.width) {
            ballProps.dy = -ballProps.dy;
        }
        else {
            --tries.value;
            if(tries.value <= 0) {
                tries == 0;
                updateGameState(gameStates.LOSE, "Sorry, game over!");
            } else {
                ballProps.x = initialValues.ballProps.x;
                ballProps.y = initialValues.ballProps.y;
                ballProps.dx = initialValues.ballProps.dx;
                ballProps.dy = initialValues.ballProps.dy;
                paddleProps.x = initialValues.paddleProps.x;
            }
        }
    }

    if (keyPressed.RIGHT && paddleProps.x < canvas.width - paddleProps.width) {
        paddleProps.x += 7;
    }
    else if (keyPressed.LEFT && paddleProps.x > 0) {
        paddleProps.x -= 7;
    }

    ballProps.x += ballProps.dx;
    ballProps.y += ballProps.dy;

    requestAnimationFrame(draw);
}
//#endregion

if(currentGameState == gameStates.PLAYING) draw(); //setInterval(draw, 10);

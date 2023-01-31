const container = document.querySelector(".game");
const startBtn = document.querySelector("#start-btn");
const sound = document.querySelector("#eat");
let speed = 3;
let score = 0;
const boxes = [];
const snake = [];
let interval = 0;
let dir = "right";
const dirVal = { right: 0, down: 90, left: 180, up: 270 };

function createGame() {
    for (let i = 0; i < 14; i++) {
        const row = [];
        for (let j = 0; j < 22; j++) {
            const box = document.createElement("div");
            if (i == 6 && j < 10 && j > 6) {
                box.classList.add("snake");
                snake.unshift(box);
            }

            if (i == 6 && j == 10) {
                box.classList.add("head-right", "snake");
                snake.unshift(box);
            }
            const apple = document.createElement("i");
            apple.classList.add("fas", "fa-apple-whole");
            box.appendChild(apple);
            box.classList.add("box");
            container.appendChild(box);
            row.push(box);
        }
        boxes.push(row);
    }


}

function moveSnake() {
    const head = snake[0];
    const row = Math.floor(Array.from(head.parentNode.children).indexOf(head) / 22);
    const col = boxes[row].indexOf(head);
    let next = 0;

    switch (dir) {
        case "right":
            next = boxes[row] ? boxes[row][col + 1] : null;
            break;
        case "left":
            next = boxes[row] ? boxes[row][col - 1] : null;
            break;
        case "up":
            next = boxes[row - 1] ? boxes[row - 1][col] : null;
            break;
        case "down":
            next = boxes[row + 1] ? boxes[row + 1][col] : null;
            break;
        default:
            break;

    }

    if (!next || next.classList.contains("snake")) {
        gameOver();
        return;
    }


    head.classList.remove(`head-${dir}`);
    next.classList.add(`head-${dir}`, "snake")
    snake.unshift(next);
    if (next.classList.contains("apple")) {
        next.classList.remove("apple");
        score += 1;
        sound.volume = 1;
        sound.play();
        document.querySelector("#score").textContent = score;
        createApple();
        return;
    }
    const last = snake.pop();
    console.log(last);
    last.classList.remove("snake");
}

function startGame() {
    moveSnake();
    interval = setInterval(moveSnake, 100 * (4 - speed));
}

function gameOver() {
    clearInterval(interval);
    document.querySelector('#game-over h4 span').textContent = score;
    startBtn.parentElement.parentElement.classList.add("game-over", "active");
    window.removeEventListener("keydown", enterDirection);
}

function createApple() {
    const row = Math.floor(Math.random() * 14);
    const col = Math.floor(Math.random() * 14);
    const apple = boxes[row][col];
    if (apple.classList.contains("snake")) {
        createApple();
        return;
    }

    apple.classList.add("apple");

}

function enterDirection(e) {
    if (!e.key.includes("Arrow")) return;
    if (e.key.split("Arrow")[1].toLowerCase() == dir) return;
    const value = e.key.split("Arrow")[1].toLowerCase();
    if ((dirVal[value] - dirVal[dir]) % 180 != 0) {
        changeDirection(value);
    }
}

function changeDirection(value) {
    dir = value;
    const head = snake[0];
    head.classList.forEach((c) => {
        if (c.includes("head")) {
            head.classList.remove(c);
        }
    })
    head.classList.add(`head-${value}`);
    clearInterval(interval);
    startGame();
}

const buttonsDifficulty = document.querySelectorAll(".difficulty button");

buttonsDifficulty.forEach((btn) => {
    btn.addEventListener("click", () => {
        buttonsDifficulty.forEach((btn) => {
            btn.classList.remove("selected");
        })
        btn.classList.add("selected");
        speed = btn.textContent.toLowerCase() == "easy" ? 1 : btn.textContent.toLowerCase() == "medium" ? 2 : 3;
    })
})

startBtn.addEventListener("click", () => {
    startBtn.parentElement.parentElement.classList.remove('active');
    sound.volume = 0;
    sound.play();
    createGame();
    createApple();
    setTimeout(() => {
        window.addEventListener("keydown", enterDirection)
        startGame();
    }, 200);
})

window.addEventListener("keydown", (e) => {
    if (e.key == "Enter" || e.key == " ") {
        startBtn.click();
    }
})




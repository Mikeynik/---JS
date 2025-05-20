class GameFieled {
    constructor(size) {
        this.size = size;
        this.cells = [];
        this.initFieled();
    }

    initFieled() {
        const board = document.getElementById('gameFieled');
        board.innerHTML = '';
        for (let i = 0; i < this.size * this.size; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            board.appendChild(cell);
            this.cells.push(cell);
        }
    }

    updateFieled(snake, apple) {
        this.cells.forEach(cell => cell.className = 'cell');
        snake.body.forEach(segment => {
            const index = segment.y * this.size + segment.x;
            this.cells[index].classList.add('snake');
        });
        const appleIndex = apple.y * this.size + apple.x;
        this.cells[appleIndex].classList.add('apple');
    }
}

class Snake {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.body = [{ x: Math.floor(boardSize / 2), y: Math.floor(boardSize / 2) }];
        this.direction = 'RIGHT';
        this.grow = false;
    }

    move() {
        const head = { ...this.body[0] };
        if (this.direction === 'RIGHT') head.x++;
        if (this.direction === 'LEFT') head.x--;
        if (this.direction === 'UP') head.y--;
        if (this.direction === 'DOWN') head.y++;

        if (head.x >= this.boardSize) head.x = 0;
        if (head.x < 0) head.x = this.boardSize - 1;
        if (head.y >= this.boardSize) head.y = 0;
        if (head.y < 0) head.y = this.boardSize - 1;

        this.body.unshift(head);
        if (!this.grow) this.body.pop();
        this.grow = false;
    }

    changeDirection(newDirection) {
        const opposites = {
            'UP': 'DOWN',
            'DOWN': 'UP',
            'LEFT': 'RIGHT',
            'RIGHT': 'LEFT'
        };
        if (opposites[this.direction] !== newDirection) {
            this.direction = newDirection;
        }
    }

    checkCollision() {
        const head = this.body[0];
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }

    growSnake() {
        this.grow = true;
    }
}

class Apple {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.generateNewPosition();
    }

    generateNewPosition() {
        this.x = Math.floor(Math.random() * this.boardSize);
        this.y = Math.floor(Math.random() * this.boardSize);
    }
}

class Game {
    constructor() {
        this.boardSize = 10;
        this.gameFieled = new GameFieled(this.boardSize);
        this.snake = new Snake(this.boardSize);
        this.apple = new Apple(this.boardSize);
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.updateScore();
        this.startGame();
    }

    startGame() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        document.getElementById('gameFieled').addEventListener('click', this.startGameLoop.bind(this));
        document.getElementById('restart').addEventListener('click', this.restartGame.bind(this));
    }

    handleKeyPress(event) {
        const key = event.key;
        if (key === 'ArrowUp') this.snake.changeDirection('UP');
        if (key === 'ArrowDown') this.snake.changeDirection('DOWN');
        if (key === 'ArrowLeft') this.snake.changeDirection('LEFT');
        if (key === 'ArrowRight') this.snake.changeDirection('RIGHT');
    }

    startGameLoop() {
        this.gameInterval = setInterval(() => {
            this.snake.move();
            if (this.snake.checkCollision()) {
                this.endGame();
            } else {
                this.checkAppleCollision();
                this.gameFieled.updateFieled(this.snake, this.apple);
            }
        }, 500);
    }

    checkAppleCollision() {
        const head = this.snake.body[0];
        if (head.x === this.apple.x && head.y === this.apple.y) {
            this.snake.growSnake();
            this.apple.generateNewPosition();
            this.score++;
            this.updateScore();
        }
    }

    updateScore() {
        document.getElementById('currentScore').innerText = this.score;
        document.getElementById('highScore').innerText = this.highScore;
    }

    endGame() {
        clearInterval(this.gameInterval);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }
        document.getElementById('restart').style.display = 'block';
    }

    restartGame() {
        this.snake = new Snake(this.boardSize);
        this.apple = new Apple(this.boardSize);
        this.score = 0;
        this.updateScore();
        this.gameFieled.updateFieled(this.snake, this.apple);
        this.startGameLoop();
        document.getElementById('restart').style.display = 'none';
    }
}

new Game();
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 700);
const gamespeed = 1;
const border = 0;
let framerate = 20;
let frameX = 0;
let staggerFrames = 0;

const layers = Array.from({ length: 5 }, (_, i) => {
  const layer = new Image();
  layer.src = `layer-${i + 1}.png`;
  const speed = 5 - i;
  return { layer, speed };
});

let x = 0;
const last = 2400;
gravity = 0.2;
let isJumping = false;
class Character {
  constructor({ position, imgSrc }) {
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.position = position;
    this.image = new Image();
    this.height = 100;

    this.image.onload = () => {
      this.width = this.image.width;
      this.height = this.image.height;
    };

    this.image.src = imgSrc;
  }
  draw() {
    //ctx.fillStyle = 'red';
    // ctx.fillRect(this.position.x, this.position.y, 100, this.height);
    if (!this.image) return;
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }

  update() {
    this.draw();
    if (this.position.x + this.width > CANVAS_WIDTH - border)
      this.position.x = CANVAS_WIDTH - this.width - border;
    this.position.x += this.velocity.x;
    // if(this.position.x < border) this.position.x = border;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y < canvas.height - 100)
      this.velocity.y += gravity;
    else {
      this.velocity.y = 0;
      isJumping = false;
    }
  }
}

class Enemy {
  constructor({ position, imgSrc }) {
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.position = position;
    this.image = new Image();
    this.image.onload = () => {
      this.width = this.image.width;
      this.height = this.image.height;
    };

    this.image.src = imgSrc;
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }

  update() {
    this.draw();
    this.velocity.x = -gamespeed;
    this.position.x += this.velocity.x;
  }
}
const character = new Character({
  position: {
    x: 400,
    y: 50,
  },
  imgSrc: "idle.png",
});

const enemy = new Enemy({
  position: {
    x: 900,
    y: canvas.height - 194,
  },
  imgSrc: "enemy.png",
});

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  r: {
    pressed: false,
  },
};

function checkCollisionWithBorder() {
  if (character.position.x + character.width < border) {
    console.log("Out of bounds!");
    return true;
  } else return false;
}
function collisionWithEnemy() {
  if (
    character.position.x > enemy.position.x + enemy.width ||
    character.position.x + character.width < enemy.position.x ||
    character.position.y + character.height < enemy.position.y ||
    character.position.y > enemy.position.y + enemy.height
  )
    return true;
  else return false;
}

function spawnEnemy() {
  if (enemy.position.x + enemy.width < border) enemy.position.x = 900;
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  layers.forEach(({ layer, speed }, i) => {
    let xPos = (x / speed) % last;

    while (xPos < CANVAS_WIDTH) {
      ctx.drawImage(layer, xPos, 0);
      xPos += last;
    }
  });

  x -= gamespeed;
  if (!checkCollisionWithBorder() && collisionWithEnemy())
    requestAnimationFrame(animate);
  enemy.update();
  if (enemy.position.x < 600) enemy.update();
  spawnEnemy();
  character.update();

  if (keys.d.pressed) character.velocity.x = gamespeed + 1;
  if (keys.a.pressed) character.velocity.x = -gamespeed - 1;
  if (!keys.d.pressed && !keys.a.pressed) character.velocity.x = -gamespeed;
  if (keys.w.pressed && !isJumping) {
    character.velocity.y = -10;
    isJumping = true;
  }
  if (keys.r.pressed) location.reload();
}

animate();
//gameTime();

window.addEventListener("keydown", (event) => {
  if (event.key === "w") {
    keys.w.pressed = true;
  } else if (event.key === "a") {
    keys.a.pressed = true;
  } else if (event.key === "d") {
    keys.d.pressed = true;
  } else if (event.key === "r") {
    keys.r.pressed = true;
    location.reload();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "a") {
    keys.a.pressed = false;
  } else if (event.key === "d") {
    keys.d.pressed = false;
  } else if (event.key === "w") {
    keys.w.pressed = false;
  }
});

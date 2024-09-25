// 设置画布
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

// 生成森林主题颜色值的函数
function randomForestColor() {
  const color = 'rgb(' +
                 random(34, 139) + ',' + // 更偏向绿色的 RGB 值
                 random(34, 139) + ',' +
                 random(34, 139) + ')';
  return color;
}

// 定义 Ball 构造器
function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
  this.history = []; // 存储球的移动轨迹
}

// 定义彩球绘制函数
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();

  // 绘制轨迹
  if (this.history.length > 0) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.history[0].x, this.history[0].y);
    for (let point of this.history) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  }
};

// 定义彩球更新函数
Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;

  // 更新轨迹
  this.history.push({x: this.x, y: this.y});
  if (this.history.length > 50) { // 限制轨迹点数量，防止性能问题
    this.history.shift();
  }
};

// 定义碰撞检测函数
Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        this.color = balls[j].color = randomForestColor();
      }
    }
  }
};

// 定义一个数组，生成并保存所有的球
let balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomForestColor(),
    size
  );
  balls.push(ball);
}

// 定义一个循环来不停地播放
function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.1)'; // 半透明背景
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  requestAnimationFrame(loop);
}

loop();

// 设置场景
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// 添加球体
const geometry = new THREE.SphereGeometry(5, 32, 32); // 半径为5，32段
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // 森林绿色
const ball = new THREE.Mesh(geometry, material);
scene.add(ball);

// 设置相机位置
camera.position.z = 20;

// 添加光源
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// 动画函数
const animate = function () {
  requestAnimationFrame(animate);

  // 球体旋转动画
  ball.rotation.x += 0.01;
  ball.rotation.y += 0.01;

  // 球体弹跳动画
  if (ball.position.y < 5 || ball.position.y > 15) {
    ball.velocity.y = -ball.velocity.y;
  }
  ball.position.y += ball.velocity.y;

  renderer.render(scene, camera);
};

// 初始化球体位置和速度
ball.position.set(0, 5, 0);
ball.velocity = { y: 0.5 };

animate();

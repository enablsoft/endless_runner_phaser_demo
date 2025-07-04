class GameScene extends Phaser.Scene {
    constructor() {
      super('GameScene');
    }
  
    preload() {
      // Nothing to preload, using generated textures
    }
  
    create() {
      this.createTextures();
  
      this.ground = this.physics.add.staticGroup();
      this.ground.create(400, 380, 'ground');
  
      this.player = this.physics.add.sprite(100, 300, 'player');
      this.player.setCollideWorldBounds(true).setBounce(0.1);
      this.physics.add.collider(this.player, this.ground);
  
      this.obstacles = this.physics.add.group();
      this.coins = this.physics.add.group();
  
      this.physics.add.collider(this.obstacles, this.ground);
      this.physics.add.collider(this.coins, this.ground);
  
      this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);
      this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
  
      this.score = 0;
      this.level = 1;
      this.speed = 200;
      this.spawnDelay = 1500;
      this.canDoubleJump = true;
      this.gameOver = false;
      this.isPaused = false;
      this.gameStarted = false;
      this.reviveGivenThisLevel = false;
  
      this.highScore = localStorage.getItem('highScore') || 0;
  
      this.powerUps = {
        revive: false
      };
      this.powerUpTimer = null;
  
      // UI
      this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#000', fontFamily: 'Arial' }).setDepth(5);
      this.highScoreText = this.add.text(16, 44, 'High Score: ' + this.highScore, { fontSize: '18px', fill: '#444', fontFamily: 'Arial' }).setDepth(5);
      this.levelText = this.add.text(16, 72, 'Level: 1', { fontSize: '18px', fill: '#444', fontFamily: 'Arial' }).setDepth(5);
      this.pauseText = this.add.text(this.scale.width / 2, 150, '', { fontSize: '48px', fill: '#f00', fontFamily: 'Arial' }).setOrigin(0.5).setDepth(5);
      this.powerUpText = this.add.text(16, 100, 'Power Up: None', { fontSize: '18px', fill: '#444', fontFamily: 'Arial' }).setDepth(5);
      this.gameOverText = this.add.text(this.scale.width / 2, 200, 'GAME OVER\nTap Restart Button', {
        fontSize: '32px',
        fill: '#f00',
        align: 'center',
        fontFamily: 'Arial'
      }).setOrigin(0.5).setAlpha(0).setDepth(10);
  
      this.physics.pause();
  
      this.input.keyboard.on('keydown-SPACE', () => {
        if (!this.gameStarted) this.startGame();
        else if (this.gameOver && !this.powerUps.revive) this.restartGame();
        else if (!this.isPaused) this.jump();
      });
  
      this.input.keyboard.on('keydown-P', () => {
        if (this.gameStarted && !this.gameOver) this.togglePause();
      });
  
      this.spawnTimer = this.time.addEvent({
        delay: this.spawnDelay,
        loop: true,
        paused: true,
        callback: () => {
          if (!this.gameOver && !this.isPaused) {
            this.spawnObstacle();
            this.spawnCoin();
          }
        }
      });
  
      this.createBottomUI();
    }
  
    update() {
      if (!this.gameStarted || this.gameOver || this.isPaused) return;
      this.speed += 0.005;
  
      let newLevel = Math.floor(this.score / 100) + 1;
      if (newLevel > this.level) this.levelUp(newLevel);
  
      this.obstacles.children.iterate(ob => {
        if (ob && ob.x < -50) ob.destroy();
        else if (ob) ob.body.setVelocityX(-this.speed);
        if (ob && ob.rotationSpeed) ob.rotation += ob.rotationSpeed;
      });
  
      this.coins.children.iterate(coin => {
        if (coin && coin.x < -50) coin.destroy();
        else if (coin) coin.body.setVelocityX(-this.speed);
      });
  
      if (this.player.body.touching.down) this.canDoubleJump = true;
    }
  
    createBottomUI() {
      const uiHeight = 70;
      const panelY = this.scale.height - uiHeight / 2;
  
      this.uiPanel = this.add.rectangle(this.scale.width / 2, panelY, this.scale.width, uiHeight, 0x222222, 0.8).setDepth(8);
      this.uiPanel.setStrokeStyle(2, 0xffffff, 0.5);
  
      const btnStyle = {
        fontSize: '22px',
        fill: '#fff',
        backgroundColor: '#444',
        padding: { x: 20, y: 10 },
        align: 'center',
        fontFamily: 'Arial',
        stroke: '#000',
        strokeThickness: 2,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000',
          blur: 3,
          stroke: true,
          fill: true
        }
      };
  
      const createBtn = (x, text, callback) => {
        const btn = this.add.text(x, panelY, text, btnStyle).setOrigin(0.5).setInteractive().setDepth(10);
  
        btn.on('pointerover', () => btn.setStyle({ fill: '#ff0', backgroundColor: '#666' }));
        btn.on('pointerout', () => btn.setStyle({ fill: '#fff', backgroundColor: '#444' }));
        btn.on('pointerdown', () => {
          btn.setStyle({ fill: '#0f0', backgroundColor: '#222' });
          callback();
        });
        btn.on('pointerup', () => {
          btn.setStyle({ fill: '#fff', backgroundColor: '#444' });
        });
  
        return btn;
      };
  
      const quarter = this.scale.width / 5;
  
      // Start Button
      this.startBtn = createBtn(quarter, '▶️ START', () => {
        if (!this.gameStarted) this.startGame();
      });
  
      // Jump Button
      this.jumpBtn = createBtn(quarter * 2, '🚀 JUMP', () => {
        if (this.gameStarted && !this.gameOver && !this.isPaused) this.jump();
      });
      this.jumpBtn.setVisible(false);
  
      // Pause Button
      this.pauseBtn = createBtn(quarter * 3, '⏸ PAUSE', () => {
        if (this.gameStarted && !this.gameOver) this.togglePause();
      });
      this.pauseBtn.setVisible(false);
  
      // Restart Button
      this.restartBtn = createBtn(quarter * 4, '🔄 RESTART', () => {
        if (this.gameOver && !this.powerUps.revive) this.restartGame();
      });
      this.restartBtn.setVisible(false);
  
      // Revive Button - only visible when revive power-up active and game over
      this.reviveBtn = createBtn(quarter, '❤️ REVIVE', () => {
        if (this.gameOver && this.powerUps.revive) this.useRevive();
      });
      this.reviveBtn.setVisible(false);
    }
  
    startGame() {
      this.gameStarted = true;
      this.startBtn.setVisible(false);
      this.jumpBtn.setVisible(true);
      this.pauseBtn.setVisible(true);
      this.restartBtn.setVisible(false);
      this.reviveBtn.setVisible(false);
      this.gameOverText.setAlpha(0);
      this.physics.resume();
      this.spawnTimer.paused = false;
      this.pauseText.setText('');
      this.powerUpText.setText('Power Up: None');
      this.powerUps.revive = false;
      this.powerUps.slowdown = false;
      if(this.powerUpTimer) {
        this.powerUpTimer.remove();
        this.powerUpTimer = null;
      }
    }
  
    jump() {
      if (this.player.body.touching.down) {
        this.player.setVelocityY(-420);
        this.canDoubleJump = true;
      } else if (this.canDoubleJump) {
        this.player.setVelocityY(-360);
        this.canDoubleJump = false;
      }
    }
  
    hitObstacle() {
      if (this.powerUps.revive) {
        // Activate game over state but show revive button instead of restart
        this.gameOver = true;
        this.player.setTint(0xff0000);
        this.physics.pause();
        this.spawnTimer.paused = true;
  
        this.jumpBtn.setVisible(false);
        this.pauseBtn.setVisible(false);
        this.restartBtn.setVisible(false);
        this.reviveBtn.setVisible(true);
  
        this.gameOverText.setAlpha(1);
      } else {
        // Normal game over
        this.gameOver = true;
        this.player.setTint(0xff0000);
        this.physics.pause();
        this.spawnTimer.paused = true;
  
        if (this.score > this.highScore) {
          this.highScore = this.score;
          localStorage.setItem('highScore', this.highScore);
          this.highScoreText.setText('High Score: ' + this.highScore);
        }
  
        this.gameOverText.setAlpha(1);
        this.restartBtn.setVisible(true);
        this.jumpBtn.setVisible(false);
        this.pauseBtn.setVisible(false);
        this.reviveBtn.setVisible(false);
        this.powerUpText.setText('Power Up: None');
        this.powerUps.revive = false;
      }
    }
  
    useRevive() {
      if (!this.powerUps.revive) return;
  
      this.gameOver = false;
      this.powerUps.revive = false;
      this.reviveBtn.setVisible(false);
      this.gameOverText.setAlpha(0);
      this.jumpBtn.setVisible(true);
      this.pauseBtn.setVisible(true);
      this.restartBtn.setVisible(false);
      this.powerUpText.setText('Power Up: None');
  
      this.player.clearTint();
      this.player.setPosition(100, 200);
      this.player.setVelocity(0, 0);
  
      this.physics.resume();
      this.spawnTimer.paused = false;
    }
  
    spawnObstacle() {
      // Different shapes: rectangle, star, triangle, circle
      const shapes = ['obstacle_rect', 'obstacle_star', 'obstacle_triangle', 'obstacle_circle'];
      const shape = Phaser.Utils.Array.GetRandom(shapes);
      const yPos = 350;
      const ob = this.obstacles.create(800, yPos, shape);
  
      ob.setImmovable(true);
      ob.body.allowGravity = false;
  
      // Random animation properties
      if (shape === 'obstacle_star' || shape === 'obstacle_triangle') {
        ob.rotationSpeed = Phaser.Math.FloatBetween(0.02, 0.05);
      } else {
        ob.rotationSpeed = 0;
      }
  
      // Pulsating scale tween for triangle
      if (shape === 'obstacle_triangle') {
        ob.pulseTween = this.tweens.add({
          targets: ob,
          scaleX: 1.1,
          scaleY: 1.1,
          yoyo: true,
          repeat: -1,
          duration: 800
        });
      }
  
      ob.body.setVelocityX(-this.speed);
    }
  
    spawnCoin() {
      const yPos = Phaser.Math.Between(260, 310);
  
      if (!this.reviveGivenThisLevel && Phaser.Math.Between(1, 100) <= 20) {
        const coin = this.coins.create(800, yPos, 'coin_revive');
        coin.setImmovable(true);
        coin.body.allowGravity = false;
        coin.body.setVelocityX(-this.speed);
  
        this.reviveGivenThisLevel = true;
  
        coin.bounceTween = this.tweens.add({
          targets: coin,
          y: yPos - 10,
          yoyo: true,
          duration: 400,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
        return;
      }
  
      const coin = this.coins.create(800, yPos, 'coin');
      coin.setImmovable(true);
      coin.body.allowGravity = false;
      coin.body.setVelocityX(-this.speed);
    }
  
    togglePause() {
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        this.physics.pause();
        this.pauseText.setText('PAUSED');
        this.spawnTimer.paused = true;
      } else {
        this.physics.resume();
        this.pauseText.setText('');
        this.spawnTimer.paused = false;
      }
    }
  
    restartGame() {
      this.gameOver = false;
      this.score = 0;
      this.level = 1;
      this.speed = 200;
      this.spawnDelay = 1500;
      this.canDoubleJump = true;
  
      this.player.clearTint();
      this.player.setPosition(100, 300);
      this.player.setVelocity(0, 0);
  
      this.obstacles.clear(true, true);
      this.coins.clear(true, true);
  
      this.scoreText.setText('Score: 0');
      this.levelText.setText('Level: 1');
      this.pauseText.setText('');
      this.gameOverText.setAlpha(0);
      this.powerUpText.setText('Power Up: None');
  
      this.startBtn.setVisible(false);
      this.jumpBtn.setVisible(true);
      this.pauseBtn.setVisible(true);
      this.restartBtn.setVisible(false);
      this.reviveBtn.setVisible(false);
  
      this.powerUps.revive = false;
      this.powerUps.slowdown = false;
      if(this.powerUpTimer) {
        this.powerUpTimer.remove();
        this.powerUpTimer = null;
      }
  
      this.physics.resume();
      this.spawnTimer.paused = false;
      this.spawnTimer.delay = this.spawnDelay;
    }
  
    collectCoin(player, coin) {
      coin.destroy();
      this.score += 10;
      this.scoreText.setText('Score: ' + this.score);
  
      if (this.score > this.highScore) {
        this.highScore = this.score;
        this.highScoreText.setText('High Score: ' + this.highScore);
      }
  
      if (coin.texture.key === 'coin_revive') {
        this.grantRevivePowerUp();
      }
    }
  
    grantRevivePowerUp() {
      this.powerUps.revive = true;
      this.powerUpText.setText('Power Up: REVIVE available! Tap ❤️ REVIVE button after death to continue.');
      this.reviveBtn.setVisible(this.gameOver);
    }
  
    levelUp(newLevel) {
      this.level = newLevel;
      this.levelText.setText('Level: ' + this.level);
      this.speed += 20 * (this.level - 1);
      this.spawnDelay = Math.max(500, 1500 - (this.level - 1) * 150);
      this.spawnTimer.delay = this.spawnDelay;
      this.reviveGivenThisLevel = false;
    }
  
    createTextures() {
      const gfx = this.make.graphics({ x: 0, y: 0, add: false });
  
      gfx.clear(); gfx.fillStyle(0xff0000, 1); gfx.fillRect(0, 0, 32, 32); gfx.generateTexture('player', 32, 32);
      gfx.clear(); gfx.fillStyle(0x228b22, 1); gfx.fillRect(0, 0, 800, 40); gfx.generateTexture('ground', 800, 40);
      gfx.clear(); gfx.fillStyle(0x000000, 1); gfx.fillRect(0, 0, 30, 30); gfx.generateTexture('obstacle_rect', 30, 30);
  
      gfx.clear(); gfx.fillStyle(0xffd700, 1);
      this.drawStar(gfx, 15, 15, 5, 15, 7);
      gfx.generateTexture('obstacle_star', 30, 30);
  
      gfx.clear(); gfx.fillStyle(0x800080, 1);
      this.drawTriangle(gfx, 30, 30);
      gfx.generateTexture('obstacle_triangle', 30, 30);
  
      gfx.clear(); gfx.fillStyle(0x0000ff, 1);
      gfx.fillCircle(15, 15, 15);
      gfx.generateTexture('obstacle_circle', 30, 30);
  
      gfx.clear(); gfx.fillStyle(0xffd700, 1); gfx.fillRect(0, 0, 20, 20); gfx.generateTexture('coin', 20, 20);
  
      // Revive coin - pink heart
      gfx.clear();
      gfx.fillStyle(0xff69b4, 1);
      gfx.beginPath();
      gfx.moveTo(10, 0);
      gfx.lineTo(20, 10);
      gfx.lineTo(10, 20);
      gfx.lineTo(0, 10);
      gfx.closePath();
      gfx.fillPath();
      gfx.generateTexture('coin_revive', 20, 20);
    }
  
    drawStar(gfx, x, y, points, outerRadius, innerRadius) {
      const step = Math.PI / points;
      gfx.beginPath();
      for (let i = 0; i < 2 * points; i++) {
        const r = (i % 2) ? innerRadius : outerRadius;
        const a = i * step;
        const sx = x + r * Math.sin(a);
        const sy = y - r * Math.cos(a);
        if (i === 0) gfx.moveTo(sx, sy);
        else gfx.lineTo(sx, sy);
      }
      gfx.closePath();
      gfx.fillPath();
    }
  
    drawTriangle(gfx, width, height) {
      gfx.beginPath();
      gfx.moveTo(width / 2, 0);
      gfx.lineTo(width, height);
      gfx.lineTo(0, height);
      gfx.closePath();
      gfx.fillPath();
    }
  }
  
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 460,
    backgroundColor: '#87ceeb',
    physics: {
      default: 'arcade',
      arcade: { gravity: { y: 800 }, debug: false }
    },
    scene: [GameScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    }
  };
  
  new Phaser.Game(config);
  
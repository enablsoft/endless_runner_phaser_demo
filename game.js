// ============================================================================
// ENDLESS RUNNER GAME - Phaser 3 Implementation
// ============================================================================

// Game Configuration Constants
const GAME_CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  BACKGROUND_COLOR: '#87ceeb',
  GRAVITY: 800,
  PLAYER_START_X: 100,
  PLAYER_START_Y: 300,
  GROUND_Y: 520,
  OBSTACLE_SPAWN_X: 800,
  OBSTACLE_Y: 490,
  COIN_SPAWN_X: 800,
  COIN_MIN_Y: 340,
  COIN_MAX_Y: 400,
  INITIAL_SPEED: 200,
  INITIAL_SPAWN_DELAY: 1500,
  SPEED_INCREMENT: 0.005,
  LEVEL_SPEED_BONUS: 20,
  SPAWN_DELAY_REDUCTION: 150,
  MIN_SPAWN_DELAY: 500,
  SCORE_PER_COIN: 10,
  SCORE_PER_LEVEL: 100,
  REVIVE_CHANCE: 20,
  JUMP_VELOCITY: -420,
  DOUBLE_JUMP_VELOCITY: -360,
  PLAYER_BOUNCE: 0.1
};

// UI Configuration Constants
const UI_CONFIG = {
  BUTTON_STYLE: {
    fontSize: '22px',
    fill: '#fff',
    backgroundColor: '#444',
    padding: { x: 25, y: 12 },
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
  },
  MENU_BUTTON_STYLE: {
    fontSize: '26px',
    fill: '#fff',
    backgroundColor: '#444',
    padding: { x: 25, y: 12 },
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
  },
  BUTTON_WIDTH: 110,
  BUTTON_GAP: 35,
  UI_PANEL_HEIGHT: 70
};

// ============================================================================
// MAIN MENU SCENE
// ============================================================================

class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    this.createBackground();
    globalCloudManager.start(this);
    this.createTitle();
    this.createHighScoreDisplay();
    this.createButtons();
    this.createInstructions();
  }

  createBackground() {
    this.add.rectangle(
      GAME_CONFIG.WIDTH / 2, 
      GAME_CONFIG.HEIGHT / 2, 
      GAME_CONFIG.WIDTH, 
      GAME_CONFIG.HEIGHT, 
      0x87ceeb
    );
  }

  createTitle() {
    // Main title with modern styling and shadow
    const titleText = this.add.text(GAME_CONFIG.WIDTH / 2, 80, 'ENDLESS RUNNER', {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000000',
        blur: 6,
        fill: true
      }
    }).setOrigin(0.5);
    
    // Subtitle with modern styling
    const subtitleText = this.add.text(GAME_CONFIG.WIDTH / 2, 120, 'Adventure Awaits!', {
      fontSize: '22px',
      fill: '#ffd700',
      fontFamily: 'Arial',
      fontStyle: 'italic',
      stroke: '#000000',
      strokeThickness: 2,
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: '#000000',
        blur: 2,
        fill: true
      }
    }).setOrigin(0.5);
    
    // Add entrance animation
    titleText.setAlpha(0);
    subtitleText.setAlpha(0);
    titleText.setY(60);
    subtitleText.setY(100);
    
    this.tweens.add({
      targets: titleText,
      alpha: 1,
      y: 80,
      duration: 1200,
      ease: 'Back.easeOut'
    });
    
    this.tweens.add({
      targets: subtitleText,
      alpha: 1,
      y: 120,
      duration: 1200,
      delay: 300,
      ease: 'Back.easeOut'
    });
  }

  createHighScoreDisplay() {
    const highScore = localStorage.getItem('highScore') || 0;
    
    // Add modern background panel for high score
    const highScoreBg = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2, 
      170, 
      350, 
      50, 
      0xffffff, 
      0.85
    );
    highScoreBg.setStrokeStyle(3, 0x000000, 0.5);
    
    // Add subtle shadow
    const shadowBg = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2 + 2, 
      172, 
      350, 
      50, 
      0x000000, 
      0.3
    );
    shadowBg.setDepth(0);
    highScoreBg.setDepth(1);
    
    const highScoreText = this.add.text(GAME_CONFIG.WIDTH / 2, 170, `🏆 High Score: ${highScore}`, {
      fontSize: '22px',
      fill: '#000',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 1
    }).setOrigin(0.5).setDepth(2);
    
    // Add enhanced animation to high score
    this.tweens.add({
      targets: highScoreText,
      scaleX: 1.08,
      scaleY: 1.08,
      yoyo: true,
      repeat: -1,
      duration: 2500,
      ease: 'Sine.easeInOut'
    });
    
    // Add entrance animation
    highScoreBg.setAlpha(0);
    highScoreText.setAlpha(0);
    this.tweens.add({
      targets: [highScoreBg, highScoreText],
      alpha: 1,
      duration: 1000,
      delay: 600,
      ease: 'Power2'
    });
  }

  createButtons() {
    const createButton = (y, text, callback) => {
      // Modern button styling
      const buttonStyle = {
        fontSize: '32px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
        backgroundColor: '#4CAF50',
        padding: { x: 40, y: 20 },
        borderRadius: 15,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000000',
          blur: 4,
          fill: true
        }
      };
      
      const buttonHoverStyle = {
        ...buttonStyle,
        backgroundColor: '#45a049',
        fill: '#ffff00'
      };
      
      const button = this.add.text(GAME_CONFIG.WIDTH / 2, y, text, buttonStyle)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setDepth(10);

      // Enhanced button interaction events with smooth animations
      button.on('pointerover', () => {
        this.tweens.add({
          targets: button,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 150,
          ease: 'Power2'
        });
        button.setStyle(buttonHoverStyle);
      });
      
      button.on('pointerout', () => {
        this.tweens.add({
          targets: button,
          scaleX: 1,
          scaleY: 1,
          duration: 150,
          ease: 'Power2'
        });
        button.setStyle(buttonStyle);
      });
      
      button.on('pointerdown', () => {
        this.tweens.add({
          targets: button,
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 100,
          ease: 'Power2'
        });
        callback();
      });
      
      button.on('pointerup', () => {
        this.tweens.add({
          targets: button,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 100,
          ease: 'Power2'
        });
      });

      return button;
    };

    // Calculate button positions for true side-by-side layout with visible edges
    const buttonWidth = 180; // Reduced width for better fit
    const gap = 100; // Increased gap to move buttons further apart
    const totalWidth = buttonWidth * 2 + gap;
    const startX = (GAME_CONFIG.WIDTH - totalWidth) / 2 + buttonWidth / 2;
    
    // Play Button - left side
    const playButton = this.add.text(startX, 320, '🎮 PLAY GAME', {
      fontSize: '26px', // Adjusted font size
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#4CAF50',
      padding: { x: 25, y: 12 },
      borderRadius: 15,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 4,
        fill: true
      }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(10);

    // Leaderboard Button - right side
    const leaderboardButton = this.add.text(startX + buttonWidth + gap, 320, '🏆 LEADERBOARD', {
      fontSize: '26px', // Adjusted font size
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#4CAF50',
      padding: { x: 25, y: 12 },
      borderRadius: 15,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 4,
        fill: true
      }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(10);

    // Button interaction events for both buttons
    [playButton, leaderboardButton].forEach(button => {
      button.on('pointerover', () => {
        this.tweens.add({
          targets: button,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 150,
          ease: 'Power2'
        });
        button.setStyle({ 
          fill: '#ffff00', 
          backgroundColor: '#45a049' 
        });
      });
      
      button.on('pointerout', () => {
        this.tweens.add({
          targets: button,
          scaleX: 1,
          scaleY: 1,
          duration: 150,
          ease: 'Power2'
        });
        button.setStyle({ 
          fill: '#ffffff', 
          backgroundColor: '#4CAF50' 
        });
      });
      
      button.on('pointerdown', () => {
        this.tweens.add({
          targets: button,
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 100,
          ease: 'Power2'
        });
      });
      
      button.on('pointerup', () => {
        this.tweens.add({
          targets: button,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 100,
          ease: 'Power2'
        });
      });
    });

    // Add click handlers
    playButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
    
    leaderboardButton.on('pointerdown', () => {
      this.scene.start('LeaderboardScene');
    });
    
    // Add entrance animations for buttons
    playButton.setAlpha(0);
    leaderboardButton.setAlpha(0);
    playButton.setY(300);
    leaderboardButton.setY(300);
    
    this.tweens.add({
      targets: playButton,
      alpha: 1,
      y: 320,
      duration: 800,
      delay: 900,
      ease: 'Back.easeOut'
    });
    
    this.tweens.add({
      targets: leaderboardButton,
      alpha: 1,
      y: 320,
      duration: 800,
      delay: 1100,
      ease: 'Back.easeOut'
    });
  }

  createInstructions() {
    // Add modern background panel for instructions with transparency - moved 20px down
    const instructionsBg = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2, 
      490, 
      650, 
      140, 
      0xffffff, 
      0.8
    );
    instructionsBg.setStrokeStyle(3, 0x000000, 0.4);
    
    // Add subtle shadow effect
    const shadowBg = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2 + 3, 
      493, 
      650, 
      140, 
      0x000000, 
      0.25
    );
    shadowBg.setDepth(0);
    instructionsBg.setDepth(1);
    
    const instructionsText = this.add.text(GAME_CONFIG.WIDTH / 2, 560, 
      '🎮 CONTROLS 🎮\n\nSPACE or 🚀 JUMP - Jump/Double Jump\nP or ⏸ PAUSE - Pause Game\n\n💰 Collect coins to score points!\n⚠️ Avoid obstacles to survive!', {
      fontSize: '15px',
      fill: '#000',
      fontFamily: 'Arial',
      align: 'center',
      fontStyle: 'bold',
      lineSpacing: 1,
      wordWrap: { width: 580 },
      padding: { x: 20, y: 15 }
    }).setOrigin(0.5).setDepth(2);
    
    // Add enhanced entrance animation
    instructionsBg.setAlpha(0);
    instructionsText.setAlpha(0);
    instructionsBg.setY(470);
    instructionsText.setY(470);
    
    this.tweens.add({
      targets: [instructionsBg, instructionsText],
      alpha: 1,
      y: 490,
      duration: 1200,
      delay: 1300,
      ease: 'Back.easeOut'
    });
  }

  createClouds() {
    this.clouds = this.add.group();
    
    // Create initial clouds
    for (let i = 0; i < 4; i++) {
      this.spawnCloud();
    }

    // Spawn new clouds periodically
    this.time.addEvent({
      delay: 4000,
      loop: true,
      callback: () => {
        this.spawnCloud();
      }
    });
  }

  spawnCloud() {
    const cloudTypes = ['cloud_small', 'cloud_medium', 'cloud_large'];
    const cloudType = Phaser.Utils.Array.GetRandom(cloudTypes);
    
    // Random position on the right side of screen
    const x = GAME_CONFIG.WIDTH + Phaser.Math.Between(50, 150);
    const y = Phaser.Math.Between(50, 200);
    
    const cloud = this.add.sprite(x, y, cloudType);
    cloud.setDepth(1); // Behind UI elements
    
    // Random speed based on cloud size (increased speeds)
    const speeds = { cloud_small: 0.6, cloud_medium: 0.4, cloud_large: 0.25 };
    const speed = speeds[cloudType];
    
    // Animate cloud movement
    this.tweens.add({
      targets: cloud,
      x: -100,
      duration: 15000 / speed,
      ease: 'Linear',
      onComplete: () => {
        cloud.destroy();
      }
    });
    
    this.clouds.add(cloud);
  }
}

// ============================================================================
// LEADERBOARD SCENE
// ============================================================================

class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super('LeaderboardScene');
  }

  create() {
    this.createBackground();
    globalCloudManager.start(this);
    this.createTitle();
    this.createLeaderboardEntries();
    this.createBackButton();
  }

  createBackground() {
    this.add.rectangle(
      GAME_CONFIG.WIDTH / 2, 
      GAME_CONFIG.HEIGHT / 2, 
      GAME_CONFIG.WIDTH, 
      GAME_CONFIG.HEIGHT, 
      0x87ceeb
    );
  }

  createTitle() {
    // Main title with modern styling - moved higher up
    const titleText = this.add.text(GAME_CONFIG.WIDTH / 2, 60, '🏆 LEADERBOARD', {
      fontSize: '40px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 4,
        fill: true
      }
    }).setOrigin(0.5);

    // Subtitle with modern styling - moved down with more spacing
    const subtitleText = this.add.text(GAME_CONFIG.WIDTH / 2, 140, '🏅 Top 10 High Scores 🏅', {
      fontSize: '18px',
      fill: '#ffd700',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: '#000000',
        blur: 2,
        fill: true
      }
    }).setOrigin(0.5);
    
    // Add entrance animations with adjusted final positions
    titleText.setAlpha(0);
    subtitleText.setAlpha(0);
    titleText.setY(30);
    subtitleText.setY(100);
    
    this.tweens.add({
      targets: titleText,
      alpha: 1,
      y: 60,
      duration: 1000,
      ease: 'Back.easeOut'
    });
    
    this.tweens.add({
      targets: subtitleText,
      alpha: 1,
      y: 110,
      duration: 1000,
      delay: 200,
      ease: 'Back.easeOut'
    });
  }

  createLeaderboardEntries() {
    const leaderboard = this.getLeaderboard();
    let yPos = 220;

    // Simple header row - moved down to avoid overlap with title
    this.add.text(150, 150, 'RANK', {
      fontSize: '20px',
      fill: '#000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(300, 150, 'SCORE', {
      fontSize: '20px',
      fill: '#000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(450, 150, 'LEVEL', {
      fontSize: '20px',
      fill: '#000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(600, 150, 'DATE', {
      fontSize: '20px',
      fill: '#000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Simple separator line - positioned below header
    this.add.line(400, 165, 100, 0, 700, 0, 0x000000, 1).setOrigin(0.5);

    // Show message if no scores
    if (leaderboard.length === 0) {
      this.add.text(GAME_CONFIG.WIDTH / 2, 280, 'No scores yet!\nPlay the game to set a record!', {
        fontSize: '24px',
        fill: '#666',
        fontFamily: 'Arial',
        align: 'center'
      }).setOrigin(0.5);
      return;
    }

    // Adjust starting position for scores to be between header and button
    yPos = 200; // Start scores below the separator line with more spacing

    leaderboard.forEach((entry, index) => {
      const rank = index + 1;
      const medal = this.getMedalForRank(rank);
      
      // Simple rank/medal
      this.add.text(150, yPos, medal, {
        fontSize: '24px',
        fill: '#000',
        fontFamily: 'Arial'
      }).setOrigin(0.5);

      // Simple score
      this.add.text(300, yPos, `${entry.score}`, {
        fontSize: '24px',
        fill: '#000',
        fontFamily: 'Arial'
      }).setOrigin(0.5);

      // Simple level
      this.add.text(450, yPos, `${entry.level || 1}`, {
        fontSize: '24px',
        fill: '#000',
        fontFamily: 'Arial'
      }).setOrigin(0.5);

      // Simple date
      this.add.text(600, yPos, `${entry.date}`, {
        fontSize: '18px',
        fill: '#666',
        fontFamily: 'Arial'
      }).setOrigin(0.5);

      yPos += 40;
    });
  }

  createBackButton() {
    // Modern button styling to match main menu
    const buttonStyle = {
      fontSize: '28px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#4CAF50',
      padding: { x: 30, y: 15 },
      borderRadius: 10,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 4,
        fill: true
      }
    };
    
    const buttonHoverStyle = {
      ...buttonStyle,
      backgroundColor: '#45a049',
      fill: '#ffff00'
    };
    
    const backButton = this.add.text(GAME_CONFIG.WIDTH / 2, 540, '← BACK TO MENU', buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(10);

    // Enhanced button interaction events with smooth animations
    backButton.on('pointerover', () => {
      this.tweens.add({
        targets: backButton,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 150,
        ease: 'Power2'
      });
      backButton.setStyle(buttonHoverStyle);
    });
    
    backButton.on('pointerout', () => {
      this.tweens.add({
        targets: backButton,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Power2'
      });
      backButton.setStyle(buttonStyle);
    });
    
    backButton.on('pointerdown', () => {
      this.tweens.add({
        targets: backButton,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        ease: 'Power2'
      });
      this.scene.start('MainMenuScene');
    });
    
    backButton.on('pointerup', () => {
      this.tweens.add({
        targets: backButton,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
        ease: 'Power2'
      });
    });
  }

  getMedalForRank(rank) {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}.`;
    }
  }

  getLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    return leaderboard.sort((a, b) => b.score - a.score).slice(0, 10); // Keep top 10 for storage
  }

  createClouds() {
    this.clouds = this.add.group();
    
    // Create initial clouds
    for (let i = 0; i < 3; i++) {
      this.spawnCloud();
    }

    // Spawn new clouds periodically
    this.time.addEvent({
      delay: 5000,
      loop: true,
      callback: () => {
        this.spawnCloud();
      }
    });
  }

  spawnCloud() {
    const cloudTypes = ['cloud_small', 'cloud_medium', 'cloud_large'];
    const cloudType = Phaser.Utils.Array.GetRandom(cloudTypes);
    
    // Random position on the right side of screen
    const x = GAME_CONFIG.WIDTH + Phaser.Math.Between(50, 150);
    const y = Phaser.Math.Between(50, 180);
    
    const cloud = this.add.sprite(x, y, cloudType);
    cloud.setDepth(1); // Behind UI elements
    
    // Random speed based on cloud size (increased speeds)
    const speeds = { cloud_small: 0.5, cloud_medium: 0.35, cloud_large: 0.2 };
    const speed = speeds[cloudType];
    
    // Animate cloud movement
    this.tweens.add({
      targets: cloud,
      x: -100,
      duration: 18000 / speed,
      ease: 'Linear',
      onComplete: () => {
        cloud.destroy();
      }
    });
    
    this.clouds.add(cloud);
  }
}

// ============================================================================
// MAIN GAME SCENE
// ============================================================================

class GameScene extends Phaser.Scene {
    constructor() {
      super('GameScene');
    }
  
    preload() {
    // Using generated textures, no external assets to preload
    }
  
    create() {
    this.initializeGameState();
      this.createTextures();
    this.createGameObjects();
    this.setupPhysics();
    this.setupUI();
    this.setupInputHandlers();
    this.setupSpawnTimer();
    this.createBottomUI();
  }

  initializeGameState() {
    // Game state variables
    this.score = parseInt(localStorage.getItem('currentScore')) || 0;
    this.level = 1;
    this.speed = GAME_CONFIG.INITIAL_SPEED;
    this.spawnDelay = GAME_CONFIG.INITIAL_SPAWN_DELAY;
    this.canDoubleJump = true;
    this.gameOver = false;
    this.isPaused = false;
    this.gameStarted = false;
    this.reviveGivenThisLevel = false;
    this.highScore = localStorage.getItem('highScore') || 0;
    this.lastSpawnedObstacle = null; // Track the last spawned obstacle for coin placement

    // Power-ups system
    this.powerUps = {
      revive: false
    };
    this.powerUpTimer = null;
  }

  createGameObjects() {
    // Create ground
      this.ground = this.physics.add.staticGroup();
    this.ground.create(GAME_CONFIG.WIDTH / 2, GAME_CONFIG.GROUND_Y, 'ground');

    // Create player
    this.player = this.physics.add.sprite(GAME_CONFIG.PLAYER_START_X, GAME_CONFIG.PLAYER_START_Y, 'player');
    this.player.setCollideWorldBounds(true).setBounce(GAME_CONFIG.PLAYER_BOUNCE);

    // Create object groups
      this.obstacles = this.physics.add.group();
      this.coins = this.physics.add.group();
  
    // Start global cloud manager
    globalCloudManager.start(this);
  }

  setupPhysics() {
    // Player collisions
    this.physics.add.collider(this.player, this.ground);
    
    // Object collisions with ground
      this.physics.add.collider(this.obstacles, this.ground);
      this.physics.add.collider(this.coins, this.ground);
  
    // Player overlaps
      this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);
      this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
  }

  setupUI() {
    // Score and game info
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { 
      fontSize: '24px', 
      fill: '#000', 
      fontFamily: 'Arial' 
    }).setDepth(5);

    this.highScoreText = this.add.text(16, 44, `High Score: ${this.highScore}`, { 
      fontSize: '18px', 
      fill: '#444', 
      fontFamily: 'Arial' 
    }).setDepth(5);

    this.levelText = this.add.text(16, 72, 'Level: 1', { 
      fontSize: '18px', 
      fill: '#444', 
      fontFamily: 'Arial' 
    }).setDepth(5);

    this.powerUpText = this.add.text(16, 100, 'Power Up: None', { 
      fontSize: '18px', 
      fill: '#444', 
      fontFamily: 'Arial' 
    }).setDepth(5);

    // Game state messages
    this.pauseText = this.add.text(GAME_CONFIG.WIDTH / 2, 150, '', { 
      fontSize: '48px', 
      fill: '#f00', 
      fontFamily: 'Arial' 
    }).setOrigin(0.5).setDepth(5);

    this.gameOverText = this.add.text(GAME_CONFIG.WIDTH / 2, 200, 'GAME OVER\nTap Restart Button', {
        fontSize: '32px',
        fill: '#f00',
        align: 'center',
        fontFamily: 'Arial'
      }).setOrigin(0.5).setAlpha(0).setDepth(10);
  
    // Pause physics initially
      this.physics.pause();
  }
  
  setupInputHandlers() {
    // Keyboard controls
      this.input.keyboard.on('keydown-SPACE', () => {
        if (!this.gameStarted) this.startGame();
        else if (this.gameOver && !this.powerUps.revive) this.restartGame();
        else if (!this.isPaused) this.jump();
      });
  
      this.input.keyboard.on('keydown-P', () => {
        if (this.gameStarted && !this.gameOver) this.togglePause();
      });
  }
  
  setupSpawnTimer() {
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
    }
  
    createBottomUI() {
    const uiHeight = UI_CONFIG.UI_PANEL_HEIGHT;
    const panelY = GAME_CONFIG.HEIGHT - uiHeight / 2;

    // Create UI panel background
    this.uiPanel = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2, 
      panelY, 
      GAME_CONFIG.WIDTH, 
      uiHeight, 
      0x222222, 
      0.8
    ).setDepth(8);
      this.uiPanel.setStrokeStyle(2, 0xffffff, 0.5);
  
    // Button creation helper
      const createBtn = (x, text, callback) => {
      const btn = this.add.text(x, panelY, text, UI_CONFIG.BUTTON_STYLE)
        .setOrigin(0.5)
        .setInteractive()
        .setDepth(10);
  
      // Button interaction events
        btn.on('pointerover', () => btn.setStyle({ fill: '#ff0', backgroundColor: '#666' }));
        btn.on('pointerout', () => btn.setStyle({ fill: '#fff', backgroundColor: '#444' }));
        btn.on('pointerdown', () => {
          btn.setStyle({ fill: '#0f0', backgroundColor: '#222' });
          callback();
        });
      btn.on('pointerup', () => btn.setStyle({ fill: '#fff', backgroundColor: '#444' }));
  
        return btn;
      };
  
    // Calculate button positions with gaps
    const totalWidth = GAME_CONFIG.WIDTH;
    const buttonWidth = UI_CONFIG.BUTTON_WIDTH;
    const gap = UI_CONFIG.BUTTON_GAP;
    const totalButtonWidth = 5 * buttonWidth + 4 * gap;
    const startX = (totalWidth - totalButtonWidth) / 2 + buttonWidth / 2;

    // Create all buttons
    this.startBtn = createBtn(startX, '▶️ START', () => {
        if (!this.gameStarted) this.startGame();
      });
  
    this.jumpBtn = createBtn(startX + buttonWidth + gap, '🚀 JUMP', () => {
        if (this.gameStarted && !this.gameOver && !this.isPaused) this.jump();
      });
      this.jumpBtn.setVisible(false);
  
    this.pauseBtn = createBtn(startX + (buttonWidth + gap) * 2, '⏸ PAUSE', () => {
        if (this.gameStarted && !this.gameOver) this.togglePause();
      });
      this.pauseBtn.setVisible(false);
  
    this.restartBtn = createBtn(startX + (buttonWidth + gap) * 3, '🔄 RESTART', () => {
        if (this.gameOver && !this.powerUps.revive) this.restartGame();
      });
      this.restartBtn.setVisible(false);
  
    this.reviveBtn = createBtn(startX + buttonWidth + gap, '❤️ REVIVE', () => {
        if (this.gameOver && this.powerUps.revive) this.useRevive();
      });
      this.reviveBtn.setVisible(false);

    this.menuBtn = createBtn(startX + (buttonWidth + gap) * 4, '🏠 MENU', () => {
      this.scene.start('MainMenuScene');
    });
  }

  update() {
    if (!this.gameStarted || this.gameOver || this.isPaused) return;

    // Increase game speed over time
    this.speed += GAME_CONFIG.SPEED_INCREMENT;

    // Check for level up
    const newLevel = Math.floor(this.score / GAME_CONFIG.SCORE_PER_LEVEL) + 1;
    if (newLevel > this.level) this.levelUp(newLevel);

    // Update obstacles
    this.obstacles.children.iterate(obstacle => {
      if (obstacle && obstacle.x < -50) {
        obstacle.destroy();
      } else if (obstacle) {
        obstacle.body.setVelocityX(-this.speed);
        if (obstacle.rotationSpeed) obstacle.rotation += obstacle.rotationSpeed;
      }
    });

    // Update coins
    this.coins.children.iterate(coin => {
      if (coin && coin.x < -50) {
        coin.destroy();
      } else if (coin) {
        coin.body.setVelocityX(-this.speed);
      }
    });

    // Reset double jump when touching ground
    if (this.player.body.touching.down) this.canDoubleJump = true;
    }
  
    startGame() {
      this.gameStarted = true;
    this.score = 0;
    localStorage.setItem('currentScore', 0);
    this.scoreText.setText('Score: 0');
    
    this.updateButtonVisibility();
      this.gameOverText.setAlpha(0);
      this.physics.resume();
      this.spawnTimer.paused = false;
      this.pauseText.setText('');
      this.powerUpText.setText('Power Up: None');
      this.powerUps.revive = false;
    
    if (this.powerUpTimer) {
        this.powerUpTimer.remove();
        this.powerUpTimer = null;
      }
    }
  
    jump() {
      if (this.player.body.touching.down) {
      this.player.setVelocityY(GAME_CONFIG.JUMP_VELOCITY);
        this.canDoubleJump = true;
      } else if (this.canDoubleJump) {
      this.player.setVelocityY(GAME_CONFIG.DOUBLE_JUMP_VELOCITY);
        this.canDoubleJump = false;
      }
    }
  
    hitObstacle() {
      if (this.powerUps.revive) {
      this.handleReviveGameOver();
    } else {
      this.handleNormalGameOver();
    }
  }

  handleReviveGameOver() {
        this.gameOver = true;
        this.player.setTint(0xff0000);
        this.physics.pause();
        this.spawnTimer.paused = true;
  
        this.jumpBtn.setVisible(false);
        this.pauseBtn.setVisible(false);
        this.restartBtn.setVisible(false);
        this.reviveBtn.setVisible(true);
    this.menuBtn.setVisible(true);
  
        this.gameOverText.setAlpha(1);
  }

  handleNormalGameOver() {
        this.gameOver = true;
        this.player.setTint(0xff0000);
        this.physics.pause();
        this.spawnTimer.paused = true;
  
    // Save score to leaderboard
    this.saveScoreToLeaderboard();

    // Update high score if needed
        if (this.score > this.highScore) {
          this.highScore = this.score;
          localStorage.setItem('highScore', this.highScore);
      this.highScoreText.setText(`High Score: ${this.highScore}`);
        }
  
        this.gameOverText.setAlpha(1);
        this.restartBtn.setVisible(true);
        this.jumpBtn.setVisible(false);
        this.pauseBtn.setVisible(false);
        this.reviveBtn.setVisible(false);
    this.menuBtn.setVisible(true);
        this.powerUpText.setText('Power Up: None');
        this.powerUps.revive = false;
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
    this.menuBtn.setVisible(true);
      this.powerUpText.setText('Power Up: None');
  
      this.player.clearTint();
    this.player.setPosition(GAME_CONFIG.PLAYER_START_X, 200);
      this.player.setVelocity(0, 0);
  
      this.physics.resume();
      this.spawnTimer.paused = false;
    }
  
      spawnObstacle() {
    const shapes = ['obstacle_rect', 'obstacle_star', 'obstacle_triangle', 'obstacle_circle'];
    const shape = Phaser.Utils.Array.GetRandom(shapes);
    const obstacle = this.obstacles.create(GAME_CONFIG.OBSTACLE_SPAWN_X, GAME_CONFIG.OBSTACLE_Y, shape);

    obstacle.setImmovable(true);
    obstacle.body.allowGravity = false;

    // Add rotation animation for certain shapes
    if (shape === 'obstacle_star' || shape === 'obstacle_triangle') {
      obstacle.rotationSpeed = Phaser.Math.FloatBetween(0.02, 0.05);
    } else {
      obstacle.rotationSpeed = 0;
    }

    // Add pulsating animation for triangle
    if (shape === 'obstacle_triangle') {
      obstacle.pulseTween = this.tweens.add({
        targets: obstacle,
        scaleX: 1.1,
        scaleY: 1.1,
        yoyo: true,
        repeat: -1,
        duration: 800
      });
    }

    obstacle.body.setVelocityX(-this.speed);
    
    // Store reference to this obstacle for coin placement
    this.lastSpawnedObstacle = obstacle;
  }
  
      spawnCoin() {
    // Place coin on top of the last spawned obstacle
    let coinY;
    
    if (this.lastSpawnedObstacle) {
      // Place coin on top of the obstacle with some variation
      const obstacleTop = this.lastSpawnedObstacle.y - 15; // 15 is half the obstacle height
      const variation = Phaser.Math.Between(-5, 5); // Small random variation
      
      // Adjust height based on obstacle type
      let heightOffset = 35; // Default height above obstacle
      
      // Check if it's a rectangular obstacle (which is taller)
      if (this.lastSpawnedObstacle.texture.key === 'obstacle_rect') {
        heightOffset = 50; // More height for rectangular obstacles
      }
      
      coinY = obstacleTop - heightOffset - variation;
    } else {
      // Fallback to random position if no obstacle
      coinY = Phaser.Math.Between(GAME_CONFIG.COIN_MIN_Y, GAME_CONFIG.COIN_MAX_Y);
    }

    // Spawn revive coin with 20% chance if not given this level
    if (!this.reviveGivenThisLevel && Phaser.Math.Between(1, 100) <= GAME_CONFIG.REVIVE_CHANCE) {
      const coin = this.coins.create(GAME_CONFIG.COIN_SPAWN_X, coinY, 'coin_revive');
      coin.setImmovable(true);
      coin.body.allowGravity = false;
      coin.body.setVelocityX(-this.speed);

      this.reviveGivenThisLevel = true;

      // Add bouncing animation
      coin.bounceTween = this.tweens.add({
        targets: coin,
        y: coinY - 10,
        yoyo: true,
        duration: 400,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      return;
    }

    // Spawn regular coin
    const coin = this.coins.create(GAME_CONFIG.COIN_SPAWN_X, coinY, 'coin');
    coin.setImmovable(true);
    coin.body.allowGravity = false;
    coin.body.setVelocityX(-this.speed);
    
    // Add subtle floating animation for regular coins
    coin.floatTween = this.tweens.add({
      targets: coin,
      y: coinY - 5,
      yoyo: true,
      duration: 600,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
    togglePause() {
      this.isPaused = !this.isPaused;
    
      if (this.isPaused) {
        this.physics.pause();
        this.pauseText.setText('PAUSED');
        this.spawnTimer.paused = true;
      globalCloudManager.pause();
      } else {
        this.physics.resume();
        this.pauseText.setText('');
        this.spawnTimer.paused = false;
      globalCloudManager.resume();
      }
    }
  
      restartGame() {
    this.gameOver = false;
    this.score = 0;
    localStorage.setItem('currentScore', 0);
    this.level = 1;
    this.speed = GAME_CONFIG.INITIAL_SPEED;
    this.spawnDelay = GAME_CONFIG.INITIAL_SPAWN_DELAY;
    this.canDoubleJump = true;
    this.lastSpawnedObstacle = null; // Reset obstacle tracking

    // Reset player
    this.player.clearTint();
    this.player.setPosition(GAME_CONFIG.PLAYER_START_X, GAME_CONFIG.PLAYER_START_Y);
    this.player.setVelocity(0, 0);

    // Clear objects
    this.obstacles.clear(true, true);
    this.coins.clear(true, true);

    // Update UI
    this.scoreText.setText('Score: 0');
    this.levelText.setText('Level: 1');
    this.pauseText.setText('');
    this.gameOverText.setAlpha(0);
    this.powerUpText.setText('Power Up: None');

    this.updateButtonVisibility();
    this.powerUps.revive = false;
    
    if (this.powerUpTimer) {
      this.powerUpTimer.remove();
      this.powerUpTimer = null;
    }

    this.physics.resume();
    this.spawnTimer.paused = false;
    this.spawnTimer.delay = this.spawnDelay;
  }
  
    collectCoin(player, coin) {
      coin.destroy();
    this.score += GAME_CONFIG.SCORE_PER_COIN;
    this.scoreText.setText(`Score: ${this.score}`);
  
    // Save current score to localStorage
    localStorage.setItem('currentScore', this.score);

    // Update high score if needed
      if (this.score > this.highScore) {
        this.highScore = this.score;
      localStorage.setItem('highScore', this.highScore);
      this.highScoreText.setText(`High Score: ${this.highScore}`);
      }
  
    // Check for revive coin
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
    this.levelText.setText(`Level: ${this.level}`);
    this.speed += GAME_CONFIG.LEVEL_SPEED_BONUS * (this.level - 1);
    this.spawnDelay = Math.max(GAME_CONFIG.MIN_SPAWN_DELAY, 
      GAME_CONFIG.INITIAL_SPAWN_DELAY - (this.level - 1) * GAME_CONFIG.SPAWN_DELAY_REDUCTION);
      this.spawnTimer.delay = this.spawnDelay;
      this.reviveGivenThisLevel = false;
    }

  saveScoreToLeaderboard() {
    if (this.score <= 0) return;
    
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const newEntry = {
      score: this.score,
      date: new Date().toLocaleDateString(),
      level: this.level
    };
    
    leaderboard.push(newEntry);
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 10 scores
    const topScores = leaderboard.slice(0, 10);
    localStorage.setItem('leaderboard', JSON.stringify(topScores));
  }

  updateButtonVisibility() {
    this.startBtn.setVisible(false);
    this.jumpBtn.setVisible(true);
    this.pauseBtn.setVisible(true);
    this.restartBtn.setVisible(false);
    this.reviveBtn.setVisible(false);
    this.menuBtn.setVisible(true);
  }
  
    createTextures() {
      const gfx = this.make.graphics({ x: 0, y: 0, add: false });
  
    // Player texture (red square)
    gfx.clear(); 
    gfx.fillStyle(0xff0000, 1); 
    gfx.fillRect(0, 0, 32, 32); 
    gfx.generateTexture('player', 32, 32);

    // Ground texture (green rectangle)
    gfx.clear(); 
    gfx.fillStyle(0x228b22, 1); 
    gfx.fillRect(0, 0, 800, 40); 
    gfx.generateTexture('ground', 800, 40);

    // Obstacle textures
    gfx.clear(); 
    gfx.fillStyle(0x000000, 1); 
    gfx.fillRect(0, 0, 30, 30); 
    gfx.generateTexture('obstacle_rect', 30, 30);

    // Star obstacle
    gfx.clear(); 
    gfx.fillStyle(0xffd700, 1);
      this.drawStar(gfx, 15, 15, 5, 15, 7);
      gfx.generateTexture('obstacle_star', 30, 30);
  
    // Triangle obstacle
    gfx.clear(); 
    gfx.fillStyle(0x800080, 1);
      this.drawTriangle(gfx, 30, 30);
      gfx.generateTexture('obstacle_triangle', 30, 30);
  
    // Circle obstacle
    gfx.clear(); 
    gfx.fillStyle(0x0000ff, 1);
      gfx.fillCircle(15, 15, 15);
      gfx.generateTexture('obstacle_circle', 30, 30);
  
    // Regular coin
    gfx.clear(); 
    gfx.fillStyle(0xffd700, 1); 
    gfx.fillRect(0, 0, 20, 20); 
    gfx.generateTexture('coin', 20, 20);

    // Revive coin (pink diamond)
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

// ============================================================================
// GLOBAL CLOUD MANAGER
// ============================================================================

class CloudManager {
  constructor() {
    this.clouds = [];
    this.isActive = false;
  }

  start(scene) {
    this.scene = scene;
    this.isActive = true;
    this.createCloudTextures();
    this.spawnInitialClouds();
    this.startSpawning();
  }

  stop() {
    this.isActive = false;
    this.clouds.forEach(cloud => {
      if (cloud.tween) cloud.tween.stop();
      if (cloud.sprite) cloud.sprite.destroy();
    });
    this.clouds = [];
  }

  createCloudTextures() {
    const gfx = this.scene.make.graphics({ x: 0, y: 0, add: false });

    // Small cloud
    gfx.clear();
    gfx.fillStyle(0xffffff, 0.8);
    gfx.fillCircle(20, 15, 12);
    gfx.fillCircle(35, 15, 15);
    gfx.fillCircle(50, 15, 12);
    gfx.fillCircle(32, 8, 10);
    gfx.generateTexture('cloud_small', 60, 30);

    // Medium cloud
    gfx.clear();
    gfx.fillStyle(0xffffff, 0.7);
    gfx.fillCircle(25, 20, 15);
    gfx.fillCircle(45, 20, 18);
    gfx.fillCircle(65, 20, 15);
    gfx.fillCircle(40, 10, 12);
    gfx.fillCircle(55, 12, 10);
    gfx.generateTexture('cloud_medium', 80, 40);

    // Large cloud
    gfx.clear();
    gfx.fillStyle(0xffffff, 0.6);
    gfx.fillCircle(30, 25, 18);
    gfx.fillCircle(55, 25, 22);
    gfx.fillCircle(80, 25, 18);
    gfx.fillCircle(45, 12, 15);
    gfx.fillCircle(65, 15, 12);
    gfx.fillCircle(35, 8, 10);
    gfx.generateTexture('cloud_large', 100, 50);
  }

  spawnInitialClouds() {
    const count = this.scene.constructor.name === 'GameScene' ? 5 : 
                  this.scene.constructor.name === 'MainMenuScene' ? 4 : 3;
    
    for (let i = 0; i < count; i++) {
      this.spawnCloud();
    }
  }

  startSpawning() {
    const delay = this.scene.constructor.name === 'GameScene' ? 3000 : 
                  this.scene.constructor.name === 'MainMenuScene' ? 4000 : 5000;
    
    this.spawnTimer = this.scene.time.addEvent({
      delay: delay,
      loop: true,
      callback: () => {
        if (this.isActive) {
          this.spawnCloud();
        }
      }
    });
  }

  spawnCloud() {
    const cloudTypes = ['cloud_small', 'cloud_medium', 'cloud_large'];
    const cloudType = Phaser.Utils.Array.GetRandom(cloudTypes);
    
    // Random position on the right side of screen
    const x = GAME_CONFIG.WIDTH + Phaser.Math.Between(50, 150);
    const y = Phaser.Math.Between(50, 200);
    
    const cloud = this.scene.add.sprite(x, y, cloudType);
    cloud.setDepth(1);
    
    // Speed based on scene and cloud size
    let speeds;
    if (this.scene.constructor.name === 'GameScene') {
      speeds = { cloud_small: 0.7, cloud_medium: 0.5, cloud_large: 0.3 };
    } else if (this.scene.constructor.name === 'MainMenuScene') {
      speeds = { cloud_small: 0.6, cloud_medium: 0.4, cloud_large: 0.25 };
    } else {
      speeds = { cloud_small: 0.5, cloud_medium: 0.35, cloud_large: 0.2 };
    }
    
    const speed = speeds[cloudType];
    const duration = this.scene.constructor.name === 'GameScene' ? 12000 : 
                    this.scene.constructor.name === 'MainMenuScene' ? 15000 : 18000;
    
    // Animate cloud movement
    const tween = this.scene.tweens.add({
      targets: cloud,
      x: -100,
      duration: duration / speed,
      ease: 'Linear',
      onComplete: () => {
        cloud.destroy();
        this.clouds = this.clouds.filter(c => c.sprite !== cloud);
      }
    });
    
    this.clouds.push({ sprite: cloud, tween: tween });
  }

  pause() {
    this.clouds.forEach(cloud => {
      if (cloud.tween) cloud.tween.pause();
    });
  }

  resume() {
    this.clouds.forEach(cloud => {
      if (cloud.tween) cloud.tween.resume();
    });
  }
}

// Global cloud manager instance
const globalCloudManager = new CloudManager();

// ============================================================================
// GAME CONFIGURATION AND INITIALIZATION
// ============================================================================
  
  const config = {
    type: Phaser.AUTO,
  width: GAME_CONFIG.WIDTH,
  height: GAME_CONFIG.HEIGHT,
  backgroundColor: GAME_CONFIG.BACKGROUND_COLOR,
    physics: {
      default: 'arcade',
    arcade: { 
      gravity: { y: GAME_CONFIG.GRAVITY }, 
      debug: false 
    }
    },
  scene: [MainMenuScene, LeaderboardScene, GameScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    }
  };
  
// Initialize the game
  new Phaser.Game(config);
  
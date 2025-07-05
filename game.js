// ============================================================================
// ENDLESS RUNNER GAME - Phaser 3 Implementation
// ============================================================================
// A complete endless runner game built with Phaser 3 featuring:
// - Player movement with jumping mechanics and physics
// - Procedurally generated obstacles and collectible coins
// - Comprehensive scoring system with persistent high scores
// - Dynamic level progression with increasing difficulty
// - Power-up system with revive functionality
// - Ad integration with detailed statistics tracking
// - Multiple scenes: Main Menu, Game, Settings, Leaderboard, Statistics
// - Animated backgrounds with dynamic cloud system
// - Mobile-responsive design with orientation support
// - Fullscreen and display settings management
// - Professional UI/UX with modern styling
// ============================================================================

// ============================================================================
// GAME CONFIGURATION CONSTANTS
// ============================================================================
// Centralized configuration for all game parameters
// Makes it easy to adjust game balance and behavior
const GAME_CONFIG = {
  // Display settings
  WIDTH: 800,                    // Canvas width in pixels
  HEIGHT: 600,                   // Canvas height in pixels
  BACKGROUND_COLOR: '#87ceeb',   // Sky blue background color
  
  // Physics settings
  GRAVITY: 800,                  // Gravity strength for player falling
  PLAYER_BOUNCE: 0.1,            // Bounce factor when player hits ground
  
  // Player positioning
  PLAYER_START_X: 100,           // Initial player X position
  PLAYER_START_Y: 300,           // Initial player Y position
  GROUND_Y: 520,                 // Y position of the ground surface
  
  // Obstacle and coin spawning
  OBSTACLE_SPAWN_X: 800,         // X position where obstacles spawn (off-screen right)
  OBSTACLE_Y: 490,               // Y position where obstacles are placed
  COIN_SPAWN_X: 800,             // X position where coins spawn (off-screen right)
  COIN_MIN_Y: 340,               // Minimum Y position for coin spawning
  COIN_MAX_Y: 400,               // Maximum Y position for coin spawning
  
  // Game progression settings
  INITIAL_SPEED: 150,            // Starting speed of obstacles and coins (reduced for easier start)
  INITIAL_SPAWN_DELAY: 1500,     // Initial delay between obstacle spawns (ms)
  SPEED_INCREMENT: 0.005,        // How much speed increases per frame
  LEVEL_SPEED_BONUS: 20,         // Speed bonus when leveling up
  SPAWN_DELAY_REDUCTION: 150,    // How much spawn delay decreases per level
  MIN_SPAWN_DELAY: 500,          // Minimum spawn delay (prevents impossible gameplay)
  
  // Scoring system
  SCORE_PER_COIN: 10,            // Points awarded for collecting a coin
  SCORE_PER_LEVEL: 100,          // Bonus points for reaching a new level
  
  // Power-up settings
  REVIVE_CHANCE: 20,             // Percentage chance to get a revive coin
  
  // Player movement
  JUMP_VELOCITY: -420,           // Initial jump velocity (negative = upward)
  DOUBLE_JUMP_VELOCITY: -360     // Velocity for double jump (slightly weaker)
};

// ============================================================================
// UI CONFIGURATION CONSTANTS
// ============================================================================
// Defines styling and layout for all user interface elements
// Ensures consistent appearance across all scenes
const UI_CONFIG = {
  // Standard button styling for most UI buttons
  BUTTON_STYLE: {
    fontSize: '22px',             // Button text size
    fill: '#fff',                 // Text color (white)
    backgroundColor: '#444',      // Button background (dark gray)
    padding: { x: 25, y: 12 },    // Internal padding for button size
    align: 'center',              // Text alignment
    fontFamily: 'Arial',          // Font family
    stroke: '#000',               // Text outline color (black)
    strokeThickness: 2,           // Text outline thickness
    shadow: {                     // Drop shadow for depth
      offsetX: 2,                 // Shadow X offset
      offsetY: 2,                 // Shadow Y offset
      color: '#000',              // Shadow color (black)
      blur: 3,                    // Shadow blur radius
      stroke: true,               // Apply shadow to text outline
      fill: true                  // Apply shadow to text fill
    }
  },
  
  // Larger button styling for main menu buttons
  MENU_BUTTON_STYLE: {
    fontSize: '26px',             // Larger text for menu buttons
    fill: '#fff',                 // Text color (white)
    backgroundColor: '#444',      // Button background (dark gray)
    padding: { x: 25, y: 12 },    // Internal padding
    align: 'center',              // Text alignment
    fontFamily: 'Arial',          // Font family
    stroke: '#000',               // Text outline color (black)
    strokeThickness: 2,           // Text outline thickness
    shadow: {                     // Drop shadow for depth
      offsetX: 2,                 // Shadow X offset
      offsetY: 2,                 // Shadow Y offset
      color: '#000',              // Shadow color (black)
      blur: 3,                    // Shadow blur radius
      stroke: true,               // Apply shadow to text outline
      fill: true                  // Apply shadow to text fill
    }
  },
  
  // Layout constants
  BUTTON_WIDTH: 110,              // Standard button width in pixels
  BUTTON_GAP: 35,                 // Gap between buttons in pixels
  UI_PANEL_HEIGHT: 70             // Height of UI panels in pixels
};

// ============================================================================
// MAIN MENU SCENE
// ============================================================================
// The main entry point and first scene users encounter
// Features:
// - Animated title with modern styling and entrance effects
// - Persistent high score display from localStorage
// - Navigation buttons to all game sections
// - Game instructions and controls overview
// - Dynamic cloud background system
// - Responsive layout with proper spacing
// ============================================================================

class MainMenuScene extends Phaser.Scene {
  /**
   * Constructor for the main menu scene
   * Sets up the scene name for navigation between scenes
   */
  constructor() {
    super('MainMenuScene');
  }

  /**
   * Main create method called when the scene starts
   * Initializes all visual elements in the correct order for proper layering
   * Background → Clouds → Title → High Score → Buttons → Instructions
   */
  create() {
    this.createBackground();        // Create the sky blue background
    globalCloudManager.start(this); // Start animated cloud system
    this.createTitle();             // Create animated title and subtitle
    this.createHighScoreDisplay();  // Show persistent high score
    this.createButtons();           // Create navigation buttons
    this.createInstructions();      // Add game instructions
  }

  /**
   * Creates the sky blue background for the main menu
   * Uses a simple rectangle that covers the entire canvas
   */
  createBackground() {
    this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,    // Center X position
      GAME_CONFIG.HEIGHT / 2,   // Center Y position
      GAME_CONFIG.WIDTH,        // Full width
      GAME_CONFIG.HEIGHT,       // Full height
      0x87ceeb                  // Sky blue color (hex)
    );
  }

  /**
   * Creates the animated title and subtitle
   * Features modern styling with shadows and entrance animations
   */
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
    const playButton = this.add.text(startX, 280, '🎮 PLAY GAME', {
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
    const leaderboardButton = this.add.text(startX + buttonWidth + gap, 280, '🏆 LEADERBOARD', {
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
    
    // Settings Button - positioned below the main buttons
    const settingsButton = this.add.text(GAME_CONFIG.WIDTH / 2, 340, '⚙️ SETTINGS', {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#2196F3',
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

    // Settings button interaction events
    settingsButton.on('pointerover', () => {
      this.tweens.add({
        targets: settingsButton,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 150,
        ease: 'Power2'
      });
      settingsButton.setStyle({ 
        fill: '#ffff00', 
        backgroundColor: '#1976D2' 
      });
    });
    
    settingsButton.on('pointerout', () => {
      this.tweens.add({
        targets: settingsButton,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Power2'
      });
      settingsButton.setStyle({ 
        fill: '#ffffff', 
        backgroundColor: '#2196F3' 
      });
    });
    
    settingsButton.on('pointerdown', () => {
      this.tweens.add({
        targets: settingsButton,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        ease: 'Power2'
      });
      this.scene.start('SettingsScene');
    });
    
    settingsButton.on('pointerup', () => {
      this.tweens.add({
        targets: settingsButton,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
        ease: 'Power2'
      });
    });
    
    // Add entrance animations for buttons
    playButton.setAlpha(0);
    leaderboardButton.setAlpha(0);
    settingsButton.setAlpha(0);
    playButton.setY(260);
    leaderboardButton.setY(260);
    settingsButton.setY(320);
    
    this.tweens.add({
      targets: playButton,
      alpha: 1,
      y: 280,
      duration: 800,
      delay: 900,
      ease: 'Back.easeOut'
    });
    
    this.tweens.add({
      targets: leaderboardButton,
      alpha: 1,
      y: 280,
      duration: 800,
      delay: 1100,
      ease: 'Back.easeOut'
    });
    
    this.tweens.add({
      targets: settingsButton,
      alpha: 1,
      y: 340,
      duration: 800,
      delay: 1300,
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
}

// ============================================================================
// SETTINGS SCENE
// ============================================================================
// Comprehensive settings and configuration management
// Features:
// - Username editing with canvas-based input system
// - Ad preferences (enable/disable with statistics tracking)
// - Display settings (fullscreen, orientation controls)
// - Leaderboard management (clear all scores)
// - Statistics viewing and analytics
// - Persistent data storage in localStorage
// - Mobile-responsive design with orientation detection
// ============================================================================

class SettingsScene extends Phaser.Scene {
  /**
   * Constructor for the settings scene
   * Sets up the scene name for navigation between scenes
   */
  constructor() {
    super('SettingsScene');
  }

  /**
   * Main create method called when the scene starts
   * Initializes all visual elements in the correct order for proper layering
   * Background → Clouds → Title → Settings → Back Button
   */
  create() {
    this.createBackground();        // Create the sky blue background
    globalCloudManager.start(this); // Start animated cloud system
    this.createTitle();             // Create animated title
    this.createSettings();          // Create all settings sections
    this.createBackButton();        // Create navigation back button
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
    // Main title with modern styling
    const titleText = this.add.text(GAME_CONFIG.WIDTH / 2, 80, '⚙️ SETTINGS', {
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

    // Add entrance animation
    titleText.setAlpha(0);
    titleText.setY(30);
    
    this.tweens.add({
      targets: titleText,
      alpha: 1,
      y: 80,
      duration: 1000,
      ease: 'Back.easeOut'
    });
  }

  createSettings() {
    // Get current settings
    const currentUsername = localStorage.getItem('username') || '';
    const showAds = localStorage.getItem('showAds') !== 'false'; // Default to true

    // Username section
    this.add.text(GAME_CONFIG.WIDTH / 2, 150, '👤 USERNAME', {
      fontSize: '24px',
      fill: '#000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Username input background - positioned to the left
    const usernameBg = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2 - 100, 
      200, 
      200, 
      40, 
      0xffffff, 
      0.9
    ).setStrokeStyle(2, 0x000000, 0.3);

    // Username text display with input functionality
    this.usernameText = this.add.text(GAME_CONFIG.WIDTH / 2 - 100, 200, currentUsername || 'Click to enter name...', {
      fontSize: '16px',
      fill: currentUsername ? '#000' : '#666',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);

    // Make the entire username background clickable
    usernameBg.setInteractive({ useHandCursor: true });
    usernameBg.on('pointerdown', () => {
      this.startUsernameInput();
    });

    // Change username button - positioned to the right
    const changeUsernameButton = this.add.text(GAME_CONFIG.WIDTH / 2 + 100, 200, '✏️ CHANGE', {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#FF9800',
      padding: { x: 20, y: 8 },
      borderRadius: 8
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Change button interaction
    changeUsernameButton.on('pointerdown', () => {
      this.startUsernameInput();
    });

    // Display settings section - moved above ads
    this.add.text(GAME_CONFIG.WIDTH / 2, 260, '🖥️ DISPLAY SETTINGS', {
      fontSize: '24px',
      fill: '#000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Calculate button position for centered fullscreen button
    const buttonWidth = 200; // Slightly wider for better appearance
    const startX = GAME_CONFIG.WIDTH / 2; // Center of screen

    // Fullscreen button - centered
    const fullscreenButtonText = this.isFullscreenSupported() ? '🔍 ENTER FULLSCREEN' : '🔍 FULLSCREEN NOT SUPPORTED';
    const fullscreenButtonColor = this.isFullscreenSupported() ? '#9C27B0' : '#666666';
    
    const fullscreenButton = this.add.text(startX, 320, fullscreenButtonText, {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: fullscreenButtonColor,
      padding: { x: 20, y: 10 },
      borderRadius: 8
    }).setOrigin(0.5).setInteractive({ useHandCursor: this.isFullscreenSupported() });

    // Fullscreen button interaction
    fullscreenButton.on('pointerdown', () => {
      if (this.isFullscreenSupported()) {
        this.toggleFullscreen(fullscreenButton);
      } else {
        this.showFullscreenNotSupportedMessage();
      }
    });

    // Add event listeners for automatic button text updates
    this.addOrientationListeners(fullscreenButton, null);

    // Initialize button text based on current state
    this.initializeButtonStates(fullscreenButton, null);

    // Ads section - moved below display settings
    this.add.text(GAME_CONFIG.WIDTH / 2, 380, '📺 ADS SETTINGS', {
      fontSize: '24px',
      fill: '#000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Calculate button positions for ads section
    const adsButtonWidth = 160;
    const adsGap = 40;
    const adsTotalWidth = adsButtonWidth * 3 + adsGap * 2; // 3 buttons for ads
    const adsStartX = (GAME_CONFIG.WIDTH - adsTotalWidth) / 2 + adsButtonWidth / 2;

    // Enable ads button - left side
    const enableAdsButton = this.add.text(adsStartX, 440, '✅ ENABLE ADS', {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: showAds ? '#4CAF50' : '#666',
      padding: { x: 15, y: 8 },
      borderRadius: 8
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Disable ads button - right side
    const disableAdsButton = this.add.text(adsStartX + adsButtonWidth + adsGap, 440, '❌ DISABLE ADS', {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: !showAds ? '#f44336' : '#666',
      padding: { x: 15, y: 8 },
      borderRadius: 8
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Statistics button - third position
    const statsButton = this.add.text(adsStartX + (adsButtonWidth + adsGap) * 2, 440, '📊 STATISTICS', {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#4CAF50',
      padding: { x: 15, y: 8 },
      borderRadius: 8
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Enable ads button interaction
    enableAdsButton.on('pointerdown', () => {
      localStorage.setItem('showAds', 'true');
      enableAdsButton.setStyle({ backgroundColor: '#4CAF50' });
      disableAdsButton.setStyle({ backgroundColor: '#666' });
    });

    // Disable ads button interaction
    disableAdsButton.on('pointerdown', () => {
      localStorage.setItem('showAds', 'false');
      disableAdsButton.setStyle({ backgroundColor: '#f44336' });
      enableAdsButton.setStyle({ backgroundColor: '#666' });
    });

    // Statistics button interaction
    statsButton.on('pointerdown', () => {
      this.scene.start('StatisticsScene');
    });

    // Clear leaderboard section
    this.add.text(GAME_CONFIG.WIDTH / 2, 500, '🗑️ CLEAR LEADERBOARD', {
      fontSize: '24px',
      fill: '#000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Clear leaderboard button
    const clearLeaderboardButton = this.add.text(GAME_CONFIG.WIDTH / 2, 560, '🗑️ CLEAR ALL SCORES', {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#f44336',
      padding: { x: 20, y: 10 },
      borderRadius: 8
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Test ad button - positioned at top right
    const testAdButton = this.add.text(GAME_CONFIG.WIDTH - 20, 20, '📺 TEST AD', {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#2196F3',
      padding: { x: 15, y: 8 },
      borderRadius: 6
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

    // Test ad button interaction
    testAdButton.on('pointerdown', () => {
      this.showTestAdPopup();
    });

    // Clear leaderboard button interaction
    clearLeaderboardButton.on('pointerdown', () => {
      this.showClearConfirmation(clearLeaderboardButton);
    });

    // Add entrance animations for main elements
    const elementsToAnimate = [usernameBg, this.usernameText, changeUsernameButton, enableAdsButton, disableAdsButton, statsButton, clearLeaderboardButton, fullscreenButton];
    
    elementsToAnimate.forEach((element, index) => {
      element.setAlpha(0);
      element.setY(element.y + 50);
      
      this.tweens.add({
        targets: element,
        alpha: 1,
        y: element.y - 50,
        duration: 800,
        delay: 500 + (index * 150),
        ease: 'Back.easeOut'
      });
    });

    // Special animation for test ad button (top right)
    testAdButton.setAlpha(0);
    testAdButton.setX(testAdButton.x + 50);
    
    this.tweens.add({
      targets: testAdButton,
      alpha: 1,
      x: testAdButton.x - 50,
      duration: 800,
      delay: 800,
      ease: 'Back.easeOut'
    });
  }

  startUsernameInput() {
    // Create input field overlay with better visibility
    const inputBg = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2,
      500,
      200,
      0x000000,
      0.9
    ).setDepth(20);

    // Add border to background for better definition
    inputBg.setStrokeStyle(3, 0xffffff, 0.3);

    const inputBox = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 - 30,
      400,
      50,
      0xffffff,
      1
    ).setDepth(21);

    // Add border to input box
    inputBox.setStrokeStyle(2, 0x000000, 0.5);

    const inputLabel = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 - 70,
      'Enter your username:',
      {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5).setDepth(21);

    const inputText = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 - 25,
      '',
      {
        fontSize: '22px',
        fill: '#000000',
        fontFamily: 'Arial',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5, 0.5).setDepth(21);

    // Create blinking cursor
    const cursor = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 - 25,
      3,
      26,
      0x000000,
      1
    ).setDepth(22);

    // Cursor blinking animation
    this.tweens.add({
      targets: cursor,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    // Calculate button positions for side-by-side layout like main menu
    const buttonWidth = 140;
    const gap = 100;
    const totalWidth = buttonWidth * 2 + gap;
    const startX = (GAME_CONFIG.WIDTH - totalWidth) / 2 + buttonWidth / 2;

    const saveButton = this.add.text(
      startX,
      GAME_CONFIG.HEIGHT / 2 + 50,
      '💾 SAVE',
      {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        backgroundColor: '#4CAF50',
        padding: { x: 30, y: 15 },
        borderRadius: 12,
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(21);

    const cancelButton = this.add.text(
      startX + buttonWidth + gap,
      GAME_CONFIG.HEIGHT / 2 + 50,
      '❌ CANCEL',
      {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        backgroundColor: '#f44336',
        padding: { x: 30, y: 15 },
        borderRadius: 12,
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(21);

    // Handle keyboard input
    let currentInput = localStorage.getItem('username') || '';
    inputText.setText(currentInput);
    
    // Position cursor at the end of existing text
    const updateCursorPosition = () => {
      const textWidth = inputText.width;
      cursor.setX(GAME_CONFIG.WIDTH / 2 + textWidth / 2);
      cursor.setY(GAME_CONFIG.HEIGHT / 2 - 25);
    };
    
    // Initial cursor position
    updateCursorPosition();
    
    // Create hidden HTML input for mobile keyboard support
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'text';
    hiddenInput.style.position = 'absolute';
    hiddenInput.style.left = '-9999px';
    hiddenInput.style.top = '-9999px';
    hiddenInput.style.opacity = '0';
    hiddenInput.style.pointerEvents = 'none';
    hiddenInput.value = currentInput;
    hiddenInput.maxLength = 20;
    document.body.appendChild(hiddenInput);
    
    // Focus hidden input to trigger mobile keyboard
    setTimeout(() => {
      hiddenInput.focus();
      hiddenInput.select();
    }, 100);
    
    // Handle input changes from mobile keyboard
    hiddenInput.addEventListener('input', (event) => {
      currentInput = event.target.value;
      inputText.setText(currentInput);
      updateCursorPosition();
    });
    
    // Handle keyboard input for desktop
    this.input.keyboard.on('keydown', (event) => {
      if (event.key === 'Enter') {
        this.saveUsername(currentInput, [inputBg, inputBox, inputLabel, inputText, cursor, saveButton, cancelButton, hiddenInput]);
      } else if (event.key === 'Escape') {
        this.cancelUsernameInput([inputBg, inputBox, inputLabel, inputText, cursor, saveButton, cancelButton, hiddenInput]);
      } else if (event.key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
        inputText.setText(currentInput);
        hiddenInput.value = currentInput;
        updateCursorPosition();
      } else if (event.key.length === 1 && currentInput.length < 20) {
        currentInput += event.key;
        inputText.setText(currentInput);
        hiddenInput.value = currentInput;
        updateCursorPosition();
      }
    });

    // Save button interaction
    saveButton.on('pointerdown', () => {
      this.saveUsername(currentInput, [inputBg, inputBox, inputLabel, inputText, cursor, saveButton, cancelButton, hiddenInput]);
    });

    // Cancel button interaction
    cancelButton.on('pointerdown', () => {
      this.cancelUsernameInput([inputBg, inputBox, inputLabel, inputText, cursor, saveButton, cancelButton, hiddenInput]);
    });

    // Focus on input
    this.input.keyboard.enabled = true;
  }

  saveUsername(username, elements) {
    if (username.trim()) {
      const oldUsername = localStorage.getItem('username') || '';
      const newUsername = username.trim();
      
      localStorage.setItem('username', newUsername);
      this.usernameText.setText(newUsername);
      this.usernameText.setStyle({ fill: '#000' });
      
      // Update existing leaderboard entries with new username
      if (oldUsername !== newUsername) {
        this.updateLeaderboardUsernames(oldUsername, newUsername);
      }
    }
    this.cancelUsernameInput(elements);
  }

  updateLeaderboardUsernames(oldUsername, newUsername) {
    if (!oldUsername) return; // Skip if there was no previous username
    
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    let updated = false;
    
    // Update all entries that match the old username
    leaderboard.forEach(entry => {
      if (entry.username === oldUsername) {
        entry.username = newUsername;
        updated = true;
      }
    });
    
    // Save updated leaderboard if changes were made
    if (updated) {
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }
  }

  cancelUsernameInput(elements) {
    elements.forEach(element => element.destroy());
    this.input.keyboard.off('keydown');
  }

  showClearConfirmation(clearButton) {
    // Create confirmation overlay
    const confirmBg = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2,
      500,
      200,
      0x000000,
      0.9
    ).setDepth(30);

    // Add border to background
    confirmBg.setStrokeStyle(3, 0xffffff, 0.3);

    const confirmTitle = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 - 80,
      '⚠️ CONFIRM CLEAR',
      {
        fontSize: '26px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5).setDepth(31);

    const confirmMessage = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 - 25,
      'Are you sure you want to clear all\nleaderboard scores?\nThis action cannot be undone!',
      {
        fontSize: '18px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        align: 'center',
        lineSpacing: 10,
        stroke: '#000000',
        strokeThickness: 1
      }
    ).setOrigin(0.5).setDepth(31);

    // Calculate button positions for side-by-side layout like main menu
    const buttonWidth = 140;
    const gap = 100;
    const totalWidth = buttonWidth * 2 + gap;
    const startX = (GAME_CONFIG.WIDTH - totalWidth) / 2 + buttonWidth / 2;

    const yesButton = this.add.text(
      startX,
      GAME_CONFIG.HEIGHT / 2 + 50,
      '✅ YES, CLEAR',
      {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        backgroundColor: '#f44336',
        padding: { x: 30, y: 15 },
        borderRadius: 12,
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(31);

    const noButton = this.add.text(
      startX + buttonWidth + gap,
      GAME_CONFIG.HEIGHT / 2 + 50,
      '❌ CANCEL',
      {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        backgroundColor: '#666',
        padding: { x: 30, y: 15 },
        borderRadius: 12,
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(31);

    // Yes button interaction
    yesButton.on('pointerdown', () => {
      // Clear leaderboard and reset high score
      localStorage.removeItem('leaderboard');
      localStorage.removeItem('highScore');
      localStorage.setItem('highScore', '0');
      
      clearButton.setText('✅ CLEARED!');
      clearButton.setStyle({ backgroundColor: '#4CAF50' });
      
      // Reset button after 2 seconds
      setTimeout(() => {
        clearButton.setText('🗑️ CLEAR ALL SCORES');
        clearButton.setStyle({ backgroundColor: '#f44336' });
      }, 2000);
      
      this.closeClearConfirmation([confirmBg, confirmTitle, confirmMessage, yesButton, noButton]);
    });

    // No button interaction
    noButton.on('pointerdown', () => {
      this.closeClearConfirmation([confirmBg, confirmTitle, confirmMessage, yesButton, noButton]);
    });

    // Add entrance animation
    [confirmBg, confirmTitle, confirmMessage, yesButton, noButton].forEach((element, index) => {
      element.setAlpha(0);
      element.setScale(0.8);
      
      this.tweens.add({
        targets: element,
        alpha: 1,
        scale: 1,
        duration: 300,
        delay: index * 50,
        ease: 'Back.easeOut'
      });
    });
  }

  closeClearConfirmation(elements) {
    // Add exit animation
    elements.forEach((element, index) => {
      this.tweens.add({
        targets: element,
        alpha: 0,
        scale: 0.8,
        duration: 200,
        delay: index * 30,
        ease: 'Power2',
        onComplete: () => {
          element.destroy();
        }
      });
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
    
    const backButton = this.add.text(20, 20, '← BACK', buttonStyle)
      .setOrigin(0, 0)
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

  toggleFullscreen(fullscreenButton) {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(error => {
            console.log('Fullscreen request failed:', error);
            this.showFullscreenError();
          });
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen().catch(error => {
            console.log('Webkit fullscreen request failed:', error);
            this.showFullscreenError();
          });
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen().catch(error => {
            console.log('MS fullscreen request failed:', error);
            this.showFullscreenError();
          });
        } else {
          console.log('Fullscreen API not supported');
          this.showFullscreenError();
        }
      } catch (error) {
        console.log('Fullscreen request error:', error);
        this.showFullscreenError();
      }
    } else {
      // Exit fullscreen
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(error => {
            console.log('Exit fullscreen failed:', error);
          });
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen().catch(error => {
            console.log('Webkit exit fullscreen failed:', error);
          });
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen().catch(error => {
            console.log('MS exit fullscreen failed:', error);
          });
        }
      } catch (error) {
        console.log('Exit fullscreen error:', error);
      }
    }
  }

  requestLandscape(landscapeButton) {
    // Check current orientation using global manager
    const currentOrientation = globalOrientationManager.getCurrentOrientation();
    
    if (currentOrientation === 'landscape') {
      // Currently in landscape, request portrait
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('portrait').catch(() => {
          // Fallback: show message to user
          this.showOrientationMessage('portrait');
        });
      } else {
        // Fallback for devices that don't support orientation lock
        this.showOrientationMessage('portrait');
      }
      // Update button text
      landscapeButton.setText('📱 LANDSCAPE MODE');
    } else {
      // Currently in portrait, request landscape
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {
          // Fallback: show message to user
          this.showOrientationMessage('landscape');
        });
      } else {
        // Fallback for devices that don't support orientation lock
        this.showOrientationMessage('landscape');
      }
      // Update button text
      landscapeButton.setText('📱 PORTRAIT MODE');
    }
  }

  showOrientationMessage(orientation) {
    // Create a simple message popup
    const messageBg = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2,
      400,
      150,
      0x000000,
      0.9
    ).setDepth(30);

    const messageText = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2,
      orientation === 'landscape' 
        ? '📱 Please rotate your device\nto landscape mode\nfor the best experience!'
        : '📱 Please rotate your device\nto portrait mode\nfor the best experience!',
      {
        fontSize: '18px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 2
      }
    ).setOrigin(0.5).setDepth(31);

    const closeButton = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 + 60,
      'OK',
      {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        backgroundColor: '#4CAF50',
        padding: { x: 20, y: 8 },
        borderRadius: 6,
        stroke: '#000000',
        strokeThickness: 2
      }
    ).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(31);

    closeButton.on('pointerdown', () => {
      messageBg.destroy();
      messageText.destroy();
      closeButton.destroy();
    });

    // Auto-close after 5 seconds
    this.time.delayedCall(5000, () => {
      if (messageBg.active) {
        messageBg.destroy();
        messageText.destroy();
        closeButton.destroy();
      }
    });
  }

  // Add event listeners for fullscreen and orientation changes
  addOrientationListeners(fullscreenButton, landscapeButton) {
    // Store references to buttons for cleanup
    this.fullscreenButton = fullscreenButton;
    this.landscapeButton = landscapeButton;
    
    // Listen for fullscreen changes
    this.fullscreenChangeHandler = () => {
      // Check if button still exists and is active before updating
      if (this.fullscreenButton && this.fullscreenButton.active) {
        if (document.fullscreenElement) {
          this.fullscreenButton.setText('🔍 EXIT FULLSCREEN');
        } else {
          this.fullscreenButton.setText('🔍 ENTER FULLSCREEN');
        }
      }
    };
    document.addEventListener('fullscreenchange', this.fullscreenChangeHandler);

    // Use global orientation manager for orientation changes
    if (landscapeButton) {
      this.orientationCallback = (newOrientation) => {
        // Check if button still exists and is active before updating
        if (this.landscapeButton && this.landscapeButton.active) {
          if (newOrientation === 'landscape') {
            this.landscapeButton.setText('📱 PORTRAIT MODE');
          } else {
            this.landscapeButton.setText('📱 LANDSCAPE MODE');
          }
        }
      };
      
      // Register with global orientation manager
      globalOrientationManager.addListener(this.orientationCallback);
    }
  }

  // Initialize button text based on current state
  initializeButtonStates(fullscreenButton, landscapeButton) {
    // Set fullscreen button text based on current state
    if (document.fullscreenElement) {
      fullscreenButton.setText('🔍 EXIT FULLSCREEN');
    } else {
      fullscreenButton.setText('🔍 ENTER FULLSCREEN');
    }

    // Set landscape button text based on current orientation (only if button exists)
    if (landscapeButton) {
      const currentOrientation = globalOrientationManager.getCurrentOrientation();
      if (currentOrientation === 'landscape') {
        landscapeButton.setText('📱 PORTRAIT MODE');
      } else {
        landscapeButton.setText('📱 LANDSCAPE MODE');
      }
    }
  }

  // Check if device is mobile
  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
  }

  // Check if fullscreen is supported
  isFullscreenSupported() {
    return !!(document.fullscreenEnabled || 
              document.webkitFullscreenEnabled || 
              document.mozFullScreenEnabled || 
              document.msFullscreenEnabled);
  }



  // Apply stored orientation preference
  applyStoredOrientationPreference() {
    const storedOrientation = globalOrientationManager.getStoredOrientation();
    const currentOrientation = globalOrientationManager.getCurrentOrientation();
    
    // Only apply if different from current orientation
    if (storedOrientation !== currentOrientation) {
      console.log(`Applying stored orientation preference: ${storedOrientation}`);
      
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock(storedOrientation).catch(() => {
          console.log('Could not lock orientation, showing message instead');
          this.showOrientationMessage(storedOrientation);
        });
      } else {
        this.showOrientationMessage(storedOrientation);
      }
    }
  }

  // Show fullscreen error message
  showFullscreenError() {
    // Create a popup message
    const popup = this.add.graphics();
    popup.fillStyle(0x000000, 0.8);
    popup.fillRoundedRect(100, 200, 600, 200, 20);
    popup.lineStyle(2, 0xffffff);
    popup.strokeRoundedRect(100, 200, 600, 200, 20);

    const message = this.add.text(400, 300, '⚠️ Fullscreen requires user interaction\n\nPlease click the button again to enter fullscreen mode.', {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      align: 'center',
      wordWrap: { width: 580 }
    }).setOrigin(0.5);

    // Auto-remove after 3 seconds
    this.time.delayedCall(3000, () => {
      popup.destroy();
      message.destroy();
    });
  }

  // Show fullscreen not supported message
  showFullscreenNotSupportedMessage() {
    // Create a popup message
    const popup = this.add.graphics();
    popup.fillStyle(0x000000, 0.8);
    popup.fillRoundedRect(100, 200, 600, 200, 20);
    popup.lineStyle(2, 0xffffff);
    popup.strokeRoundedRect(100, 200, 600, 200, 20);

    const message = this.add.text(400, 300, '❌ Fullscreen is not supported in this browser\n\nTry using F11 key or browser menu instead.', {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      align: 'center',
      wordWrap: { width: 580 }
    }).setOrigin(0.5);

    // Auto-remove after 3 seconds
    this.time.delayedCall(3000, () => {
      popup.destroy();
      message.destroy();
    });
  }

  // Cleanup event listeners when scene is destroyed
  cleanup() {
    // Remove fullscreen change listener
    if (this.fullscreenChangeHandler) {
      document.removeEventListener('fullscreenchange', this.fullscreenChangeHandler);
      this.fullscreenChangeHandler = null;
    }
    
    // Remove orientation callback from global manager
    if (this.orientationCallback) {
      globalOrientationManager.removeListener(this.orientationCallback);
      this.orientationCallback = null;
    }
    
    // Clear button references
    this.fullscreenButton = null;
    this.landscapeButton = null;
  }

  showTestAdPopup() {
    // Increment ad view count for test
    const currentAdCount = parseInt(localStorage.getItem('adViewCount')) || 0;
    localStorage.setItem('adViewCount', currentAdCount + 1);
    
    // Create ad popup background with better positioning
    const popupBg = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2,
      GAME_CONFIG.WIDTH * 0.85,
      GAME_CONFIG.HEIGHT * 0.7,
      0x000000,
      0.95
    ).setDepth(20);
    popupBg.setStrokeStyle(3, 0xffffff, 1);
    
    // Ad title - positioned higher for better visibility
    const adTitle = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 - 140,
      '🎮 GAME SPONSORED BY',
      {
        fontSize: '28px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5).setDepth(21);
    
    // Ad content - better spacing and visibility
    const adContent = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 - 50,
      '🏆 PREMIUM GAMING GEAR\n🎯 ENHANCE YOUR GAMING EXPERIENCE\n⚡ BOOST YOUR PERFORMANCE',
      {
        fontSize: '20px',
        fill: '#ffff00',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'center',
        lineSpacing: 8,
        stroke: '#000000',
        strokeThickness: 2
      }
    ).setOrigin(0.5).setDepth(21);
    
    // Ad description - better positioned
    const adDescription = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 + 40,
      'Get the latest gaming accessories\nand level up your gameplay!',
      {
        fontSize: '18px',
        fill: '#cccccc',
        fontFamily: 'Arial',
        align: 'center',
        lineSpacing: 10,
        stroke: '#000000',
        strokeThickness: 1
      }
    ).setOrigin(0.5).setDepth(21);
    
    // Close button - better positioned and styled
    const closeBtn = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 + 120,
      '❌ CLOSE AD',
      {
        fontSize: '22px',
        fill: '#ffffff',
        backgroundColor: '#f44336',
        padding: { x: 25, y: 12 },
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      }
    ).setOrigin(0.5).setInteractive().setDepth(21);
    
    // Button interactions
    closeBtn.on('pointerover', () => {
      closeBtn.setStyle({ fill: '#ffff00', backgroundColor: '#666666' });
    });
    closeBtn.on('pointerout', () => {
      closeBtn.setStyle({ fill: '#ffffff', backgroundColor: '#444444' });
    });
    closeBtn.on('pointerdown', () => {
      // Remove ad popup elements
      popupBg.destroy();
      adTitle.destroy();
      adContent.destroy();
      adDescription.destroy();
      closeBtn.destroy();
      
      // Refresh the settings scene to update statistics
      this.scene.restart();
    });
    
    // Auto-close after 5 seconds
    this.time.delayedCall(5000, () => {
      if (popupBg.active) {
        popupBg.destroy();
        adTitle.destroy();
        adContent.destroy();
        adDescription.destroy();
        closeBtn.destroy();
        this.scene.restart();
      }
    });
  }

  // Called when the scene is shut down
  shutdown() {
    this.cleanup();
  }
}

// ============================================================================
// STATISTICS SCENE
// ============================================================================
// Comprehensive game analytics and statistics display
// Features:
// - User profile information and preferences
// - Gameplay statistics (games played, high score, etc.)
// - Ad engagement metrics and frequency tracking
// - Professional table layout with alternating row colors
// - Animated entrance effects and modern styling
// - Real-time data from localStorage
// - Responsive design with proper spacing
// ============================================================================

class StatisticsScene extends Phaser.Scene {
  /**
   * Constructor for the statistics scene
   * Sets up the scene name for navigation between scenes
   */
  constructor() {
    super('StatisticsScene');
  }

  /**
   * Main create method called when the scene starts
   * Initializes all visual elements in the correct order for proper layering
   * Background → Clouds → Title → Statistics Table → Back Button
   */
  create() {
    this.createBackground();        // Create the sky blue background
    globalCloudManager.start(this); // Start animated cloud system
    this.createTitle();             // Create animated title and subtitle
    this.createStatistics();        // Create the statistics table
    this.createBackButton();        // Create navigation back button
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
    // Main title with modern styling
    const titleText = this.add.text(GAME_CONFIG.WIDTH / 2, 80, '📊 GAME STATISTICS', {
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

    // Subtitle with modern styling
    const subtitleText = this.add.text(GAME_CONFIG.WIDTH / 2, 130, '📈 Your Gaming Journey 📈', {
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
    
    // Add entrance animations
    titleText.setAlpha(0);
    subtitleText.setAlpha(0);
    titleText.setY(50);
    subtitleText.setY(100);
    
    this.tweens.add({
      targets: titleText,
      alpha: 1,
      y: 80,
      duration: 1000,
      ease: 'Back.easeOut'
    });
    
    this.tweens.add({
      targets: subtitleText,
      alpha: 1,
      y: 130,
      duration: 1000,
      delay: 200,
      ease: 'Back.easeOut'
    });
  }

  createStatistics() {
    // Get statistics from localStorage
    const gamePlayCount = parseInt(localStorage.getItem('gamePlayCount')) || 0;
    const adViewCount = parseInt(localStorage.getItem('adViewCount')) || 0;
    const highScore = parseInt(localStorage.getItem('highScore')) || 0;
    const adsEnabled = localStorage.getItem('showAds') === 'true';
    const username = localStorage.getItem('username') || 'Anonymous';
    
    // Calculate additional statistics
    const nextAdGames = adsEnabled ? (3 - (gamePlayCount % 3)) : 0;
    const adFrequency = gamePlayCount > 0 ? ((adViewCount / gamePlayCount) * 100).toFixed(1) : 0;
    
    // Table layout variables - defined first
    const tableStartY = 200;
    const tableWidth = 700; // Fixed width to ensure it fits
    const tableStartX = (GAME_CONFIG.WIDTH - tableWidth) / 2;
    const labelX = tableStartX + 80; // More padding from left edge
    const valueX = tableStartX + tableWidth - 160; // More padding from right edge
    const rowHeight = 40; // Slightly smaller row height to fit all stats

    // Statistics data
    const statsData = [
      { label: '👤 Username', value: username, color: '#2196F3' },
      { label: '🎮 Games Played', value: gamePlayCount.toString(), color: '#4CAF50' },
      { label: '🏆 High Score', value: highScore.toString(), color: '#FF9800' },
      { label: '📺 Ads Viewed', value: adViewCount.toString(), color: '#9C27B0' },
      { label: '⏰ Next Ad In', value: adsEnabled ? `${nextAdGames} games` : 'Disabled', color: adsEnabled ? '#E91E63' : '#666666' }
    ];
    
    // Calculate table height with bottom padding
    const tableHeight = (statsData.length * rowHeight) + 40; // Add 40px bottom padding

    // Create table background panel
    const tableBg = this.add.rectangle(
      tableStartX + tableWidth / 2,
      tableStartY + tableHeight / 2,
      tableWidth,
      tableHeight,
      0xffffff,
      0.95
    ).setDepth(5);
    tableBg.setStrokeStyle(4, 0x000000, 0.5);

    // Table header - positioned to match table
    const headerBg = this.add.rectangle(
      tableStartX + tableWidth / 2,
      180,
      tableWidth,
      40,
      0x2196F3,
      0.8
    ).setDepth(6);
    headerBg.setStrokeStyle(2, 0x000000, 0.5);

    const headerText = this.add.text(tableStartX + tableWidth / 2, 180, '📊 GAME STATISTICS', {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: '#000000',
        blur: 2,
        fill: true
      }
    }).setOrigin(0.5).setDepth(7);

    // Create table rows with alternating background colors
    statsData.forEach((stat, index) => {
      const yPos = tableStartY + (index * rowHeight);
      
      // Row background (alternating colors) - positioned to match table
      const rowBg = this.add.rectangle(
        tableStartX + tableWidth / 2,
        yPos + rowHeight / 2,
        tableWidth - 20, // Slightly smaller to show table boundaries
        rowHeight - 5,
        index % 2 === 0 ? 0xf5f5f5 : 0xffffff,
        0.7
      ).setDepth(6);
      rowBg.setStrokeStyle(1, 0xcccccc, 0.5);

      // Label column
      const labelText = this.add.text(labelX, yPos + rowHeight / 2, stat.label, {
        fontSize: '20px',
        fill: '#000000',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#ffffff',
        strokeThickness: 2,
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: '#000000',
          blur: 1,
          fill: true
        }
      }).setOrigin(0, 0.5).setDepth(7);

      // Value column - positioned at fixed right position
      const valueText = this.add.text(valueX, yPos + rowHeight / 2, stat.value, {
        fontSize: '22px',
        fill: stat.color,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: '#000000',
          blur: 1,
          fill: true
        }
      }).setOrigin(0, 0.5).setDepth(7);

      // Add entrance animations for each row
      rowBg.setAlpha(0);
      labelText.setAlpha(0);
      valueText.setAlpha(0);
      rowBg.setY(rowBg.y - 20);
      labelText.setX(labelText.x - 30);
      valueText.setX(valueText.x + 30); // Move value text to the right initially
      
      this.tweens.add({
        targets: [rowBg],
        alpha: 1,
        y: rowBg.y + 20,
        duration: 600,
        delay: 1000 + (index * 200),
        ease: 'Back.easeOut'
      });
      
      this.tweens.add({
        targets: [labelText],
        alpha: 1,
        x: labelText.x + 30,
        duration: 600,
        delay: 1000 + (index * 200),
        ease: 'Back.easeOut'
      });
      
      this.tweens.add({
        targets: [valueText],
        alpha: 1,
        x: valueText.x - 30, // Move value text back to its final position
        duration: 600,
        delay: 1000 + (index * 200),
        ease: 'Back.easeOut'
      });
    });

    // Add entrance animation for header
    headerBg.setAlpha(0);
    headerText.setAlpha(0);
    headerBg.setY(headerBg.y - 30);
    headerText.setY(headerText.y - 30);
    
    this.tweens.add({
      targets: [headerBg, headerText],
      alpha: 1,
      y: headerBg.y + 30,
      duration: 800,
      delay: 800,
      ease: 'Back.easeOut'
    });
  }

  createBackButton() {
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
    
    const backButton = this.add.text(GAME_CONFIG.WIDTH / 2, 520, '← BACK TO SETTINGS', buttonStyle)
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
      this.scene.start('SettingsScene');
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

    // Add entrance animation
    backButton.setAlpha(0);
    backButton.setY(backButton.y + 30);
    
    this.tweens.add({
      targets: backButton,
      alpha: 1,
      y: backButton.y - 30,
      duration: 800,
      delay: 1200,
      ease: 'Back.easeOut'
    });
  }
}

// ============================================================================
// LEADERBOARD SCENE
// ============================================================================
// High score leaderboard with pagination and ranking system
// Features:
// - Top 10 high scores with persistent storage
// - Medal icons for top 3 positions (🥇🥈🥉)
// - Pagination system (6 entries per page)
// - Centered table layout with proper column alignment
// - Player name, score, and level information
// - Navigation controls with visual feedback
// - Responsive design with proper spacing
// - Animated entrance effects
// ============================================================================

class LeaderboardScene extends Phaser.Scene {
  /**
   * Constructor for the leaderboard scene
   * Sets up the scene name for navigation between scenes
   */
  constructor() {
    super('LeaderboardScene');
  }

  /**
   * Main create method called when the scene starts
   * Initializes all visual elements in the correct order for proper layering
   * Background → Clouds → Title → Leaderboard Table → Pagination → Back Button
   */
  create() {
    this.createBackground();        // Create the sky blue background
    globalCloudManager.start(this); // Start animated cloud system
    this.createTitle();             // Create animated title and subtitle
    this.createLeaderboardEntries(); // Create the leaderboard table
    this.createBackButton();        // Create navigation back button
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
    // Pagination settings
    this.itemsPerPage = 6;
    this.currentPage = 0;
    this.leaderboard = this.getLeaderboard();
    this.totalPages = Math.ceil(this.leaderboard.length / this.itemsPerPage);

    // Create header
    this.createLeaderboardHeader();
    
    // Show message if no scores
    if (this.leaderboard.length === 0) {
      this.add.text(GAME_CONFIG.WIDTH / 2, 280, 'No scores yet!\nPlay the game to set a record!', {
        fontSize: '24px',
        fill: '#666',
        fontFamily: 'Arial',
        align: 'center'
      }).setOrigin(0.5);
      return;
    }

    // Create pagination controls
    this.createPaginationControls();
    
    // Display first page
    this.displayCurrentPage();
  }

  createLeaderboardHeader() {
    // Calculate centered positions
    const tableWidth = 600;
    const tableStartX = (GAME_CONFIG.WIDTH - tableWidth) / 2;
    const rankX = tableStartX + 50;
    const playerX = tableStartX + 200;
    const scoreX = tableStartX + 350;
    const levelX = tableStartX + 500;

    // Header row
    this.add.text(rankX, 150, 'RANK', {
      fontSize: '20px',
      fill: '#000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(playerX, 150, 'PLAYER', {
      fontSize: '20px',
      fill: '#000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(scoreX, 150, 'SCORE', {
      fontSize: '20px',
      fill: '#000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(levelX, 150, 'LEVEL', {
      fontSize: '20px',
      fill: '#000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Separator line - centered with table
    this.add.line(tableStartX + tableWidth / 2, 165, 0, 0, tableWidth, 0, 0x000000, 1).setOrigin(0.5);

    // Store column positions for use in displayCurrentPage
    this.columnPositions = {
      rank: rankX,
      player: playerX,
      score: scoreX,
      level: levelX
    };
  }

  createPaginationControls() {
    const buttonStyle = {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#2196F3',
      padding: { x: 15, y: 8 },
      borderRadius: 6
    };

    const buttonHoverStyle = {
      ...buttonStyle,
      backgroundColor: '#1976D2',
      fill: '#ffff00'
    };

    // Calculate centered positions for pagination controls
    const tableWidth = 600;
    const tableStartX = (GAME_CONFIG.WIDTH - tableWidth) / 2;
    const paginationY = 470;
    const buttonGap = 120; // Gap between buttons and page info

    // Previous button - left side
    this.prevButton = this.add.text(tableStartX + 100, paginationY, '← PREV', buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(10);

    // Next button - right side
    this.nextButton = this.add.text(tableStartX + tableWidth - 100, paginationY, 'NEXT →', buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(10);

    // Page info - center
    this.pageInfo = this.add.text(tableStartX + tableWidth / 2, paginationY, `Page ${this.currentPage + 1} of ${this.totalPages}`, {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Button interactions
    this.prevButton.on('pointerover', () => {
      // Only apply hover effect if button is enabled
      if (this.currentPage > 0) {
        this.tweens.add({
          targets: this.prevButton,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 150,
          ease: 'Power2'
        });
        this.prevButton.setStyle(buttonHoverStyle);
      }
    });

    this.prevButton.on('pointerout', () => {
      // Only apply hover effect if button is enabled
      if (this.currentPage > 0) {
        this.tweens.add({
          targets: this.prevButton,
          scaleX: 1,
          scaleY: 1,
          duration: 150,
          ease: 'Power2'
        });
        this.prevButton.setStyle(buttonStyle);
      }
    });

    this.prevButton.on('pointerdown', () => {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.displayCurrentPage();
        this.updatePaginationControls();
      }
    });

    this.nextButton.on('pointerover', () => {
      // Only apply hover effect if button is enabled
      if (this.currentPage < this.totalPages - 1) {
        this.tweens.add({
          targets: this.nextButton,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 150,
          ease: 'Power2'
        });
        this.nextButton.setStyle(buttonHoverStyle);
      }
    });

    this.nextButton.on('pointerout', () => {
      // Only apply hover effect if button is enabled
      if (this.currentPage < this.totalPages - 1) {
        this.tweens.add({
          targets: this.nextButton,
          scaleX: 1,
          scaleY: 1,
          duration: 150,
          ease: 'Power2'
        });
        this.nextButton.setStyle(buttonStyle);
      }
    });

    this.nextButton.on('pointerdown', () => {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
        this.displayCurrentPage();
        this.updatePaginationControls();
      }
    });

    // Update initial button states
    this.updatePaginationControls();
  }

  displayCurrentPage() {
    // Clear previous entries
    if (this.currentEntries) {
      this.currentEntries.forEach(entry => entry.destroy());
    }
    this.currentEntries = [];

    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.leaderboard.length);
    const pageEntries = this.leaderboard.slice(startIndex, endIndex);

    let yPos = 200;

    pageEntries.forEach((entry, index) => {
      const globalIndex = startIndex + index;
      const rank = globalIndex + 1;
      const medal = this.getMedalForRank(rank);
      
      const entries = [];

      // Rank/medal
      entries.push(this.add.text(this.columnPositions.rank, yPos, medal, {
        fontSize: '24px',
        fill: '#000',
        fontFamily: 'Arial'
      }).setOrigin(0.5));

      // Player name
      entries.push(this.add.text(this.columnPositions.player, yPos, `${entry.username || 'Anonymous'}`, {
        fontSize: '18px',
        fill: '#000',
        fontFamily: 'Arial',
        fontStyle: 'bold'
      }).setOrigin(0.5));

      // Score
      entries.push(this.add.text(this.columnPositions.score, yPos, `${entry.score}`, {
        fontSize: '24px',
        fill: '#000',
        fontFamily: 'Arial'
      }).setOrigin(0.5));

      // Level
      entries.push(this.add.text(this.columnPositions.level, yPos, `${entry.level || 1}`, {
        fontSize: '24px',
        fill: '#000',
        fontFamily: 'Arial'
      }).setOrigin(0.5));

      this.currentEntries.push(...entries);
      yPos += 40;
    });
  }

  updatePaginationControls() {
    // Update page info
    this.pageInfo.setText(`Page ${this.currentPage + 1} of ${this.totalPages}`);

    // Check if buttons should be disabled
    const isFirstPage = this.currentPage === 0;
    const isLastPage = this.currentPage === this.totalPages - 1;

    // Update previous button state
    if (isFirstPage) {
      // Disabled state - dimmed appearance
      this.prevButton.setStyle({
        fontSize: '16px',
        fill: '#999999',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#666666',
        strokeThickness: 1,
        backgroundColor: '#cccccc',
        padding: { x: 15, y: 8 },
        borderRadius: 6
      });
      this.prevButton.setInteractive(false);
      this.prevButton.setAlpha(0.5); // Make it more obviously disabled
    } else {
      // Enabled state - normal appearance
      this.prevButton.setStyle({
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
        backgroundColor: '#2196F3',
        padding: { x: 15, y: 8 },
        borderRadius: 6
      });
      this.prevButton.setInteractive({ useHandCursor: true });
      this.prevButton.setAlpha(1); // Full opacity when enabled
    }

    // Update next button state
    if (isLastPage) {
      // Disabled state - dimmed appearance
      this.nextButton.setStyle({
        fontSize: '16px',
        fill: '#999999',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#666666',
        strokeThickness: 1,
        backgroundColor: '#cccccc',
        padding: { x: 15, y: 8 },
        borderRadius: 6
      });
      this.nextButton.setInteractive(false);
      this.nextButton.setAlpha(0.5); // Make it more obviously disabled
    } else {
      // Enabled state - normal appearance
      this.nextButton.setStyle({
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
        backgroundColor: '#2196F3',
        padding: { x: 15, y: 8 },
        borderRadius: 6
      });
      this.nextButton.setInteractive({ useHandCursor: true });
      this.nextButton.setAlpha(1); // Full opacity when enabled
    }
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
}

// ============================================================================
// MAIN GAME SCENE
// ============================================================================
// The core gameplay scene where the endless runner game takes place
// Features:
// - Player movement with jumping mechanics and physics
// - Procedurally generated obstacles and collectible coins
// - Dynamic difficulty progression with speed increases
// - Power-up system with revive functionality
// - Real-time scoring and level progression
// - Ad integration with statistics tracking
// - Pause/resume functionality
// - Game over handling with restart options
// - Programmatically generated textures and animations
// ============================================================================

class GameScene extends Phaser.Scene {
  /**
   * Constructor for the game scene
   * Sets up the scene name for navigation between scenes
   */
  constructor() {
    super('GameScene');
  }

  /**
   * Preload method called before create
   * No external assets needed - all textures are generated programmatically
   */
  preload() {
    // Using generated textures, no external assets to preload
  }

  /**
   * Main create method called when the scene starts
   * Initializes all game systems in the correct order for proper functionality
   * State → Textures → Objects → Physics → UI → Input → Spawning
   */
  create() {
    this.initializeGameState();  // Set up game variables and state
    this.createTextures();       // Generate all game textures
    this.createGameObjects();    // Create player, ground, and object groups
    this.setupPhysics();         // Configure physics and collision detection
    this.setupUI();              // Create score, level, and button displays
      this.setupInputHandlers();   // Set up keyboard and touch controls
      this.setupSpawnTimer();      // Start obstacle and coin spawning system
      this.createBottomUI();       // Create bottom UI panel with buttons
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
  
    // Ad system - track game play count and ad views
    this.gamePlayCount = parseInt(localStorage.getItem('gamePlayCount')) || 0;
    this.adViewCount = parseInt(localStorage.getItem('adViewCount')) || 0;
  }

  createGameObjects() {
    // Create ground
      this.ground = this.physics.add.staticGroup();
    this.ground.create(GAME_CONFIG.WIDTH / 2, GAME_CONFIG.GROUND_Y, 'ground');

    // Create player - adjusted for larger size
    this.player = this.physics.add.sprite(GAME_CONFIG.PLAYER_START_X, GAME_CONFIG.PLAYER_START_Y - 10, 'player');
    this.player.setCollideWorldBounds(true).setBounce(GAME_CONFIG.PLAYER_BOUNCE);
    
    // Set custom collision bounds for better collision detection
    this.player.body.setSize(32, 40); // Smaller collision box than visual size
    this.player.body.setOffset(6, 8);  // Center the collision box

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
    
    // Increment game play count and check for ad
    this.gamePlayCount++;
    localStorage.setItem('gamePlayCount', this.gamePlayCount);
    
    // Check if ads are enabled and if it's time to show an ad (every 3 game plays)
    const adsEnabled = localStorage.getItem('showAds') === 'true';
    if (adsEnabled && this.gamePlayCount % 3 === 0) {
      this.showAdPopup();
      return; // Don't start yet, wait for ad to close
    }
    
    this.performStartGame();
  }
  
  performStartGame() {
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
    // Increment game play count and check for ad
    this.gamePlayCount++;
    localStorage.setItem('gamePlayCount', this.gamePlayCount);
    
    // Check if ads are enabled and if it's time to show an ad (every 3 game plays)
    const adsEnabled = localStorage.getItem('showAds') === 'true';
    if (adsEnabled && this.gamePlayCount % 3 === 0) {
      this.showAdPopup();
      return; // Don't restart yet, wait for ad to close
    }
    
    this.performRestart();
  }
  
  performRestart() {
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
  
  showAdPopup() {
    // Increment ad view count
    this.adViewCount++;
    localStorage.setItem('adViewCount', this.adViewCount);
    
    // Create ad popup background
    const popupBg = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2,
      GAME_CONFIG.WIDTH * 0.8,
      GAME_CONFIG.HEIGHT * 0.6,
      0x000000,
      0.9
    ).setDepth(20);
    popupBg.setStrokeStyle(3, 0xffffff, 1);
    
    // Ad title
    const adTitle = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 - 120,
      '🎮 GAME SPONSORED BY',
      {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        align: 'center'
      }
    ).setOrigin(0.5).setDepth(21);
    
    // Ad content
    const adContent = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 - 40,
      '🏆 PREMIUM GAMING GEAR\n🎯 ENHANCE YOUR GAMING EXPERIENCE\n⚡ BOOST YOUR PERFORMANCE',
      {
        fontSize: '18px',
        fill: '#ffff00',
        fontFamily: 'Arial',
        align: 'center',
        lineSpacing: 6
      }
    ).setOrigin(0.5).setDepth(21);
    
    // Ad description
    const adDescription = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 + 40,
      'Get the latest gaming accessories\nand level up your gameplay!',
      {
        fontSize: '16px',
        fill: '#cccccc',
        fontFamily: 'Arial',
        align: 'center',
        lineSpacing: 8
      }
    ).setOrigin(0.5).setDepth(21);
    
    // Continue button
    const continueBtn = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 + 100,
      '▶️ CONTINUE GAME',
      {
        fontSize: '20px',
        fill: '#ffffff',
        backgroundColor: '#444444',
        padding: { x: 20, y: 10 },
        fontFamily: 'Arial'
      }
    ).setOrigin(0.5).setInteractive().setDepth(21);
    
    // Button interactions
    continueBtn.on('pointerover', () => {
      continueBtn.setStyle({ fill: '#ffff00', backgroundColor: '#666666' });
    });
    continueBtn.on('pointerout', () => {
      continueBtn.setStyle({ fill: '#ffffff', backgroundColor: '#444444' });
    });
    continueBtn.on('pointerdown', () => {
      // Remove ad popup elements
      popupBg.destroy();
      adTitle.destroy();
      adContent.destroy();
      adDescription.destroy();
      continueBtn.destroy();
      
      // Now perform the actual game start or restart
      if (this.gameStarted) {
        this.performRestart();
      } else {
        this.performStartGame();
      }
    });
    
    // Auto-close after 5 seconds
    this.time.delayedCall(5000, () => {
      if (popupBg.active) {
        popupBg.destroy();
        adTitle.destroy();
        adContent.destroy();
        adDescription.destroy();
        continueBtn.destroy();
        if (this.gameStarted) {
          this.performRestart();
        } else {
          this.performStartGame();
        }
      }
    });
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
      level: this.level,
      username: localStorage.getItem('username') || 'Anonymous'
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
  
    // Player texture (person/runner) - larger size
    gfx.clear();
    
    // Body (torso) - larger
    gfx.fillStyle(0x4169E1, 1); // Royal blue shirt
    gfx.fillRect(12, 18, 20, 18);
    
    // Head - larger
    gfx.fillStyle(0xFFE4C4, 1); // Skin tone
    gfx.fillCircle(22, 12, 8);
    
    // Arms - larger
    gfx.fillStyle(0x4169E1, 1); // Blue shirt sleeves
    gfx.fillRect(6, 20, 6, 12);  // Left arm
    gfx.fillRect(32, 20, 6, 12); // Right arm
    
    // Legs - larger
    gfx.fillStyle(0x000080, 1); // Dark blue pants
    gfx.fillRect(14, 36, 6, 12); // Left leg
    gfx.fillRect(24, 36, 6, 12); // Right leg
    
    // Shoes - larger
    gfx.fillStyle(0x000000, 1); // Black shoes
    gfx.fillRect(12, 48, 8, 3);  // Left shoe
    gfx.fillRect(24, 48, 8, 3);  // Right shoe
    
    // Eyes - larger
    gfx.fillStyle(0x000000, 1); // Black eyes
    gfx.fillCircle(19, 10, 1.5);   // Left eye
    gfx.fillCircle(25, 10, 1.5);   // Right eye
    
    // Hair - larger
    gfx.fillStyle(0x8B4513, 1); // Brown hair
    gfx.fillRect(14, 4, 16, 6);
    gfx.fillCircle(22, 6, 6);
    
    gfx.generateTexture('player', 44, 52);

    // Ground texture (green rectangle)
    gfx.clear(); 
    gfx.fillStyle(0x228b22, 1); 
    gfx.fillRect(0, 0, 800, 40); 
    gfx.generateTexture('ground', 800, 40);

    // Obstacle textures - more detailed and interesting
    gfx.clear(); 
    gfx.fillStyle(0x8B4513, 1); // Brown wooden box
    gfx.fillRect(0, 0, 30, 30);
    gfx.fillStyle(0x654321, 1); // Darker brown for wood grain
    gfx.fillRect(2, 2, 26, 4);  // Top plank
    gfx.fillRect(2, 8, 26, 4);  // Middle plank
    gfx.fillRect(2, 14, 26, 4); // Bottom plank
    gfx.fillRect(2, 20, 26, 4); // Bottom plank 2
    gfx.fillRect(2, 26, 26, 4); // Bottom plank 3
    gfx.generateTexture('obstacle_rect', 30, 30);

    // Rock obstacle
    gfx.clear(); 
    gfx.fillStyle(0x696969, 1); // Dark gray base
    gfx.fillCircle(15, 15, 14);
    gfx.fillStyle(0x808080, 1); // Lighter gray highlights
    gfx.fillCircle(10, 10, 4);
    gfx.fillCircle(20, 8, 3);
    gfx.fillCircle(18, 18, 2);
    gfx.fillStyle(0x556B2F, 1); // Moss green
    gfx.fillCircle(5, 5, 2);
    gfx.fillCircle(25, 12, 1);
      gfx.generateTexture('obstacle_star', 30, 30);
  
    // Tree stump obstacle
    gfx.clear(); 
    gfx.fillStyle(0x8B4513, 1); // Brown trunk
    gfx.fillRect(8, 5, 14, 25);
    gfx.fillStyle(0x654321, 1); // Darker brown rings
    gfx.fillRect(10, 8, 10, 2);
    gfx.fillRect(10, 12, 10, 2);
    gfx.fillRect(10, 16, 10, 2);
    gfx.fillRect(10, 20, 10, 2);
    gfx.fillStyle(0x228B22, 1); // Green moss on top
    gfx.fillRect(6, 3, 18, 4);
    gfx.fillStyle(0x32CD32, 1); // Lighter green highlights
    gfx.fillRect(8, 4, 14, 2);
      gfx.generateTexture('obstacle_triangle', 30, 30);
  
    // Crate obstacle
    gfx.clear(); 
    gfx.fillStyle(0xD2691E, 1); // Orange crate
    gfx.fillRect(0, 0, 30, 30);
    gfx.fillStyle(0xCD853F, 1); // Lighter orange for slats
    gfx.fillRect(2, 2, 26, 4);  // Top slat
    gfx.fillRect(2, 8, 26, 4);  // Middle slat
    gfx.fillRect(2, 14, 26, 4); // Bottom slat
    gfx.fillRect(2, 20, 26, 4); // Bottom slat 2
    gfx.fillRect(2, 26, 26, 4); // Bottom slat 3
    gfx.fillStyle(0x8B4513, 1); // Brown vertical slats
    gfx.fillRect(8, 2, 4, 26);  // Left vertical
    gfx.fillRect(18, 2, 4, 26); // Right vertical
    gfx.fillStyle(0x654321, 1); // Dark brown nails
    gfx.fillRect(6, 6, 2, 2);
    gfx.fillRect(22, 6, 2, 2);
    gfx.fillRect(6, 22, 2, 2);
    gfx.fillRect(22, 22, 2, 2);
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
// Global cloud background system for animated atmosphere
// Features:
// - Programmatically generated cloud textures (small, medium, large)
// - Scene-specific cloud behavior and positioning
// - Dynamic spawning with configurable timing
// - Smooth movement animations across screen
// - Pause/resume functionality for game states
// - Memory-efficient cleanup and management
// - Different opacity and speed settings per scene
// ============================================================================

class CloudManager {
  /**
   * Constructor for the cloud manager
   * Initializes cloud system state and texture storage
   */
  constructor() {
    this.clouds = [];           // Array to store active cloud objects
    this.isActive = false;      // Flag to track if cloud system is running
    this.spawnTimer = null;     // Timer for periodic cloud spawning
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
    gfx.fillStyle(0xffffff, 1.0); // Full opacity for better visibility
    gfx.fillCircle(20, 15, 12);
    gfx.fillCircle(35, 15, 15);
    gfx.fillCircle(50, 15, 12);
    gfx.fillCircle(32, 8, 10);
    gfx.generateTexture('cloud_small', 60, 30);

    // Medium cloud
    gfx.clear();
    gfx.fillStyle(0xffffff, 1.0); // Full opacity for better visibility
    gfx.fillCircle(25, 20, 15);
    gfx.fillCircle(45, 20, 18);
    gfx.fillCircle(65, 20, 15);
    gfx.fillCircle(40, 10, 12);
    gfx.fillCircle(55, 12, 10);
    gfx.generateTexture('cloud_medium', 80, 40);

    // Large cloud
    gfx.clear();
    gfx.fillStyle(0xffffff, 1.0); // Full opacity for better visibility
    gfx.fillCircle(30, 25, 18);
    gfx.fillCircle(55, 25, 22);
    gfx.fillCircle(80, 25, 18);
    gfx.fillCircle(45, 12, 15);
    gfx.fillCircle(65, 15, 12);
    gfx.fillCircle(35, 8, 10);
    gfx.generateTexture('cloud_large', 100, 50);
  }

  spawnInitialClouds() {
    const isMenuScene = ['MainMenuScene', 'SettingsScene', 'LeaderboardScene'].includes(this.scene.constructor.name);
    const count = this.scene.constructor.name === 'GameScene' ? 5 : 
                  this.scene.constructor.name === 'MainMenuScene' ? 4 : // More clouds for main menu
                  isMenuScene ? 2 : 3;
    
    for (let i = 0; i < count; i++) {
      this.spawnCloud();
    }
  }

  startSpawning() {
    const isMenuScene = ['MainMenuScene', 'SettingsScene', 'LeaderboardScene'].includes(this.scene.constructor.name);
    const delay = this.scene.constructor.name === 'GameScene' ? 3000 : 
                  this.scene.constructor.name === 'MainMenuScene' ? 4000 : // More frequent for main menu
                  isMenuScene ? 6000 : 5000;
    
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
    
    // console.log('Spawning cloud:', cloudType, 'in scene:', this.scene.constructor.name);
    
    // Random position on the right side of screen
    const x = GAME_CONFIG.WIDTH + Phaser.Math.Between(50, 150);
    const y = Phaser.Math.Between(50, 200);
    
    const cloud = this.scene.add.sprite(x, y, cloudType);
    cloud.setDepth(0); // Set to 0 to ensure clouds are visible but behind UI elements
    
    // Set transparency and positioning based on scene type
    const isMenuScene = ['MainMenuScene', 'SettingsScene', 'LeaderboardScene'].includes(this.scene.constructor.name);
    
    if (this.scene.constructor.name === 'MainMenuScene') {
      // More visible clouds for main menu, less spread out
      cloud.setAlpha(0.6); // Slightly transparent for subtle effect
      // Concentrate clouds in the middle area of the screen
      cloud.y = Phaser.Math.Between(120, 400);
    } else if (isMenuScene) {
      // More transparent and spread out for other menu scenes
      cloud.setAlpha(0.5); // Increased visibility for other menu scenes
      // Spread clouds across more vertical space
      cloud.y = Phaser.Math.Between(30, 300);
    } else {
      // Slightly transparent for game scene to avoid distraction
      cloud.setAlpha(0.4); // Reduced visibility for game scene
      cloud.y = Phaser.Math.Between(50, 200);
    }
    
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

// Global cloud manager instance - shared across all scenes
const globalCloudManager = new CloudManager();

// ============================================================================
// GLOBAL ORIENTATION MANAGER
// ============================================================================
// Global orientation detection and management system
// Features:
// - Real-time orientation change detection
// - Persistent orientation preference storage
// - Cross-scene orientation state management
// - Event listener system for orientation updates
// - Automatic localStorage synchronization
// - Mobile device orientation optimization
// ============================================================================

class OrientationManager {
  /**
   * Constructor for the orientation manager
   * Initializes orientation tracking and global listeners
   */
  constructor() {
    this.currentOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    this.listeners = [];
    this.setupGlobalListener();
  }

  setupGlobalListener() {
    // Global resize listener that works across all scenes
    window.addEventListener('resize', () => {
      const newOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
      
      // Only update if orientation actually changed
      if (newOrientation !== this.currentOrientation) {
        this.currentOrientation = newOrientation;
        
        // Store in localStorage
        localStorage.setItem('preferredOrientation', newOrientation);
        console.log(`Global orientation changed to: ${newOrientation}`);
        
        // Notify all listeners
        this.listeners.forEach(callback => {
          try {
            callback(newOrientation);
          } catch (error) {
            console.log('Error in orientation listener:', error);
          }
        });
      }
    });
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  getCurrentOrientation() {
    return this.currentOrientation;
  }

  getStoredOrientation() {
    return localStorage.getItem('preferredOrientation') || this.currentOrientation;
  }
}

// Global orientation manager instance
const globalOrientationManager = new OrientationManager();

// ============================================================================
// LOCAL STORAGE INITIALIZATION
// ============================================================================
// Ensures all required localStorage values are properly initialized
// Called once when the game loads for the first time
// ============================================================================

/**
 * Initialize localStorage with default values if they don't exist
 * This ensures the game works properly on first load
 */
function initializeLocalStorage() {
  // Check if this is the first time loading the game
  const isFirstLoad = !localStorage.getItem('gameInitialized');
  
  if (isFirstLoad) {
    console.log('First time loading game - initializing localStorage...');
    
    // Initialize all required localStorage values with defaults
    localStorage.setItem('highScore', '0');                    // High score tracking
    localStorage.setItem('currentScore', '0');                 // Current game score
    localStorage.setItem('gamePlayCount', '0');                // Total games played
    localStorage.setItem('adViewCount', '0');                  // Total ads viewed
    localStorage.setItem('showAds', 'true');                   // Ads initially enabled
    localStorage.setItem('username', 'Anonymous');             // Default username
    localStorage.setItem('leaderboard', '[]');                 // Empty leaderboard array
    
    // Set default orientation based on current viewport
    const isLandscape = window.innerWidth > window.innerHeight;
    localStorage.setItem('preferredOrientation', isLandscape ? 'landscape' : 'portrait');
    
    // Mark game as initialized
    localStorage.setItem('gameInitialized', 'true');
    
    console.log('localStorage initialized successfully');
  } else {
    // Ensure critical values exist even if they were somehow deleted
    const defaults = {
      'highScore': '0',
      'currentScore': '0', 
      'gamePlayCount': '0',
      'adViewCount': '0',
      'showAds': 'true',
      'username': 'Anonymous',
      'leaderboard': '[]'
    };
    
    // Add orientation preference if it doesn't exist
    if (!localStorage.getItem('preferredOrientation')) {
      const isLandscape = window.innerWidth > window.innerHeight;
      localStorage.setItem('preferredOrientation', isLandscape ? 'landscape' : 'portrait');
    }
    
    // Check and set any missing values
    Object.entries(defaults).forEach(([key, defaultValue]) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, defaultValue);
        console.log(`Missing localStorage key "${key}" restored with default value`);
      }
    });
  }
}

// Initialize localStorage before creating the game
initializeLocalStorage();

// ============================================================================
// GAME CONFIGURATION AND INITIALIZATION
// ============================================================================
// Phaser game configuration object
// Defines renderer, physics, scenes, and scaling behavior
// Optimized for cross-platform compatibility and performance
// ============================================================================

const config = {
  // ========================================================================
  // RENDERER CONFIGURATION
  // ========================================================================
  type: Phaser.AUTO,                    // Auto-detect best renderer (WebGL or Canvas)
  width: GAME_CONFIG.WIDTH,             // Game width from configuration
  height: GAME_CONFIG.HEIGHT,           // Game height from configuration
  backgroundColor: GAME_CONFIG.BACKGROUND_COLOR,  // Background color from configuration
  
  // ========================================================================
  // PHYSICS SYSTEM CONFIGURATION
  // ========================================================================
  physics: {
    default: 'arcade',                  // Use Arcade Physics (lightweight 2D physics)
    arcade: { 
      gravity: { y: GAME_CONFIG.GRAVITY },  // Apply gravity from configuration
      debug: false                       // Disable physics debug visualization
    }
  },
  
  // ========================================================================
  // SCENE MANAGEMENT
  // ========================================================================
  // Order determines loading sequence and scene availability
  scene: [
    MainMenuScene,      // First scene (main menu) - entry point
    LeaderboardScene,   // Leaderboard display and management
    SettingsScene,      // Game settings and configuration
    StatisticsScene,    // Statistics and analytics display
    GameScene           // Main gameplay scene - core game logic
  ],
  
  // ========================================================================
  // SCALING AND DISPLAY CONFIGURATION
  // ========================================================================
  scale: {
    mode: Phaser.Scale.FIT,             // Scale to fit screen while maintaining aspect ratio
    autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game on screen
    orientation: Phaser.Scale.LANDSCAPE,  // Default to landscape orientation
  }
};

// ============================================================================
// GAME INITIALIZATION
// ============================================================================
// Create and start the Phaser game instance
// This initializes all systems and loads the first scene (MainMenuScene)
// ============================================================================

new Phaser.Game(config);
  
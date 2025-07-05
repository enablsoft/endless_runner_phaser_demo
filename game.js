// ============================================================================
// FEATURE MODULES IMPORT
// ============================================================================
// Import all feature modules for modular game architecture
// Each manager handles a specific aspect of the game functionality
// ============================================================================

import { 
  CloudManager, 
  OrientationManager, 
  PlayerManager, 
  ScoreManager, 
  SettingsManager, 
  TextureManager 
} from './features/index.js';

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
// GLOBAL MANAGERS INITIALIZATION
// ============================================================================
// Initialize global manager instances for use across all scenes
// These managers provide centralized functionality for game features
// ============================================================================

const globalManagers = {
  cloudManager: new CloudManager(),
  orientationManager: new OrientationManager(),
  playerManager: new PlayerManager(),
  scoreManager: new ScoreManager(),
  settingsManager: new SettingsManager(),
  textureManager: new TextureManager()
};

// ============================================================================
// GAME CONFIGURATION CONSTANTS
// ============================================================================
// Centralized configuration for all game parameters
// Makes it easy to adjust game balance and behavior
// All values can be tuned here for different difficulty levels
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
// All UI styling can be modified here for theme changes
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
// - Mobile fullscreen trigger on first interaction
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
    globalManagers.cloudManager.start(this); // Start animated cloud system
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
    const highScore = globalManagers.scoreManager.getHighScore();
    
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
      // Trigger mobile fullscreen on first user interaction
      this.triggerMobileFullscreen();
      this.scene.start('GameScene');
    });
    
    leaderboardButton.on('pointerdown', () => {
      // Trigger mobile fullscreen on first user interaction
      this.triggerMobileFullscreen();
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
      // Trigger mobile fullscreen on first user interaction
      this.triggerMobileFullscreen();
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

  /**
   * Trigger mobile fullscreen on first user interaction
   * This method is called when the user first interacts with the game
   * to satisfy browser requirements for fullscreen API
   */
  triggerMobileFullscreen() {
    // Only trigger once per session
    if (sessionStorage.getItem('mobileFullscreenTriggered')) {
      return;
    }

    // Mark that we've triggered fullscreen this session
    sessionStorage.setItem('mobileFullscreenTriggered', 'true');

    // Check if this is a mobile device and fullscreen is supported
    if (globalManagers.orientationManager.isMobileDevice() && 
        globalManagers.orientationManager.isFullscreenSupported()) {
      
      console.log('Triggering mobile fullscreen on user interaction...');
      
      // Small delay to ensure the scene transition doesn't interfere
      setTimeout(() => {
        globalManagers.orientationManager.requestMobileFullscreen()
          .then((success) => {
            if (success) {
              console.log('Mobile fullscreen entered successfully on user interaction');
              localStorage.setItem('mobileFullscreenEnabled', 'true');
            } else {
              console.log('Mobile fullscreen request was not successful');
            }
          })
          .catch((error) => {
            console.warn('Mobile fullscreen trigger error:', error);
          });
      }, 500);
    }
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
// - Tabbed interface for organized settings management
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
    globalManagers.cloudManager.start(this); // Start animated cloud system
    this.createTitle();             // Create animated title
    this.createSettings();          // Create all settings sections
    this.createBackButton();        // Create navigation back button
  }

  /**
   * Creates the sky blue background for the settings scene
   * Uses a simple rectangle that covers the entire canvas
   */
  createBackground() {
    this.add.rectangle(
      GAME_CONFIG.WIDTH / 2, 
      GAME_CONFIG.HEIGHT / 2, 
      GAME_CONFIG.WIDTH, 
      GAME_CONFIG.HEIGHT, 
      0x87ceeb
    );
  }

  /**
   * Creates the animated title for the settings scene
   * Features modern styling with shadows and entrance animations
   */
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

  /**
   * Creates the main settings interface with tabbed navigation
   * Initializes all settings tabs and their content
   * Features: Profile, Display, Ads, and Data management
   */
  createSettings() {
    // Get current settings using SettingsManager
    const currentUsername = globalManagers.settingsManager.getUsername();
    const showAds = globalManagers.settingsManager.getShowAds();
    const playerGender = globalManagers.settingsManager.getPlayerGender();

    // Initialize tab system
    this.currentTab = 'profile';
    this.tabs = {};
    this.tabContent = {};

    // Create tab navigation
    this.createTabNavigation();

    // Create tab content
    this.createProfileTab(currentUsername, playerGender);
    this.createDisplayTab();
    this.createAdsTab(showAds);
    this.createDataTab();

    // Show initial tab
    this.showTab('profile');

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

    // Add entrance animations for tab navigation
    this.animateTabEntrance();
  }

  /**
   * Creates the tab navigation system for settings
   * Features four tabs: Profile, Display, Ads, and Data
   * Each tab has unique colors and hover effects
   */
  createTabNavigation() {
    const tabConfigs = [
      { key: 'profile', text: '👤 PROFILE', color: '#2196F3' },
      { key: 'display', text: '🖥️ DISPLAY', color: '#9C27B0' },
      { key: 'ads', text: '📺 ADS', color: '#FF9800' },
      { key: 'data', text: '🗄️ DATA', color: '#F44336' }
    ];

    const tabWidth = 150;
    const tabHeight = 40;
    const tabGap = 10;
    const totalWidth = tabConfigs.length * tabWidth + (tabConfigs.length - 1) * tabGap;
    const startX = (GAME_CONFIG.WIDTH - totalWidth) / 2;
    const tabY = 150;

    tabConfigs.forEach((config, index) => {
      const x = startX + index * (tabWidth + tabGap) + tabWidth / 2;
      
      // Create tab button
      const tab = this.add.text(x, tabY, config.text, {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
        backgroundColor: this.currentTab === config.key ? config.color : '#666666',
        padding: { x: 15, y: 8 },
        borderRadius: 8
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      // Tab interactions
      tab.on('pointerdown', () => {
        this.showTab(config.key);
      });

      tab.on('pointerover', () => {
        if (this.currentTab !== config.key) {
          tab.setStyle({ backgroundColor: config.color, fill: '#ffffff' });
        }
      });

      tab.on('pointerout', () => {
        if (this.currentTab !== config.key) {
          tab.setStyle({ backgroundColor: '#666666', fill: '#ffffff' });
        }
      });

      this.tabs[config.key] = tab;
    });
  }

  /**
   * Creates the Profile tab with user settings
   * Features: Username management and gender selection
   * Uses modern UI design with clean typography and spacing
   */
  createProfileTab(currentUsername, playerGender) {
    const content = this.add.container(0, 220);
    this.tabContent['profile'] = content;

    // Create background panel for profile content
    const contentBg = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      120,
      500,
      320,
      0xffffff,
      0.95
    ).setStrokeStyle(3, 0x2196F3, 0.8);

    // Profile title within the box
    const profileTitle = this.add.text(GAME_CONFIG.WIDTH / 2, 0, '👤 PROFILE SETTINGS', {
      fontSize: '24px',
      fill: '#2196F3',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Username section - modern design
    const usernameTitle = this.add.text(GAME_CONFIG.WIDTH / 2, 30, 'USERNAME', {
      fontSize: '18px',
      fill: '#2C3E50',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 2
    }).setOrigin(0.5);

    // Username input background - modern card design
    const usernameBg = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2, 
      70, 
      300, 
      50, 
      0xF8F9FA, 
      1
    ).setStrokeStyle(2, 0xE9ECEF, 1).setOrigin(0.5);

    // Username text display - modern styling
    this.usernameText = this.add.text(GAME_CONFIG.WIDTH / 2, 70, currentUsername || 'Enter your username...', {
      fontSize: '16px',
      fill: currentUsername ? '#495057' : '#ADB5BD',
      fontFamily: 'Arial',
      fontStyle: currentUsername ? 'bold' : 'normal',
      align: 'center'
    }).setOrigin(0.5);

    // Change username button - modern flat design
    const changeUsernameButton = this.add.text(GAME_CONFIG.WIDTH / 2, 125, 'EDIT USERNAME', {
      fontSize: '14px',
      fill: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      backgroundColor: '#007BFF',
      padding: { x: 25, y: 12 },
      borderRadius: 25
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Player gender section - modern design
    const genderTitle = this.add.text(GAME_CONFIG.WIDTH / 2, 170, 'GENDER', {
      fontSize: '18px',
      fill: '#2C3E50',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 2
    }).setOrigin(0.5);

    // Gender selection buttons - modern toggle design
    const genderButtonWidth = 110;
    const genderGap = 40;
    const genderStartX = GAME_CONFIG.WIDTH / 2 - (genderButtonWidth + genderGap) / 2;

    const maleButton = this.add.text(genderStartX, 210, '👨 MALE', {
      fontSize: '14px',
      fill: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      backgroundColor: playerGender === 'male' ? '#28A745' : '#6C757D',
      padding: { x: 20, y: 12 },
      borderRadius: 20
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const femaleButton = this.add.text(genderStartX + genderButtonWidth + genderGap, 210, '👩 FEMALE', {
      fontSize: '14px',
      fill: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      backgroundColor: playerGender === 'female' ? '#DC3545' : '#6C757D',
      padding: { x: 20, y: 12 },
      borderRadius: 20
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Gender button interactions
    maleButton.on('pointerdown', () => {
      globalManagers.settingsManager.setPlayerGender('male');
      globalManagers.playerManager.setStoredGender('male');
      maleButton.setStyle({ backgroundColor: '#2196F3' });
      femaleButton.setStyle({ backgroundColor: '#666' });
    });

    femaleButton.on('pointerdown', () => {
      globalManagers.settingsManager.setPlayerGender('female');
      globalManagers.playerManager.setStoredGender('female');
      femaleButton.setStyle({ backgroundColor: '#E91E63' });
      maleButton.setStyle({ backgroundColor: '#666' });
    });

    // Username interactions
    usernameBg.setInteractive({ useHandCursor: true });
    usernameBg.on('pointerdown', () => this.startUsernameInput());
    changeUsernameButton.on('pointerdown', () => this.startUsernameInput());

    // Add all elements to content container
    content.add([contentBg, profileTitle, usernameTitle, usernameBg, this.usernameText, changeUsernameButton, genderTitle, maleButton, femaleButton]);
  }

  /**
   * Creates the Display tab with screen and orientation settings
   * Features: Fullscreen mode control and mobile device information
   * Provides immersive gaming experience options
   */
  createDisplayTab() {
    const content = this.add.container(0, 220);
    this.tabContent['display'] = content;

    // Create background panel for display content
    const contentBg = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      100,
      500,
      240,
      0xffffff,
      0.95
    ).setStrokeStyle(3, 0x9C27B0, 0.8);

    // Display title within the box
    const displayTitle = this.add.text(GAME_CONFIG.WIDTH / 2, 30, '🖥️ DISPLAY SETTINGS', {
      fontSize: '24px',
      fill: '#9C27B0',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Fullscreen section title
    const fullscreenTitle = this.add.text(GAME_CONFIG.WIDTH / 2, 65, '🔍 FULLSCREEN MODE', {
      fontSize: '20px',
      fill: '#333',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Fullscreen button with dynamic text based on support
    const fullscreenButtonText = this.isFullscreenSupported() ? '🔍 ENTER FULLSCREEN' : '🔍 FULLSCREEN NOT SUPPORTED';
    const fullscreenButtonColor = this.isFullscreenSupported() ? '#9C27B0' : '#666666';
    
    const fullscreenButton = this.add.text(GAME_CONFIG.WIDTH / 2, 110, fullscreenButtonText, {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: fullscreenButtonColor,
      padding: { x: 20, y: 12 },
      borderRadius: 8
    }).setOrigin(0.5).setInteractive({ useHandCursor: this.isFullscreenSupported() });

    // Fullscreen description
    const fullscreenDesc = this.add.text(GAME_CONFIG.WIDTH / 2, 155, 'Toggle immersive fullscreen gaming experience', {
      fontSize: '16px',
      fill: '#666',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);

    // Mobile device information
    const mobileInfo = this.add.text(GAME_CONFIG.WIDTH / 2, 190, '📱 Mobile devices auto-enter fullscreen on first interaction', {
      fontSize: '14px',
      fill: '#999',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);

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
    this.initializeButtonStates(fullscreenButton, null);

    // Add elements to content container
    content.add([contentBg, displayTitle, fullscreenTitle, fullscreenButton, fullscreenDesc, mobileInfo]);
  }

  /**
   * Creates the Ads tab with advertisement control settings
   * Features: Enable/disable ads, view statistics, and ad frequency information
   * Provides user control over advertising experience
   */
  createAdsTab(showAds) {
    const content = this.add.container(0, 200);
    this.tabContent['ads'] = content;

    // Create background panel for ads content
    const contentBg = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      85,
      500,
      210,
      0xffffff,
      0.95
    ).setStrokeStyle(3, 0xFF9800, 0.8);

    // Ads title within the box
    const adsTitle = this.add.text(GAME_CONFIG.WIDTH / 2, 20, '📺 ADS SETTINGS', {
      fontSize: '20px',
      fill: '#FF9800',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Ads description
    const adsDesc = this.add.text(GAME_CONFIG.WIDTH / 2, 50, 'Control ad display preferences and view statistics', {
      fontSize: '12px',
      fill: '#666',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);

    // Calculate button positions for ads section
    const adsButtonWidth = 120;
    const adsGap = 20;
    const adsTotalWidth = adsButtonWidth * 3 + adsGap * 2;
    const adsStartX = (GAME_CONFIG.WIDTH - adsTotalWidth) / 2 + adsButtonWidth / 2;

    // Enable ads button
    const enableAdsButton = this.add.text(adsStartX, 90, '✅ ENABLE ADS', {
      fontSize: '14px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: showAds ? '#4CAF50' : '#666',
      padding: { x: 10, y: 6 },
      borderRadius: 6
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Disable ads button
    const disableAdsButton = this.add.text(adsStartX + adsButtonWidth + adsGap, 90, '❌ DISABLE ADS', {
      fontSize: '14px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: !showAds ? '#f44336' : '#666',
      padding: { x: 10, y: 6 },
      borderRadius: 6
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Statistics button
    const statsButton = this.add.text(adsStartX + (adsButtonWidth + adsGap) * 2, 90, '📊 STATISTICS', {
      fontSize: '14px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#4CAF50',
      padding: { x: 10, y: 6 },
      borderRadius: 6
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Ad frequency information
    const adInfo = this.add.text(GAME_CONFIG.WIDTH / 2, 140, '📺 Ads appear every 3 games when enabled', {
      fontSize: '10px',
      fill: '#999',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);

    // Button interactions
    enableAdsButton.on('pointerdown', () => {
      globalManagers.settingsManager.setShowAds(true);
      enableAdsButton.setStyle({ backgroundColor: '#4CAF50' });
      disableAdsButton.setStyle({ backgroundColor: '#666' });
    });

    disableAdsButton.on('pointerdown', () => {
      globalManagers.settingsManager.setShowAds(false);
      disableAdsButton.setStyle({ backgroundColor: '#f44336' });
      enableAdsButton.setStyle({ backgroundColor: '#666' });
    });

    statsButton.on('pointerdown', () => {
      this.scene.start('StatisticsScene');
    });

    // Add elements to content container
    content.add([contentBg, adsTitle, adsDesc, enableAdsButton, disableAdsButton, statsButton, adInfo]);
  }

  /**
   * Creates the Data tab with data management options
   * Features: Clear leaderboard functionality with confirmation
   * Provides data reset capabilities with safety warnings
   */
  createDataTab() {
    const content = this.add.container(0, 200);
    this.tabContent['data'] = content;

    // Create background panel for data content
    const contentBg = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      85,
      500,
      210,
      0xffffff,
      0.95
    ).setStrokeStyle(3, 0xF44336, 0.8);

    // Data title within the box
    const dataTitle = this.add.text(GAME_CONFIG.WIDTH / 2, 20, '🗄️ DATA MANAGEMENT', {
      fontSize: '20px',
      fill: '#F44336',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Data description
    const dataDesc = this.add.text(GAME_CONFIG.WIDTH / 2, 50, 'Manage your game data and leaderboard information', {
      fontSize: '12px',
      fill: '#666',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);

    // Warning message
    const warningText = this.add.text(GAME_CONFIG.WIDTH / 2, 80, '⚠️ WARNING: This action cannot be undone!', {
      fontSize: '14px',
      fill: '#F44336',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    // Clear leaderboard button
    const clearLeaderboardButton = this.add.text(GAME_CONFIG.WIDTH / 2, 120, '🗑️ CLEAR ALL SCORES', {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#f44336',
      padding: { x: 15, y: 8 },
      borderRadius: 8
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Clear leaderboard description
    const clearDesc = this.add.text(GAME_CONFIG.WIDTH / 2, 160, 'This will permanently delete all leaderboard scores and reset your high score', {
      fontSize: '10px',
      fill: '#999',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);

    // Clear leaderboard button interaction
    clearLeaderboardButton.on('pointerdown', () => {
      this.showClearConfirmation(clearLeaderboardButton);
    });

    // Add elements to content container
    content.add([contentBg, dataTitle, dataDesc, warningText, clearLeaderboardButton, clearDesc]);
  }

  /**
   * Switches between different settings tabs
   * Updates tab button appearances and shows/hides content
   * @param {string} tabKey - The tab to switch to ('profile', 'display', 'ads', 'data')
   */
  showTab(tabKey) {
    // Update current tab
    this.currentTab = tabKey;

    // Update tab button appearances
    const tabConfigs = [
      { key: 'profile', color: '#2196F3' },
      { key: 'display', color: '#9C27B0' },
      { key: 'ads', color: '#FF9800' },
      { key: 'data', color: '#F44336' }
    ];

    tabConfigs.forEach(config => {
      const tab = this.tabs[config.key];
      if (tab) {
        const isActive = config.key === tabKey;
        tab.setStyle({ 
          backgroundColor: isActive ? config.color : '#666666',
          fill: '#ffffff'
        });
      }
    });

    // Hide all tab content
    Object.values(this.tabContent).forEach(content => {
      content.setVisible(false);
    });

    // Show selected tab content
    if (this.tabContent[tabKey]) {
      this.tabContent[tabKey].setVisible(true);
    }
  }

  /**
   * Animates the entrance of tab navigation and content
   * Creates smooth entrance effects for better user experience
   * Staggers animations for visual appeal
   */
  animateTabEntrance() {
    // Animate tab navigation
    Object.values(this.tabs).forEach((tab, index) => {
      tab.setAlpha(0);
      tab.setY(tab.y + 30);
      
      this.tweens.add({
        targets: tab,
        alpha: 1,
        y: tab.y - 30,
        duration: 600,
        delay: 300 + (index * 100),
        ease: 'Back.easeOut'
      });
    });

    // Animate initial tab content
    if (this.tabContent[this.currentTab]) {
      const content = this.tabContent[this.currentTab];
      content.setAlpha(0);
      content.setY(content.y + 50);
      
      this.tweens.add({
        targets: content,
        alpha: 1,
        y: content.y - 50,
        duration: 800,
        delay: 700,
        ease: 'Back.easeOut'
      });
    }
  }

  /**
   * Creates an interactive username input overlay
   * Features: Modal dialog with input field, real-time text input, and validation
   * Provides smooth user experience for username changes
   */
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
    
    // Focus hidden input to trigger mobile keyboard (only on mobile)
    if (this.isMobileDevice()) {
      setTimeout(() => {
        hiddenInput.focus();
        hiddenInput.select();
      }, 100);
    }
    
    // Handle input changes from mobile keyboard
    hiddenInput.addEventListener('input', (event) => {
      currentInput = event.target.value;
      inputText.setText(currentInput);
      updateCursorPosition();
    });
    
    // Handle keyboard input for desktop (only if not on mobile)
    if (!this.isMobileDevice()) {
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
    }

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
      const oldUsername = globalManagers.settingsManager.getUsername();
      const newUsername = username.trim();
      
      globalManagers.settingsManager.setUsername(newUsername);
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
    
    globalManagers.scoreManager.updateLeaderboardUsernames(oldUsername, newUsername);
  }

  cancelUsernameInput(elements) {
    elements.forEach(element => {
      if (element && typeof element.destroy === 'function') {
        element.destroy();
      } else if (element && element.remove) {
        // Remove hidden input from DOM
        element.remove();
      }
    });
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
      // Clear leaderboard and reset high score using ScoreManager
      globalManagers.scoreManager.clearLeaderboard();
      globalManagers.scoreManager.setHighScore(0);
      
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
    globalManagers.cloudManager.start(this); // Start animated cloud system
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
    // Get statistics using managers
    const gamePlayCount = globalManagers.scoreManager.getGamePlayCount();
    const adViewCount = globalManagers.scoreManager.getAdViewCount();
    const highScore = globalManagers.scoreManager.getHighScore();
    const adsEnabled = globalManagers.settingsManager.getShowAds();
    const username = globalManagers.settingsManager.getUsername();
    
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
    globalManagers.cloudManager.start(this); // Start animated cloud system
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
    
    // Use ScoreManager's pagination data
    const pageData = globalManagers.scoreManager.getLeaderboardPage(0, this.itemsPerPage);
    this.totalPages = pageData.totalPages;

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

    // Use ScoreManager's pagination method
    const pageData = globalManagers.scoreManager.getLeaderboardPage(this.currentPage, this.itemsPerPage);
    const pageEntries = pageData.entries;

    let yPos = 200;

    pageEntries.forEach((entry, index) => {
      const globalIndex = this.currentPage * this.itemsPerPage + index;
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
    // Update page info using ScoreManager's pagination data
    const pageData = globalManagers.scoreManager.getLeaderboardPage(this.currentPage, this.itemsPerPage);
    this.pageInfo.setText(`Page ${pageData.currentPage + 1} of ${pageData.totalPages}`);

    // Check if buttons should be disabled using ScoreManager's pagination data
    const isFirstPage = pageData.currentPage === 0;
    const isLastPage = pageData.currentPage === pageData.totalPages - 1;

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
    return globalManagers.scoreManager.getLeaderboard();
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
    // Game state variables using managers
    this.score = globalManagers.scoreManager.getCurrentScore();
    this.level = 1;
    this.speed = GAME_CONFIG.INITIAL_SPEED;
    this.spawnDelay = GAME_CONFIG.INITIAL_SPAWN_DELAY;
    this.canDoubleJump = true;
    this.gameOver = false;
    this.isPaused = false;
    this.gameStarted = false;
    this.reviveGivenThisLevel = false;
    this.highScore = globalManagers.scoreManager.getHighScore();
    this.lastSpawnedObstacle = null; // Track the last spawned obstacle for coin placement
  
    // Power-ups system
    this.powerUps = {
      revive: false
    };
    this.powerUpTimer = null;
  
    // Ad system - track game play count and ad views
    this.gamePlayCount = globalManagers.scoreManager.getGamePlayCount();
    this.adViewCount = globalManagers.scoreManager.getAdViewCount();
  }

  createGameObjects() {
    // Create ground
      this.ground = this.physics.add.staticGroup();
    this.ground.create(GAME_CONFIG.WIDTH / 2, GAME_CONFIG.GROUND_Y, 'ground');

    // Create player using PlayerManager
    this.player = globalManagers.playerManager.createPlayer(this, GAME_CONFIG.PLAYER_START_X, GAME_CONFIG.PLAYER_START_Y - 10);
    this.player.setCollideWorldBounds(true).setBounce(GAME_CONFIG.PLAYER_BOUNCE);
    
    // Set custom collision bounds for better collision detection
    this.player.body.setSize(32, 40); // Smaller collision box than visual size
    this.player.body.setOffset(6, 8);  // Center the collision box

    // Create object groups
      this.obstacles = this.physics.add.group();
      this.coins = this.physics.add.group();
  
    // Start global cloud manager
    globalManagers.cloudManager.start(this);
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
        globalManagers.cloudManager.pause();
      } else {
        this.physics.resume();
        this.pauseText.setText('');
        this.spawnTimer.paused = false;
        globalManagers.cloudManager.resume();
      }
    }
  
    restartGame() {
    // Increment game play count and check for ad
    this.gamePlayCount++;
    globalManagers.scoreManager.incrementGamePlayCount();
    
    // Check if ads are enabled and if it's time to show an ad (every 3 game plays)
    const adsEnabled = globalManagers.settingsManager.getShowAds();
    if (adsEnabled && this.gamePlayCount % 3 === 0) {
      this.showAdPopup();
      return; // Don't restart yet, wait for ad to close
    }
    
    this.performRestart();
  }
  
  performRestart() {
      this.gameOver = false;
      this.score = 0;
      globalManagers.scoreManager.setCurrentScore(0);
      this.level = 1;
    this.speed = GAME_CONFIG.INITIAL_SPEED;
    this.spawnDelay = GAME_CONFIG.INITIAL_SPAWN_DELAY;
      this.canDoubleJump = true;
    this.lastSpawnedObstacle = null; // Reset obstacle tracking
  
    // Reset player using PlayerManager
    globalManagers.playerManager.updatePlayerTexture(this.player);
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
    globalManagers.scoreManager.incrementAdViewCount();
    
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
  
      // Save current score using ScoreManager
      globalManagers.scoreManager.setCurrentScore(this.score);

      // Update high score if needed
      if (this.score > this.highScore) {
        this.highScore = this.score;
        globalManagers.scoreManager.setHighScore(this.highScore);
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
    
    const username = globalManagers.settingsManager.getUsername();
    globalManagers.scoreManager.addToLeaderboard(this.score, this.level, username);
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
      // Use the TextureManager to create all game textures
      globalManagers.textureManager.createAllTextures(this);
      
      // Use the PlayerManager to create player textures
      globalManagers.playerManager.createPlayerTextures(this);
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
// LOCAL STORAGE INITIALIZATION
// ============================================================================
// Ensures all required localStorage values are properly initialized
// Called once when the game loads for the first time
// Provides data persistence across game sessions
// ============================================================================

/**
 * Initialize localStorage with default values if they don't exist
 * This ensures the game works properly on first load
 * Sets up all required game data with sensible defaults
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
    mode: Phaser.Scale.AUTO,             // Scale to fit screen while maintaining aspect ratio
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

const game = new Phaser.Game(config);

// ============================================================================
// MOBILE FULLSCREEN INITIALIZATION
// ============================================================================
// Automatically request fullscreen on mobile devices for better gaming experience
// Only triggers on first load and requires user interaction
// Provides enhanced mobile gaming experience
// ============================================================================

/**
 * Function to handle mobile fullscreen initialization
 * Checks device compatibility and user preferences before requesting fullscreen
 * Ensures optimal mobile gaming experience
 */
function initializeMobileFullscreen() {
  // Only proceed if this is a mobile device
  if (!globalManagers.orientationManager.isMobileDevice()) {
    console.log('Desktop device detected - skipping mobile fullscreen initialization');
    return;
  }

  // Check if fullscreen is supported
  if (!globalManagers.orientationManager.isFullscreenSupported()) {
    console.log('Fullscreen not supported on this mobile device');
    return;
  }

  // Check if we've already attempted mobile fullscreen on this session
  if (sessionStorage.getItem('mobileFullscreenAttempted')) {
    console.log('Mobile fullscreen already attempted this session');
    return;
  }

  // Check if user has previously declined mobile fullscreen
  if (localStorage.getItem('mobileFullscreenDeclined') === 'true') {
    console.log('User previously declined mobile fullscreen');
    return;
  }

  // Wait for the game to be fully loaded and ready
  setTimeout(() => {
    console.log('Attempting to enter mobile fullscreen mode...');
    
    // Mark that we've attempted fullscreen this session
    sessionStorage.setItem('mobileFullscreenAttempted', 'true');
    
    // Request fullscreen
    globalManagers.orientationManager.requestMobileFullscreen()
      .then((success) => {
        if (success) {
          console.log('Mobile fullscreen entered successfully');
          // Store preference for future sessions
          localStorage.setItem('mobileFullscreenEnabled', 'true');
        } else {
          console.log('Mobile fullscreen request was not successful');
        }
      })
      .catch((error) => {
        console.warn('Mobile fullscreen initialization error:', error);
      });
  }, 1000); // Wait 1 second for game to be ready
}

// Initialize mobile fullscreen after a short delay to ensure game is loaded
setTimeout(initializeMobileFullscreen, 2000);
  
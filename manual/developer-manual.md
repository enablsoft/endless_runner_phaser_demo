 # 🛠️ Endless Runner - Developer Manual

Technical documentation for understanding and working with the Endless Runner game codebase.

## 📋 Table of Contents

1. [Code Overview](#code-overview)
2. [Architecture](#architecture)
3. [Core Classes](#core-classes)
4. [Configuration System](#configuration-system)
5. [Scene Management](#scene-management)
6. [Game Systems](#game-systems)
7. [Data Management](#data-management)
8. [Mobile Support](#mobile-support)
9. [Development Guide](#development-guide)
10. [API Reference](#api-reference)

---

## 🎯 Code Overview

### Project Structure
```
endless_runner_phaser_demo/
├── game.js                    # Single file containing all game logic
├── index.html                 # HTML entry point with Phaser CDN
├── README.md                  # Project overview
├── LICENSE                    # MIT License
└── manual/                    # Documentation
    ├── user-manual.md         # User guide
    └── developer-manual.md    # This file
```

### Key Design Decisions
- **Single File Architecture**: All code in `game.js` for simplicity
- **Scene-Based Design**: Each game section is a separate Phaser scene
- **Configuration-Driven**: Centralized constants for easy tuning
- **Global Managers**: Cross-scene functionality (clouds, orientation)
- **localStorage Persistence**: Client-side data storage

### Technology Stack
- **Phaser 3.60.0**: HTML5 game framework
- **JavaScript ES6+**: Modern features (classes, arrow functions, const/let)
- **localStorage API**: Persistent data storage
- **Canvas Graphics**: Programmatic texture generation
- **CSS3**: Modern styling and animations

---

## 🏗️ Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Game Application                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Main Menu   │  │   Game      │  │  Settings   │        │
│  │   Scene     │  │   Scene     │  │   Scene     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │Leaderboard  │  │Statistics   │  │   Global    │        │
│  │   Scene     │  │   Scene     │  │  Managers   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│                    Phaser 3 Framework                       │
├─────────────────────────────────────────────────────────────┤
│                    Browser APIs                             │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns
- **Scene Pattern**: Each game section is a separate scene
- **Manager Pattern**: Global managers for cross-scene functionality
- **Configuration Pattern**: Centralized game parameters
- **Observer Pattern**: Event-driven communication
- **Factory Pattern**: Programmatic texture generation

---

## 🎮 Core Classes

### Scene Classes

#### MainMenuScene
```javascript
class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }
  
  create() {
    this.createBackground();        // Sky blue background
    globalCloudManager.start(this); // Start cloud system
    this.createTitle();             // Animated title
    this.createHighScoreDisplay();  // Show high score
    this.createButtons();           // Navigation buttons
    this.createInstructions();      // Game instructions
  }
}
```

#### GameScene
```javascript
class GameScene extends Phaser.Scene {
  create() {
    this.initializeGameState();  // Set up game variables
    this.createTextures();       // Generate all textures
    this.createGameObjects();    // Create player, ground, groups
    this.setupPhysics();         // Configure physics
    this.setupUI();              // Create score/level display
    this.setupInputHandlers();   // Keyboard/touch input
    this.setupSpawnTimer();      // Start obstacle spawning
  }
  
  update() {
    // Main game loop - handles movement, collisions, scoring
  }
}
```

#### SettingsScene
```javascript
class SettingsScene extends Phaser.Scene {
  create() {
    this.createBackground();
    globalCloudManager.start(this);
    this.createTitle();
    this.createSettings();        // Username, ads, display settings
    this.createBackButton();
  }
  
  startUsernameInput() {
    // Canvas-based input system for username editing
  }
}
```

#### LeaderboardScene
```javascript
class LeaderboardScene extends Phaser.Scene {
  create() {
    this.createBackground();
    globalCloudManager.start(this);
    this.createTitle();
    this.createLeaderboardEntries(); // Table with pagination
    this.createBackButton();
  }
  
  displayCurrentPage() {
    // Show 6 entries per page with navigation
  }
}
```

#### StatisticsScene
```javascript
class StatisticsScene extends Phaser.Scene {
  create() {
    this.createBackground();
    globalCloudManager.start(this);
    this.createTitle();
    this.createStatistics();      // Analytics table
    this.createBackButton();
  }
}
```

### Manager Classes

#### CloudManager
```javascript
class CloudManager {
  constructor() {
    this.clouds = [];           // Active cloud objects
    this.isActive = false;      // System state
    this.spawnTimer = null;     // Spawning timer
  }
  
  start(scene) {
    this.scene = scene;
    this.isActive = true;
    this.createCloudTextures();    // Generate cloud graphics
    this.spawnInitialClouds();     // Create starting clouds
    this.startSpawning();          // Begin periodic spawning
  }
  
  spawnCloud() {
    // Create cloud with scene-specific behavior
    // Different opacity, speed, and positioning per scene
  }
}
```

#### OrientationManager
```javascript
class OrientationManager {
  constructor() {
    this.currentOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    this.listeners = [];
    this.setupGlobalListener();
  }
  
  setupGlobalListener() {
    // Global resize listener for orientation changes
    // Updates localStorage and notifies all listeners
  }
}
```

---

## ⚙️ Configuration System

### GAME_CONFIG Object
Centralized configuration for all game parameters:

```javascript
const GAME_CONFIG = {
  // Display settings
  WIDTH: 800,
  HEIGHT: 600,
  BACKGROUND_COLOR: '#87ceeb',
  
  // Physics settings
  GRAVITY: 800,
  PLAYER_BOUNCE: 0.1,
  
  // Player positioning
  PLAYER_START_X: 100,
  PLAYER_START_Y: 300,
  GROUND_Y: 520,
  
  // Spawning positions
  OBSTACLE_SPAWN_X: 800,
  OBSTACLE_Y: 490,
  COIN_SPAWN_X: 800,
  COIN_MIN_Y: 340,
  COIN_MAX_Y: 400,
  
  // Game progression
  INITIAL_SPEED: 150,
  INITIAL_SPAWN_DELAY: 1500,
  SPEED_INCREMENT: 0.005,
  LEVEL_SPEED_BONUS: 20,
  SPAWN_DELAY_REDUCTION: 150,
  MIN_SPAWN_DELAY: 500,
  
  // Scoring
  SCORE_PER_COIN: 10,
  SCORE_PER_LEVEL: 100,
  
  // Power-ups
  REVIVE_CHANCE: 20,
  
  // Player movement
  JUMP_VELOCITY: -420,
  DOUBLE_JUMP_VELOCITY: -360
};
```

### UI_CONFIG Object
Styling and layout configuration:

```javascript
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
    shadow: { ... }
  },
  
  MENU_BUTTON_STYLE: { ... },
  
  BUTTON_WIDTH: 110,
  BUTTON_GAP: 35,
  UI_PANEL_HEIGHT: 70
};
```

### Configuration Best Practices
- **Single Source of Truth**: All parameters in one place
- **Descriptive Names**: Clear, self-documenting parameter names
- **Grouped Organization**: Logical grouping with comments
- **Easy Tuning**: Simple values for quick adjustments
- **Documentation**: Clear comments explaining each parameter

---

## 🎬 Scene Management

### Scene Lifecycle
Each scene follows the Phaser 3 lifecycle:

```javascript
class ExampleScene extends Phaser.Scene {
  constructor() {
    super('SceneName');
  }
  
  preload() {
    // Load assets (if needed)
  }
  
  create() {
    // Initialize scene elements
  }
  
  update() {
    // Game loop logic
  }
  
  shutdown() {
    // Cleanup when leaving scene
  }
}
```

### Scene Communication
- **Scene Transitions**: `this.scene.start('SceneName')`
- **Data Passing**: Use scene data or global variables
- **Event System**: Phaser events for cross-scene communication

### Scene Organization
1. **MainMenuScene**: Entry point and navigation hub
2. **GameScene**: Core gameplay mechanics
3. **SettingsScene**: Configuration and preferences
4. **LeaderboardScene**: Score display and management
5. **StatisticsScene**: Analytics and data visualization

---

## 🎮 Game Systems

### Physics System
```javascript
// Arcade Physics Configuration
physics: {
  default: 'arcade',
  arcade: { 
    gravity: { y: GAME_CONFIG.GRAVITY },
    debug: false
  }
}

// Collision Detection
this.physics.add.collider(player, obstacles, this.hitObstacle, null, this);
this.physics.add.overlap(player, coins, this.collectCoin, null, this);
```

### Input System
```javascript
// Keyboard Input
this.input.keyboard.on('keydown-SPACE', this.jump, this);
this.input.keyboard.on('keydown-P', this.togglePause, this);

// Touch Input
button.setInteractive({ useHandCursor: true });
button.on('pointerdown', callback);
```

### Animation System
```javascript
// Tween Animations
this.tweens.add({
  targets: object,
  alpha: 1,
  y: targetY,
  duration: 1000,
  ease: 'Back.easeOut'
});
```

### Spawning System
```javascript
// Timer-based spawning
this.spawnTimer = this.time.addEvent({
  delay: GAME_CONFIG.INITIAL_SPAWN_DELAY,
  loop: true,
  callback: this.spawnObstacle,
  callbackScope: this
});
```

---

## 💾 Data Management

### localStorage Structure
```javascript
// Core Game Data
localStorage.setItem('highScore', '0');
localStorage.setItem('currentScore', '0');
localStorage.setItem('gamePlayCount', '0');

// User Preferences
localStorage.setItem('username', 'Anonymous');
localStorage.setItem('showAds', 'true');
localStorage.setItem('preferredOrientation', 'landscape');

// Leaderboard Data
localStorage.setItem('leaderboard', JSON.stringify([]));

// Statistics
localStorage.setItem('adViewCount', '0');
```

### Data Operations
```javascript
// Reading Data
const highScore = parseInt(localStorage.getItem('highScore')) || 0;

// Writing Data
localStorage.setItem('highScore', score.toString());

// Complex Data (JSON)
const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
```

### Data Validation
```javascript
function validateLocalStorage() {
  const defaults = {
    'highScore': '0',
    'currentScore': '0',
    'gamePlayCount': '0',
    'adViewCount': '0',
    'showAds': 'true',
    'username': 'Anonymous',
    'leaderboard': '[]'
  };
  
  Object.entries(defaults).forEach(([key, defaultValue]) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, defaultValue);
    }
  });
}
```

---

## 📱 Mobile Support

### Responsive Design
```javascript
// Viewport Detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Orientation Detection
const isLandscape = window.innerWidth > window.innerHeight;
```

### Touch Controls
```javascript
// Touch-Friendly Buttons
const buttonStyle = {
  fontSize: '18px',
  padding: { x: 20, y: 10 },
  backgroundColor: '#444'
};

// Touch Event Handling
button.setInteractive({ useHandCursor: true });
button.on('pointerdown', callback);
```

### Mobile-Specific Features
```javascript
// Fullscreen API
function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}

// Orientation API
screen.orientation.lock('landscape').catch(() => {
  // Fallback for unsupported browsers
});
```

---

## 🛠️ Development Guide

### Getting Started
```bash
# Clone repository
git clone <repository-url>
cd endless_runner_phaser_demo

# Start local server
python -m http.server 8000

# Open in browser
http://localhost:8000
```

### Code Organization
1. **Configuration Constants** (top of file)
2. **Scene Classes** (MainMenuScene, GameScene, etc.)
3. **Manager Classes** (CloudManager, OrientationManager)
4. **Utility Functions** (initializeLocalStorage)
5. **Game Configuration** (Phaser config object)
6. **Game Initialization** (new Phaser.Game())

### Development Workflow
1. **Modify Configuration**: Adjust `GAME_CONFIG` for game balance
2. **Update Scenes**: Modify scene classes for new features
3. **Test Changes**: Use browser dev tools for debugging
4. **Optimize Performance**: Monitor frame rate and memory usage

### Debugging Tips
```javascript
// Enable physics debug
physics: {
  arcade: { debug: true }
}

// Console logging
console.log('Game state:', this.gameState);
console.time('spawnObstacle');
this.spawnObstacle();
console.timeEnd('spawnObstacle');

// Performance monitoring
console.log('FPS:', this.game.loop.actualFps);
```

### Common Patterns

#### Button Creation
```javascript
const createButton = (x, y, text, callback) => {
  const button = this.add.text(x, y, text, UI_CONFIG.BUTTON_STYLE)
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });
  
  button.on('pointerdown', callback);
  return button;
};
```

#### Scene Background
```javascript
createBackground() {
  this.add.rectangle(
    GAME_CONFIG.WIDTH / 2,
    GAME_CONFIG.HEIGHT / 2,
    GAME_CONFIG.WIDTH,
    GAME_CONFIG.HEIGHT,
    0x87ceeb  // Sky blue
  );
}
```

#### Animated Title
```javascript
createTitle() {
  const title = this.add.text(GAME_CONFIG.WIDTH / 2, 80, 'GAME TITLE', {
    fontSize: '48px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 4
  }).setOrigin(0.5);
  
  // Entrance animation
  title.setAlpha(0);
  title.setY(30);
  this.tweens.add({
    targets: title,
    alpha: 1,
    y: 80,
    duration: 1000,
    ease: 'Back.easeOut'
  });
}
```

---



---

## 📚 API Reference

### Core Classes

#### MainMenuScene
```javascript
class MainMenuScene extends Phaser.Scene {
  create() // Initialize main menu
  createTitle() // Create animated title
  createButtons() // Create navigation buttons
  createHighScoreDisplay() // Show persistent high score
}
```

#### GameScene
```javascript
class GameScene extends Phaser.Scene {
  create() // Initialize game
  update() // Game loop
  jump() // Player jump mechanics
  spawnObstacle() // Spawn new obstacles
  collectCoin() // Handle coin collection
  hitObstacle() // Handle collision
}
```

#### CloudManager
```javascript
class CloudManager {
  start(scene) // Start cloud system
  stop() // Stop cloud system
  spawnCloud() // Spawn individual cloud
  pause() // Pause animations
  resume() // Resume animations
}
```

#### OrientationManager
```javascript
class OrientationManager {
  getCurrentOrientation() // Get current orientation
  getStoredOrientation() // Get stored preference
  addListener(callback) // Add orientation listener
  removeListener(callback) // Remove listener
}
```

### Configuration Objects

#### GAME_CONFIG
- **Display**: WIDTH, HEIGHT, BACKGROUND_COLOR
- **Physics**: GRAVITY, PLAYER_BOUNCE
- **Player**: PLAYER_START_X, PLAYER_START_Y, GROUND_Y
- **Spawning**: OBSTACLE_SPAWN_X, COIN_SPAWN_X, etc.
- **Progression**: INITIAL_SPEED, SPEED_INCREMENT, etc.
- **Scoring**: SCORE_PER_COIN, SCORE_PER_LEVEL
- **Movement**: JUMP_VELOCITY, DOUBLE_JUMP_VELOCITY

#### UI_CONFIG
- **BUTTON_STYLE**: Standard button styling
- **MENU_BUTTON_STYLE**: Menu-specific button styling
- **Layout**: BUTTON_WIDTH, BUTTON_GAP, UI_PANEL_HEIGHT

### Utility Functions

#### initializeLocalStorage()
Initializes localStorage with default values if not present.

#### Global Instances
- **globalCloudManager**: Shared cloud system across scenes
- **globalOrientationManager**: Cross-scene orientation management

---

## 🔮 Future Enhancements

### Planned Features
- **Sound System**: Background music and sound effects
- **Particle Effects**: Enhanced visual feedback
- **Achievement System**: Unlockable achievements
- **Social Features**: Share scores on social media
- **Progressive Web App**: Offline support and app-like experience

### Technical Improvements
- **Build System**: Webpack or Vite for optimization
- **TypeScript**: Type safety and better tooling
- **Testing Framework**: Automated testing suite
- **Performance Monitoring**: Real-time performance tracking
- **Analytics**: Player behavior tracking

### Code Quality
- **Linting**: ESLint configuration
- **Formatting**: Prettier code formatting
- **Documentation**: Enhanced JSDoc comments
- **Modularization**: Split into multiple files
- **Error Boundaries**: Better error handling

---

## 📞 Support & Contributing

### Getting Help
- **Documentation**: Check this manual and user manual
- **Code Comments**: Inline documentation in game.js
- **Browser DevTools**: Use for debugging
- **Community**: Phaser forums and Discord

### Contributing Guidelines
1. **Fork Repository**: Create your own fork
2. **Feature Branch**: Create branch for your feature
3. **Code Standards**: Follow established guidelines
4. **Testing**: Test thoroughly before submitting
5. **Documentation**: Update docs for new features
6. **Pull Request**: Submit with clear description

### Code Review Process
- **Functionality**: Does it work as intended?
- **Performance**: No performance regressions
- **Compatibility**: Works across browsers
- **Documentation**: Code is well-documented
- **Testing**: Includes appropriate tests

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Phaser Team**: For the excellent game framework
- **HTML5 Game Community**: For inspiration and support
- **Open Source Contributors**: For tools and libraries
- **Testers**: For feedback and bug reports

---

*Last updated: July 2025*
*Game Version: 1.0*
*Documentation Version: 1.0*
# 🏃‍♂️ Endless Runner - Phaser 3 Game

A complete endless runner game built with Phaser 3 featuring modern UI/UX, mobile support, and comprehensive game systems.

## 🎮 Game Overview

Endless Runner is a polished HTML5 game where you jump over obstacles, collect coins, and compete for high scores. Features include persistent scoring, leaderboards, settings management, and mobile optimization.

## 🎮 How to Play

### Controls
- **SPACE** or **🚀 JUMP Button**: Jump / Double Jump
- **P** or **⏸ PAUSE Button**: Pause/Resume Game
- **🔄 RESTART Button**: Restart after game over
- **🏠 MENU Button**: Return to main menu
- **❤️ REVIVE Button**: Use revive power-up (when available)

### Gameplay
1. Jump over obstacles to survive
2. Collect golden coins for points (10 points each)
3. Find pink diamond coins for revive power-up
4. Try to achieve the highest score!

## ✨ Key Features

- **🎯 Core Gameplay**: Endless running with progressive difficulty, double jump mechanics, and power-up system
- **🏆 Competition**: Leaderboard with medal rankings, username system, and score persistence
- **🎨 Visual**: Animated cloud system, programmatic graphics, and modern UI design
- **⚙️ Settings**: Display controls, ad preferences, and mobile optimization
- **📱 Mobile**: Touch controls, orientation support, and responsive design

## 🚀 Quick Start

1. **Download**: Clone or download the repository
2. **Open**: Double-click `index.html` in your browser
3. **Play**: Click "PLAY GAME" and start jumping!

### Local Server (Optional)
```bash
# Python 3
python -m http.server 8000

# Then visit: http://localhost:8000
```

## 🏗️ Project Structure

```
endless_runner_phaser_demo/
├── game.js              # Main game logic and all scenes
├── index.html           # HTML entry point
├── README.md            # This file
├── LICENSE              # Project license
└── manual/              # Documentation folder
    ├── user-manual.md   # Complete user guide
    └── developer-manual.md # Developer documentation
```

## ⚙️ Settings

### Username
- Set your username to appear in the leaderboard
- Click the username field to edit
- Username updates automatically in existing leaderboard entries

### Ads
- Enable/disable ads that appear every 3 game plays
- Ads are optional and can be turned off anytime
- No ads during gameplay - only when starting a new game
- Ad count persists across sessions and menu navigation
- **Test Ad Feature**: Preview ads in settings without playing games
- **Ad Statistics**: Track total games played and ads viewed
- **Ad Counter**: Shows when next ad will appear

### Leaderboard Management
- Clear all leaderboard scores and reset high score
- Complete data reset option for fresh start

## 🛠️ Technical Stack

- **Phaser 3**: HTML5 game framework for 2D games
- **JavaScript ES6+**: Modern JavaScript features
- **localStorage API**: Client-side data persistence
- **Canvas Graphics**: Programmatic texture generation
- **CSS3**: Modern styling and animations
- **HTML5**: Semantic markup and accessibility

## 🌐 Play Online

- **Live Demo**: [Play Now](https://enablsoft.github.io/endless_runner_phaser_demo/)
- **Original Demo**: [Phaser Sandbox](https://phaser.io/sandbox/F7W9ewti)

## 📚 Documentation

- **[User Manual](manual/user-manual.md)**: Complete guide for players
- **[Developer Manual](manual/developer-manual.md)**: Technical documentation for developers

## 📱 Mobile Support

Works great on mobile devices with touch controls and responsive design!

## 🎯 Game Features

### Scoring System
- **Coin Collection**: 10 points per coin
- **Level Bonuses**: 100 points per level reached
- **High Score Tracking**: Persistent across browser sessions
- **Leaderboard Rankings**: Top 10 with medal system

### Power-up System
- **Revive Coins**: Pink diamonds grant extra life
- **Double Jump**: Enhanced aerial mobility
- **Progressive Difficulty**: Speed increases with score

### UI/UX Features
- **Main Menu**: Clean navigation with animated elements
- **Settings Panel**: Comprehensive customization options
- **Leaderboard**: Paginated display with sorting
- **Statistics**: Detailed gameplay analytics
- **Responsive Design**: Adapts to all screen sizes

## 🔧 Configuration

The game uses a centralized configuration system in `game.js`:

```javascript
const GAME_CONFIG = {
  // Display settings
  WIDTH: 800,
  HEIGHT: 600,
  
  // Physics settings
  GRAVITY: 800,
  JUMP_VELOCITY: -420,
  
  // Game progression
  INITIAL_SPEED: 150,
  SPEED_INCREMENT: 0.005,
  
  // Scoring
  SCORE_PER_COIN: 10,
  SCORE_PER_LEVEL: 100
};
```

## 🐛 Known Issues

- Fullscreen mode requires user interaction (browser security)
- Some mobile browsers may have orientation restrictions
- Ad system is simulated (no real ad integration)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Phaser Team**: For the excellent game framework
- **HTML5 Game Devs**: Community support and inspiration
- **Open Source Community**: For tools and libraries used

---

**Ready to run? Start playing now!** 🎮✨

*Jump, collect, compete, and have fun!*
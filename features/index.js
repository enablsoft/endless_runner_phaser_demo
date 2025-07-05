 // ============================================================================
// FEATURES INDEX MODULE
// ============================================================================
// Central export point for all feature modules
// Provides easy access to all game features and managers
// ============================================================================

// Import all feature modules
import CloudManager from './CloudManager.js';
import OrientationManager from './OrientationManager.js';
import PlayerManager from './PlayerManager.js';
import ScoreManager from './ScoreManager.js';
import SettingsManager from './SettingsManager.js';
import TextureManager from './TextureManager.js';

// Export all modules
export {
  CloudManager,
  OrientationManager,
  PlayerManager,
  ScoreManager,
  SettingsManager,
  TextureManager
};

// Create global instances for easy access
if (typeof window !== 'undefined') {
  // Initialize global managers
  window.gameManagers = {
    cloudManager: new CloudManager(),
    orientationManager: new OrientationManager(),
    playerManager: new PlayerManager(),
    scoreManager: new ScoreManager(),
    settingsManager: new SettingsManager(),
    textureManager: new TextureManager()
  };
}
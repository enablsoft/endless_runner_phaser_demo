// ============================================================================
// SETTINGS MANAGER MODULE
// ============================================================================
// Settings management system for user preferences
// Features:
// - Username management and validation
// - Ad preferences storage
// - Display settings (fullscreen, orientation)
// - Settings persistence and retrieval
// - Settings validation and defaults
// ============================================================================

class SettingsManager {
    constructor() {
      this.initializeSettings();
    }
  
    initializeSettings() {
      // Initialize default settings if not present
      if (!localStorage.getItem('username')) {
        localStorage.setItem('username', '');
      }
      if (!localStorage.getItem('showAds')) {
        localStorage.setItem('showAds', 'true');
      }
      if (!localStorage.getItem('playerGender')) {
        localStorage.setItem('playerGender', 'male');
      }
      if (!localStorage.getItem('preferredOrientation')) {
        localStorage.setItem('preferredOrientation', 'portrait');
      }
    }
  
    // Username management
    getUsername() {
      return localStorage.getItem('username') || '';
    }
  
    setUsername(username) {
      if (username && username.trim()) {
        localStorage.setItem('username', username.trim());
        return true;
      }
      return false;
    }
  
    validateUsername(username) {
      if (!username || !username.trim()) {
        return { valid: false, message: 'Username cannot be empty' };
      }
      
      if (username.length < 2) {
        return { valid: false, message: 'Username must be at least 2 characters' };
      }
      
      if (username.length > 20) {
        return { valid: false, message: 'Username must be 20 characters or less' };
      }
      
      // Check for invalid characters
      const invalidChars = /[<>:"/\\|?*]/;
      if (invalidChars.test(username)) {
        return { valid: false, message: 'Username contains invalid characters' };
      }
      
      return { valid: true, message: 'Username is valid' };
    }
  
    // Ad preferences
    getShowAds() {
      return localStorage.getItem('showAds') !== 'false'; // Default to true
    }
  
    setShowAds(show) {
      localStorage.setItem('showAds', show.toString());
    }
  
    // Player gender
    getPlayerGender() {
      return localStorage.getItem('playerGender') || 'male';
    }
  
    setPlayerGender(gender) {
      if (gender === 'male' || gender === 'female') {
        localStorage.setItem('playerGender', gender);
        return true;
      }
      return false;
    }
  
    // Orientation preferences
    getPreferredOrientation() {
      return localStorage.getItem('preferredOrientation') || 'portrait';
    }
  
    setPreferredOrientation(orientation) {
      if (orientation === 'portrait' || orientation === 'landscape') {
        localStorage.setItem('preferredOrientation', orientation);
        return true;
      }
      return false;
    }
  
    // Fullscreen support detection
    isFullscreenSupported() {
      return !!(
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled
      );
    }
  
    // Mobile device detection
    isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  
    // Get all settings as an object
    getAllSettings() {
      return {
        username: this.getUsername(),
        showAds: this.getShowAds(),
        playerGender: this.getPlayerGender(),
        preferredOrientation: this.getPreferredOrientation(),
        isMobile: this.isMobileDevice(),
        fullscreenSupported: this.isFullscreenSupported()
      };
    }
  
    // Reset all settings to defaults
    resetToDefaults() {
      localStorage.setItem('username', '');
      localStorage.setItem('showAds', 'true');
      localStorage.setItem('playerGender', 'male');
      localStorage.setItem('preferredOrientation', 'portrait');
    }
  
    // Export settings (for backup)
    exportSettings() {
      const settings = {
        username: this.getUsername(),
        showAds: this.getShowAds(),
        playerGender: this.getPlayerGender(),
        preferredOrientation: this.getPreferredOrientation(),
        highScore: localStorage.getItem('highScore') || '0',
        gamePlayCount: localStorage.getItem('gamePlayCount') || '0',
        exportDate: new Date().toISOString()
      };
      
      return JSON.stringify(settings, null, 2);
    }
  
    // Import settings (from backup)
    importSettings(settingsJson) {
      try {
        const settings = JSON.parse(settingsJson);
        
        if (settings.username !== undefined) {
          this.setUsername(settings.username);
        }
        if (settings.showAds !== undefined) {
          this.setShowAds(settings.showAds);
        }
        if (settings.playerGender !== undefined) {
          this.setPlayerGender(settings.playerGender);
        }
        if (settings.preferredOrientation !== undefined) {
          this.setPreferredOrientation(settings.preferredOrientation);
        }
        
        return { success: true, message: 'Settings imported successfully' };
      } catch (error) {
        return { success: false, message: 'Invalid settings file' };
      }
    }
  }
  
  // Export for use in other modules
export default SettingsManager;
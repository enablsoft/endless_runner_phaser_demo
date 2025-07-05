 // ============================================================================
// ORIENTATION MANAGER MODULE
// ============================================================================
// Global orientation management system for mobile device support
// Features:
// - Device orientation detection and handling
// - Landscape/portrait mode switching
// - Persistent orientation preference storage
// - Cross-scene orientation state management
// - Event listener management for orientation changes
// - Mobile-specific orientation controls
// ============================================================================

class OrientationManager {
    constructor() {
      this.listeners = [];
      this.currentOrientation = this.getCurrentOrientation();
      this.setupGlobalListener();
    }
  
    setupGlobalListener() {
      // Listen for orientation changes using modern Screen Orientation API
      if (window.screen && window.screen.orientation) {
        window.screen.orientation.addEventListener('change', () => {
          this.currentOrientation = this.getCurrentOrientation();
          this.notifyListeners();
        });
      }
    }
  
    addListener(callback) {
      this.listeners.push(callback);
    }
  
    removeListener(callback) {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    }
  
    notifyListeners() {
      this.listeners.forEach(callback => {
        try {
          callback(this.currentOrientation);
        } catch (error) {
          console.error('Error in orientation listener:', error);
        }
      });
    }
  
    getCurrentOrientation() {
      if (window.screen && window.screen.orientation) {
        return window.screen.orientation.type;
      }
      return 'unknown';
    }
  
    getStoredOrientation() {
      return localStorage.getItem('preferredOrientation') || 'portrait';
    }
  
    setStoredOrientation(orientation) {
      localStorage.setItem('preferredOrientation', orientation);
    }
  
    requestOrientation(orientation) {
      if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
        try {
          window.screen.orientation.lock(orientation);
          this.setStoredOrientation(orientation);
          return true;
        } catch (error) {
          console.warn('Could not lock orientation:', error);
          return false;
        }
      }
      return false;
    }
  
    isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  
    isOrientationSupported() {
      return !!(window.screen && window.screen.orientation && window.screen.orientation.lock);
    }

    // Check if fullscreen is supported
    isFullscreenSupported() {
      return !!(document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled);
    }

    // Request fullscreen for mobile devices
    requestMobileFullscreen() {
      if (!this.isMobileDevice()) {
        console.log('Not a mobile device, skipping mobile fullscreen request');
        return Promise.resolve(false);
      }

      if (!this.isFullscreenSupported()) {
        console.log('Fullscreen not supported on this device');
        return Promise.resolve(false);
      }

      // Check if already in fullscreen
      if (document.fullscreenElement) {
        console.log('Already in fullscreen mode');
        return Promise.resolve(true);
      }

      // Request fullscreen with proper vendor prefixes
      const requestFullscreen = (element) => {
        if (element.requestFullscreen) {
          return element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          return element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          return element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          return element.msRequestFullscreen();
        }
        return Promise.reject(new Error('Fullscreen API not supported'));
      };

      return requestFullscreen(document.documentElement)
        .then(() => {
          console.log('Mobile fullscreen entered successfully');
          return true;
        })
        .catch((error) => {
          console.warn('Mobile fullscreen request failed:', error);
          return false;
        });
    }
  }
  
  // Export for use in other modules
export default OrientationManager;
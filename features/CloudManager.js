 // ============================================================================
// CLOUD MANAGER MODULE
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
      gfx.fillStyle(0xffffff, 0.3);
      gfx.fillCircle(10, 10, 8);
      gfx.fillCircle(20, 8, 6);
      gfx.fillCircle(15, 15, 5);
      gfx.generateTexture('cloud_small', 30, 25);
  
      // Medium cloud
      gfx.clear();
      gfx.fillStyle(0xffffff, 0.4);
      gfx.fillCircle(15, 15, 12);
      gfx.fillCircle(30, 12, 10);
      gfx.fillCircle(25, 22, 8);
      gfx.fillCircle(40, 18, 7);
      gfx.generateTexture('cloud_medium', 50, 35);
  
      // Large cloud
      gfx.clear();
      gfx.fillStyle(0xffffff, 0.5);
      gfx.fillCircle(20, 20, 15);
      gfx.fillCircle(40, 15, 12);
      gfx.fillCircle(35, 30, 10);
      gfx.fillCircle(55, 25, 8);
      gfx.fillCircle(25, 35, 9);
      gfx.generateTexture('cloud_large', 70, 50);
    }
  
    spawnInitialClouds() {
      // Spawn 3-5 initial clouds for immediate visual appeal
      const initialCount = Phaser.Math.Between(3, 5);
      for (let i = 0; i < initialCount; i++) {
        this.spawnCloud();
      }
    }
  
    startSpawning() {
      // Spawn new clouds every 3-8 seconds
      this.spawnTimer = this.scene.time.addEvent({
        delay: Phaser.Math.Between(3000, 8000),
        loop: true,
        callback: () => {
          if (this.isActive && this.clouds.length < 8) {
            this.spawnCloud();
          }
        }
      });
    }
  
    spawnCloud() {
      const cloudTypes = ['cloud_small', 'cloud_medium', 'cloud_large'];
      const cloudType = Phaser.Math.RND.pick(cloudTypes);
      
      // Determine cloud properties based on type
      let speed, yRange, opacity;
      switch (cloudType) {
        case 'cloud_small':
          speed = Phaser.Math.Between(20, 40);
          yRange = { min: 50, max: 150 };
          opacity = 0.3;
          break;
        case 'cloud_medium':
          speed = Phaser.Math.Between(15, 30);
          yRange = { min: 30, max: 120 };
          opacity = 0.4;
          break;
        case 'cloud_large':
          speed = Phaser.Math.Between(10, 25);
          yRange = { min: 20, max: 100 };
          opacity = 0.5;
          break;
      }
  
      // Create cloud sprite
      const cloud = this.scene.add.sprite(
        this.scene.game.config.width + 50,
        Phaser.Math.Between(yRange.min, yRange.max),
        cloudType
      ).setAlpha(opacity).setDepth(1);
  
      // Create movement tween
      const tween = this.scene.tweens.add({
        targets: cloud,
        x: -100,
        duration: (this.scene.game.config.width + 150) / speed * 1000,
        ease: 'Linear',
        onComplete: () => {
          cloud.destroy();
          this.clouds = this.clouds.filter(c => c.sprite !== cloud);
        }
      });
  
      // Store cloud data
      this.clouds.push({
        sprite: cloud,
        tween: tween,
        type: cloudType
      });
    }
  
    pause() {
      this.clouds.forEach(cloud => {
        if (cloud.tween) cloud.tween.pause();
      });
      if (this.spawnTimer) this.spawnTimer.paused = true;
    }
  
    resume() {
      this.clouds.forEach(cloud => {
        if (cloud.tween) cloud.tween.resume();
      });
      if (this.spawnTimer) this.spawnTimer.paused = false;
    }
  }
  
  // Export for use in other modules
export default CloudManager;
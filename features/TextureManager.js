// ============================================================================
// TEXTURE MANAGER MODULE
// ============================================================================
// Texture generation and management system for all game objects
// Features:
// - Programmatic texture generation for all game elements
// - Obstacle texture creation (rectangles, circles, triangles, stars)
// - Coin and power-up texture generation
// - Ground and background texture creation
// - Texture optimization and caching
// ============================================================================

class TextureManager {
    constructor() {
      this.texturesCreated = false;
    }
  
    createAllTextures(scene) {
      if (this.texturesCreated) return;
      
      this.createGroundTextures(scene);
      this.createObstacleTextures(scene);
      this.createCoinTextures(scene);
      this.createUITextures(scene);
      
      this.texturesCreated = true;
    }
  
    createGroundTextures(scene) {
      const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
  
      // Ground texture (green rectangle)
      gfx.clear(); 
      gfx.fillStyle(0x228b22, 1); 
      gfx.fillRect(0, 0, 800, 40); 
      gfx.generateTexture('ground', 800, 40);
    }
  
    createObstacleTextures(scene) {
      const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
  
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
    }
  
    createCoinTextures(scene) {
      const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
  
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
  
    createUITextures(scene) {
      const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
  
      // Button background texture
      gfx.clear();
      gfx.fillStyle(0x444444, 1);
      gfx.fillRoundedRect(0, 0, 100, 40, 8);
      gfx.generateTexture('button_bg', 100, 40);
  
      // Panel background texture
      gfx.clear();
      gfx.fillStyle(0x222222, 0.8);
      gfx.fillRoundedRect(0, 0, 200, 100, 10);
      gfx.generateTexture('panel_bg', 200, 100);
    }
  
    // Utility methods for drawing shapes
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
  
    // Get random obstacle texture
    getRandomObstacleTexture() {
      const obstacles = ['obstacle_rect', 'obstacle_star', 'obstacle_triangle', 'obstacle_circle'];
      return Phaser.Math.RND.pick(obstacles);
    }
  
    // Clear all textures (for memory management)
    clearTextures(scene) {
      const textureKeys = [
        'ground', 'obstacle_rect', 'obstacle_star', 'obstacle_triangle', 
        'obstacle_circle', 'coin', 'coin_revive', 'button_bg', 'panel_bg'
      ];
      
      textureKeys.forEach(key => {
        if (scene.textures.exists(key)) {
          scene.textures.remove(key);
        }
      });
      
      this.texturesCreated = false;
    }
  }
  
  // Export for use in other modules
  export default TextureManager;
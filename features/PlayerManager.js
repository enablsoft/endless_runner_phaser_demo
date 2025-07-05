// ============================================================================
// PLAYER MANAGER MODULE
// ============================================================================
// Player management system for character customization and appearance
// Features:
// - Gender selection (male/female)
// - Dynamic player texture generation
// - Player appearance customization
// - Gender preference storage and retrieval
// - Player sprite creation and management
// ============================================================================

class PlayerManager {
    constructor() {
      this.currentGender = this.getStoredGender();
    }
  
    getStoredGender() {
      return localStorage.getItem('playerGender') || 'male';
    }
  
    setStoredGender(gender) {
      localStorage.setItem('playerGender', gender);
      this.currentGender = gender;
    }
  
    createPlayerTextures(scene) {
      const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
  
      // Male player texture (person/runner) - larger size
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
      
      // Hair - larger (short male hair)
      gfx.fillStyle(0x8B4513, 1); // Brown hair
      gfx.fillRect(14, 4, 16, 6);
      gfx.fillCircle(22, 6, 6);
      
      gfx.generateTexture('player_male', 44, 52);
  
      // Female player texture - larger size
      gfx.clear();
      
      // Body (torso) - larger with slightly different shape
      gfx.fillStyle(0xFF69B4, 1); // Pink shirt
      gfx.fillRect(12, 18, 20, 18);
      
      // Head - larger
      gfx.fillStyle(0xFFE4C4, 1); // Skin tone
      gfx.fillCircle(22, 12, 8);
      
      // Arms - larger
      gfx.fillStyle(0xFF69B4, 1); // Pink shirt sleeves
      gfx.fillRect(6, 20, 6, 12);  // Left arm
      gfx.fillRect(32, 20, 6, 12); // Right arm
      
      // Legs - larger
      gfx.fillStyle(0x9932CC, 1); // Purple pants
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
      
      // Hair - larger (longer female hair)
      gfx.fillStyle(0x8B4513, 1); // Brown hair
      gfx.fillRect(14, 4, 16, 8); // Longer hair
      gfx.fillCircle(22, 6, 6);
      // Hair extensions for longer look
      gfx.fillRect(10, 8, 4, 6);  // Left hair extension
      gfx.fillRect(30, 8, 4, 6);  // Right hair extension
      
      gfx.generateTexture('player_female', 44, 52);
  
      // Legacy player texture (for backward compatibility)
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
    }
  
    getPlayerTexture() {
      const gender = this.getStoredGender();
      return gender === 'female' ? 'player_female' : 'player_male';
    }
  
    createPlayer(scene, x, y) {
      const texture = this.getPlayerTexture();
      return scene.physics.add.sprite(x, y, texture);
    }
  
    updatePlayerTexture(player) {
      const texture = this.getPlayerTexture();
      player.setTexture(texture);
    }
  }
  
  // Export for use in other modules
export default PlayerManager;
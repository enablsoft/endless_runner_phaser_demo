// ============================================================================
// SCORE MANAGER MODULE
// ============================================================================
// Score and leaderboard management system
// Features:
// - Score tracking and persistence
// - High score management
// - Leaderboard operations (add, get, clear)
// - Score formatting and display
// - Statistics tracking
// ============================================================================

class ScoreManager {
    constructor() {
      this.initializeLocalStorage();
    }
  
    initializeLocalStorage() {
      // Initialize localStorage with default values if not present
      if (!localStorage.getItem('highScore')) {
        localStorage.setItem('highScore', '0');
      }
      if (!localStorage.getItem('currentScore')) {
        localStorage.setItem('currentScore', '0');
      }
      if (!localStorage.getItem('leaderboard')) {
        localStorage.setItem('leaderboard', '[]');
      }
      if (!localStorage.getItem('gamePlayCount')) {
        localStorage.setItem('gamePlayCount', '0');
      }
      if (!localStorage.getItem('adViewCount')) {
        localStorage.setItem('adViewCount', '0');
      }
    }
  
    getCurrentScore() {
      return parseInt(localStorage.getItem('currentScore')) || 0;
    }
  
    setCurrentScore(score) {
      localStorage.setItem('currentScore', score.toString());
    }
  
    getHighScore() {
      return parseInt(localStorage.getItem('highScore')) || 0;
    }
  
    setHighScore(score) {
      localStorage.setItem('highScore', score.toString());
    }
  
    updateHighScore(score) {
      const currentHigh = this.getHighScore();
      if (score > currentHigh) {
        this.setHighScore(score);
        return true; // New high score achieved
      }
      return false; // No new high score
    }
  
    addToLeaderboard(score, level, username) {
      const leaderboard = this.getLeaderboard();
      const newEntry = {
        score: score,
        date: new Date().toLocaleDateString(),
        level: level,
        username: username || 'Anonymous'
      };
      
      leaderboard.push(newEntry);
      
      // Sort by score (highest first)
      leaderboard.sort((a, b) => b.score - a.score);
      
      // Keep only top 100 entries
      if (leaderboard.length > 100) {
        leaderboard.splice(100);
      }
      
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }
  
    getLeaderboard() {
      try {
        return JSON.parse(localStorage.getItem('leaderboard')) || [];
      } catch (error) {
        console.error('Error parsing leaderboard:', error);
        return [];
      }
    }
  
    clearLeaderboard() {
      localStorage.setItem('leaderboard', '[]');
    }
  
    updateLeaderboardUsernames(oldUsername, newUsername) {
      const leaderboard = this.getLeaderboard();
      let updated = false;
      
      leaderboard.forEach(entry => {
        if (entry.username === oldUsername) {
          entry.username = newUsername;
          updated = true;
        }
      });
      
      if (updated) {
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
      }
    }
  
    getLeaderboardPage(page, entriesPerPage = 6) {
      const leaderboard = this.getLeaderboard();
      const startIndex = page * entriesPerPage;
      const endIndex = startIndex + entriesPerPage;
      
      return {
        entries: leaderboard.slice(startIndex, endIndex),
        totalPages: Math.ceil(leaderboard.length / entriesPerPage),
        currentPage: page,
        totalEntries: leaderboard.length
      };
    }
  
    incrementGamePlayCount() {
      const count = parseInt(localStorage.getItem('gamePlayCount')) || 0;
      localStorage.setItem('gamePlayCount', (count + 1).toString());
    }
  
    getGamePlayCount() {
      return parseInt(localStorage.getItem('gamePlayCount')) || 0;
    }
  
    incrementAdViewCount() {
      const count = parseInt(localStorage.getItem('adViewCount')) || 0;
      localStorage.setItem('adViewCount', (count + 1).toString());
    }
  
    getAdViewCount() {
      return parseInt(localStorage.getItem('adViewCount')) || 0;
    }
  
    formatScore(score) {
      return score.toLocaleString();
    }
  
    getMedalForRank(rank) {
      switch (rank) {
        case 1: return '🥇';
        case 2: return '🥈';
        case 3: return '🥉';
        default: return '';
      }
    }
  }
  
  // Export for use in other modules
export default ScoreManager;
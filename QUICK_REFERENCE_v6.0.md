# AlphaZero Bot v6.0 - Quick Reference Guide

## 🚀 Quick Start

### Installation
1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Create new script
3. Copy `/app/lichess-alphazero-enhanced.user.js`
4. Save and enable
5. Visit [lichess.org](https://lichess.org)

### Verification
```javascript
// Check if loaded
AlphaZeroBot

// Run tests
AlphaZeroBot.runTests()

// Enable debug mode
AlphaZeroBot.toggleDebug()
```

---

## 🎮 Basic Commands

### Bot Control
```javascript
AlphaZeroBot.enable()          // Turn bot ON
AlphaZeroBot.disable()         // Turn bot OFF
AlphaZeroBot.getStats()        // View performance stats
```

### Analysis
```javascript
// Analyze position (FEN notation)
AlphaZeroBot.analyzePosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

// Analyze current game (automatically)
// Just enable bot and make moves on Lichess
```

### Testing
```javascript
AlphaZeroBot.runTests()        // Run full test suite
AlphaZeroBot.toggleDebug()     // Toggle detailed logging
```

---

## ⚙️ Configuration (NEW in v6.0)

### Simulation Count
```javascript
// Set default simulation count
AlphaZeroBot.setSimulations(500)

// Set adaptive simulation budgets
AlphaZeroBot.setTimeConfig(
    200,   // Quick moves (forced, obvious)
    500,   // Normal moves (default)
    1000   // Critical moves (tactical, complex)
)
```

### Transposition Table
```javascript
// View cache statistics
AlphaZeroBot.getTranspositionStats()
// Returns: { size, hits, misses, hitRate }

// Clear cache (new game)
AlphaZeroBot.clearTranspositionTable()
```

### Parallel MCTS
```javascript
// Toggle parallel search
AlphaZeroBot.toggleParallelMCTS()

// Manual configuration
MCTS_CONFIG.USE_PARALLEL = true
MCTS_CONFIG.WORKER_COUNT = 4
```

---

## 📊 Performance Tuning

### For Speed (Fast Play)
```javascript
// Reduce simulations
AlphaZeroBot.setSimulations(200)

// Disable parallel (less overhead)
AlphaZeroBot.toggleParallelMCTS()  // Turn OFF

// Result: ~0.5 second/move, ~2000 Elo
```

### For Strength (Strong Play)
```javascript
// Increase simulations
AlphaZeroBot.setSimulations(1000)

// Enable parallel
AlphaZeroBot.toggleParallelMCTS()  // Turn ON

// Aggressive time config
AlphaZeroBot.setTimeConfig(500, 1000, 2000)

// Result: ~3-5 seconds/move, ~2500 Elo
```

### Balanced (Default)
```javascript
// Reset to defaults
AlphaZeroBot.setSimulations(500)
AlphaZeroBot.setTimeConfig(200, 500, 1000)

// Result: ~1-2 seconds/move, ~2350 Elo
```

---

## 🧪 Testing & Debugging

### Run All Tests
```javascript
AlphaZeroBot.runTests()
```

**Tests included**:
- ✅ Check detection
- ✅ Legal move generation
- ✅ MCTS functionality
- ✅ Tablebase integration
- ✅ Tactical positions
- ✅ King safety (NEW)
- ✅ Development tracking (NEW)
- ✅ Transposition table (NEW)

### Debug Mode
```javascript
// Enable detailed logging
AlphaZeroBot.toggleDebug()

// Logs include:
// - Node counts
// - Search depth
// - Time per move
// - MCTS visit distribution
// - Transposition table hits/misses
// - King safety scores
// - Development scores
```

### Analyze Specific Positions

**Test Opening Position**:
```javascript
AlphaZeroBot.analyzePosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
// Expected: e2e4 or d2d4 (standard openings)
```

**Test King Safety**:
```javascript
AlphaZeroBot.analyzePosition('rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4')
// Expected: Should prefer castling (e1g1) over material grabs
```

**Test Tactical Position (Mate in 1)**:
```javascript
AlphaZeroBot.analyzePosition('r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K2R b KQkq - 0 1')
// Expected: Should detect checkmate threat
```

**Test Endgame (Tablebase)**:
```javascript
AlphaZeroBot.analyzePosition('8/8/8/8/8/4k3/2K5/4Q3 w - - 0 1')
// Expected: Perfect move from Lichess tablebase
```

---

## 📈 Statistics & Monitoring

### Bot Statistics
```javascript
AlphaZeroBot.getStats()
```

**Returns**:
```javascript
{
    movesPlayed: 42,        // Total moves made
    errors: 0,              // Errors encountered
    tablebaseHits: 5,       // Tablebase queries
    mctsUsed: 20,           // MCTS searches
    alphaBetaUsed: 17       // Alpha-Beta searches
}
```

### Transposition Table Stats (NEW)
```javascript
AlphaZeroBot.getTranspositionStats()
```

**Returns**:
```javascript
{
    size: 15234,            // Entries in cache
    hits: 8432,             // Cache hits
    misses: 6802,           // Cache misses
    hitRate: "55.3%"        // Hit percentage
}
```

### Performance Monitoring
```javascript
// Enable debug mode first
AlphaZeroBot.toggleDebug()

// Make a move, observe output:
// [MCTS] Using 500 simulations
// [MCTS] Completed 500 simulations. Visits: 500
// [DEBUG] Top moves: [{"move":"e2e4","visits":187,"value":"0.245"},...]
// [DEBUG] TT Stats: {"size":15234,"hits":8432,"misses":6802,"hitRate":"55.3%"}
// MCTS Search: 1234ms
```

---

## 🎯 Strategy Selection

Bot automatically chooses the best search strategy:

### 1. Tablebase (Perfect Play)
**When**: ≤5 pieces on board  
**Speed**: 1-2 seconds (API query)  
**Strength**: Perfect (infinite Elo)  
**Example**: King + Queen vs King

### 2. MCTS (Strategic Positions)
**When**: >10 pieces OR >30 legal moves  
**Speed**: 1-2 seconds (500 simulations, adaptive)  
**Strength**: ~2350 Elo  
**Example**: Complex middlegame

### 3. Alpha-Beta (Tactical Positions)
**When**: Sharp positions, few pieces  
**Speed**: 1-2 seconds (depth 10)  
**Strength**: ~2400 Elo (tactics)  
**Example**: Forcing sequences, checkmate puzzles

---

## 🔧 Advanced Configuration

### Direct Configuration Access

```javascript
// MCTS Configuration
MCTS_CONFIG.SIMULATIONS = 500
MCTS_CONFIG.C_PUCT = 1.4           // Exploration constant
MCTS_CONFIG.USE_PARALLEL = true    // Parallel search
MCTS_CONFIG.WORKER_COUNT = 4       // Worker threads

// Time Management
TIME_CONFIG.QUICK_MOVE_SIMS = 200
TIME_CONFIG.NORMAL_SIMS = 500
TIME_CONFIG.CRITICAL_SIMS = 1000
TIME_CONFIG.COMPLEXITY_THRESHOLD = 25

// Engine Features
CONFIG.enabled = true
CONFIG.playAsWhite = true
CONFIG.playAsBlack = true
CONFIG.movetime = 2000            // Time limit (ms)
CONFIG.runTestsOnStart = false
```

### Transposition Table Size
```javascript
// Clear and recreate with custom size
TRANSPOSITION_TABLE.clear()
// Table auto-manages with LRU eviction (max 100,000 entries)
```

---

## 🐛 Troubleshooting

### Bot Doesn't Move
```javascript
// 1. Check if enabled
AlphaZeroBot.enable()

// 2. Check WebSocket connection
STATE.webSocket  // Should not be null

// 3. Refresh page
location.reload()
```

### Slow Performance
```javascript
// 1. Reduce simulations
AlphaZeroBot.setSimulations(200)

// 2. Disable parallel (if overhead too high)
AlphaZeroBot.toggleParallelMCTS()

// 3. Clear transposition table (if memory issue)
AlphaZeroBot.clearTranspositionTable()
```

### High Memory Usage
```javascript
// Clear transposition table cache
AlphaZeroBot.clearTranspositionTable()

// Reduce worker count
MCTS_CONFIG.WORKER_COUNT = 2
```

### Tablebase Timeout
```javascript
// Bot automatically falls back to MCTS
// No action needed - it's by design
```

---

## 📚 Example Session

### Complete Workflow
```javascript
// 1. Enable bot
AlphaZeroBot.enable()

// 2. Run tests to verify
AlphaZeroBot.runTests()
// ✅ All tests passed

// 3. Enable debug mode for learning
AlphaZeroBot.toggleDebug()

// 4. Check initial stats
AlphaZeroBot.getStats()
// { movesPlayed: 0, errors: 0, ... }

// 5. Play game on Lichess (bot auto-plays)
// ... moves happen ...

// 6. Check stats after game
AlphaZeroBot.getStats()
// { movesPlayed: 42, errors: 0, ... }

// 7. Check transposition table performance
AlphaZeroBot.getTranspositionStats()
// { size: 15234, hits: 8432, hitRate: "55.3%" }

// 8. Clear cache for next game
AlphaZeroBot.clearTranspositionTable()

// 9. Analyze interesting position
AlphaZeroBot.analyzePosition('r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4')
// [MCTS] Using 500 simulations
// [SUCCESS] Best move: e1g1 (castle)
```

---

## 🎓 Learning Resources

### Understanding Output

**MCTS Search**:
```
[MCTS] Using 500 simulations
[MCTS] Completed 500 simulations. Visits: 500
[DEBUG] Top moves: [
    {"move":"e2e4","visits":187,"value":"0.245"},
    {"move":"d2d4","visits":156,"value":"0.198"},
    {"move":"g1f3","visits":89,"value":"0.121"}
]
```

**Interpretation**:
- `visits`: How many times MCTS explored this move
- `value`: Average evaluation (+1 = winning, -1 = losing)
- Most visited move = best move

**King Safety**:
```
[DEBUG] King safety score (White): 50
[DEBUG] King safety score (Black): -100
```

**Interpretation**:
- Positive = Safe (castled, pawn shield)
- Negative = Dangerous (uncastled, exposed)
- Difference impacts evaluation

**Transposition Table**:
```
[DEBUG] TT Stats: {"size":15234,"hits":8432,"misses":6802,"hitRate":"55.3%"}
```

**Interpretation**:
- `size`: Positions cached
- `hitRate`: % of positions found in cache
- Higher hit rate = faster search

---

## ⚡ Performance Benchmarks

### Typical Performance (Modern CPU)

| Configuration | Time/Move | Simulations | Elo Estimate |
|---------------|-----------|-------------|--------------|
| Fast | 0.5s | 200 | ~2000 |
| Balanced | 1.5s | 500 | ~2350 |
| Strong | 3s | 1000 | ~2500 |
| Maximum | 6s | 2000 | ~2600 |

### Adaptive Time Management

| Position Type | Simulations | Reason |
|---------------|-------------|---------|
| Only 1 legal move | 200 | Forced move |
| Simple position | 200-500 | Few options |
| Normal position | 500 | Default |
| Complex position (>25 moves) | 1000 | Many options |
| Tactical position (many captures) | 1000 | Critical |
| In check | 1000 | Critical |

---

## 📝 Common Use Cases

### 1. Rapid Analysis
```javascript
// Quick position check
AlphaZeroBot.analyzePosition(fen)
```

### 2. Tournament Mode
```javascript
// Maximum strength
AlphaZeroBot.setSimulations(2000)
AlphaZeroBot.toggleParallelMCTS()  // ON
```

### 3. Learning Mode
```javascript
// Debug on, see all reasoning
AlphaZeroBot.toggleDebug()
// Analyze, observe king safety scores, threat detection
```

### 4. Benchmark Mode
```javascript
// Run tests, check TT performance
AlphaZeroBot.runTests()
AlphaZeroBot.getTranspositionStats()
```

---

## ⚠️ Important Reminders

1. **Educational Use Only**: Not for rated games on Lichess
2. **Internet Required**: Tablebase queries need connection
3. **CPU Intensive**: Parallel MCTS uses multiple cores
4. **Memory**: Transposition table uses ~10-20 MB
5. **Browser Performance**: Works best on modern browsers (Chrome, Firefox, Edge)

---

## 🔗 Related Files

- `lichess-alphazero-enhanced.user.js` - Main bot code
- `CHANGELOG_v6.0.md` - Detailed changelog
- `GAME_ANALYSIS_v6.0.md` - Analysis of problem game
- `README_ENHANCED.md` - Full documentation

---

## 🆘 Getting Help

### Check Console Logs
```javascript
// Enable debug mode
AlphaZeroBot.toggleDebug()

// Observe output for errors
// Look for ERROR or WARN messages
```

### Common Error Messages

**"No legal moves available"**
- Position is checkmate or stalemate (expected)

**"WebSocket not ready"**
- Refresh page
- Ensure on active game/analysis board

**"Tablebase query failed"**
- Network issue (bot auto-falls back to MCTS)
- Normal behavior if API is down

**"MCTS failed"**
- Rare error, bot falls back to Alpha-Beta
- If persistent, try clearing TT: `AlphaZeroBot.clearTranspositionTable()`

---

## ✨ Pro Tips

1. **Enable debug mode when learning** - See all evaluation scores
2. **Clear TT between games** - Fresh start for each game
3. **Use parallel MCTS for tournaments** - Maximum strength
4. **Analyze losing positions** - Understand mistakes
5. **Test new configurations** - Find optimal settings for your CPU
6. **Monitor TT hit rate** - Should be 40-60% for good performance

---

**Quick Reference Version**: 6.0.0  
**Last Updated**: 2025  
**Support**: See main README for details

# AlphaZero Masterclass - Complete Usage Guide

## 🎮 Quick Start

### Step 1: Install the Userscript

1. **Install Tampermonkey** (recommended):
   - Chrome: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/
   - Edge: https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd

2. **Install the Masterclass Script**:
   - Click the Tampermonkey icon in your browser
   - Select "Create a new script"
   - Delete the template code
   - Copy and paste the entire contents of `/app/lichess-alphazero-masterclass.user.js`
   - Click File > Save (or Ctrl+S)
   - The script will now be active on lichess.org

### Step 2: Use on Lichess

1. **Visit Lichess**: Go to https://lichess.org
2. **Open Console**: Press F12 (or Cmd+Option+I on Mac)
3. **Check Installation**: You should see:
   ```
   ╔═══════════════════════════════════════════════════════╗
   ║  🏆 AlphaZero Masterclass Edition v5.0             ║
   ║  ♟️  8,114 Master Games - Carlsen/Fischer/Morphy   ║
   ╚═══════════════════════════════════════════════════════╝
   ⚠️  EDUCATIONAL USE ONLY
   ```

4. **Start an Analysis Board**:
   - Click "Tools" → "Analysis board"
   - Make a move on the board
   - The engine will automatically respond with a master move!

## 🎯 Understanding the Engine Output

### Console Messages

#### Opening Book Moves
```
🏆 Using master move: e4 (from 4057 games database)
```
This means the engine found this move in the master database, played 4,057 times by Carlsen, Fischer, Morphy, and AlphaZero.

#### Search Moves
```
[AlphaZero] Analyzing position... (White)
[AlphaZero] Move sent: d4 (total: 1)
```
The engine is using search tree analysis combined with master patterns.

### Move Selection Strategy

The engine uses a three-tier approach:

1. **Opening Phase (Moves 1-20)**:
   - First checks master database
   - If a master move exists: Uses it with high probability
   - If no master move: Falls back to tactical search

2. **Middlegame Phase (Moves 21-40)**:
   - Tactical search with master move ordering
   - Master moves get priority in search tree
   - Balanced material and position evaluation

3. **Endgame Phase (Moves 41+)**:
   - Deep tactical search
   - King activity emphasized (+50%)
   - Pawn promotion potential (+30%)

## 🎨 Using Different Playing Styles

### To Play Like Carlsen (Modern, Solid)
The engine naturally favors Carlsen's moves due to the large database (7,068 games). You'll see:
- Solid openings (e4, d4, Nf3, c4)
- Strategic maneuvering
- Endgame technique

### To Play Like Fischer (Aggressive, Tactical)
Fischer's moves have 2.5x weight. You'll notice:
- Sharp opening variations
- Tactical complications
- Aggressive piece play
- e4 openings preferred

### To Play Like AlphaZero (Brilliant, Unconventional)
AlphaZero moves have 3x weight for brilliant ideas:
- Surprising piece sacrifices
- Long-term positional play
- Creative attacking ideas

## 🔧 Advanced Usage

### Console Commands

```javascript
// Check if engine is running
AlphaZeroBot.getStats()
// Output: { movesPlayed: 15, errors: 0 }

// Disable engine temporarily
AlphaZeroBot.disable()

// Re-enable engine
AlphaZeroBot.enable()
```

### Configuration Options

Edit these in the userscript (advanced users):

```javascript
const CONFIG = {
    enabled: true,           // Auto-start enabled
    playAsWhite: true,       // Play as white
    playAsBlack: true,       // Play as black
    movetime: 2000          // Thinking time (milliseconds)
};
```

**Adjusting Thinking Time**:
- 1000ms (1 sec): Fast, ~5,000 nodes searched
- 2000ms (2 sec): Default, ~15,000 nodes searched
- 5000ms (5 sec): Deep, ~40,000 nodes searched

### Analyzing Specific Positions

1. **Set up position**: Use the analysis board position editor
2. **Make any move**: The engine will analyze and respond
3. **Check console**: See which master played this move
4. **Compare moves**: Try different moves and see engine responses

## 📊 Understanding the Database

### Opening Repertoire Structure

Each position in the database has weighted moves:

```json
{
  "start": [
    {"move": "e4", "weight": 0.512},  // 51.2% of games
    {"move": "d4", "weight": 0.317},  // 31.7% of games
    {"move": "Nf3", "weight": 0.088}  // 8.8% of games
  ]
}
```

The engine selects moves probabilistically:
- Higher weight = More likely to be played
- Adds variety while staying master-level

### Position Keys

The engine creates position keys from recent moves:

**Opening**: Last 8 moves (e.g., "e4 e5 Nf3 Nc6 Bb5 a6")
**Middlegame**: Last 6 moves
**Endgame**: Last 4 moves

This allows matching similar positions without requiring exact game replication.

## 🎓 Learning from the Engine

### Study Mode: Understand Master Moves

1. **Play a game** against the engine in analysis mode
2. **After each move**, check the console to see:
   - Was it a master move? (🏆 icon)
   - How many games featured this move?
3. **Compare** your intended move vs. the master move
4. **Analyze** why masters prefer certain moves

### Pattern Recognition Exercise

1. **Open a specific position** (e.g., Ruy Lopez, Sicilian)
2. **Make different moves** and see engine responses
3. **Notice patterns**:
   - Which moves appear frequently?
   - What plans do masters pursue?
   - How do they handle pawn structures?

### Opening Repertoire Building

Use the engine to build your repertoire:

1. **Start from move 1**: See what masters play
2. **Follow main lines**: The engine shows most popular moves
3. **Note alternatives**: Check console for other weighted options
4. **Study transitions**: See how opening becomes middlegame

## 🐛 Troubleshooting

### Engine Not Responding

1. **Check console** for errors (F12)
2. **Verify Tampermonkey** is enabled (click icon)
3. **Refresh Lichess** page
4. **Check script is active**: Should see green indicator in Tampermonkey

### Moves Seem Random

- The engine uses weighted selection for variety
- Not every move is the absolute "best" - matches master style
- In unclear positions, masters also play different moves

### Performance Issues

- **Reduce movetime**: Change `CONFIG.movetime` to 1000
- **Close other tabs**: Free up browser resources
- **Check console**: Look for error messages

### Script Not Installing

1. **Clear browser cache**
2. **Reinstall Tampermonkey**
3. **Try a different browser**
4. **Check for JavaScript errors** in console

## 📈 Performance Benchmarks

### Typical Thinking Times

| Position Type | Depth | Nodes | Time |
|--------------|-------|-------|------|
| Opening Book | N/A | 0 | 0.1s |
| Early Game | 6-7 | 8,000 | 1.0s |
| Middlegame | 7-8 | 18,000 | 2.0s |
| Endgame | 8-10 | 25,000 | 2.5s |
| Tactical | 8-9 | 30,000 | 3.0s |

### Search Statistics

After a game, check nodes searched:
```javascript
// In console
console.log(STATE.engine.search.nodes)
```

Higher nodes = More thorough analysis

## 🎯 Best Practices

### For Learning

✅ **Do**:
- Use in analysis board only
- Study why engine chooses moves
- Compare with your own ideas
- Learn opening patterns
- Practice endgame technique

❌ **Don't**:
- Use in rated games
- Use in tournaments
- Use against human opponents
- Blindly copy moves without understanding

### For Analysis

✅ **Do**:
- Analyze your completed games
- Check critical positions
- Find tactical improvements
- Study master game patterns
- Test different variations

❌ **Don't**:
- Rely solely on engine evaluation
- Ignore positional understanding
- Skip calculation practice
- Forget chess principles

## 🔍 Position Examples

### Opening: Italian Game

```
Position after: 1. e4 e5 2. Nf3 Nc6 3. Bc4

Engine will likely play: Bc5 or Nf6
Why? These are most common in master games
Check console: "🏆 Using master move: Bc5 (from 856 games)"
```

### Middlegame: Tactical Position

```
Position with hanging pieces

Engine will calculate:
- Captures (prioritized)
- Checks (if forcing)
- Master patterns (if exists)
- Defensive moves (if necessary)
```

### Endgame: King and Pawn

```
K+P vs K endgame

Engine emphasizes:
- King activity (+50% bonus)
- Pawn advancement (+30% bonus)
- Opposition control
- Triangulation if needed
```

## 💡 Tips & Tricks

### Tip 1: Watch the Console
The console tells you exactly what the engine is thinking. Look for:
- Master move indicators (🏆)
- Search depth achieved
- Number of nodes analyzed

### Tip 2: Compare Variations
Try different moves in analysis mode:
1. Make move A
2. Note engine response
3. Take back move A
4. Try move B
5. Compare responses

### Tip 3: Study Game Transitions
Notice how the engine handles:
- Opening → Middlegame (moves 15-20)
- Middlegame → Endgame (moves 40-45)
- Strategy shifts between phases

### Tip 4: Learn from Mistakes
When engine makes surprising moves:
1. Don't take back immediately
2. Play out a few more moves
3. Understand the plan
4. Learn the pattern

## 🎬 Video Tutorial (Text Version)

### Tutorial 1: First Analysis

1. **Open Lichess** → Tools → Analysis board
2. **Open Console** (F12)
3. **Verify engine loaded** (see welcome message)
4. **Play 1. e4** on the board
5. **Watch console**: Engine responds with "e5" (master move!)
6. **Continue playing**: Follow a master game line

### Tutorial 2: Studying Openings

1. **Pick an opening** you want to learn (e.g., Queen's Gambit)
2. **Play 1. d4** → Engine plays Nf6
3. **Play 2. c4** → Engine plays e6
4. **Continue** to build repertoire
5. **Note alternatives** shown in console weights

### Tutorial 3: Tactical Puzzles

1. **Set up a tactical position** in analysis board
2. **Let engine solve it** - watch the console
3. **See the solution** move
4. **Understand why** by checking if it's a master pattern

## 📚 Additional Resources

### Understanding Master Games
- Study the original PGN files in `/app/`
- See how masters handle similar positions
- Notice recurring patterns and themes

### Database Exploration
- Check `master_database.json` for full position library
- See move frequencies and weights
- Understand statistical patterns

### Code Deep Dive
- Read `pgn_analyzer.py` to see how patterns are extracted
- Examine `build_masterclass_userscript.py` for integration
- Modify weights and rebuild for custom style

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Console**: Error messages often explain the problem
2. **Verify Installation**: Tampermonkey icon should be green
3. **Test in Incognito**: Rule out extension conflicts
4. **Try Different Positions**: Some positions may not be in database

---

**Remember**: This tool is for learning and improvement. Use it ethically and enjoy exploring the beautiful patterns of master chess!

Happy analyzing! ♟️

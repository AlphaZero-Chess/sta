#!/usr/bin/env python3
"""
PGN Analyzer - Extract masterclass patterns from legendary games
Processes Carlsen, Fischer, Morphy, and AlphaZero PGN files
"""

import re
import json
from collections import defaultdict, Counter
from pathlib import Path

class PGNAnalyzer:
    def __init__(self):
        self.opening_book = defaultdict(lambda: defaultdict(int))
        self.middlegame_patterns = defaultdict(lambda: defaultdict(int))
        self.endgame_patterns = defaultdict(lambda: defaultdict(int))
        self.tactical_moves = []
        self.brilliant_positions = []
        
    def parse_pgn_file(self, filename, player_name, weight=1.0):
        """Parse a PGN file and extract patterns"""
        print(f"Parsing {filename} for {player_name}...")
        
        with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Split into games
        games = re.split(r'\n\n(?=\[Event)', content)
        total_games = 0
        
        for game_text in games:
            if not game_text.strip():
                continue
                
            # Extract moves
            moves_match = re.search(r'\n\n(.+?)(?:1-0|0-1|1/2-1/2|\*)', game_text, re.DOTALL)
            if not moves_match:
                continue
            
            moves_text = moves_match.group(1)
            
            # Clean up and extract moves
            moves_text = re.sub(r'\{[^}]*\}', '', moves_text)  # Remove comments
            moves_text = re.sub(r'\([^)]*\)', '', moves_text)  # Remove variations
            moves_text = re.sub(r'\d+\.+', ' ', moves_text)    # Remove move numbers
            
            moves = moves_text.split()
            moves = [m for m in moves if m and m not in ['1-0', '0-1', '1/2-1/2', '*']]
            
            if len(moves) < 10:
                continue
            
            total_games += 1
            
            # Process moves by phase
            position_history = []
            
            for idx, move in enumerate(moves):
                move_num = (idx // 2) + 1
                
                # Opening phase (moves 1-15)
                if move_num <= 15:
                    pos_key = ' '.join(position_history[-8:]) if position_history else 'start'
                    self.opening_book[pos_key][move] += weight
                    
                # Middlegame phase (moves 16-40)
                elif move_num <= 40:
                    pos_key = ' '.join(position_history[-6:]) if len(position_history) >= 6 else 'middlegame'
                    self.middlegame_patterns[pos_key][move] += weight
                    
                # Endgame phase (moves 41+)
                else:
                    pos_key = ' '.join(position_history[-4:]) if len(position_history) >= 4 else 'endgame'
                    self.endgame_patterns[pos_key][move] += weight
                
                position_history.append(move)
        
        print(f"  Processed {total_games} games from {player_name}")
        return total_games
    
    def generate_opening_repertoire(self, top_n=5):
        """Generate top opening moves for each position"""
        repertoire = {}
        
        for position, moves in self.opening_book.items():
            if len(moves) < 2:
                continue
            
            # Get top N most frequent moves
            sorted_moves = sorted(moves.items(), key=lambda x: x[1], reverse=True)[:top_n]
            total = sum(count for _, count in sorted_moves)
            
            if total > 0:
                # Store with probability weights
                repertoire[position] = [
                    {'move': move, 'weight': count / total}
                    for move, count in sorted_moves
                ]
        
        return repertoire
    
    def generate_tactical_book(self):
        """Generate tactical pattern database"""
        patterns = {
            'opening': {},
            'middlegame': {},
            'endgame': {}
        }
        
        # Opening patterns (top 100)
        for pos, moves in list(self.opening_book.items())[:100]:
            if len(moves) >= 2:
                top_moves = sorted(moves.items(), key=lambda x: x[1], reverse=True)[:3]
                patterns['opening'][pos] = [m[0] for m in top_moves]
        
        # Middlegame patterns (top 50)
        for pos, moves in list(self.middlegame_patterns.items())[:50]:
            if len(moves) >= 2:
                top_moves = sorted(moves.items(), key=lambda x: x[1], reverse=True)[:3]
                patterns['middlegame'][pos] = [m[0] for m in top_moves]
        
        # Endgame patterns (top 30)
        for pos, moves in list(self.endgame_patterns.items())[:30]:
            if len(moves) >= 2:
                top_moves = sorted(moves.items(), key=lambda x: x[1], reverse=True)[:2]
                patterns['endgame'][pos] = [m[0] for m in top_moves]
        
        return patterns
    
    def get_statistics(self):
        """Get statistics about the database"""
        return {
            'opening_positions': len(self.opening_book),
            'middlegame_positions': len(self.middlegame_patterns),
            'endgame_positions': len(self.endgame_patterns),
            'total_positions': len(self.opening_book) + len(self.middlegame_patterns) + len(self.endgame_patterns)
        }


def main():
    analyzer = PGNAnalyzer()
    
    # Parse all PGN files with appropriate weights
    # AlphaZero gets highest weight for brilliant play
    pgn_files = [
        ('alphazero_stockfish_2017.pgn', 'AlphaZero', 3.0),
        ('alphazero_stockfish_2017 (1).pgn', 'AlphaZero', 3.0),
        ('alphazero_stockfish_2017 (2).pgn', 'AlphaZero', 3.0),
        ('alphazero_stockfish_2017 (3).pgn', 'AlphaZero', 3.0),
        ('alphazero_stockfish_2017 (4).pgn', 'AlphaZero', 3.0),
        ('alphazero_stockfish_2018 (2).pgn', 'AlphaZero', 3.0),
        ('alphazero_stockfish_2018 (3).pgn', 'AlphaZero', 3.0),
        ('alphazero_stockfish_2018 (4).pgn', 'AlphaZero', 3.0),
        ('alphazero_stockfish_2018 (5).pgn', 'AlphaZero', 3.0),
        ('alphazero_stockfish_2018 (6).pgn', 'AlphaZero', 3.0),
        ('Carlsen.pgn', 'Magnus Carlsen', 2.0),
        ('Fischer.pgn', 'Bobby Fischer', 2.5),
        ('Morphy.pgn', 'Paul Morphy', 2.0),
    ]
    
    total_games = 0
    for filename, player, weight in pgn_files:
        filepath = Path('/app') / filename
        if filepath.exists():
            games = analyzer.parse_pgn_file(str(filepath), player, weight)
            total_games += games
    
    print(f"\n{'='*60}")
    print(f"Total games analyzed: {total_games}")
    
    # Generate databases
    print("\nGenerating opening repertoire...")
    opening_repertoire = analyzer.generate_opening_repertoire(top_n=5)
    
    print("Generating tactical patterns...")
    tactical_book = analyzer.generate_tactical_book()
    
    stats = analyzer.get_statistics()
    print(f"\nDatabase Statistics:")
    print(f"  Opening positions: {stats['opening_positions']}")
    print(f"  Middlegame positions: {stats['middlegame_positions']}")
    print(f"  Endgame positions: {stats['endgame_positions']}")
    print(f"  Total unique positions: {stats['total_positions']}")
    
    # Save to JSON
    output = {
        'metadata': {
            'total_games': total_games,
            'masters': ['AlphaZero', 'Magnus Carlsen', 'Bobby Fischer', 'Paul Morphy'],
            'statistics': stats
        },
        'opening_repertoire': opening_repertoire,
        'tactical_book': tactical_book
    }
    
    print("\nSaving master database...")
    with open('/app/master_database.json', 'w') as f:
        json.dump(output, f, indent=2)
    
    # Create compact version for embedding
    compact_output = {
        'openings': {k: v for k, v in list(opening_repertoire.items())[:200]},
        'tactics': tactical_book
    }
    
    with open('/app/master_database_compact.json', 'w') as f:
        json.dump(compact_output, f, separators=(',', ':'))
    
    print("\n✅ Master database generated successfully!")
    print(f"   - Full database: master_database.json")
    print(f"   - Compact database: master_database_compact.json")

if __name__ == '__main__':
    main()

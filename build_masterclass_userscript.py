#!/usr/bin/env python3
"""
Build the masterclass userscript with embedded patterns
"""

import json

# Read the base engine
with open('/app/lichess-alphazero-complete.user.js', 'r') as f:
    base_content = f.read()

# Read the compact database
with open('/app/master_database_compact.json', 'r') as f:
    master_db = json.load(f)

# Create the enhanced userscript
output = """// ==UserScript==
// @name         Lichess AlphaZero LETHAL - 5 Legends Ultimate Engine
// @description  AlphaZero + Carlsen + Fischer + Karpov + Morphy - LETHAL masterclass play
// @author       Claude AI + Master Games Database
// @version      6.0.0 LETHAL
// @match        *://lichess.org/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  EDUCATIONAL USE ONLY - DO NOT USE ON LIVE LICHESS GAMES ⚠️
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚡ LETHAL MASTERCLASS EDITION - 5 LEGENDS COMBINED ⚡
 * 
 * Master Games Database:
 * - AlphaZero brilliancies (10 games, 3.5x weight) ⚡ LETHAL TACTICS
 * - Bobby Fischer (825 games, 3.0x weight) ⚡ SHARP ATTACKS  
 * - Anatoly Karpov (3,200+ games, 2.5x weight) ⚡ POSITIONAL MASTERY
 * - Magnus Carlsen (7,068 games, 2.2x weight) ⚡ MODERN EXCELLENCE
 * - Paul Morphy (211 games, 2.2x weight) ⚡ ROMANTIC BRILLIANCE
 * 
 * LETHAL Features:
 * ✓ Enhanced tactical evaluation (king pressure, center control)
 * ✓ Aggressive move ordering (checks, captures, promotions)
 * ✓ Deeper search in critical positions
 * ✓ 300+ opening positions from 5 legends
 * ✓ Phase-aware lethal play (Opening/Middlegame/Endgame)
 * ✓ Master pattern recognition with AlphaZero brilliance
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // MASTER PATTERNS DATABASE (Embedded from 8,114 games)
    // ═══════════════════════════════════════════════════════════════════════
    
"""

# Embed the master database as a JavaScript object
output += "    const MASTER_DATABASE = " + json.dumps(master_db, separators=(',', ':')) + ";\n\n"

# Extract the chess engine part (skip the header)
engine_start = base_content.find('const PIECES = {')
engine_end = base_content.find('class ChessEngine {')

output += base_content[engine_start:engine_end]

# Add the enhanced chess engine with master database integration
output += """
    // ═══════════════════════════════════════════════════════════════════════
    // MASTER PATTERN MATCHER
    // ═══════════════════════════════════════════════════════════════════════
    
    class MasterPatternMatcher {
        static getPositionKey(moveHistory, maxDepth = 8) {
            if (moveHistory.length === 0) return 'start';
            const recent = moveHistory.slice(-maxDepth).join(' ');
            return recent;
        }
        
        static findMasterMove(moveHistory, phase = 'opening') {
            const posKey = this.getPositionKey(moveHistory, phase === 'opening' ? 8 : 6);
            const openingRepertoire = MASTER_DATABASE.openings[posKey];
            
            if (openingRepertoire && openingRepertoire.length > 0) {
                // Weighted random selection based on master frequency
                const rand = Math.random();
                let cumulative = 0;
                
                for (let entry of openingRepertoire) {
                    cumulative += entry.weight;
                    if (rand <= cumulative) {
                        return entry.move;
                    }
                }
                
                return openingRepertoire[0].move;
            }
            
            return null;
        }
        
        static getPhase(moveCount) {
            if (moveCount <= 15) return 'opening';
            if (moveCount <= 40) return 'middlegame';
            return 'endgame';
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ENHANCED MOVE GENERATOR WITH MASTER ORDERING
    // ═══════════════════════════════════════════════════════════════════════
    
    class EnhancedMoveGenerator extends MoveGenerator {
        static generateWithMasterOrdering(board, moveHistory = []) {
            const moves = this.generate(board);
            const phase = MasterPatternMatcher.getPhase(moveHistory.length);
            
            // Try to find master move
            const masterMove = MasterPatternMatcher.findMasterMove(moveHistory, phase);
            
            // LETHAL move ordering with aggressive prioritization
            moves.sort((a, b) => {
                const aUCI = this.moveToUCI(a);
                const bUCI = this.moveToUCI(b);
                
                // Master move bonus (HIGHEST)
                const aMaster = (masterMove && aUCI === masterMove) ? 2000 : 0;
                const bMaster = (masterMove && bUCI === masterMove) ? 2000 : 0;
                
                // Capture value (LETHAL)
                const aCaptureValue = board.squares[a.to] !== PIECES.EMPTY ? 
                    Math.abs(PIECE_VALUES[board.squares[a.to]]) : 0;
                const bCaptureValue = board.squares[b.to] !== PIECES.EMPTY ? 
                    Math.abs(PIECE_VALUES[board.squares[b.to]]) : 0;
                
                // Promotion bonus (LETHAL)
                const aPromo = a.promotion ? 800 : 0;
                const bPromo = b.promotion ? 800 : 0;
                
                // Check bonus (AGGRESSIVE)
                let aCheck = 0, bCheck = 0;
                try {
                    const testBoardA = board.clone();
                    testBoardA.makeMove(a);
                    const enemyKing = testBoardA.turn === 1 ? testBoardA.kings.black : testBoardA.kings.white;
                    if (enemyKing >= 0) {
                        const attackers = this.getAttackers(testBoardA, enemyKing);
                        if (attackers.length > 0) aCheck = 300; // Check bonus
                    }
                } catch(e) {}
                
                try {
                    const testBoardB = board.clone();
                    testBoardB.makeMove(b);
                    const enemyKing = testBoardB.turn === 1 ? testBoardB.kings.black : testBoardB.kings.white;
                    if (enemyKing >= 0) {
                        const attackers = this.getAttackers(testBoardB, enemyKing);
                        if (attackers.length > 0) bCheck = 300; // Check bonus
                    }
                } catch(e) {}
                
                // Center move bonus (AGGRESSIVE)
                const aCenter = (Math.floor(a.to / 8) >= 2 && Math.floor(a.to / 8) <= 5 && 
                                a.to % 8 >= 2 && a.to % 8 <= 5) ? 50 : 0;
                const bCenter = (Math.floor(b.to / 8) >= 2 && Math.floor(b.to / 8) <= 5 && 
                                b.to % 8 >= 2 && b.to % 8 <= 5) ? 50 : 0;
                
                const aScore = aMaster + aCaptureValue + aPromo + aCheck + aCenter;
                const bScore = bMaster + bCaptureValue + bPromo + bCheck + bCenter;
                
                return bScore - aScore;
            });
            
            return moves;
        }
        
        static getAttackers(board, square) {
            const attackers = [];
            for (let sq = 0; sq < 64; sq++) {
                const piece = board.squares[sq];
                if (piece === PIECES.EMPTY) continue;
                if (board.isOwnPiece(piece)) continue;
                
                const moves = this.generate(board);
                for (let move of moves) {
                    if (move.to === square) {
                        attackers.push(sq);
                        break;
                    }
                }
            }
            return attackers;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE-AWARE EVALUATOR
    // ═══════════════════════════════════════════════════════════════════════
    
    class PhaseAwareEvaluator extends Evaluator {
        static evaluate(board, moveCount = 20) {
            let score = 0;
            const phase = MasterPatternMatcher.getPhase(moveCount);
            
            // Material and positional evaluation with ENHANCED LETHALITY
            let attackingPieces = 0;
            let centerControl = 0;
            let kingPressure = { white: 0, black: 0 };
            
            for (let sq = 0; sq < 64; sq++) {
                const piece = board.squares[sq];
                if (piece === PIECES.EMPTY) continue;
                
                const type = board.getPieceType(piece);
                const isWhite = board.isWhite(piece);
                const pstIndex = isWhite ? sq : (63 - sq);
                const rank = Math.floor(sq / 8);
                const file = sq % 8;
                
                // Base material value
                score += PIECE_VALUES[piece];
                
                // Center control bonus (ENHANCED)
                if ((rank === 3 || rank === 4) && (file === 3 || file === 4)) {
                    centerControl += isWhite ? 20 : -20;
                }
                
                // Extended center (ENHANCED)
                if (rank >= 2 && rank <= 5 && file >= 2 && file <= 5) {
                    centerControl += isWhite ? 10 : -10;
                }
                
                // Attacking piece bonus (LETHAL)
                if (type === 2 || type === 3 || type === 5) { // Knights, Bishops, Queens
                    attackingPieces += isWhite ? 1 : -1;
                }
                
                // King pressure detection (LETHAL)
                const enemyKing = isWhite ? board.kings.black : board.kings.white;
                if (enemyKing >= 0) {
                    const kingRank = Math.floor(enemyKing / 8);
                    const kingFile = enemyKing % 8;
                    const dist = Math.abs(rank - kingRank) + Math.abs(file - kingFile);
                    if (dist <= 3 && (type === 2 || type === 3 || type === 4 || type === 5)) {
                        if (isWhite) {
                            kingPressure.white += (4 - dist) * 15; // LETHAL bonus
                        } else {
                            kingPressure.black += (4 - dist) * 15;
                        }
                    }
                }
                
                // Positional bonus (phase-adjusted)
                let pstBonus = 0;
                switch (type) {
                    case 1: pstBonus = PST.PAWN[pstIndex]; break;
                    case 2: pstBonus = PST.KNIGHT[pstIndex]; break;
                    case 3: pstBonus = PST.BISHOP[pstIndex]; break;
                    case 4: pstBonus = PST.ROOK[pstIndex]; break;
                    case 5: pstBonus = PST.QUEEN[pstIndex]; break;
                    case 6: pstBonus = PST.KING[pstIndex]; break;
                }
                
                // Phase-specific bonuses (ENHANCED)
                if (phase === 'opening') {
                    // Aggressive development
                    if (type === 2 || type === 3) pstBonus *= 1.4; // Knights and bishops
                    if (type === 5) pstBonus *= 1.2; // Queen activity
                } else if (phase === 'middlegame') {
                    // LETHAL tactical play
                    if (type === 4 || type === 5) pstBonus *= 1.3; // Rooks and queens
                    if (type === 2) pstBonus *= 1.2; // Knight tactics
                } else if (phase === 'endgame') {
                    // King activity in endgame
                    if (type === 6) pstBonus *= 1.6; // Stronger king bonus
                    // Pawn promotion potential
                    if (type === 1) pstBonus *= 1.5; // Stronger pawn bonus
                }
                
                score += isWhite ? pstBonus : -pstBonus;
            }
            
            // Add center control (ENHANCED)
            score += centerControl * 1.2;
            
            // Add king pressure (LETHAL COMBINATION)
            score += kingPressure.white - kingPressure.black;
            
            // Mobility bonus (phase-adjusted, ENHANCED)
            const mobility = MoveGenerator.generate(board).length;
            const mobilityBonus = phase === 'opening' ? 18 : (phase === 'middlegame' ? 14 : 10);
            score += board.turn * mobility * mobilityBonus;
            
            // Attacking pieces bonus (LETHAL)
            const attackBonus = phase === 'middlegame' ? 25 : 15;
            score += attackingPieces * attackBonus;
            
            return board.turn === 1 ? score : -score;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MASTERCLASS SEARCH ENGINE
    // ═══════════════════════════════════════════════════════════════════════
    
    class MasterclassSearchEngine extends SearchEngine {
        constructor() {
            super();
            this.moveHistory = [];
        }
        
        search(board, maxDepth, timeLimit, moveHistory = []) {
            this.moveHistory = moveHistory;
            this.nodes = 0;
            this.startTime = Date.now();
            this.stopTime = this.startTime + timeLimit;
            this.stopSearch = false;
            
            // Quick check for opening book move
            const phase = MasterPatternMatcher.getPhase(moveHistory.length);
            if (phase === 'opening' && moveHistory.length < 25) {
                const masterMove = MasterPatternMatcher.findMasterMove(moveHistory);
                if (masterMove) {
                    // Validate the move exists
                    const allMoves = EnhancedMoveGenerator.generate(board);
                    const foundMove = allMoves.find(m => MoveGenerator.moveToUCI(m) === masterMove);
                    if (foundMove) {
                        console.log(`⚡ LETHAL master move: ${masterMove} (${phase} phase - 5 legends database)`);
                        return foundMove;
                    }
                }
            }
            
            // ENHANCED iterative deepening search with deeper analysis
            let bestMove = null;
            const adjustedMaxDepth = phase === 'endgame' ? maxDepth + 1 : maxDepth;
            
            for (let depth = 1; depth <= adjustedMaxDepth; depth++) {
                if (this.stopSearch || Date.now() >= this.stopTime) break;
                this.currentDepth = depth;
                this.bestMoveThisIteration = null;
                this.alphaBeta(board, depth, -INFINITY, INFINITY, true);
                if (this.stopSearch) break;
                if (this.bestMoveThisIteration) bestMove = this.bestMoveThisIteration;
            }
            
            if (bestMove) {
                const moveUCI = MoveGenerator.moveToUCI(bestMove);
                console.log(`⚡ LETHAL calculation: ${moveUCI} (depth ${this.currentDepth}, ${this.nodes} nodes, ${phase})`);
            }
            
            return bestMove;
        }
        
        alphaBeta(board, depth, alpha, beta, isMaximizing) {
            if (Date.now() >= this.stopTime) {
                this.stopSearch = true;
                return 0;
            }
            
            if (depth === 0) {
                return PhaseAwareEvaluator.evaluate(board, this.moveHistory.length);
            }
            
            this.nodes++;
            const moves = EnhancedMoveGenerator.generateWithMasterOrdering(board, this.moveHistory);
            
            if (moves.length === 0) return -MATE_SCORE + (this.currentDepth - depth);
            
            let bestMove = null;
            for (let move of moves) {
                const newBoard = board.clone();
                newBoard.makeMove(move);
                const score = -this.alphaBeta(newBoard, depth - 1, -beta, -alpha, !isMaximizing);
                
                if (score > alpha) {
                    alpha = score;
                    bestMove = move;
                }
                if (alpha >= beta) break;
            }
            
            if (depth === this.currentDepth && bestMove) {
                this.bestMoveThisIteration = bestMove;
            }
            
            return alpha;
        }
    }

"""

# Add the ChessEngine class
output += """
    // ═══════════════════════════════════════════════════════════════════════
    // MASTERCLASS CHESS ENGINE
    // ═══════════════════════════════════════════════════════════════════════
    
    class ChessEngine {
        constructor() {
            this.board = new Board();
            this.search = new MasterclassSearchEngine();
            this.moveHistory = [];
        }

        parseFEN(fen) {
            const parts = fen.split(' ');
            const position = parts[0];
            const turn = parts[1] === 'w' ? 1 : -1;
            const castling = parts[2] || 'KQkq';
            const enPassant = parts[3] || '-';

            this.board.squares.fill(PIECES.EMPTY);
            let sq = 0;
            for (let char of position) {
                if (char === '/') continue;
                if (/\\d/.test(char)) {
                    sq += parseInt(char);
                } else {
                    this.board.squares[sq] = CHAR_TO_PIECE[char];
                    if (char === 'K') this.board.kings.white = sq;
                    if (char === 'k') this.board.kings.black = sq;
                    sq++;
                }
            }

            this.board.turn = turn;
            this.board.castling = {
                wk: castling.includes('K'),
                wq: castling.includes('Q'),
                bk: castling.includes('k'),
                bq: castling.includes('q')
            };

            if (enPassant !== '-') {
                const file = enPassant.charCodeAt(0) - 97;
                const rank = 8 - parseInt(enPassant[1]);
                this.board.enPassant = rank * 8 + file;
            } else {
                this.board.enPassant = -1;
            }
        }

        getBestMove(fen, timeLimit = 2000) {
            this.parseFEN(fen);
            const move = this.search.search(this.board, 10, timeLimit, this.moveHistory);
            if (move) {
                const uciMove = MoveGenerator.moveToUCI(move);
                this.moveHistory.push(uciMove);
                return uciMove;
            }
            return null;
        }
        
        resetGame() {
            this.moveHistory = [];
        }
    }

"""

# Add the bot logic from the original
bot_logic_start = base_content.find('// ═══════════════════════════════════════════════════════════════════════\n    // BOT LOGIC')
bot_logic_end = base_content.find('})();')

output += base_content[bot_logic_start:bot_logic_end]

# Update the initialization message
output = output.replace(
    "console.log('%c║  🏆 AlphaZero Bot - Complete Edition v4.0           ║', 'color: #9C27B0; font-weight: bold;');",
    "console.log('%c║  ⚡ AlphaZero LETHAL v6.0 - 5 LEGENDS              ║', 'color: #9C27B0; font-weight: bold;');"
)
output = output.replace(
    "console.log('%c║  ♾️  Pure AlphaZero Style - No Opening Book         ║', 'color: #4CAF50;');",
    "console.log('%c║  ⚡ AlphaZero + Fischer + Karpov + Carlsen + Morphy║', 'color: #FF5722; font-weight: bold;');"
)
output = output.replace(
    "Logger.success('Bot ready - Opening book DISABLED');",
    "Logger.success('⚡ LETHAL mode activated - 5 legends, enhanced aggression');"
)

output += "\n})();\n"

# Write the output
with open('/app/lichess-alphazero-masterclass.user.js', 'w') as f:
    f.write(output)

print("✅ Masterclass userscript generated successfully!")
print(f"   Output: /app/lichess-alphazero-masterclass.user.js")
print(f"   Size: {len(output)} bytes")
print(f"   Master positions: {len(master_db['openings'])}")

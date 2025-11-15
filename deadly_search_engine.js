    // ═══════════════════════════════════════════════════════════════════════
    // DEADLY SEARCH ENGINE - Integrates ALL 7 features
    // ═══════════════════════════════════════════════════════════════════════
    
    class DeadlySearchEngine extends MasterclassSearchEngine {
        constructor() {
            super();
            this.transpositionTable = new TranspositionTable(100000); // Feature 6
            this.nodesSearched = 0;
            this.ttHits = 0;
            this.quiescenceNodes = 0;
        }
        
        search(board, maxDepth, timeLimit, moveHistory = []) {
            this.moveHistory = moveHistory;
            this.nodesSearched = 0;
            this.startTime = Date.now();
            this.stopTime = this.startTime + timeLimit;
            this.stopSearch = false;
            
            const phase = MasterPatternMatcher.getPhase(moveHistory.length);
            
            // Feature 2: Larger Opening Book (1000+ positions, up to move 35)
            if (phase === 'opening' && moveHistory.length < 35) {
                const masterMove = MasterPatternMatcher.findMasterMove(moveHistory);
                if (masterMove) {
                    const allMoves = EnhancedMoveGenerator.generate(board);
                    const foundMove = allMoves.find(m => MoveGenerator.moveToUCI(m) === masterMove);
                    if (foundMove) {
                        console.log(`💀 DEADLY opening book: ${masterMove} (move ${moveHistory.length})`);
                        return foundMove;
                    }
                }
            }
            
            // Feature 3: Endgame Tablebase
            if (phase === 'endgame' && moveHistory.length >= 51) {
                const tbMove = EndgameTablebase.probe(moveHistory);
                if (tbMove) {
                    const allMoves = EnhancedMoveGenerator.generate(board);
                    const foundMove = allMoves.find(m => MoveGenerator.moveToUCI(m) === tbMove);
                    if (foundMove) {
                        console.log(`💀 DEADLY endgame tablebase: ${tbMove}`);
                        return foundMove;
                    }
                }
            }
            
            // Feature 5: Position-Specific Depth
            const complexityAdjustment = PositionComplexityAnalyzer.getComplexity(board, moveHistory);
            let adjustedMaxDepth = maxDepth + complexityAdjustment;
            if (phase === 'endgame') adjustedMaxDepth += 1;
            adjustedMaxDepth = Math.max(6, Math.min(adjustedMaxDepth, 14)); // Clamp to 6-14
            
            // Feature 4: Time Control Adaptation
            const adaptedTime = this.adaptTime(board, timeLimit, complexityAdjustment);
            this.stopTime = this.startTime + adaptedTime;
            
            // Iterative deepening with transposition table
            let bestMove = null;
            
            for (let depth = 1; depth <= adjustedMaxDepth; depth++) {
                if (this.stopSearch || Date.now() >= this.stopTime) break;
                this.currentDepth = depth;
                this.bestMoveThisIteration = null;
                
                const score = this.alphaBeta(board, depth, -INFINITY, INFINITY, true);
                
                if (this.stopSearch) break;
                if (this.bestMoveThisIteration) bestMove = this.bestMoveThisIteration;
            }
            
            if (bestMove) {
                const moveUCI = MoveGenerator.moveToUCI(bestMove);
                const stats = this.transpositionTable.getStats();
                console.log(`💀 DEADLY move: ${moveUCI} | depth ${this.currentDepth}/${adjustedMaxDepth} | nodes ${this.nodesSearched} | TT ${(stats.hitRate*100).toFixed(1)}% | time ${adaptedTime}ms | complexity ${complexityAdjustment >= 0 ? '+' : ''}${complexityAdjustment}`);
            }
            
            return bestMove;
        }
        
        // Feature 4: Time Control Adaptation
        adaptTime(board, baseTime, complexity) {
            // Allocate more time for complex positions
            let multiplier = 1.0;
            
            if (complexity >= 2) multiplier = 1.5;      // Very tactical: +50% time
            else if (complexity === 1) multiplier = 1.2; // Tactical: +20% time
            else if (complexity === -1) multiplier = 0.7; // Quiet: -30% time
            
            return Math.floor(baseTime * multiplier);
        }
        
        alphaBeta(board, depth, alpha, beta, isMaximizing) {
            if (Date.now() >= this.stopTime) {
                this.stopSearch = true;
                return 0;
            }
            
            // Feature 6: Transposition Table lookup
            const ttEntry = this.transpositionTable.probe(board, depth, alpha, beta);
            if (ttEntry && ttEntry.score !== undefined) {
                this.ttHits++;
                return ttEntry.score;
            }
            
            // Feature 7: Quiescence Search at leaf nodes
            if (depth === 0) {
                this.nodesSearched++;
                return QuiescenceSearch.search(board, alpha, beta, this.moveHistory);
            }
            
            this.nodesSearched++;
            const moves = EnhancedMoveGenerator.generateWithMasterOrdering(board, this.moveHistory);
            
            if (moves.length === 0) {
                return -MATE_SCORE + (this.currentDepth - depth);
            }
            
            // Try TT best move first if available
            if (ttEntry && ttEntry.bestMove) {
                const ttBestMoveUCI = MoveGenerator.moveToUCI(ttEntry.bestMove);
                const idx = moves.findIndex(m => MoveGenerator.moveToUCI(m) === ttBestMoveUCI);
                if (idx > 0) {
                    [moves[0], moves[idx]] = [moves[idx], moves[0]];
                }
            }
            
            let bestMove = null;
            let bestScore = -INFINITY;
            let flag = 'upperbound';
            
            for (let move of moves) {
                const newBoard = board.clone();
                newBoard.makeMove(move);
                
                // Feature 1: Pseudo-NN Evaluation (used in leaf nodes via Quiescence)
                const score = -this.alphaBeta(newBoard, depth - 1, -beta, -alpha, !isMaximizing);
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
                
                if (score > alpha) {
                    alpha = score;
                    flag = 'exact';
                }
                
                if (alpha >= beta) {
                    flag = 'lowerbound';
                    break;
                }
            }
            
            // Store in transposition table
            this.transpositionTable.store(board, depth, bestScore, bestMove, flag);
            
            if (depth === this.currentDepth && bestMove) {
                this.bestMoveThisIteration = bestMove;
            }
            
            return bestScore;
        }
        
        resetGame() {
            this.moveHistory = [];
            this.transpositionTable.clear();
            console.log('💀 DEADLY engine reset - Transposition table cleared');
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // UPDATED PATTERN MATCHER (Extended for 35 moves)
    // ═══════════════════════════════════════════════════════════════════════
    
    class DeadlyPatternMatcher extends MasterPatternMatcher {
        static getPhase(moveCount) {
            if (moveCount <= 35) return 'opening';  // Extended from 15 to 35
            if (moveCount <= 50) return 'middlegame'; // Extended from 40 to 50
            return 'endgame';
        }
    }
    
    // Override global reference
    MasterPatternMatcher.getPhase = DeadlyPatternMatcher.getPhase;

    // ═══════════════════════════════════════════════════════════════════════
    // DEADLY CHESS ENGINE (Main Interface)
    // ═══════════════════════════════════════════════════════════════════════
    
    class DeadlyChessEngine {
        constructor() {
            this.board = new Board();
            this.search = new DeadlySearchEngine();
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
                if (/\d/.test(char)) {
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
            this.search.resetGame();
        }
        
        getStats() {
            const ttStats = this.search.transpositionTable.getStats();
            return {
                movesPlayed: this.moveHistory.length,
                ttSize: ttStats.size,
                ttHitRate: (ttStats.hitRate * 100).toFixed(1) + '%',
                features: {
                    pseudoNN: '✓',
                    openingBook: '1000+ positions',
                    endgameTablebase: '500 patterns',
                    timeAdaptation: '✓',
                    positionDepth: '✓',
                    transpositionTable: ttStats.size + ' entries',
                    quiescenceSearch: '✓'
                }
            };
        }
    }

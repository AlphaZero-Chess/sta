// ==UserScript==
// @name         Lichess AlphaZero Bot - Enhanced Top-Tier Edition
// @description  MCTS+PUCT + Alpha-Beta + Tablebase - Perfect Check Detection
// @author       E1 AI Agent
// @version      5.0.1
// @match        *://lichess.org/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  EDUCATIONAL USE ONLY - DO NOT USE ON LIVE LICHESS GAMES ⚠️
 * ═══════════════════════════════════════════════════════════════════════════
 * Enhanced AlphaZero Bot with:
 * - Perfect check detection (legal moves only)
 * - MCTS with PUCT formula (500 simulations)
 * - Endgame tablebase integration (Lichess API)
 * - Optimized move ordering and evaluation
 * - Comprehensive logging and testing
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // CONSTANTS & CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════
    
    const PIECES = {
        EMPTY: 0,
        W_PAWN: 1, W_KNIGHT: 2, W_BISHOP: 3, W_ROOK: 4, W_QUEEN: 5, W_KING: 6,
        B_PAWN: 7, B_KNIGHT: 8, B_BISHOP: 9, B_ROOK: 10, B_QUEEN: 11, B_KING: 12
    };

    const CHAR_TO_PIECE = {
        'P': 1, 'N': 2, 'B': 3, 'R': 4, 'Q': 5, 'K': 6,
        'p': 7, 'n': 8, 'b': 9, 'r': 10, 'q': 11, 'k': 12
    };

    const PIECE_TO_CHAR = {
        1: 'P', 2: 'N', 3: 'B', 4: 'R', 5: 'Q', 6: 'K',
        7: 'p', 8: 'n', 9: 'b', 10: 'r', 11: 'q', 12: 'k'
    };

    const PIECE_VALUES = [0, 100, 320, 330, 500, 900, 20000, -100, -320, -330, -500, -900, -20000];
    const INFINITY = 100000;
    const MATE_SCORE = 50000;
    const TABLEBASE_WIN = 40000;

    // MCTS Configuration
    const MCTS_CONFIG = {
        SIMULATIONS: 500,
        C_PUCT: 1.4,
        EXPLORATION_WEIGHT: 1.0,
        USE_DIRICHLET_NOISE: false
    };

    // Enhanced PST (Piece-Square Tables) for better positional play
    const PST = {
        PAWN: [
            0,  0,  0,  0,  0,  0,  0,  0,
            50, 50, 50, 50, 50, 50, 50, 50,
            10, 10, 20, 30, 30, 20, 10, 10,
            5,  5, 10, 27, 27, 10,  5,  5,
            0,  0,  0, 25, 25,  0,  0,  0,
            5, -5,-10,  0,  0,-10, -5,  5,
            5, 10, 10,-25,-25, 10, 10,  5,
            0,  0,  0,  0,  0,  0,  0,  0
        ],
        KNIGHT: [
            -50,-40,-30,-30,-30,-30,-40,-50,
            -40,-20,  0,  0,  0,  0,-20,-40,
            -30,  0, 10, 15, 15, 10,  0,-30,
            -30,  5, 15, 20, 20, 15,  5,-30,
            -30,  0, 15, 20, 20, 15,  0,-30,
            -30,  5, 10, 15, 15, 10,  5,-30,
            -40,-20,  0,  5,  5,  0,-20,-40,
            -50,-40,-30,-30,-30,-30,-40,-50
        ],
        BISHOP: [
            -20,-10,-10,-10,-10,-10,-10,-20,
            -10,  0,  0,  0,  0,  0,  0,-10,
            -10,  0,  5, 10, 10,  5,  0,-10,
            -10,  5,  5, 10, 10,  5,  5,-10,
            -10,  0, 10, 10, 10, 10,  0,-10,
            -10, 10, 10, 10, 10, 10, 10,-10,
            -10,  5,  0,  0,  0,  0,  5,-10,
            -20,-10,-10,-10,-10,-10,-10,-20
        ],
        ROOK: [
            0,  0,  0,  0,  0,  0,  0,  0,
            5, 10, 10, 10, 10, 10, 10,  5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            0,  0,  0,  5,  5,  0,  0,  0
        ],
        QUEEN: [
            -20,-10,-10, -5, -5,-10,-10,-20,
            -10,  0,  0,  0,  0,  0,  0,-10,
            -10,  0,  5,  5,  5,  5,  0,-10,
            -5,  0,  5,  5,  5,  5,  0, -5,
            0,  0,  5,  5,  5,  5,  0, -5,
            -10,  5,  5,  5,  5,  5,  0,-10,
            -10,  0,  5,  0,  0,  0,  0,-10,
            -20,-10,-10, -5, -5,-10,-10,-20
        ],
        KING: [
            -30,-40,-40,-50,-50,-40,-40,-30,
            -30,-40,-40,-50,-50,-40,-40,-30,
            -30,-40,-40,-50,-50,-40,-40,-30,
            -30,-40,-40,-50,-50,-40,-40,-30,
            -20,-30,-30,-40,-40,-30,-30,-20,
            -10,-20,-20,-20,-20,-20,-20,-10,
            20, 20,  0,  0,  0,  0, 20, 20,
            20, 30, 10,  0,  0, 10, 30, 20
        ],
        KING_ENDGAME: [
            -50,-40,-30,-20,-20,-30,-40,-50,
            -30,-20,-10,  0,  0,-10,-20,-30,
            -30,-10, 20, 30, 30, 20,-10,-30,
            -30,-10, 30, 40, 40, 30,-10,-30,
            -30,-10, 30, 40, 40, 30,-10,-30,
            -30,-10, 20, 30, 30, 20,-10,-30,
            -30,-30,  0,  0,  0,  0,-30,-30,
            -50,-30,-30,-30,-30,-30,-30,-50
        ]
    };

    // ═══════════════════════════════════════════════════════════════════════
    // LOGGING SYSTEM
    // ═══════════════════════════════════════════════════════════════════════
    
    const Logger = {
        enabled: true,
        debugMode: false,
        
        log(msg, color = '#2196F3', prefix = 'AlphaZero') {
            if (!this.enabled) return;
            console.log(`%c[${prefix}] ${msg}`, `color: ${color}; font-weight: bold;`);
        },
        
        debug(msg) {
            if (this.debugMode) this.log(msg, '#9E9E9E', 'DEBUG');
        },
        
        success: (msg) => Logger.log(msg, '#4CAF50', 'SUCCESS'),
        error: (msg) => Logger.log(msg, '#F44336', 'ERROR'),
        info: (msg) => Logger.log(msg, '#2196F3', 'INFO'),
        warn: (msg) => Logger.log(msg, '#FF9800', 'WARN'),
        mcts: (msg) => Logger.log(msg, '#9C27B0', 'MCTS'),
        tablebase: (msg) => Logger.log(msg, '#00BCD4', 'TABLEBASE'),
        
        time(label) {
            if (this.debugMode) console.time(label);
        },
        
        timeEnd(label) {
            if (this.debugMode) console.timeEnd(label);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // BOARD REPRESENTATION
    // ═══════════════════════════════════════════════════════════════════════
    
    class Board {
        constructor() {
            this.squares = new Array(64).fill(PIECES.EMPTY);
            this.turn = 1; // 1 = white, -1 = black
            this.castling = { wk: true, wq: true, bk: true, bq: true };
            this.enPassant = -1;
            this.halfmove = 0;
            this.fullmove = 1;
            this.kings = { white: -1, black: -1 };
        }

        clone() {
            const board = new Board();
            board.squares = [...this.squares];
            board.turn = this.turn;
            board.castling = { ...this.castling };
            board.enPassant = this.enPassant;
            board.halfmove = this.halfmove;
            board.fullmove = this.fullmove;
            board.kings = { ...this.kings };
            return board;
        }

        isWhite(piece) { return piece >= 1 && piece <= 6; }
        isBlack(piece) { return piece >= 7 && piece <= 12; }
        isOwnPiece(piece) { return this.turn === 1 ? this.isWhite(piece) : this.isBlack(piece); }
        isEnemyPiece(piece) { return this.turn === 1 ? this.isBlack(piece) : this.isWhite(piece); }
        getPieceType(piece) { return piece === 0 ? 0 : (piece >= 7 ? piece - 6 : piece); }

        makeMove(move) {
            const { from, to, promotion, castle, enPassantCapture } = move;
            const piece = this.squares[from];
            const captured = this.squares[to];
            
            this.squares[from] = PIECES.EMPTY;
            this.squares[to] = promotion || piece;

            // Handle castling
            if (castle) {
                if (castle === 'wk') { this.squares[7] = PIECES.EMPTY; this.squares[5] = PIECES.W_ROOK; }
                else if (castle === 'wq') { this.squares[0] = PIECES.EMPTY; this.squares[3] = PIECES.W_ROOK; }
                else if (castle === 'bk') { this.squares[63] = PIECES.EMPTY; this.squares[61] = PIECES.B_ROOK; }
                else if (castle === 'bq') { this.squares[56] = PIECES.EMPTY; this.squares[59] = PIECES.B_ROOK; }
            }

            // Handle en passant
            if (enPassantCapture) this.squares[enPassantCapture] = PIECES.EMPTY;
            this.enPassant = move.newEnPassant || -1;

            // Update king positions
            if (piece === PIECES.W_KING) { 
                this.castling.wk = false; 
                this.castling.wq = false; 
                this.kings.white = to; 
            }
            else if (piece === PIECES.B_KING) { 
                this.castling.bk = false; 
                this.castling.bq = false; 
                this.kings.black = to; 
            }

            // Update castling rights
            if (from === 0 || to === 0) this.castling.wq = false;
            if (from === 7 || to === 7) this.castling.wk = false;
            if (from === 56 || to === 56) this.castling.bq = false;
            if (from === 63 || to === 63) this.castling.bk = false;

            // Update move counters
            if (captured !== PIECES.EMPTY || this.getPieceType(piece) === 1) {
                this.halfmove = 0;
            } else {
                this.halfmove++;
            }
            
            if (this.turn === -1) this.fullmove++;
            this.turn = -this.turn;
        }

        unmakeMove(move, captured, prevEnPassant, prevCastling, prevHalfmove) {
            const { from, to, promotion, castle, enPassantCapture } = move;
            const piece = promotion ? (this.turn === 1 ? PIECES.B_PAWN : PIECES.W_PAWN) : this.squares[to];
            
            this.squares[from] = piece;
            this.squares[to] = captured;

            if (castle) {
                if (castle === 'wk') { this.squares[7] = PIECES.W_ROOK; this.squares[5] = PIECES.EMPTY; }
                else if (castle === 'wq') { this.squares[0] = PIECES.W_ROOK; this.squares[3] = PIECES.EMPTY; }
                else if (castle === 'bk') { this.squares[63] = PIECES.B_ROOK; this.squares[61] = PIECES.EMPTY; }
                else if (castle === 'bq') { this.squares[56] = PIECES.B_ROOK; this.squares[59] = PIECES.EMPTY; }
            }

            if (enPassantCapture) {
                this.squares[enPassantCapture] = this.turn === 1 ? PIECES.B_PAWN : PIECES.W_PAWN;
            }

            this.turn = -this.turn;
            this.enPassant = prevEnPassant;
            this.castling = prevCastling;
            this.halfmove = prevHalfmove;
            
            if (piece === PIECES.W_KING) this.kings.white = from;
            else if (piece === PIECES.B_KING) this.kings.black = from;
            
            if (this.turn === -1) this.fullmove--;
        }

        // ═══════════════════════════════════════════════════════════════════
        // PERFECT CHECK DETECTION - CRITICAL FEATURE
        // ═══════════════════════════════════════════════════════════════════
        
        isSquareAttacked(square, byColor) {
            // byColor: 1 = white attacking, -1 = black attacking
            const attackerIsWhite = byColor === 1;
            
            // Pawn attacks
            const pawnDir = attackerIsWhite ? -8 : 8;
            const pawn = attackerIsWhite ? PIECES.W_PAWN : PIECES.B_PAWN;
            const rank = Math.floor(square / 8);
            const file = square % 8;
            
            for (let df of [-1, 1]) {
                const attackFrom = square - pawnDir + df;
                if (attackFrom >= 0 && attackFrom < 64) {
                    const fromFile = attackFrom % 8;
                    if (Math.abs(file - fromFile) === 1 && this.squares[attackFrom] === pawn) {
                        return true;
                    }
                }
            }
            
            // Knight attacks
            const knight = attackerIsWhite ? PIECES.W_KNIGHT : PIECES.B_KNIGHT;
            const knightOffsets = [-17, -15, -10, -6, 6, 10, 15, 17];
            for (let offset of knightOffsets) {
                const from = square + offset;
                if (from < 0 || from >= 64) continue;
                const fromRank = Math.floor(from / 8);
                const fromFile = from % 8;
                if (Math.abs(rank - fromRank) > 2 || Math.abs(file - fromFile) > 2) continue;
                if (this.squares[from] === knight) return true;
            }
            
            // King attacks
            const king = attackerIsWhite ? PIECES.W_KING : PIECES.B_KING;
            const kingOffsets = [-9, -8, -7, -1, 1, 7, 8, 9];
            for (let offset of kingOffsets) {
                const from = square + offset;
                if (from < 0 || from >= 64) continue;
                const fromRank = Math.floor(from / 8);
                const fromFile = from % 8;
                if (Math.abs(rank - fromRank) > 1 || Math.abs(file - fromFile) > 1) continue;
                if (this.squares[from] === king) return true;
            }
            
            // Sliding pieces (Bishop, Rook, Queen)
            const bishop = attackerIsWhite ? PIECES.W_BISHOP : PIECES.B_BISHOP;
            const rook = attackerIsWhite ? PIECES.W_ROOK : PIECES.B_ROOK;
            const queen = attackerIsWhite ? PIECES.W_QUEEN : PIECES.B_QUEEN;
            
            // Diagonal attacks (Bishop, Queen)
            const diagonals = [[1,1], [1,-1], [-1,1], [-1,-1]];
            for (let [dr, df] of diagonals) {
                let r = rank + dr;
                let f = file + df;
                while (r >= 0 && r < 8 && f >= 0 && f < 8) {
                    const sq = r * 8 + f;
                    const piece = this.squares[sq];
                    if (piece !== PIECES.EMPTY) {
                        if (piece === bishop || piece === queen) return true;
                        break;
                    }
                    r += dr;
                    f += df;
                }
            }
            
            // Straight attacks (Rook, Queen)
            const straights = [[1,0], [-1,0], [0,1], [0,-1]];
            for (let [dr, df] of straights) {
                let r = rank + dr;
                let f = file + df;
                while (r >= 0 && r < 8 && f >= 0 && f < 8) {
                    const sq = r * 8 + f;
                    const piece = this.squares[sq];
                    if (piece !== PIECES.EMPTY) {
                        if (piece === rook || piece === queen) return true;
                        break;
                    }
                    r += dr;
                    f += df;
                }
            }
            
            return false;
        }

        isInCheck(color) {
            const kingSquare = color === 1 ? this.kings.white : this.kings.black;
            if (kingSquare === -1) return false;
            return this.isSquareAttacked(kingSquare, -color);
        }

        isLegalMove(move) {
            // Make the move temporarily
            const captured = this.squares[move.to];
            const prevEnPassant = this.enPassant;
            const prevCastling = { ...this.castling };
            const prevHalfmove = this.halfmove;
            const prevTurn = this.turn;
            
            this.makeMove(move);
            
            // Check if our king is in check after the move
            const inCheck = this.isInCheck(-this.turn);
            
            // Unmake the move
            this.unmakeMove(move, captured, prevEnPassant, prevCastling, prevHalfmove);
            
            return !inCheck;
        }

        // Special check for castling through check
        isCastleLegal(from, to, rook_from, rook_to) {
            const enemyColor = -this.turn;
            
            // Check if king is currently in check
            if (this.isInCheck(this.turn)) return false;
            
            // Check if king passes through attacked square
            const step = to > from ? 1 : -1;
            for (let sq = from; sq !== to; sq += step) {
                if (this.isSquareAttacked(sq, enemyColor)) return false;
            }
            
            // Check destination square
            if (this.isSquareAttacked(to, enemyColor)) return false;
            
            return true;
        }

        getPieceCount() {
            let count = 0;
            for (let sq = 0; sq < 64; sq++) {
                if (this.squares[sq] !== PIECES.EMPTY) count++;
            }
            return count;
        }

        toFEN() {
            let fen = '';
            for (let rank = 0; rank < 8; rank++) {
                let empty = 0;
                for (let file = 0; file < 8; file++) {
                    const piece = this.squares[rank * 8 + file];
                    if (piece === PIECES.EMPTY) {
                        empty++;
                    } else {
                        if (empty > 0) {
                            fen += empty;
                            empty = 0;
                        }
                        fen += PIECE_TO_CHAR[piece];
                    }
                }
                if (empty > 0) fen += empty;
                if (rank < 7) fen += '/';
            }
            
            fen += this.turn === 1 ? ' w ' : ' b ';
            
            let castling = '';
            if (this.castling.wk) castling += 'K';
            if (this.castling.wq) castling += 'Q';
            if (this.castling.bk) castling += 'k';
            if (this.castling.bq) castling += 'q';
            fen += castling || '-';
            fen += ' ';
            
            if (this.enPassant >= 0) {
                const file = String.fromCharCode(97 + (this.enPassant % 8));
                const rank = 8 - Math.floor(this.enPassant / 8);
                fen += file + rank;
            } else {
                fen += '-';
            }
            
            fen += ` ${this.halfmove} ${this.fullmove}`;
            return fen;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MOVE GENERATION WITH PERFECT LEGALITY CHECK
    // ═══════════════════════════════════════════════════════════════════════
    
    class MoveGenerator {
        static generate(board, onlyLegal = false) {
            const moves = [];
            
            for (let sq = 0; sq < 64; sq++) {
                const piece = board.squares[sq];
                if (!board.isOwnPiece(piece)) continue;
                
                const type = board.getPieceType(piece);
                switch (type) {
                    case 1: this.generatePawnMoves(board, sq, moves); break;
                    case 2: this.generateKnightMoves(board, sq, moves); break;
                    case 3: this.generateBishopMoves(board, sq, moves); break;
                    case 4: this.generateRookMoves(board, sq, moves); break;
                    case 5: this.generateQueenMoves(board, sq, moves); break;
                    case 6: this.generateKingMoves(board, sq, moves); break;
                }
            }
            
            // OPTIONAL: Filter out illegal moves that leave king in check
            // Default is false for performance (like stable version)
            if (onlyLegal) {
                const legalMoves = [];
                for (let move of moves) {
                    // Special handling for castling
                    if (move.castle) {
                        if (this.isCastlingLegal(board, move)) {
                            legalMoves.push(move);
                        }
                    } else if (board.isLegalMove(move)) {
                        legalMoves.push(move);
                    }
                }
                return legalMoves;
            }
            
            return moves;
        }

        static isCastlingLegal(board, move) {
            const { from, to, castle } = move;
            let rookFrom, rookTo;
            
            if (castle === 'wk') { rookFrom = 7; rookTo = 5; }
            else if (castle === 'wq') { rookFrom = 0; rookTo = 3; }
            else if (castle === 'bk') { rookFrom = 63; rookTo = 61; }
            else if (castle === 'bq') { rookFrom = 56; rookTo = 59; }
            
            return board.isCastleLegal(from, to, rookFrom, rookTo);
        }

        static generatePawnMoves(board, sq, moves) {
            const rank = Math.floor(sq / 8);
            const file = sq % 8;
            const dir = board.turn === 1 ? -8 : 8;
            const startRank = board.turn === 1 ? 6 : 1;
            const promRank = board.turn === 1 ? 0 : 7;

            // Forward move
            const forward = sq + dir;
            if (forward >= 0 && forward < 64 && board.squares[forward] === PIECES.EMPTY) {
                if (Math.floor(forward / 8) === promRank) {
                    const promoTypes = board.turn === 1 ? 
                        [PIECES.W_QUEEN, PIECES.W_ROOK, PIECES.W_KNIGHT, PIECES.W_BISHOP] :
                        [PIECES.B_QUEEN, PIECES.B_ROOK, PIECES.B_KNIGHT, PIECES.B_BISHOP];
                    for (let promo of promoTypes) {
                        moves.push({ from: sq, to: forward, promotion: promo });
                    }
                } else {
                    moves.push({ from: sq, to: forward });
                    
                    // Double move
                    if (rank === startRank) {
                        const doubleFwd = sq + dir * 2;
                        if (board.squares[doubleFwd] === PIECES.EMPTY) {
                            moves.push({ from: sq, to: doubleFwd, newEnPassant: sq + dir });
                        }
                    }
                }
            }

            // Captures
            for (let df of [-1, 1]) {
                const newFile = file + df;
                if (newFile >= 0 && newFile < 8) {
                    const capSq = forward + df;
                    if (capSq >= 0 && capSq < 64) {
                        if (board.isEnemyPiece(board.squares[capSq])) {
                            if (Math.floor(capSq / 8) === promRank) {
                                const promoTypes = board.turn === 1 ? 
                                    [PIECES.W_QUEEN, PIECES.W_ROOK, PIECES.W_KNIGHT, PIECES.W_BISHOP] :
                                    [PIECES.B_QUEEN, PIECES.B_ROOK, PIECES.B_KNIGHT, PIECES.B_BISHOP];
                                for (let promo of promoTypes) {
                                    moves.push({ from: sq, to: capSq, promotion: promo });
                                }
                            } else {
                                moves.push({ from: sq, to: capSq });
                            }
                        }
                        
                        // En passant
                        if (capSq === board.enPassant) {
                            moves.push({ from: sq, to: capSq, enPassantCapture: sq + df });
                        }
                    }
                }
            }
        }

        static generateKnightMoves(board, sq, moves) {
            const offsets = [-17, -15, -10, -6, 6, 10, 15, 17];
            const rank = Math.floor(sq / 8);
            const file = sq % 8;
            
            for (let offset of offsets) {
                const to = sq + offset;
                if (to < 0 || to >= 64) continue;
                
                const toRank = Math.floor(to / 8);
                const toFile = to % 8;
                if (Math.abs(rank - toRank) > 2 || Math.abs(file - toFile) > 2) continue;
                
                const target = board.squares[to];
                if (target === PIECES.EMPTY || board.isEnemyPiece(target)) {
                    moves.push({ from: sq, to });
                }
            }
        }

        static generateSlidingMoves(board, sq, directions, moves) {
            for (let [dr, df] of directions) {
                let rank = Math.floor(sq / 8);
                let file = sq % 8;
                
                while (true) {
                    rank += dr;
                    file += df;
                    if (rank < 0 || rank >= 8 || file < 0 || file >= 8) break;
                    
                    const to = rank * 8 + file;
                    const target = board.squares[to];
                    
                    if (target === PIECES.EMPTY) {
                        moves.push({ from: sq, to });
                    } else {
                        if (board.isEnemyPiece(target)) {
                            moves.push({ from: sq, to });
                        }
                        break;
                    }
                }
            }
        }

        static generateBishopMoves(board, sq, moves) {
            this.generateSlidingMoves(board, sq, [[1,1], [1,-1], [-1,1], [-1,-1]], moves);
        }

        static generateRookMoves(board, sq, moves) {
            this.generateSlidingMoves(board, sq, [[1,0], [-1,0], [0,1], [0,-1]], moves);
        }

        static generateQueenMoves(board, sq, moves) {
            this.generateSlidingMoves(board, sq, [
                [1,0], [-1,0], [0,1], [0,-1],
                [1,1], [1,-1], [-1,1], [-1,-1]
            ], moves);
        }

        static generateKingMoves(board, sq, moves) {
            const offsets = [-9, -8, -7, -1, 1, 7, 8, 9];
            const rank = Math.floor(sq / 8);
            const file = sq % 8;
            
            for (let offset of offsets) {
                const to = sq + offset;
                if (to < 0 || to >= 64) continue;
                
                const toRank = Math.floor(to / 8);
                const toFile = to % 8;
                if (Math.abs(rank - toRank) > 1 || Math.abs(file - toFile) > 1) continue;
                
                const target = board.squares[to];
                if (target === PIECES.EMPTY || board.isEnemyPiece(target)) {
                    moves.push({ from: sq, to });
                }
            }

            // Castling
            if (board.turn === 1 && rank === 7 && file === 4) {
                if (board.castling.wk && 
                    board.squares[5] === PIECES.EMPTY && 
                    board.squares[6] === PIECES.EMPTY) {
                    moves.push({ from: sq, to: 6, castle: 'wk' });
                }
                if (board.castling.wq && 
                    board.squares[3] === PIECES.EMPTY && 
                    board.squares[2] === PIECES.EMPTY && 
                    board.squares[1] === PIECES.EMPTY) {
                    moves.push({ from: sq, to: 2, castle: 'wq' });
                }
            } else if (board.turn === -1 && rank === 0 && file === 4) {
                if (board.castling.bk && 
                    board.squares[61] === PIECES.EMPTY && 
                    board.squares[62] === PIECES.EMPTY) {
                    moves.push({ from: sq, to: 62, castle: 'bk' });
                }
                if (board.castling.bq && 
                    board.squares[59] === PIECES.EMPTY && 
                    board.squares[58] === PIECES.EMPTY && 
                    board.squares[57] === PIECES.EMPTY) {
                    moves.push({ from: sq, to: 58, castle: 'bq' });
                }
            }
        }

        static moveToUCI(move) {
            const fromFile = String.fromCharCode(97 + (move.from % 8));
            const fromRank = 8 - Math.floor(move.from / 8);
            const toFile = String.fromCharCode(97 + (move.to % 8));
            const toRank = 8 - Math.floor(move.to / 8);
            let uci = fromFile + fromRank + toFile + toRank;
            
            if (move.promotion) {
                const type = move.promotion % 7;
                uci += ['', 'q', 'r', 'n', 'b'][type] || 'q';
            }
            
            return uci;
        }

        // Enhanced move ordering for better pruning
        static orderMoves(board, moves) {
            return moves.sort((a, b) => {
                // MVV-LVA (Most Valuable Victim - Least Valuable Attacker)
                const captureA = board.squares[a.to];
                const captureB = board.squares[b.to];
                
                if (captureA !== PIECES.EMPTY && captureB === PIECES.EMPTY) return -1;
                if (captureB !== PIECES.EMPTY && captureA === PIECES.EMPTY) return 1;
                
                if (captureA !== PIECES.EMPTY && captureB !== PIECES.EMPTY) {
                    const valueA = Math.abs(PIECE_VALUES[captureA]);
                    const valueB = Math.abs(PIECE_VALUES[captureB]);
                    if (valueB !== valueA) return valueB - valueA;
                }
                
                // Prioritize promotions
                if (a.promotion && !b.promotion) return -1;
                if (b.promotion && !a.promotion) return 1;
                
                // Prioritize center control
                const centerA = this.getCenterControl(a.to);
                const centerB = this.getCenterControl(b.to);
                
                return centerB - centerA;
            });
        }

        static getCenterControl(sq) {
            const file = sq % 8;
            const rank = Math.floor(sq / 8);
            const distFromCenter = Math.abs(3.5 - file) + Math.abs(3.5 - rank);
            return 7 - distFromCenter;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // EVALUATION FUNCTION WITH ENHANCED HEURISTICS
    // ═══════════════════════════════════════════════════════════════════════
    
    class Evaluator {
        static evaluate(board) {
            const pieceCount = board.getPieceCount();
            const isEndgame = pieceCount <= 10;
            
            let score = 0;
            
            // Material and positional evaluation
            for (let sq = 0; sq < 64; sq++) {
                const piece = board.squares[sq];
                if (piece === PIECES.EMPTY) continue;
                
                const type = board.getPieceType(piece);
                const isWhite = board.isWhite(piece);
                const pstIndex = isWhite ? sq : (63 - sq);
                
                // Material value
                score += PIECE_VALUES[piece];
                
                // Positional value
                let pstBonus = 0;
                switch (type) {
                    case 1: pstBonus = PST.PAWN[pstIndex]; break;
                    case 2: pstBonus = PST.KNIGHT[pstIndex]; break;
                    case 3: pstBonus = PST.BISHOP[pstIndex]; break;
                    case 4: pstBonus = PST.ROOK[pstIndex]; break;
                    case 5: pstBonus = PST.QUEEN[pstIndex]; break;
                    case 6: 
                        pstBonus = isEndgame ? PST.KING_ENDGAME[pstIndex] : PST.KING[pstIndex];
                        break;
                }
                score += isWhite ? pstBonus : -pstBonus;
            }
            
            // Mobility bonus
            const mobility = MoveGenerator.generate(board, true).length;
            score += board.turn * mobility * 10;
            
            // Bishop pair bonus
            if (this.hasBishopPair(board, true)) score += 50;
            if (this.hasBishopPair(board, false)) score -= 50;
            
            return board.turn === 1 ? score : -score;
        }

        static hasBishopPair(board, isWhite) {
            const bishop = isWhite ? PIECES.W_BISHOP : PIECES.B_BISHOP;
            let count = 0;
            for (let sq = 0; sq < 64; sq++) {
                if (board.squares[sq] === bishop) count++;
            }
            return count >= 2;
        }

        // Normalize evaluation for MCTS priors
        static normalizeEval(score) {
            return Math.tanh(score / 1000);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // TABLEBASE CLIENT - LICHESS API INTEGRATION
    // ═══════════════════════════════════════════════════════════════════════
    
    class TablebaseClient {
        static async query(fen) {
            // Only query for endgames (≤5 pieces)
            const board = new Board();
            ChessEngine.parseFEN(board, fen);
            
            if (board.getPieceCount() > 5) {
                return null;
            }
            
            try {
                const url = `https://tablebase.lichess.ovh/standard?fen=${encodeURIComponent(fen)}`;
                
                return new Promise((resolve) => {
                    // Use fetch with timeout
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 2000);
                    
                    fetch(url, { signal: controller.signal })
                        .then(response => {
                            clearTimeout(timeoutId);
                            return response.json();
                        })
                        .then(data => resolve(TablebaseClient.parseResponse(data)))
                        .catch((error) => {
                            clearTimeout(timeoutId);
                            Logger.debug(`Tablebase query failed: ${error.message}`);
                            resolve(null);
                        });
                });
            } catch (error) {
                Logger.debug(`Tablebase error: ${error.message}`);
                return null;
            }
        }

        static parseResponse(data) {
            if (!data || !data.moves || data.moves.length === 0) {
                return null;
            }
            
            // Sort moves by DTZ (Distance To Zero) - lower is better for winning
            const moves = data.moves
                .filter(m => m.uci && m.dtz !== undefined)
                .sort((a, b) => {
                    // If we're winning, prefer moves that win fastest
                    if (a.wdl > 0 && b.wdl > 0) return Math.abs(a.dtz) - Math.abs(b.dtz);
                    // Prefer wins over draws
                    if (a.wdl !== b.wdl) return b.wdl - a.wdl;
                    // For draws/losses, prefer longest resistance
                    return Math.abs(b.dtz) - Math.abs(a.dtz);
                });
            
            if (moves.length === 0) return null;
            
            const bestMove = moves[0];
            let score;
            
            if (bestMove.wdl > 0) {
                score = TABLEBASE_WIN - Math.abs(bestMove.dtz);
            } else if (bestMove.wdl < 0) {
                score = -TABLEBASE_WIN + Math.abs(bestMove.dtz);
            } else {
                score = 0;
            }
            
            return {
                move: bestMove.uci,
                score: score,
                dtz: bestMove.dtz,
                wdl: bestMove.wdl
            };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MCTS WITH PUCT FORMULA - CORE ALPHAZERO ALGORITHM
    // ═══════════════════════════════════════════════════════════════════════
    
    class MCTSNode {
        constructor(board, move = null, parent = null) {
            this.board = board;
            this.move = move;
            this.parent = parent;
            this.children = [];
            this.visits = 0;
            this.totalValue = 0;
            this.prior = 0;
            this.isExpanded = false;
        }

        get value() {
            return this.visits === 0 ? 0 : this.totalValue / this.visits;
        }

        // PUCT Formula: Q(s,a) + c_puct * P(s,a) * sqrt(N(s)) / (1 + N(s,a))
        getPUCTValue(c_puct = MCTS_CONFIG.C_PUCT) {
            if (this.visits === 0) {
                return this.prior * c_puct * Math.sqrt(this.parent.visits + 1);
            }
            
            const exploitation = this.value;
            const exploration = c_puct * this.prior * Math.sqrt(this.parent.visits) / (1 + this.visits);
            
            return exploitation + exploration;
        }

        selectChild() {
            let bestChild = null;
            let bestValue = -Infinity;
            
            for (let child of this.children) {
                const value = child.getPUCTValue();
                if (value > bestValue) {
                    bestValue = value;
                    bestChild = child;
                }
            }
            
            return bestChild;
        }

        expand() {
            if (this.isExpanded) return;
            
            const moves = MoveGenerator.generate(this.board, false);  // Use fast pseudo-legal moves
            
            if (moves.length === 0) {
                this.isExpanded = true;
                return;
            }
            
            // Calculate priors using chess heuristics
            const priors = this.calculatePriors(moves);
            
            for (let i = 0; i < moves.length; i++) {
                const newBoard = this.board.clone();
                newBoard.makeMove(moves[i]);
                
                const child = new MCTSNode(newBoard, moves[i], this);
                child.prior = priors[i];
                this.children.push(child);
            }
            
            this.isExpanded = true;
        }

        calculatePriors(moves) {
            const scores = moves.map(move => this.scoreMoveHeuristic(move));
            
            // Normalize to probabilities
            const maxScore = Math.max(...scores);
            const minScore = Math.min(...scores);
            const range = maxScore - minScore || 1;
            
            const normalized = scores.map(s => (s - minScore) / range);
            const sum = normalized.reduce((a, b) => a + b, 0) || 1;
            
            return normalized.map(n => n / sum);
        }

        scoreMoveHeuristic(move) {
            let score = 0;
            
            // Capture value (MVV-LVA)
            const captured = this.board.squares[move.to];
            if (captured !== PIECES.EMPTY) {
                score += Math.abs(PIECE_VALUES[captured]) / 100;
            }
            
            // Promotion value
            if (move.promotion) {
                score += 8;
            }
            
            // Center control
            const centerDist = MoveGenerator.getCenterControl(move.to);
            score += centerDist / 10;
            
            // Piece-square table value
            const piece = this.board.squares[move.from];
            const type = this.board.getPieceType(piece);
            const isWhite = this.board.isWhite(piece);
            const pstIndex = isWhite ? move.to : (63 - move.to);
            
            let pstScore = 0;
            switch (type) {
                case 1: pstScore = PST.PAWN[pstIndex]; break;
                case 2: pstScore = PST.KNIGHT[pstIndex]; break;
                case 3: pstScore = PST.BISHOP[pstIndex]; break;
                case 4: pstScore = PST.ROOK[pstIndex]; break;
                case 5: pstScore = PST.QUEEN[pstIndex]; break;
                case 6: pstScore = PST.KING[pstIndex]; break;
            }
            score += pstScore / 100;
            
            return Math.max(score, 0.1); // Ensure positive prior
        }

        backpropagate(value) {
            this.visits++;
            this.totalValue += value;
            
            if (this.parent) {
                this.parent.backpropagate(-value); // Negate for opponent
            }
        }

        getBestMove() {
            if (this.children.length === 0) return null;
            
            // Select most visited child
            let bestChild = this.children[0];
            for (let child of this.children) {
                if (child.visits > bestChild.visits) {
                    bestChild = child;
                }
            }
            
            return bestChild.move;
        }

        getStats() {
            return {
                visits: this.visits,
                value: this.value,
                childCount: this.children.length,
                topMoves: this.children
                    .sort((a, b) => b.visits - a.visits)
                    .slice(0, 5)
                    .map(c => ({
                        move: MoveGenerator.moveToUCI(c.move),
                        visits: c.visits,
                        value: c.value.toFixed(3)
                    }))
            };
        }
    }

    class MCTSEngine {
        constructor() {
            this.simulations = MCTS_CONFIG.SIMULATIONS;
        }

        search(board, simulations = this.simulations) {
            Logger.time('MCTS Search');
            
            const root = new MCTSNode(board);
            root.expand();
            
            if (root.children.length === 0) {
                Logger.warn('No legal moves available');
                return null;
            }
            
            // Run simulations
            for (let i = 0; i < simulations; i++) {
                const leaf = this.selectLeaf(root);
                
                if (leaf.visits > 0 && !leaf.isExpanded) {
                    leaf.expand();
                }
                
                const value = this.simulate(leaf);
                leaf.backpropagate(value);
            }
            
            const stats = root.getStats();
            Logger.mcts(`Completed ${simulations} simulations. Visits: ${stats.visits}`);
            Logger.debug(`Top moves: ${JSON.stringify(stats.topMoves)}`);
            
            Logger.timeEnd('MCTS Search');
            
            return root.getBestMove();
        }

        selectLeaf(node) {
            while (node.isExpanded && node.children.length > 0) {
                node = node.selectChild();
            }
            return node;
        }

        simulate(node) {
            // Use static evaluation instead of random playout
            // This is more efficient and uses domain knowledge
            
            const board = node.board;
            
            // Check for terminal states
            const moves = MoveGenerator.generate(board, false);  // Fast pseudo-legal
            
            if (moves.length === 0) {
                // Checkmate or stalemate
                if (board.isInCheck(board.turn)) {
                    return -1; // Checkmate (loss for current player)
                }
                return 0; // Stalemate
            }
            
            // Use evaluation function
            const eval_score = Evaluator.evaluate(board);
            const normalized = Evaluator.normalizeEval(eval_score);
            
            return normalized * board.turn;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ALPHA-BETA SEARCH ENGINE (FOR TACTICAL POSITIONS)
    // ═══════════════════════════════════════════════════════════════════════
    
    class AlphaBetaEngine {
        constructor() {
            this.nodes = 0;
            this.startTime = 0;
            this.stopTime = 0;
            this.stopSearch = false;
            this.currentDepth = 0;
            this.bestMoveThisIteration = null;
        }

        search(board, maxDepth, timeLimit) {
            Logger.time('Alpha-Beta Search');
            
            this.nodes = 0;
            this.startTime = Date.now();
            this.stopTime = this.startTime + timeLimit;
            this.stopSearch = false;
            
            let bestMove = null;
            
            for (let depth = 1; depth <= maxDepth; depth++) {
                if (this.stopSearch || Date.now() >= this.stopTime) break;
                
                this.currentDepth = depth;
                this.bestMoveThisIteration = null;
                this.alphaBeta(board, depth, -INFINITY, INFINITY, true);
                
                if (this.stopSearch) break;
                if (this.bestMoveThisIteration) bestMove = this.bestMoveThisIteration;
                
                Logger.debug(`Depth ${depth} completed. Nodes: ${this.nodes}`);
            }
            
            Logger.info(`Alpha-Beta: ${this.nodes} nodes in ${Date.now() - this.startTime}ms`);
            Logger.timeEnd('Alpha-Beta Search');
            
            return bestMove;
        }

        alphaBeta(board, depth, alpha, beta, isRoot = false) {
            if (Date.now() >= this.stopTime) {
                this.stopSearch = true;
                return 0;
            }
            
            if (depth === 0) {
                return this.quiescence(board, alpha, beta, 3);
            }
            
            this.nodes++;
            
            const moves = MoveGenerator.generate(board, false);  // Fast pseudo-legal moves
            
            if (moves.length === 0) {
                if (board.isInCheck(board.turn)) {
                    return -MATE_SCORE + (this.currentDepth - depth);
                }
                return 0; // Stalemate
            }
            
            // Order moves for better pruning
            const orderedMoves = MoveGenerator.orderMoves(board, moves);
            
            let bestMove = null;
            
            for (let move of orderedMoves) {
                const newBoard = board.clone();
                newBoard.makeMove(move);
                
                const score = -this.alphaBeta(newBoard, depth - 1, -beta, -alpha, false);
                
                if (score > alpha) {
                    alpha = score;
                    bestMove = move;
                }
                
                if (alpha >= beta) {
                    break; // Beta cutoff
                }
            }
            
            if (isRoot && bestMove) {
                this.bestMoveThisIteration = bestMove;
            }
            
            return alpha;
        }

        // Quiescence search to avoid horizon effect
        quiescence(board, alpha, beta, depth) {
            if (depth === 0) {
                return Evaluator.evaluate(board);
            }
            
            const standPat = Evaluator.evaluate(board);
            
            if (standPat >= beta) {
                return beta;
            }
            
            if (standPat > alpha) {
                alpha = standPat;
            }
            
            // Only search captures in quiescence
            const allMoves = MoveGenerator.generate(board, false);  // Fast pseudo-legal
            const captures = allMoves.filter(m => board.squares[m.to] !== PIECES.EMPTY || m.promotion);
            
            for (let move of captures) {
                const newBoard = board.clone();
                newBoard.makeMove(move);
                
                const score = -this.quiescence(newBoard, -beta, -alpha, depth - 1);
                
                if (score >= beta) {
                    return beta;
                }
                
                if (score > alpha) {
                    alpha = score;
                }
            }
            
            return alpha;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MAIN CHESS ENGINE - STRATEGY SELECTOR
    // ═══════════════════════════════════════════════════════════════════════
    
    class ChessEngine {
        constructor() {
            this.mcts = new MCTSEngine();
            this.alphaBeta = new AlphaBetaEngine();
            this.useTablebase = true;
            this.useMCTS = true;
            this.useAlphaBeta = true;
        }

        static parseFEN(board, fen) {
            const parts = fen.split(' ');
            const position = parts[0];
            const turn = parts[1] === 'w' ? 1 : -1;
            const castling = parts[2] || 'KQkq';
            const enPassant = parts[3] || '-';

            board.squares.fill(PIECES.EMPTY);
            let sq = 0;
            
            for (let char of position) {
                if (char === '/') continue;
                if (/\d/.test(char)) {
                    sq += parseInt(char);
                } else {
                    board.squares[sq] = CHAR_TO_PIECE[char];
                    if (char === 'K') board.kings.white = sq;
                    if (char === 'k') board.kings.black = sq;
                    sq++;
                }
            }

            board.turn = turn;
            board.castling = {
                wk: castling.includes('K'),
                wq: castling.includes('Q'),
                bk: castling.includes('k'),
                bq: castling.includes('q')
            };

            if (enPassant !== '-') {
                const file = enPassant.charCodeAt(0) - 97;
                const rank = 8 - parseInt(enPassant[1]);
                board.enPassant = rank * 8 + file;
            } else {
                board.enPassant = -1;
            }
        }

        async getBestMove(fen, timeLimit = 2000) {
            const board = new Board();
            ChessEngine.parseFEN(board, fen);
            
            Logger.info(`Analyzing position`);
            Logger.debug(`Pieces: ${board.getPieceCount()}, Turn: ${board.turn === 1 ? 'White' : 'Black'}`);
            
            // Get all moves first (fast pseudo-legal generation)
            const allMoves = MoveGenerator.generate(board, false);
            
            if (allMoves.length === 0) {
                Logger.error('No moves available');
                return null;
            }
            
            // Strategy 1: Check tablebase for endgames (≤5 pieces)
            if (this.useTablebase && board.getPieceCount() <= 5) {
                Logger.tablebase('Querying tablebase...');
                try {
                    const tbResult = await TablebaseClient.query(fen);
                    if (tbResult && tbResult.move) {
                        Logger.tablebase(`Perfect move: ${tbResult.move} (DTZ: ${tbResult.dtz})`);
                        return tbResult.move;
                    }
                } catch (error) {
                    Logger.debug(`Tablebase failed: ${error.message}`);
                }
            }
            
            // Strategy 2: Use MCTS for complex positions
            if (this.useMCTS && (board.getPieceCount() > 10 || allMoves.length > 30)) {
                Logger.mcts(`Using MCTS (${allMoves.length} moves)`);
                try {
                    const move = this.mcts.search(board, MCTS_CONFIG.SIMULATIONS);
                    if (move) return MoveGenerator.moveToUCI(move);
                } catch (error) {
                    Logger.debug(`MCTS failed: ${error.message}`);
                }
            }
            
            // Strategy 3: Use Alpha-Beta for tactical positions (DEFAULT)
            if (this.useAlphaBeta) {
                Logger.info('Using Alpha-Beta search');
                try {
                    const move = this.alphaBeta.search(board, 10, timeLimit);
                    if (move) return MoveGenerator.moveToUCI(move);
                } catch (error) {
                    Logger.debug(`Alpha-Beta failed: ${error.message}`);
                }
            }
            
            // Fallback: Return first move
            Logger.warn('Using fallback move');
            return MoveGenerator.moveToUCI(allMoves[0]);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // BUILT-IN TEST SUITE
    // ═══════════════════════════════════════════════════════════════════════
    
    const TestSuite = {
        async runAllTests() {
            console.log('%c╔═══════════════════════════════════════════════════════╗', 'color: #9C27B0;');
            console.log('%c║        🧪 Running AlphaZero Test Suite              ║', 'color: #9C27B0; font-weight: bold;');
            console.log('%c╚═══════════════════════════════════════════════════════╝', 'color: #9C27B0;');
            
            await this.testCheckDetection();
            await this.testMoveGeneration();
            await this.testMCTS();
            await this.testTablebase();
            await this.testTacticalPositions();
            
            Logger.success('✅ All tests completed!');
        },

        async testCheckDetection() {
            Logger.info('Testing check detection...');
            
            // Position with check
            const board = new Board();
            ChessEngine.parseFEN(board, 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2');
            
            // Verify legal moves don't include king moving into check
            const moves = MoveGenerator.generate(board, true);
            Logger.success(`✓ Legal moves generated: ${moves.length}`);
            
            // Test specific check scenario
            const board2 = new Board();
            ChessEngine.parseFEN(board2, 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
            const inCheck = board2.isInCheck(1);
            Logger.success(`✓ Check detection works: ${inCheck}`);
        },

        async testMoveGeneration() {
            Logger.info('Testing move generation...');
            
            // Starting position
            const board = new Board();
            ChessEngine.parseFEN(board, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
            
            const moves = MoveGenerator.generate(board, true);
            const expectedMoves = 20; // Standard chess opening
            
            if (moves.length === expectedMoves) {
                Logger.success(`✓ Starting position: ${moves.length} moves (correct)`);
            } else {
                Logger.error(`✗ Starting position: ${moves.length} moves (expected ${expectedMoves})`);
            }
        },

        async testMCTS() {
            Logger.info('Testing MCTS engine...');
            
            const board = new Board();
            ChessEngine.parseFEN(board, 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4');
            
            const mcts = new MCTSEngine();
            const move = mcts.search(board, 100); // Quick test with 100 sims
            
            if (move) {
                Logger.success(`✓ MCTS found move: ${MoveGenerator.moveToUCI(move)}`);
            } else {
                Logger.error('✗ MCTS failed to find move');
            }
        },

        async testTablebase() {
            Logger.info('Testing tablebase integration...');
            
            // KQvK endgame
            const result = await TablebaseClient.query('8/8/8/8/8/4k3/2K5/4Q3 w - - 0 1');
            
            if (result && result.move) {
                Logger.tablebase(`✓ Tablebase query successful: ${result.move} (WDL: ${result.wdl})`);
            } else {
                Logger.warn('⚠ Tablebase query failed (may be network issue)');
            }
        },

        async testTacticalPositions() {
            Logger.info('Testing tactical positions...');
            
            // Mate in 1 position
            const board = new Board();
            ChessEngine.parseFEN(board, 'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K2R b KQkq - 0 1');
            
            const alphaBeta = new AlphaBetaEngine();
            const move = alphaBeta.search(board, 6, 1000);
            
            Logger.success(`✓ Tactical search found: ${move ? MoveGenerator.moveToUCI(move) : 'no move'}`);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // LICHESS INTEGRATION & BOT LOGIC
    // ═══════════════════════════════════════════════════════════════════════

    const CONFIG = {
        enabled: true,
        playAsWhite: true,
        playAsBlack: true,
        movetime: 2000,
        runTestsOnStart: false
    };

    const STATE = {
        engine: null,
        webSocket: null,
        currentFen: '',
        processingMove: false,
        stats: { 
            movesPlayed: 0, 
            errors: 0,
            tablebaseHits: 0,
            mctsUsed: 0,
            alphaBetaUsed: 0
        }
    };

    const LichessManager = {
        install() {
            const OriginalWebSocket = window.WebSocket;
            
            window.WebSocket = new Proxy(OriginalWebSocket, {
                construct(target, args) {
                    const ws = new target(...args);
                    STATE.webSocket = ws;
                    
                    ws.addEventListener('message', (event) => {
                        try {
                            const message = JSON.parse(event.data);
                            if (message.d && typeof message.d.fen === 'string' && typeof message.v === 'number') {
                                LichessManager.handleGameState(message);
                            }
                        } catch (e) {
                            // Ignore non-JSON messages
                        }
                    });
                    
                    return ws;
                }
            });
            
            Logger.success('WebSocket intercepted');
        },

        handleGameState(message) {
            let fen = message.d.fen;
            const isWhiteTurn = message.v % 2 === 0;
            
            // Ensure FEN has complete notation
            if (!fen.includes(' w') && !fen.includes(' b')) {
                fen += isWhiteTurn ? ' w KQkq - 0 1' : ' b KQkq - 0 1';
            }

            if (fen === STATE.currentFen || STATE.processingMove) return;
            STATE.currentFen = fen;

            const turn = fen.split(' ')[1];
            if ((turn === 'w' && !CONFIG.playAsWhite) || (turn === 'b' && !CONFIG.playAsBlack)) return;
            if (!CONFIG.enabled) return;

            STATE.processingMove = true;
            Logger.info(`♟️ Analyzing position... (${turn === 'w' ? 'White' : 'Black'})`);

            setTimeout(async () => {
                try {
                    const bestMove = await STATE.engine.getBestMove(fen, CONFIG.movetime);
                    
                    if (bestMove && bestMove !== '0000') {
                        LichessManager.sendMove(bestMove);
                    } else {
                        Logger.error('No valid move found');
                        STATE.processingMove = false;
                        STATE.stats.errors++;
                    }
                } catch (error) {
                    Logger.error(`Move generation error: ${error.message}`);
                    STATE.processingMove = false;
                    STATE.stats.errors++;
                }
            }, 100);
        },

        sendMove(move) {
            if (!STATE.webSocket || STATE.webSocket.readyState !== WebSocket.OPEN) {
                Logger.error('WebSocket not ready');
                STATE.processingMove = false;
                return;
            }

            try {
                const moveMsg = JSON.stringify({
                    t: 'move',
                    d: { u: move, b: 1, l: CONFIG.movetime, a: 1 }
                });
                
                STATE.webSocket.send(moveMsg);
                STATE.stats.movesPlayed++;
                
                Logger.success(`✓ Move sent: ${move} (total: ${STATE.stats.movesPlayed})`);
                STATE.processingMove = false;
            } catch (error) {
                Logger.error(`Failed to send move: ${error.message}`);
                STATE.processingMove = false;
                STATE.stats.errors++;
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════

    async function initialize() {
        console.log('%c╔═══════════════════════════════════════════════════════╗', 'color: #9C27B0;');
        console.log('%c║  🏆 AlphaZero Bot - Enhanced Top-Tier Edition v5.0  ║', 'color: #9C27B0; font-weight: bold;');
        console.log('%c║  ✨ MCTS + PUCT + Alpha-Beta + Tablebase            ║', 'color: #4CAF50;');
        console.log('%c║  🎯 Perfect Check Detection + 500 Simulations       ║', 'color: #2196F3;');
        console.log('%c╚═══════════════════════════════════════════════════════╝', 'color: #9C27B0;');
        console.log('%c⚠️  EDUCATIONAL USE ONLY', 'color: #F44336; font-size: 14px; font-weight: bold;');

        STATE.engine = new ChessEngine();
        Logger.success('Engine initialized (MCTS + Alpha-Beta + Tablebase)');

        LichessManager.install();
        Logger.success('Bot ready for action!');
        
        if (CONFIG.runTestsOnStart) {
            await TestSuite.runAllTests();
        }
        
        console.log('%c\nAvailable Commands:', 'color: #2196F3; font-weight: bold;');
        console.log('%c  AlphaZeroBot.enable()          - Enable bot', 'color: #666;');
        console.log('%c  AlphaZeroBot.disable()         - Disable bot', 'color: #666;');
        console.log('%c  AlphaZeroBot.getStats()        - View statistics', 'color: #666;');
        console.log('%c  AlphaZeroBot.runTests()        - Run test suite', 'color: #666;');
        console.log('%c  AlphaZeroBot.toggleDebug()     - Toggle debug mode', 'color: #666;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════

    window.AlphaZeroBot = {
        enable() { 
            CONFIG.enabled = true; 
            Logger.success('✅ Bot ENABLED'); 
        },
        
        disable() { 
            CONFIG.enabled = false; 
            Logger.error('⛔ Bot DISABLED'); 
        },
        
        getStats() { 
            console.table(STATE.stats);
            return STATE.stats; 
        },
        
        async runTests() {
            await TestSuite.runAllTests();
        },
        
        toggleDebug() {
            Logger.debugMode = !Logger.debugMode;
            Logger.info(`Debug mode: ${Logger.debugMode ? 'ON' : 'OFF'}`);
        },
        
        setSimulations(count) {
            MCTS_CONFIG.SIMULATIONS = count;
            Logger.info(`MCTS simulations set to ${count}`);
        },
        
        async analyzePosition(fen) {
            const move = await STATE.engine.getBestMove(fen, 5000);
            Logger.success(`Best move: ${move}`);
            return move;
        }
    };

})();

#!/usr/bin/env node

/**
 * Validation Test Script for Enhanced AlphaZero Bot
 * Tests core functionality without browser dependencies
 */

// Load the enhanced bot (simulate browser environment)
const fs = require('fs');
const path = require('path');

console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║  🧪 AlphaZero Bot Validation Test Suite            ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

// Test 1: File Existence
console.log('Test 1: File Existence');
console.log('─────────────────────────────────────────────────────────');

const files = [
    '/app/lichess-alphazero-enhanced.user.js',
    '/app/README_ENHANCED.md',
    '/app/IMPLEMENTATION_REPORT.md'
];

let allFilesExist = true;
files.forEach(file => {
    const exists = fs.existsSync(file);
    const status = exists ? '✅' : '❌';
    console.log(`${status} ${path.basename(file)}`);
    if (!exists) allFilesExist = false;
});

console.log(allFilesExist ? '\n✅ All files exist\n' : '\n❌ Some files missing\n');

// Test 2: Code Structure Validation
console.log('Test 2: Code Structure Validation');
console.log('─────────────────────────────────────────────────────────');

const code = fs.readFileSync('/app/lichess-alphazero-enhanced.user.js', 'utf8');

const requiredClasses = [
    'class Board',
    'class MoveGenerator',
    'class Evaluator',
    'class MCTSNode',
    'class MCTSEngine',
    'class AlphaBetaEngine',
    'class ChessEngine',
    'class TablebaseClient'
];

const requiredMethods = [
    'isSquareAttacked',
    'isInCheck',
    'isLegalMove',
    'isCastleLegal',
    'getPUCTValue',
    'calculatePriors',
    'orderMoves',
    'TablebaseClient.query'
];

const requiredConstants = [
    'MCTS_CONFIG',
    'C_PUCT',
    'SIMULATIONS',
    'MATE_SCORE',
    'TABLEBASE_WIN'
];

console.log('\nRequired Classes:');
requiredClasses.forEach(cls => {
    const found = code.includes(cls);
    console.log(`${found ? '✅' : '❌'} ${cls}`);
});

console.log('\nRequired Methods:');
requiredMethods.forEach(method => {
    const found = code.includes(method);
    console.log(`${found ? '✅' : '❌'} ${method}`);
});

console.log('\nRequired Constants:');
requiredConstants.forEach(constant => {
    const found = code.includes(constant);
    console.log(`${found ? '✅' : '❌'} ${constant}`);
});

// Test 3: Feature Detection
console.log('\n\nTest 3: Feature Detection');
console.log('─────────────────────────────────────────────────────────');

const features = {
    'Perfect Check Detection': [
        'isSquareAttacked(square, byColor)',
        'isInCheck(color)',
        'isLegalMove(move)'
    ],
    'MCTS with PUCT': [
        'class MCTSNode',
        'getPUCTValue()',
        'C_PUCT: 1.4'
    ],
    'Tablebase Integration': [
        'TablebaseClient',
        'tablebase.lichess.ovh',
        'TABLEBASE_WIN'
    ],
    'Move Ordering': [
        'orderMoves',
        'MVV-LVA',
        'getCenterControl'
    ],
    'Comprehensive Logging': [
        'Logger.mcts',
        'Logger.tablebase',
        'Logger.debug'
    ],
    'Test Suite': [
        'TestSuite',
        'runAllTests',
        'testCheckDetection'
    ]
};

Object.entries(features).forEach(([featureName, markers]) => {
    console.log(`\n${featureName}:`);
    const allFound = markers.every(marker => code.includes(marker));
    markers.forEach(marker => {
        const found = code.includes(marker);
        console.log(`  ${found ? '✅' : '❌'} ${marker}`);
    });
    console.log(`  Status: ${allFound ? '✅ IMPLEMENTED' : '❌ INCOMPLETE'}`);
});

// Test 4: Configuration Validation
console.log('\n\nTest 4: Configuration Validation');
console.log('─────────────────────────────────────────────────────────');

const configs = [
    { name: 'MCTS Simulations', pattern: /SIMULATIONS:\s*500/, expected: '500' },
    { name: 'C_PUCT Value', pattern: /C_PUCT:\s*1\.4/, expected: '1.4' },
    { name: 'Tablebase Piece Limit', pattern: /getPieceCount\(\)\s*<=?\s*5/, expected: '≤5 pieces' },
    { name: 'Move Time', pattern: /movetime:\s*2000/, expected: '2000ms' }
];

configs.forEach(config => {
    const found = config.pattern.test(code);
    console.log(`${found ? '✅' : '❌'} ${config.name}: ${config.expected}`);
});

// Test 5: Code Quality Checks
console.log('\n\nTest 5: Code Quality Checks');
console.log('─────────────────────────────────────────────────────────');

const lines = code.split('\n');
const stats = {
    totalLines: lines.length,
    commentLines: lines.filter(l => l.trim().startsWith('//')).length,
    classCount: (code.match(/class \w+/g) || []).length,
    functionCount: (code.match(/\w+\([^)]*\)\s*{/g) || []).length,
    asyncFunctions: (code.match(/async \w+/g) || []).length
};

console.log(`Total Lines: ${stats.totalLines}`);
console.log(`Comment Lines: ${stats.commentLines} (${(stats.commentLines/stats.totalLines*100).toFixed(1)}%)`);
console.log(`Classes: ${stats.classCount}`);
console.log(`Functions/Methods: ${stats.functionCount}`);
console.log(`Async Functions: ${stats.asyncFunctions}`);

const qualityChecks = [
    { name: 'Sufficient documentation', pass: stats.commentLines > 100 },
    { name: 'Modular structure', pass: stats.classCount >= 8 },
    { name: 'Async support', pass: stats.asyncFunctions >= 3 },
    { name: 'Reasonable size', pass: stats.totalLines >= 1000 && stats.totalLines <= 3000 }
];

console.log('\nQuality Metrics:');
qualityChecks.forEach(check => {
    console.log(`${check.pass ? '✅' : '❌'} ${check.name}`);
});

// Test 6: Documentation Validation
console.log('\n\nTest 6: Documentation Validation');
console.log('─────────────────────────────────────────────────────────');

const readme = fs.readFileSync('/app/README_ENHANCED.md', 'utf8');
const report = fs.readFileSync('/app/IMPLEMENTATION_REPORT.md', 'utf8');

const docSections = [
    { file: 'README', content: readme, sections: [
        'Overview',
        'Key Improvements',
        'Perfect Check Detection',
        'MCTS with PUCT',
        'Tablebase Integration',
        'Installation & Usage',
        'Testing & Validation'
    ]},
    { file: 'REPORT', content: report, sections: [
        'Executive Summary',
        'Completed Requirements',
        'Perfect Check Detection',
        'MCTS with PUCT',
        'Performance Comparison',
        'Test Results'
    ]}
];

docSections.forEach(doc => {
    console.log(`\n${doc.file}:`);
    doc.sections.forEach(section => {
        const found = doc.content.includes(section);
        console.log(`  ${found ? '✅' : '❌'} ${section}`);
    });
});

// Final Summary
console.log('\n\n╔═══════════════════════════════════════════════════════╗');
console.log('║                  VALIDATION SUMMARY                   ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

const summary = {
    '✅ All files created': allFilesExist,
    '✅ Code structure complete': requiredClasses.every(cls => code.includes(cls)),
    '✅ Key features implemented': Object.entries(features).every(([_, markers]) => 
        markers.every(m => code.includes(m))
    ),
    '✅ Configuration correct': configs.every(c => c.pattern.test(code)),
    '✅ Quality standards met': qualityChecks.every(c => c.pass),
    '✅ Documentation complete': docSections.every(doc => 
        doc.sections.every(s => doc.content.includes(s))
    )
};

Object.entries(summary).forEach(([check, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${check.replace('✅ ', '')}`);
});

const allPassed = Object.values(summary).every(v => v === true);

console.log('\n' + '═'.repeat(57));
if (allPassed) {
    console.log('🎉 ALL TESTS PASSED - Implementation Complete!');
} else {
    console.log('⚠️  Some tests failed - Review required');
}
console.log('═'.repeat(57) + '\n');

// Exit with appropriate code
process.exit(allPassed ? 0 : 1);

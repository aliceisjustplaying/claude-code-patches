#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isRestore = args.includes('--restore');
const showHelp = args.includes('--help') || args.includes('-h');

// Display help
if (showHelp) {
  console.log('Claude Code Thinking Visibility Patcher v2.1.74');
  console.log('==============================================\n');
  console.log('Usage: node patch-thinking.js [options]\n');
  console.log('Options:');
  console.log('  --dry-run    Preview changes without applying them');
  console.log('  --restore    Restore from backup file');
  console.log('  --help, -h   Show this help message\n');
  console.log('Examples:');
  console.log('  node patch-thinking.js              # Apply patches');
  console.log('  node patch-thinking.js --dry-run    # Preview changes');
  console.log('  node patch-thinking.js --restore    # Restore original');
  process.exit(0);
}

console.log('Claude Code Thinking Visibility Patcher v2.1.74');
console.log('==============================================\n');

// Helper function to safely execute shell commands
function safeExec(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch (error) {
    return null;
  }
}

// Auto-detect Claude Code installation path
function getClaudeCodePath() {
  const homeDir = os.homedir();
  const attemptedPaths = [];

  // Helper to check and return path if it exists
  function checkPath(testPath, method) {
    if (!testPath) return null;

    attemptedPaths.push({ path: testPath, method });

    try {
      if (fs.existsSync(testPath)) {
        // Resolve symlinks for global npm installs
        try {
          const realPath = fs.realpathSync(testPath);
          return realPath;
        } catch (e) {
          return testPath;
        }
      }
    } catch (error) {
      // Path check failed, continue
    }
    return null;
  }

  // PRIORITY 1: Local installations (existing behavior - user overrides)
  const localPaths = [
    path.join(homeDir, '.claude', 'local', 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js'),
    path.join(homeDir, '.config', 'claude', 'local', 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js'),
  ];

  for (const localPath of localPaths) {
    const found = checkPath(localPath, 'local installation');
    if (found) return found;
  }

  // PRIORITY 2: Global npm installation via 'npm root -g'
  const npmGlobalRoot = safeExec('npm root -g');
  if (npmGlobalRoot) {
    const npmGlobalPath = path.join(npmGlobalRoot, '@anthropic-ai', 'claude-code', 'cli.js');
    const found = checkPath(npmGlobalPath, 'npm root -g');
    if (found) return found;
  }

  // PRIORITY 3: Derive from process.execPath
  // Global modules are typically in ../lib/node_modules relative to node binary
  const nodeDir = path.dirname(process.execPath);
  const derivedGlobalPath = path.join(nodeDir, '..', 'lib', 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js');
  const found = checkPath(derivedGlobalPath, 'derived from process.execPath');
  if (found) return found;

  // PRIORITY 4: Unix systems - try 'which claude' to find binary
  if (process.platform !== 'win32') {
    const claudeBinary = safeExec('which claude');
    if (claudeBinary) {
      try {
        // Resolve symlinks
        const realBinary = fs.realpathSync(claudeBinary);
        // Navigate from bin/claude to lib/node_modules/@anthropic-ai/claude-code/cli.js
        const binDir = path.dirname(realBinary);
        const nodeModulesPath = path.join(binDir, '..', 'lib', 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js');
        const foundFromBinary = checkPath(nodeModulesPath, 'which claude');
        if (foundFromBinary) return foundFromBinary;
      } catch (e) {
        // Failed to resolve, continue
      }
    }
  }

  // No installation found, return null and include attempted paths for error reporting
  getClaudeCodePath.attemptedPaths = attemptedPaths;
  return null;
}

const targetPath = getClaudeCodePath();

if (!targetPath) {
  console.error('❌ Error: Could not find Claude Code installation\n');
  console.error('Searched using the following methods:\n');

  const attemptedPaths = getClaudeCodePath.attemptedPaths || [];

  if (attemptedPaths.length > 0) {
    // Group by method for cleaner output
    const byMethod = {};
    attemptedPaths.forEach(({ path, method }) => {
      if (!byMethod[method]) byMethod[method] = [];
      byMethod[method].push(path);
    });

    Object.entries(byMethod).forEach(([method, paths]) => {
      console.error(`  [${method}]`);
      paths.forEach(p => console.error(`    - ${p}`));
    });
  } else {
    console.error('  - ~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js');
    console.error('  - ~/.config/claude/local/node_modules/@anthropic-ai/claude-code/cli.js');
    console.error('  - Global npm installation (npm root -g)');
  }

  console.error('\n💡 Troubleshooting:');
  console.error('  1. Verify Claude Code is installed: claude --version');
  console.error('  2. For local install: Check ~/.claude/local or ~/.config/claude/local');
  console.error('  3. For global install: Ensure "npm install -g @anthropic-ai/claude-code" succeeded');
  console.error('  4. Check that npm is in your PATH if using global install');
  process.exit(1);
}

console.log(`Found Claude Code at: ${targetPath}\n`);

const backupPath = targetPath + '.backup';

// Restore from backup
if (isRestore) {
  if (!fs.existsSync(backupPath)) {
    console.error('❌ Error: Backup file not found at:', backupPath);
    process.exit(1);
  }

  console.log('Restoring from backup...');
  fs.copyFileSync(backupPath, targetPath);
  console.log('✅ Restored successfully!');
  console.log('\nPlease restart Claude Code for changes to take effect.');
  process.exit(0);
}

// Read file
console.log('Reading cli.js...');
if (!fs.existsSync(targetPath)) {
  console.error('❌ Error: cli.js not found at:', targetPath);
  process.exit(1);
}

let content = fs.readFileSync(targetPath, 'utf8');

// Thinking Visibility Patch (v2.1.31)
// Forces thinking content to always render by setting isTranscriptMode to true
// Note: In v2.0.71+, the separate banner function was removed - only this patch is needed
// Note: In v2.1.2+, hideInTranscript property was added - we set it to false to always show
// Note: In v2.1.17+, React memo cache is used for memoization
// Note: In v2.1.22, minified variable names changed: H9->Y9, Ej1->iM1
// Note: In v2.1.31, verbose parameter removed, variable names changed: Y9->K9, iM1->_j6, D->j, H removed, T->V (meaning changed), K[23]->q[21], etc.
// Note: In v2.1.34, variable names changed: K9->I5, _j6->sD6, j->M, V->Z, G<->P swapped
// Note: In v2.1.37, variable names changed: I5->b5, sD6->Mj6, M->j
// Note: In v2.1.39, variable names changed: b5->F5, Mj6->pM6, P->G, G->W, memo indices shifted q[21-25]->q[22-26]
// Note: In v2.1.42, variable names changed: pM6->dW6, j->D
// Note: In v2.1.56, guard changed to 3 checks (!X&&!V&&!_), added verbose:_ prop, F5->g5, dW6->Kf1, memo now 6 slots q[22-27]
// Note: In v2.1.59, variable names changed: g5->c5, Kf1->JT1, X->D, V->f, N->V, Z->G
// Note: In v2.1.62, component name changed: JT1->jT1 (case change only)
// Note: In v2.1.63, guard reverted to 2 checks (!X&&!_), c5->U5, jT1->qN1, V->f, v->N, D->X, memo q[22-27]->q[21-26] (5 slots)
// Note: In v2.1.69, X->D, N->v, U5->d5, qN1->LN1, memo q[21-26]->q[22-27] (6 slots again)
// Note: In v2.1.71, d5->o5, LN1->PL1, v->V, G->Z in hideInTranscript check
// Note: In v2.1.72, o5->M5, PL1->gT1, _->w (verbose), V->v (memo temp)
// Note: In v2.1.74, M5->G5, gT1->kv1, f<->G swap (hideInTranscript var), Z->f (hide check var)
//
// IMPORTANT: redact-thinking beta header (v2.1.64+)
// Starting in v2.1.64 (reverted in v2.1.66, re-introduced permanently in v2.1.69),
// Claude Code sends a "redact-thinking-2026-02-12" beta header with API requests.
// This tells the API to return thinking blocks with empty thinking text (signature
// is preserved). The rendering patch works correctly but has nothing to display.
// The header is added when ALL of these are true:
//   1. Thinking is enabled
//   2. Model supports interleaved thinking
//   3. Not in verbose/transcript mode
//   4. settings.showThinkingSummaries !== true (undefined counts as not true)
//   5. Feature flag "tengu_quiet_hollow" is active (server-controlled)
// Users MUST set "showThinkingSummaries": true in ~/.claude/settings.json to
// prevent the redaction and allow this patch to actually display thinking content.
// See: https://github.com/anthropics/claude-code/issues/31326
const thinkingSearchPattern = 'case"thinking":{if(!D&&!w)return null;let G=D&&!(!f||W===f),v;if(q[22]!==Y||q[23]!==D||q[24]!==K||q[25]!==G||q[26]!==w)v=G5.createElement(kv1,{addMargin:Y,param:K,isTranscriptMode:D,verbose:w,hideInTranscript:G}),q[22]=Y,q[23]=D,q[24]=K,q[25]=G,q[26]=w,q[27]=v;else v=q[27];return v}';
const thinkingReplacement = 'case"thinking":{let G=!1,v;if(q[22]!==Y||q[23]!==!0||q[24]!==K||q[25]!==G||q[26]!==w)v=G5.createElement(kv1,{addMargin:Y,param:K,isTranscriptMode:!0,verbose:w,hideInTranscript:!1}),q[22]=Y,q[23]=!0,q[24]=K,q[25]=G,q[26]=w,q[27]=v;else v=q[27];return v}';

// Check if showThinkingSummaries is set in settings.json (required since v2.1.64)
function checkShowThinkingSummaries() {
  const settingsPaths = [
    path.join(os.homedir(), '.claude', 'settings.json'),
    path.join(os.homedir(), '.config', 'claude', 'settings.json'),
  ];
  for (const settingsPath of settingsPaths) {
    try {
      if (fs.existsSync(settingsPath)) {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        if (settings.showThinkingSummaries === true) return true;
      }
    } catch (e) {
      // ignore parse errors
    }
  }
  return false;
}

const hasShowThinkingSummaries = checkShowThinkingSummaries();
if (!hasShowThinkingSummaries) {
  console.log('⚠️  WARNING: "showThinkingSummaries" is not set to true in ~/.claude/settings.json');
  console.log('   Since v2.1.64, Claude Code sends a "redact-thinking" beta header that tells');
  console.log('   the API to strip thinking text from responses. Without this setting, the');
  console.log('   patch will apply but you will see NO thinking content.');
  console.log('');
  console.log('   Fix: Add to ~/.claude/settings.json:');
  console.log('     "showThinkingSummaries": true');
  console.log('');
}

let patchApplied = false;

// Check if patch can be applied
console.log('Checking patch...\n');

console.log('Thinking visibility patch:');
if (content.includes(thinkingSearchPattern)) {
  patchApplied = true;
  console.log('  ✅ Pattern found - ready to apply');
} else if (content.includes(thinkingReplacement)) {
  console.log('  ⚠️  Already applied');
} else {
  console.log('  ❌ Pattern not found - may need update for newer version');
}

// Dry run mode - just preview
if (isDryRun) {
  console.log('\n📋 DRY RUN - No changes will be made\n');
  console.log(`Thinking visibility patch: ${patchApplied ? 'WOULD APPLY' : 'SKIP'}`);

  if (patchApplied) {
    console.log('\nRun without --dry-run to apply patch.');
  }
  process.exit(0);
}

// Apply patch
if (!patchApplied) {
  console.error('\n❌ No patch to apply');
  console.error('Patch may already be applied or version may have changed.');
  console.error('Run with --dry-run to see details.');
  process.exit(1);
}

// Create backup if it doesn't exist
if (!fs.existsSync(backupPath)) {
  console.log('\nCreating backup...');
  fs.copyFileSync(targetPath, backupPath);
  console.log(`✅ Backup created: ${backupPath}`);
}

console.log('\nApplying patch...');

content = content.replace(thinkingSearchPattern, thinkingReplacement);
console.log('✅ Thinking visibility patch applied');

// Write file
console.log('\nWriting patched file...');
fs.writeFileSync(targetPath, content, 'utf8');
console.log('✅ File written successfully');

console.log('\n🎉 Patch applied! Please restart Claude Code for changes to take effect.');
console.log('\nTo restore original behavior, run: node patch-thinking.js --restore');
process.exit(0);

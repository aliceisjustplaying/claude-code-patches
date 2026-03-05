#!/usr/bin/env node
// Patch for: https://github.com/anthropics/claude-code/issues/27621
// Bash tool duplicates all output when a command exits non-zero.
//
// Root cause: in the bash tool's call(), M.stdout is passed as BOTH the stdout
// AND the stderr argument to ShellError. FB8(ShellError) then returns
// ["Exit code N", "", stderr, stdout] = ["Exit code N", "", M.stdout, M.stdout],
// so the tool result content contains stdout twice.
//
// The bug is on the line that calls annotateStderrWithSandboxFailures:
//   let b = uA.annotateStderrWithSandboxFailures(A.command, X.stdout || "");
//                                                            ^^^^^^^^^^^^^^^^
//                                                            should be "" or M.stderr
//   throw new SC(X.stdout, b, X.code, X.interrupted);
//                           ^ b == X.stdout, so ShellError.stderr == ShellError.stdout
//
// Fix: pass "" instead of X.stdout (the bash tool doesn't capture stderr separately;
// stdout already contains merged output). This makes ShellError.stderr empty, so
// FB8() returns ["Exit code N", "", "", X.stdout] and stdout appears only once.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isRestore = args.includes('--restore');
const showHelp = args.includes('--help') || args.includes('-h');

if (showHelp) {
  console.log('Claude Code Bash Output Deduplication Patcher v2.1.69');
  console.log('======================================================\n');
  console.log('Fixes: https://github.com/anthropics/claude-code/issues/27621');
  console.log('When a bash command exits non-zero, its output appears twice in');
  console.log('the tool result. This patch prevents the duplication.\n');
  console.log('Usage: node patch-bash-dedup.js [options]\n');
  console.log('Options:');
  console.log('  --dry-run    Preview changes without applying them');
  console.log('  --restore    Restore from backup file');
  console.log('  --help, -h   Show this help message\n');
  process.exit(0);
}

console.log('Claude Code Bash Output Deduplication Patcher v2.1.69');
console.log('======================================================\n');

function safeExec(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch (error) {
    return null;
  }
}

function getClaudeCodePath() {
  const homeDir = os.homedir();
  const attemptedPaths = [];

  function checkPath(testPath, method) {
    if (!testPath) return null;
    attemptedPaths.push({ path: testPath, method });
    try {
      if (fs.existsSync(testPath)) {
        try {
          return fs.realpathSync(testPath);
        } catch (e) {
          return testPath;
        }
      }
    } catch (e) {}
    return null;
  }

  // Global npm install (most common on Linux servers)
  const globalRoot = safeExec('npm root -g');
  if (globalRoot) {
    const found = checkPath(path.join(globalRoot, '@anthropic-ai', 'claude-code', 'cli.js'), 'npm root -g');
    if (found) return found;
  }

  // Standard system paths
  for (const p of [
    '/usr/lib/node_modules/@anthropic-ai/claude-code/cli.js',
    '/usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js',
    path.join(homeDir, '.claude', 'local', 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js'),
    path.join(homeDir, '.config', 'claude', 'local', 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js'),
  ]) {
    const found = checkPath(p, 'known paths');
    if (found) return found;
  }

  // From `which claude` binary
  const claudeBinary = safeExec('which claude');
  if (claudeBinary) {
    try {
      const realBinary = fs.realpathSync(claudeBinary);
      const binDir = path.dirname(realBinary);
      const found = checkPath(
        path.join(binDir, '..', 'lib', 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js'),
        'which claude'
      );
      if (found) return found;
    } catch (e) {}
  }

  getClaudeCodePath.attemptedPaths = attemptedPaths;
  return null;
}

const targetPath = getClaudeCodePath();

if (!targetPath) {
  console.error('❌ Error: Could not find Claude Code installation');
  process.exit(1);
}

console.log(`Found Claude Code at: ${targetPath}\n`);

const backupPath = targetPath + '.backup';

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

console.log('Reading cli.js...');
let content = fs.readFileSync(targetPath, 'utf8');

// Bash Output Deduplication Patch
// Fixes: annotateStderrWithSandboxFailures receiving M.stdout instead of M.stderr
//
// Variable names that change between CLI versions (find with: see update-thinking-patch skill):
//   uA  = the sandbox object (xA in beautified)
//   A   = tool input (A6 in beautified)
//   X   = shell result M (M in beautified)
//   SC  = ShellError class (aS in beautified)
//   J   = return code interpretation (J in beautified)
//   g   = user-interrupt flag
//
// To find the new pattern after a version upgrade:
//   grep -o '.\{30\}annotateStderrWithSandboxFailures.\{80\}' /path/to/cli.js
//
// Note: In v2.1.69, the pattern is: uA.annotateStderrWithSandboxFailures(A.command,X.stdout||"")
const bashDedupSearchPattern = 'annotateStderrWithSandboxFailures(A.command,X.stdout||"")';
const bashDedupReplacement   = 'annotateStderrWithSandboxFailures(A.command,"")';

console.log('Checking patch...\n');
console.log('Bash output deduplication patch:');

let patchApplied = false;

if (content.includes(bashDedupSearchPattern)) {
  patchApplied = true;
  console.log('  ✅ Pattern found - ready to apply');
} else if (content.includes(bashDedupReplacement)) {
  console.log('  ⚠️  Already applied');
} else {
  console.log('  ❌ Pattern not found - variable names may have changed in this version');
  console.log('  Run: grep -o \'.\\{30\\}annotateStderrWithSandboxFailures.\\{80\\}\' ' + targetPath);
  console.log('  Then update bashDedupSearchPattern in this script. See update-thinking-patch skill.');
}

if (isDryRun) {
  console.log('\n📋 DRY RUN - No changes will be made\n');
  console.log(`Bash deduplication patch: ${patchApplied ? 'WOULD APPLY' : 'SKIP'}`);
  if (patchApplied) console.log('\nRun without --dry-run to apply patch.');
  process.exit(0);
}

if (!patchApplied) {
  console.error('\n❌ No patch to apply. Pattern not found or already applied.');
  process.exit(1);
}

if (!fs.existsSync(backupPath)) {
  console.log('\nCreating backup...');
  fs.copyFileSync(targetPath, backupPath);
  console.log(`✅ Backup created: ${backupPath}`);
}

console.log('\nApplying patch...');
content = content.replace(bashDedupSearchPattern, bashDedupReplacement);
console.log('✅ Bash output deduplication patch applied');

console.log('\nWriting patched file...');
fs.writeFileSync(targetPath, content, 'utf8');
console.log('✅ File written successfully');

console.log('\n🎉 Patch applied! Please restart Claude Code for changes to take effect.');
console.log('\nTo restore original behavior, run: node patch-bash-dedup.js --restore');
process.exit(0);

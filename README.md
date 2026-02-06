# Claude Code Patches

Enhance Claude Code with custom patches for thinking display and subagent model configuration.

## Available Patches

1. **[Thinking Display Patch](#thinking-display-patch)** - Make thinking blocks visible by default
2. **[Subagent Model Configuration](#subagent-model-configuration)** - Configure which models subagents use

---

## Thinking Display Patch

Make Claude Code's thinking blocks visible by default without pressing `ctrl+o`.

## The Problem

Claude Code collapses thinking blocks by default, showing only:
```
∴ Thought for 3s (ctrl+o to show thinking)
```

You have to press `ctrl+o` every time to see the actual thinking content. This patch makes thinking blocks visible inline automatically.

**Current Version:** Claude Code 2.1.34 (Updated 2026-02-06)

## Quick Start

```bash
# Clone or download this repository
cd claude-code-thinking

# Run the patch script (automatically detects your installation)
node patch-thinking.js

# Restart Claude Code
```

That's it! Thinking blocks now display inline without `ctrl+o`.

**Works with:**
- ✅ Local installations (`~/.claude/local`)
- ✅ Global npm installations (`npm install -g @anthropic-ai/claude-code`)
- ✅ All Node version managers (NVM, nodenv, asdf, etc.)

## What This Patch Does

**Before:**
```
∴ Thought for 3s (ctrl+o to show thinking)
[thinking content hidden]
```

**After:**
```
∴ Thinking…

  [thinking content displayed inline]
  The actual thinking process is now visible
  without any keyboard shortcuts needed
```

## How It Works

This patch modifies two locations in Claude Code's compiled JavaScript:

### Patch 1: Remove the Banner (v2.0.30)
**Before:**
```javascript
function GkQ({streamMode:A}){
  // ... displays "Thought for Xs (ctrl+o to show thinking)"
}
```

**After:**
```javascript
function GkQ({streamMode:A}){return null}
```

**Effect:** Removes the collapsed thinking banner entirely.

**Version History:**
- v2.0.9: Function named `Mr2`
- v2.0.10: Renamed to `br2`, used `PE.createElement`
- v2.0.11: Renamed to `er2`, uses `_E.createElement`
- v2.0.13: Renamed to `hGB`, uses `TL.createElement`
- v2.0.14: Renamed to `pGB`, uses `TL.createElement`, `TX1.useState`
- v2.0.15: Renamed to `KYB`, uses `xL.createElement`, `mX1.useState`
- v2.0.19: Renamed to `aFB`, uses `ZM.createElement`, `BV1.useState`
- v2.0.21: Renamed to `wVB`, uses `XM.createElement`, `DV1.useState`
- v2.0.22: Renamed to `YOB`, uses `NM.createElement`, `zK1.useState`
- v2.0.24: Renamed to `GSB`, uses `oM.createElement`, `kD1.useState`
- v2.0.25: Renamed to `YSB`, uses `tM.createElement`, `xD1.useState`
- v2.0.26: Renamed to `KjQ`, uses `QO.createElement`, `gKA.useState`
- v2.0.28: Renamed to `RjQ`, uses `IO.createElement`, `iKA.useState`
- v2.0.29: Unchanged from v2.0.28 (`RjQ`, `IO.createElement`, `iKA.useState`)
- v2.0.30: Renamed to `GkQ`, uses `NO.createElement`, `dDA.useState`
- v2.0.31: Renamed to `_kQ`, uses `MO.createElement`, `nDA.useState`
- v2.0.32: Renamed to `wkQ`, uses `LO.createElement`, `oDA.useState`
- v2.0.37: Renamed to `nR2`, uses `CR.createElement`, `AwA.useState`
- v2.0.42: Renamed to `cR2`, uses `RR.createElement`, `UwA.useState`
- v2.0.46: Renamed to `Et2`, uses `xP.createElement`, `HTA.useState`
- v2.0.53: Renamed to `hq2`, uses `QP.createElement`, `dMA.useState`
- v2.0.55: Renamed to `nM2`, uses `UP.createElement`, `bOA.useState`
- v2.0.56: Renamed to `CL2`, uses `HP.createElement`, `xOA.useState`
- v2.0.57: Renamed to `HM2`, uses `EP.createElement`, `oOA.useState`
- v2.0.58: Renamed to `SM2`, uses `$P.createElement`, `GRA.useState`
- v2.0.59: Renamed to `DO2`, uses `MP.createElement`, `CRA.useState`
- v2.0.61: Renamed to `RR2`, uses `rj.createElement`, `vTA.useState`, `P` container
- v2.0.62: Renamed to `ZT2`, uses `GP.createElement`, `rTA.useState`, `P` container
- v2.0.71: **DEPRECATED** - Banner function removed; functionality integrated into `mn2` component

### Patch 2: Force Thinking Visibility (v2.1.34)
**Before:**
```javascript
case"thinking":{if(!M&&!Z)return null;let T=M&&!(!P||G===P)&&!Z,k;
  ...k=I5.createElement(sD6,{addMargin:Y,param:K,isTranscriptMode:M,hideInTranscript:T})...
```

**After:**
```javascript
case"thinking":{let T=!1,k;
  ...k=I5.createElement(sD6,{addMargin:Y,param:K,isTranscriptMode:!0,hideInTranscript:!1})...
```

**Effect:** Forces thinking content to render as if in transcript mode (visible).

**Version History:**
- v2.0.9: Used `S2B` component
- v2.0.10: Changed to `DOB` component, `z`→`H` variable
- v2.0.11: Changed to `SOB` component, `H`→`z` variable
- v2.0.13: Changed to `xlB` component, `K`→`D` variable swap
- v2.0.14: Changed to `dlB` component, maintains `K` and `D` variable pattern
- v2.0.15: Changed to `FpB` component, `z3`→`C3` variable
- v2.0.19: Changed to `NoB` component, `C3`→`B7` variable
- v2.0.21: Changed to `H8Q` component, `B7`→`G7` variable, checks `K` and `D`
- v2.0.22: Changed to `nNB` component, `G7`→`e3` variable, checks `K` and `D`
- v2.0.24: Changed to `nTB` component, `e3`→`Y7` variable, checks `K` and `D`
- v2.0.25: Changed to `aTB` component, maintains `Y7` variable, checks `K` and `D`
- v2.0.26: Changed to `CTQ` component, `Y7`→`Y3` variable, checks only `V`
- v2.0.28: Changed to `LTQ` component, `Y3`→`C3` variable, checks only `V`
- v2.0.29: Unchanged from v2.0.28 (`LTQ` component, `C3` variable, checks `V`)
- v2.0.30: Changed to `sjQ` component, `C3`→`D3` variable, checks `V` and `I`, added `verbose` parameter
- v2.0.31: Changed to `MSQ` component, `D3`→`E3` variable, checks `V` and `I`
- v2.0.32: Changed to `ljQ` component, `E3`→`F3` variable, checks `V` and `I`
- v2.0.37: Changed to `n$Q` component, `F3`→`K3` variable, checks `V` and `I`
- v2.0.42: Changed to `xLQ` component, `K3`→`w3` variable, checks `V` and `I`
- v2.0.46: Changed to `T32` component, `w3`→`H7` variable, checks `K` and `Z`
- v2.0.53: Changed to `o09` component, `H7`→`L3` variable, checks `K` and `G`
- v2.0.55: Changed to `J29` component, `L3`→`y3` variable, checks `K` and `G`
- v2.0.56: Changed to `b29` component, `y3`→`v3` variable, checks `K` and `G`
- v2.0.57: Changed to `K49` component, `v3`→`b3` variable, checks `K` and `G`
- v2.0.58: Changed to `k49` component (lowercase k), `b3` variable, checks `K` and `G`
- v2.0.59: Changed to `F89` component, `u3` variable, checks `K` and `G`
- v2.0.61: Changed to `T69` component, `A3` variable, checks `F` and `G`
- v2.0.62: Changed to `X59` component, `J3` variable, checks `F` and `G`
- v2.0.71: Changed to `mn2` component, `b5` variable, checks `H` and `G`
- v2.0.73: Changed to `Gt2` component, `J5` variable, checks `D` and `Z`
- v2.0.75: Changed to `co2` component, `J5` variable, checks `D` and `Z`
- v2.0.76: Changed to `lo2` component, `J5` variable, checks `D` and `Z`
- v2.1.2: Changed to `ybA` component, `o8` variable, checks `F` and `Z`, added `hideInTranscript` property
- v2.1.6: Changed to `_bA` component, `Z5` variable, checks `F` and `Z`
- v2.1.7: Changed to `gkA` component, `K5` variable, checks `F` and `Z`
- v2.1.12: Changed to `fI1` component, `H9` variable, checks `D` and `H`, added `T` check, uses React memo cache
- v2.1.17: Changed to `oG1` component, `H9` variable, checks `D`, `H`, and `T`
- v2.1.19: Changed to `oG1` component (unchanged), variable `x`, checks `D`, `H`, and `T`
- v2.1.20: Changed to `Ej1` component, `H9.createElement` variable, checks `D`, `H`, and `T`
- v2.1.22: Changed to `iM1` component, `Y9.createElement` variable, checks `D`, `H`, and `T`
- v2.1.31: Changed to `_j6` component, `K9.createElement` variable, checks `j` and `V`, **verbose parameter removed**, memo cache changed to `q[21]` format

## Installation

### Prerequisites
- Claude Code v2.1.34 installed
- Node.js (comes with Claude Code installation)

### Install Steps

1. **Download the patcher:**
   ```bash
   # Clone this repository
   git clone <repository-url>
   cd claude-code-thinking
   ```

2. **Run the patcher:**
   ```bash
   node patch-thinking.js
   ```

3. **Restart Claude Code** for changes to take effect.

## Command-Line Options

The script supports several options:

```bash
# Apply patches (default)
node patch-thinking.js

# Preview changes without applying
node patch-thinking.js --dry-run

# Restore original behavior from backup
node patch-thinking.js --restore

# Show help
node patch-thinking.js --help
```

## Installation Detection

The script **automatically detects** Claude Code installations using a robust 4-tier detection strategy:

### Detection Methods (Priority Order)

1. **Local Installations** (Priority 1)
   - `~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js`
   - `~/.config/claude/local/node_modules/@anthropic-ai/claude-code/cli.js`

2. **Global npm Installation** (Priority 2)
   - Dynamically detected via `npm root -g`
   - Works with **all Node version managers** (NVM, nodenv, asdf, nvm-windows)
   - Automatically resolves symlinks

3. **Derived from Node.js Binary** (Priority 3)
   - Falls back to `process.execPath` derivation
   - Works when npm command is unavailable

4. **Unix Binary Location** (Priority 4)
   - Uses `which claude` on macOS/Linux
   - Traces binary back to installation directory

### Key Features

- ✅ **Works with any Node version** - No hardcoded paths
- ✅ **Supports all version managers** - NVM, nodenv, asdf, etc.
- ✅ **Cross-platform** - macOS, Linux, Windows
- ✅ **Automatic symlink resolution** - Handles npm global symlinks
- ✅ **Comprehensive error messages** - Shows all attempted paths

**Backup Created:**
- `cli.js.backup` (in the same directory as cli.js)

## Important: After Claude Code Updates

When you run `claude update`, the patches will be **overwritten**. You must re-apply them:

```bash
cd claude-code-thinking
node patch-thinking.js
# Restart Claude Code
```

The patch script automatically:
- Detects your Claude Code installation
- Creates a backup before patching (if it doesn't exist)
- Applies both patches atomically
- Reports success or failure
- Safe to run multiple times

## Rollback

To restore the original behavior:

**Option 1: Using the script**
```bash
node patch-thinking.js --restore
```

**Option 2: Manual restore**
```bash
# The backup is created in the same directory as cli.js
cp ~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js.backup \
   ~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js
```

Then restart Claude Code.

## Verification

Check if patch is applied (for v2.1.34):

```bash
# Check thinking visibility patch (v2.1.34)
grep -n 'I5.createElement(sD6,{addMargin:Y,param:K,isTranscriptMode:!0,hideInTranscript:!1})' ~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js

# Should show a match with the patched thinking case

# Note: Banner removal patch is deprecated in v2.0.71+ - no longer needed
```

## Troubleshooting

### "Could not find Claude Code installation"

**Cause:** The script cannot locate your Claude Code installation.

The script will display all attempted detection methods and paths, for example:

```
❌ Error: Could not find Claude Code installation

Searched using the following methods:

  [local installation]
    - ~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js
    - ~/.config/claude/local/node_modules/@anthropic-ai/claude-code/cli.js
  [npm root -g]
    - /opt/homebrew/lib/node_modules/@anthropic-ai/claude-code/cli.js
  [derived from process.execPath]
    - /opt/homebrew/bin/../lib/node_modules/@anthropic-ai/claude-code/cli.js
  [which claude]
    - /opt/homebrew/bin/../lib/node_modules/@anthropic-ai/claude-code/cli.js

💡 Troubleshooting:
  1. Verify Claude Code is installed: claude --version
  2. For local install: Check ~/.claude/local or ~/.config/claude/local
  3. For global install: Ensure "npm install -g @anthropic-ai/claude-code" succeeded
  4. Check that npm is in your PATH if using global install
```

**Solutions:**
1. **Verify installation:** Run `claude --version` to confirm Claude Code is installed
2. **For local installations:** Check that cli.js exists in `~/.claude/local` or `~/.config/claude/local`
3. **For global installations:**
   - Ensure `npm install -g @anthropic-ai/claude-code` completed successfully
   - Verify npm is in your PATH: `npm --version`
   - If using NVM: Ensure you've activated the correct Node version
4. **Check file permissions:** Ensure the script has read access to the installation directory

### "Pattern not found"

**Cause:** This means:
1. Claude Code has been updated to a newer version
2. The patches are already applied
3. The file structure has changed

**Solution:**
1. Run `node patch-thinking.js --dry-run` to check status
2. If already applied, you're good!
3. If version changed, the patterns may need updating for the new version

### Thinking Still Collapsed After Patching

**Solution:** You must restart Claude Code for changes to take effect.

### Backup File Missing

The patch script creates a backup automatically on first run. The `--restore` command will fail if the backup doesn't exist.

## Cross-Platform Support

The script works on:
- **macOS** ✅ Full support (all 4 detection methods)
- **Linux** ✅ Full support (all 4 detection methods)
- **Windows** ✅ Supported (3 detection methods - excludes `which claude`)

### Platform-Specific Notes

**macOS & Linux:**
- All 4 detection methods available
- Includes `which claude` binary resolution
- Automatic symlink resolution for Homebrew, NVM, etc.

**Windows:**
- Uses first 3 detection methods
- Works with nvm-windows and system Node
- Skips Unix-specific `which` command

Path detection is fully automatic using Node.js built-in modules.

### Version Manager Support

The script automatically works with all Node.js version managers:

| Version Manager | Support | Notes |
|----------------|---------|-------|
| **NVM** (Node Version Manager) | ✅ Full | Detects via `npm root -g` |
| **nodenv** | ✅ Full | Detects via `process.execPath` |
| **asdf** | ✅ Full | Detects via `npm root -g` |
| **nvm-windows** | ✅ Full | Works with all 3 Windows methods |
| **System Node** | ✅ Full | Standard installation detection |
| **Homebrew** (macOS) | ✅ Full | Symlink resolution included |

**How it works:**
- `npm root -g` dynamically finds the global node_modules directory regardless of version manager
- `process.execPath` derives the path from the current Node.js binary location
- No hardcoded paths means it works with any Node setup

## Technical Details

### File Structure
- **cli.js:** ~7,466 lines, ~11 MB (heavily minified)
- **Version:** Claude Code 2.1.34
- **Patches:** Non-invasive, minimal changes

### Installation Detection System

The patcher uses a sophisticated detection system with multiple fallback methods:

```javascript
// Priority 1: Local installations
~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js
~/.config/claude/local/node_modules/@anthropic-ai/claude-code/cli.js

// Priority 2: Global npm (dynamic)
$(npm root -g)/@anthropic-ai/claude-code/cli.js

// Priority 3: Derived from Node binary
$(dirname process.execPath)/../lib/node_modules/@anthropic-ai/claude-code/cli.js

// Priority 4: Unix binary resolution
$(which claude) → resolve symlinks → find cli.js
```

**Key implementation details:**
- Uses `child_process.execSync()` with proper error handling
- Automatically resolves symlinks via `fs.realpathSync()`
- Tracks all attempted paths for detailed error reporting
- Cross-platform compatible (Windows, macOS, Linux)

### Why Two Patches?

1. **ZT2 Function:** Controls the UI banner shown after thinking completes
2. **Thinking Renderer:** Controls whether the actual thinking text is displayed

Both must be patched because they're separate systems:
- Patching only ZT2 → Blank line appears where thinking should be
- Patching only the renderer → Banner still shows "ctrl+o to show"

### Pattern Evolution Across Versions

The minified code patterns change with each Claude Code update:

| Version | Banner Function | Component | Variables |
|---------|----------------|-----------|-----------|
| 2.0.9   | `Mr2`          | `S2B`     | Various   |
| 2.0.10  | `br2`          | `DOB`     | `H` check |
| 2.0.11  | `er2`          | `SOB`     | `z` check |
| 2.0.13  | `hGB`          | `xlB`     | `K` check |
| 2.0.14  | `pGB`          | `dlB`     | `K` check |
| 2.0.15  | `KYB`          | `FpB`     | `K` check |
| 2.0.19  | `aFB`          | `NoB`     | `K` check |
| 2.0.21  | `wVB`          | `H8Q`     | `K,D` check |
| 2.0.22  | `YOB`          | `nNB`     | `K,D` check |
| 2.0.24  | `GSB`          | `nTB`     | `K,D` check |
| 2.0.25  | `YSB`          | `aTB`     | `K,D` check |
| 2.0.26  | `KjQ`          | `CTQ`     | `V` check   |
| 2.0.28  | `RjQ`          | `LTQ`     | `V` check   |
| 2.0.29  | `RjQ`          | `LTQ`     | `V` check   |
| 2.0.30  | `GkQ`          | `sjQ`     | `V,I` check |
| 2.0.31  | `_kQ`          | `MSQ`     | `V,I` check |
| 2.0.32  | `wkQ`          | `ljQ`     | `V,I` check |
| 2.0.37  | `nR2`          | `n$Q`     | `V,I` check |
| 2.0.42  | `cR2`          | `xLQ`     | `V,I` check |
| 2.0.46  | `Et2`          | `T32`     | `K,Z` check |
| 2.0.53  | `hq2`          | `o09`     | `K,G` check |
| 2.0.55  | `nM2`          | `J29`     | `K,G` check |
| 2.0.56  | `CL2`          | `b29`     | `K,G` check |
| 2.0.57  | `HM2`          | `K49`     | `K,G` check |
| 2.0.58  | `SM2`          | `k49`     | `K,G` check |
| 2.0.59  | `DO2`          | `F89`     | `K,G` check |
| 2.0.61  | `RR2`          | `T69`     | `F,G` check |
| 2.0.62  | `ZT2`          | `X59`     | `F,G` check |
| 2.0.71  | *deprecated*   | `mn2`     | `H,G` check |
| 2.0.73  | *deprecated*   | `Gt2`     | `D,Z` check |
| 2.0.75  | *deprecated*   | `co2`     | `D,Z` check |
| 2.0.76  | *deprecated*   | `lo2`     | `D,Z` check |
| 2.1.2   | *deprecated*   | `ybA`     | `F,Z` check + `hideInTranscript` |
| 2.1.6   | *deprecated*   | `_bA`     | `F,Z` check |
| 2.1.7   | *deprecated*   | `gkA`     | `F,Z` check |
| 2.1.12  | *deprecated*   | `fI1`     | `D,H,T` check + memo cache |
| 2.1.17  | *deprecated*   | `oG1`     | `D,H,T` check |
| 2.1.19  | *deprecated*   | `oG1`     | `D,H,T` check |
| 2.1.20  | *deprecated*   | `Ej1`     | `D,H,T` check, `H9.createElement` |
| 2.1.22  | *deprecated*   | `iM1`     | `D,H,T` check, `Y9.createElement` |
| 2.1.31  | *deprecated*   | `_j6`     | `j,V` check (no verbose), `K9.createElement`, `q[21]` memo |
| 2.1.34  | *deprecated*   | `sD6`     | `M,Z` check, `I5.createElement`, `q[21]` memo |

When Claude Code updates, function names and component identifiers are regenerated during minification. In some cases (like v2.0.29), the patterns remain unchanged.

**Note on v2.0.71:** The separate banner function was removed. The "Thought for X seconds" message no longer exists - the banner functionality was integrated into the `mn2` thinking component. Only Patch 2 (visibility) is needed for v2.0.71+.

## Limitations

1. **Breaks on updates:** Must re-run after `claude update`
2. **Minified code:** Fragile, patterns may change with version updates
3. **No official config:** This is a workaround until Anthropic adds a native setting
4. **Version-specific:** Patterns are specific to v2.1.34

## Feature Request

Consider requesting this as an official feature from Anthropic:
- Configuration option to always show thinking
- User preference in settings (`~/.claude/config.json`)
- Toggle command like `/thinking show` or `/thinking hide`
- Environment variable like `CLAUDE_SHOW_THINKING=true`

Submit feedback: https://github.com/anthropics/claude-code/issues

## Contributing

If Claude Code updates and the patches stop working:

1. **Locate the new patterns** in cli.js:
   - Search for the thinking banner function (look for "Thought for" text)
   - Search for `case"thinking"` to find the visibility check

2. **Update the script** with new patterns

3. **Test thoroughly** before committing

4. **Update this README** with the new version information

Pull requests welcome!

---

## Subagent Model Configuration

Configure which AI models Claude Code uses for different subagent types (Plan, Explore, general-purpose).

### The Problem

By default, Claude Code hardcodes the models used by subagents:
- **Plan subagent**: Uses Sonnet (for planning tasks)
- **Explore subagent**: Uses Haiku (for code exploration)
- **general-purpose subagent**: Inherits from main loop model

You cannot change these defaults without modifying the source code.

### The Solution

This patch allows you to configure subagent models via a configuration file (`~/.claude/subagent-models.json`).

**Current Version:** Claude Code 2.0.46

### Quick Start

```bash
# 1. Create configuration file
cat > ~/.claude/subagent-models.json <<EOF
{
  "Plan": "sonnet",
  "Explore": "sonnet",
  "general-purpose": "sonnet"
}
EOF

# 2. Run the patch script
node patch-subagent-models.js

# 3. Restart Claude Code
```

### Configuration

Create `~/.claude/subagent-models.json` with your preferred models:

```json
{
  "Plan": "sonnet",
  "Explore": "haiku",
  "general-purpose": "sonnet"
}
```

**Valid model values:**
- `"haiku"` - Fast and efficient (Claude Haiku 4.5)
- `"sonnet"` - Balanced performance (Claude Sonnet 4.5)
- `"opus"` - Most capable (Claude Opus 4.1)

**Subagent Types:**
- **Plan** - Used in planning mode for breaking down tasks
- **Explore** - Used for codebase exploration and file searching
- **general-purpose** - Used for general multi-step tasks

### Command-Line Options

```bash
# Apply patches
node patch-subagent-models.js

# Preview changes without applying
node patch-subagent-models.js --dry-run

# Restore original behavior
node patch-subagent-models.js --restore

# Show help
node patch-subagent-models.js --help
```

### How It Works

The patch modifies Claude Code's `cli.js` to change the hardcoded model assignments:

**Before (v2.0.37):**
```javascript
// Plan subagent
R3A={agentType:"Plan",...,model:"sonnet"}

// Explore subagent
model:"haiku"}});var R3A;
```

**After (with config: Plan="haiku", Explore="sonnet"):**
```javascript
// Plan subagent
R3A={agentType:"Plan",...,model:"haiku"}

// Explore subagent
model:"sonnet"}});var R3A;
```

### Important Notes

1. **After Claude Code Updates:** Must re-run after `claude update`:
   ```bash
   node patch-subagent-models.js
   ```

2. **Backup:** Created automatically at:
   ```
   ~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js.subagent-models.backup
   ```

3. **Version-Specific:** Patterns are specific to v2.0.37. May need updates for newer versions.

### Restoration

**Using the script:**
```bash
node patch-subagent-models.js --restore
```

**Manual restore:**
```bash
cp ~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js.subagent-models.backup \
   ~/.claude/local/node_modules/@anthropic-ai/claude-code/cli.js
```

### Example Use Cases

**Use Sonnet everywhere (avoid Haiku):**
```json
{
  "Plan": "sonnet",
  "Explore": "sonnet",
  "general-purpose": "sonnet"
}
```

**Use Haiku for speed:**
```json
{
  "Plan": "haiku",
  "Explore": "haiku",
  "general-purpose": "haiku"
}
```

**Balanced approach:**
```json
{
  "Plan": "sonnet",
  "Explore": "haiku",
  "general-purpose": "sonnet"
}
```

### Troubleshooting

**"No model configuration found"**
- Create `~/.claude/subagent-models.json` with your desired configuration
- Ensure the JSON syntax is valid

**"Pattern not found"**
- Claude Code version may have changed
- Run with `--dry-run` to see which patterns are detected
- Check if patches are already applied

**Changes not taking effect**
- Restart Claude Code after applying patches
- Verify patches were applied with `--dry-run`

### Version History

| Version | Plan Default | Explore Default | Notes |
|---------|-------------|-----------------|-------|
| 2.0.31  | sonnet      | haiku           | Previous |
| 2.0.32  | sonnet      | haiku           | Previous |
| 2.0.37  | sonnet      | haiku           | Current |

---

## License

This patch is provided as-is for educational purposes. Use at your own risk.

## Credits

Developed through analysis of Claude Code's compiled JavaScript. Special thanks to the community for identifying the thinking display issue.

---

**Last Updated:** 2026-02-06
**Claude Code Version:** 2.1.34
**Status:** ✅ Working

### Quick Reference

```bash
# Install
node patch-thinking.js

# Preview
node patch-thinking.js --dry-run

# Restore
node patch-thinking.js --restore

# Help
node patch-thinking.js --help
```

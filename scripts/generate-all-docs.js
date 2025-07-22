#!/usr/bin/env node

/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 * 
 * Complete Documentation Generator
 * 
 * Runs all documentation generation scripts and provides a summary report
 * of the generated artifacts for the ClickUp MCP Server project.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Run a command and return a promise
 */
function runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: 'pipe',
            cwd: projectRoot,
            ...options
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve({ stdout, stderr });
            } else {
                reject(new Error(`Command failed with code ${code}: ${stderr}`));
            }
        });
    });
}

/**
 * Check if a file exists and get its stats
 */
function getFileInfo(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return {
            exists: true,
            size: stats.size,
            modified: stats.mtime,
            sizeFormatted: formatBytes(stats.size)
        };
    } catch (error) {
        return {
            exists: false,
            size: 0,
            modified: null,
            sizeFormatted: '0 B'
        };
    }
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Generate a summary report of all artifacts
 */
function generateSummaryReport(results) {
    const timestamp = new Date().toISOString();
    const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
    
    let report = `# ClickUp MCP Server - Reference Artifacts Summary

*Generated on ${timestamp}*

## Project Information

- **Project Name**: ${packageJson.name}
- **Version**: ${packageJson.version}
- **Description**: ${packageJson.description}
- **Author**: ${packageJson.author}

## Generated Artifacts

### 📖 API Documentation

`;

    // API Documentation
    const apiDocsPath = path.join(projectRoot, 'docs', 'api-reference.md');
    const apiDocsInfo = getFileInfo(apiDocsPath);
    
    report += `- **File**: \`docs/api-reference.md\`
- **Status**: ${apiDocsInfo.exists ? '✅ Generated' : '❌ Failed'}
- **Size**: ${apiDocsInfo.sizeFormatted}
${apiDocsInfo.modified ? `- **Last Modified**: ${apiDocsInfo.modified.toISOString()}` : ''}

`;

    // Architecture Diagrams
    const diagramsPath = path.join(projectRoot, 'docs', 'architecture-diagrams.md');
    const diagramsInfo = getFileInfo(diagramsPath);
    
    report += `### 🏗️ Architecture Diagrams

- **File**: \`docs/architecture-diagrams.md\`
- **Status**: ${diagramsInfo.exists ? '✅ Generated' : '❌ Failed'}
- **Size**: ${diagramsInfo.sizeFormatted}
${diagramsInfo.modified ? `- **Last Modified**: ${diagramsInfo.modified.toISOString()}` : ''}

`;

    // VS Code Workspace
    const workspacePath = path.join(projectRoot, 'clickup-mcp-server.code-workspace');
    const workspaceInfo = getFileInfo(workspacePath);
    
    report += `### ⚡ VS Code Workspace

- **File**: \`clickup-mcp-server.code-workspace\`
- **Status**: ${workspaceInfo.exists ? '✅ Generated' : '❌ Failed'}
- **Size**: ${workspaceInfo.sizeFormatted}
${workspaceInfo.modified ? `- **Last Modified**: ${workspaceInfo.modified.toISOString()}` : ''}

`;

    // Generation Results
    report += `## Generation Results

`;

    for (const result of results) {
        const status = result.success ? '✅ Success' : '❌ Failed';
        report += `### ${result.name}

- **Status**: ${status}
- **Duration**: ${result.duration}ms
${result.error ? `- **Error**: ${result.error}` : ''}
${result.output ? `- **Output**: ${result.output.substring(0, 200)}...` : ''}

`;
    }

    // Usage Instructions
    report += `## Usage Instructions

### Opening in VS Code

1. Open VS Code
2. File → Open Workspace from File
3. Select \`clickup-mcp-server.code-workspace\`
4. Install recommended extensions when prompted

### Viewing Documentation

1. **API Reference**: Open \`docs/api-reference.md\` in any Markdown viewer
2. **Architecture Diagrams**: 
   - View in VS Code with Mermaid extension
   - Copy diagrams to [Mermaid Live Editor](https://mermaid.live/)
   - View on GitHub (native Mermaid support)

### Regenerating Documentation

Run any of these commands:

\`\`\`bash
# Generate API docs only
node scripts/generate-api-docs.js

# Generate diagrams only  
node scripts/generate-diagrams.js

# Generate all documentation
node scripts/generate-all-docs.js
\`\`\`

Or use VS Code tasks (Ctrl+Shift+P → "Tasks: Run Task"):
- Generate API Docs
- Generate Diagrams
- Generate All Documentation

## File Structure

\`\`\`
clickup-mcp-server/
├── docs/
│   ├── api-reference.md          # Auto-generated API documentation
│   └── architecture-diagrams.md  # Auto-generated Mermaid diagrams
├── scripts/
│   ├── generate-api-docs.js      # API documentation generator
│   ├── generate-diagrams.js      # Diagram generator
│   └── generate-all-docs.js      # This script
└── clickup-mcp-server.code-workspace  # VS Code workspace settings
\`\`\`

## Maintenance

- **Frequency**: Regenerate after major code changes
- **Automation**: Consider adding to CI/CD pipeline
- **Updates**: Keep generators in sync with codebase structure
- **Validation**: Verify Mermaid syntax using live editor

---

*This report was automatically generated by the ClickUp MCP Server documentation system*
`;

    return report;
}

/**
 * Main execution
 */
async function main() {
    console.log('🚀 Starting complete documentation generation...\n');
    
    const startTime = Date.now();
    const results = [];
    
    // Ensure docs directory exists
    const docsDir = path.join(projectRoot, 'docs');
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
        console.log('📁 Created docs directory');
    }
    
    // Generate API Documentation
    try {
        console.log('📖 Generating API documentation...');
        const apiStart = Date.now();
        const apiResult = await runCommand('node', ['scripts/generate-api-docs.js']);
        const apiDuration = Date.now() - apiStart;
        
        results.push({
            name: 'API Documentation',
            success: true,
            duration: apiDuration,
            output: apiResult.stdout
        });
        
        console.log('✅ API documentation generated');
    } catch (error) {
        results.push({
            name: 'API Documentation',
            success: false,
            duration: Date.now() - Date.now(),
            error: error.message
        });
        
        console.log('❌ API documentation failed:', error.message);
    }
    
    // Generate Architecture Diagrams
    try {
        console.log('🏗️ Generating architecture diagrams...');
        const diagramStart = Date.now();
        const diagramResult = await runCommand('node', ['scripts/generate-diagrams.js']);
        const diagramDuration = Date.now() - diagramStart;
        
        results.push({
            name: 'Architecture Diagrams',
            success: true,
            duration: diagramDuration,
            output: diagramResult.stdout
        });
        
        console.log('✅ Architecture diagrams generated');
    } catch (error) {
        results.push({
            name: 'Architecture Diagrams',
            success: false,
            duration: Date.now() - Date.now(),
            error: error.message
        });
        
        console.log('❌ Architecture diagrams failed:', error.message);
    }
    
    // Note about VS Code workspace (already created)
    console.log('⚡ VS Code workspace file already configured');
    
    // Generate summary report
    console.log('📊 Generating summary report...');
    const summaryReport = generateSummaryReport(results);
    const summaryPath = path.join(projectRoot, 'docs', 'reference-artifacts-summary.md');
    fs.writeFileSync(summaryPath, summaryReport);
    
    const totalDuration = Date.now() - startTime;
    
    console.log('\n🎉 Documentation generation complete!');
    console.log(`⏱️ Total time: ${totalDuration}ms`);
    console.log('\n📋 Generated files:');
    console.log('   - docs/api-reference.md');
    console.log('   - docs/architecture-diagrams.md'); 
    console.log('   - docs/reference-artifacts-summary.md');
    console.log('   - clickup-mcp-server.code-workspace');
    
    console.log('\n🔧 Next steps:');
    console.log('   1. Open clickup-mcp-server.code-workspace in VS Code');
    console.log('   2. Install recommended extensions');
    console.log('   3. Review generated documentation in docs/ folder');
    console.log('   4. Test Mermaid diagrams in VS Code or online editor');
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    if (successCount === totalCount) {
        console.log(`\n✅ All ${totalCount} generation tasks completed successfully!`);
        process.exit(0);
    } else {
        console.log(`\n⚠️ ${successCount}/${totalCount} generation tasks completed successfully`);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

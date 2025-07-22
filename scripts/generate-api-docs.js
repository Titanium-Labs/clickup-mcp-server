#!/usr/bin/env node

/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 * 
 * API Documentation Generator
 * 
 * Automatically extracts tool schemas from the ClickUp MCP Server codebase
 * and generates comprehensive API documentation in Markdown format.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Extract tool definitions from TypeScript files
 */
async function extractToolDefinitions() {
    const toolsDir = path.join(projectRoot, 'src', 'tools');
    const tools = [];
    
    // Read all TypeScript files in the tools directory
    const files = await findTSFiles(toolsDir);
    
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        const extractedTools = parseToolsFromFile(content, file);
        tools.push(...extractedTools);
    }
    
    return tools;
}

/**
 * Recursively find all TypeScript files
 */
async function findTSFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            const subFiles = await findTSFiles(fullPath);
            files.push(...subFiles);
        } else if (item.endsWith('.ts')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

/**
 * Parse tool definitions from a TypeScript file
 */
function parseToolsFromFile(content, filePath) {
    const tools = [];
    const relativePath = path.relative(projectRoot, filePath);
    
    // Match tool definitions using regex
    const toolDefPattern = /export const (\w+Tool): Tool = \{([^}]+)\}/gs;
    let match;
    
    while ((match = toolDefPattern.exec(content)) !== null) {
        const [, toolName, toolBody] = match;
        const tool = parseToolObject(toolBody, toolName, relativePath);
        if (tool) {
            tools.push(tool);
        }
    }
    
    return tools;
}

/**
 * Parse individual tool object
 */
function parseToolObject(toolBody, toolName, filePath) {
    try {
        // Extract name
        const nameMatch = toolBody.match(/name:\s*['"`]([^'"`]+)['"`]/);
        const name = nameMatch ? nameMatch[1] : toolName.replace('Tool', '');
        
        // Extract description
        const descMatch = toolBody.match(/description:\s*`([^`]+)`|description:\s*['"]([^'"]+)['"]/);
        const description = descMatch ? (descMatch[1] || descMatch[2]) : 'No description available';
        
        // Extract input schema (simplified - would need more complex parsing for full schema)
        const schemaMatch = toolBody.match(/inputSchema:\s*\{([^}]+)\}/s);
        let inputSchema = {};
        
        if (schemaMatch) {
            // This is a simplified parser - for production, you'd want a more robust solution
            const schemaBody = schemaMatch[1];
            const propertiesMatch = schemaBody.match(/properties:\s*\{([^}]+)\}/s);
            
            if (propertiesMatch) {
                inputSchema.properties = parseProperties(propertiesMatch[1]);
            }
        }
        
        return {
            name,
            description: description.replace(/\s+/g, ' ').trim(),
            inputSchema,
            toolName,
            filePath
        };
    } catch (error) {
        console.warn(`Failed to parse tool ${toolName} in ${filePath}:`, error.message);
        return null;
    }
}

/**
 * Parse properties from schema
 */
function parseProperties(propertiesStr) {
    const properties = {};
    
    // Simple property extraction - this would need to be more sophisticated for complex schemas
    const propertyMatches = propertiesStr.match(/(\w+):\s*\{[^}]*\}/g);
    
    if (propertyMatches) {
        for (const prop of propertyMatches) {
            const nameMatch = prop.match(/(\w+):/);
            if (nameMatch) {
                const propName = nameMatch[1];
                const typeMatch = prop.match(/type:\s*['"`](\w+)['"`]/);
                const descMatch = prop.match(/description:\s*['"`]([^'"`]+)['"`]/);
                
                properties[propName] = {
                    type: typeMatch ? typeMatch[1] : 'unknown',
                    description: descMatch ? descMatch[1] : 'No description'
                };
            }
        }
    }
    
    return properties;
}

/**
 * Generate API documentation
 */
function generateApiDocs(tools) {
    const categories = organizeToolsByCategory(tools);
    
    let markdown = `# ClickUp MCP Server API Documentation

*Generated on ${new Date().toISOString()}*

This document provides comprehensive API documentation for all tools available in the ClickUp MCP Server.

## Overview

The ClickUp MCP Server provides ${tools.length} tools organized into ${Object.keys(categories).length} main categories:

${Object.keys(categories).map(category => `- **${category}**: ${categories[category].length} tools`).join('\n')}

---

`;

    // Generate documentation for each category
    for (const [category, categoryTools] of Object.entries(categories)) {
        markdown += generateCategoryDocs(category, categoryTools);
    }
    
    // Add appendix
    markdown += generateAppendix();
    
    return markdown;
}

/**
 * Organize tools by category
 */
function organizeToolsByCategory(tools) {
    const categories = {};
    
    for (const tool of tools) {
        let category = 'General';
        
        if (tool.name.includes('task') || tool.filePath.includes('task')) {
            category = 'Task Management';
        } else if (tool.name.includes('workspace') || tool.filePath.includes('workspace')) {
            category = 'Workspace Operations';
        } else if (tool.name.includes('list') || tool.filePath.includes('list')) {
            category = 'List Management';
        } else if (tool.name.includes('folder') || tool.filePath.includes('folder')) {
            category = 'Folder Management';
        } else if (tool.name.includes('tag') || tool.filePath.includes('tag')) {
            category = 'Tag Management';
        } else if (tool.name.includes('member') || tool.filePath.includes('member')) {
            category = 'Member Management';
        }
        
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(tool);
    }
    
    return categories;
}

/**
 * Generate documentation for a category
 */
function generateCategoryDocs(category, tools) {
    let markdown = `## ${category}

${tools.length} tool${tools.length > 1 ? 's' : ''} available in this category.

`;

    for (const tool of tools) {
        markdown += generateToolDocs(tool);
    }
    
    return markdown;
}

/**
 * Generate documentation for a single tool
 */
function generateToolDocs(tool) {
    let markdown = `### ${tool.name}

**Description:** ${tool.description}

**Tool Definition:** \`${tool.toolName}\`

**Source:** \`${tool.filePath}\`

`;

    // Add parameters if available
    if (tool.inputSchema.properties && Object.keys(tool.inputSchema.properties).length > 0) {
        markdown += `**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
`;
        
        for (const [paramName, paramInfo] of Object.entries(tool.inputSchema.properties)) {
            markdown += `| \`${paramName}\` | \`${paramInfo.type}\` | ${paramInfo.description} |\n`;
        }
        
        markdown += '\n';
    } else {
        markdown += `**Parameters:** None required\n\n`;
    }
    
    // Add usage example
    markdown += `**Example Usage:**
\`\`\`json
{
  "method": "tools/call",
  "params": {
    "name": "${tool.name}"${tool.inputSchema.properties ? ',\n    "arguments": {\n      // Add required parameters here\n    }' : ''}
  }
}
\`\`\`

---

`;
    
    return markdown;
}

/**
 * Generate appendix
 */
function generateAppendix() {
    return `## Appendix

### Tool Categories Overview

The ClickUp MCP Server tools are organized into logical categories to help you navigate and understand the available functionality:

1. **Task Management**: Core task operations including CRUD operations, bulk operations, and task querying
2. **Workspace Operations**: Workspace hierarchy, member management, and workspace-wide task operations  
3. **List Management**: List creation, modification, and querying
4. **Folder Management**: Folder operations and organization
5. **Tag Management**: Tag creation and assignment
6. **Member Management**: User and team member operations

### Authentication

All tools require a valid ClickUp API token to be configured in your environment or passed via the authentication mechanism defined in your MCP client setup.

### Error Handling

All tools return structured responses with appropriate error messages when operations fail. Common error scenarios include:

- Invalid or missing API tokens
- Insufficient permissions
- Resource not found
- API rate limiting
- Network connectivity issues

### Rate Limiting

The ClickUp API has rate limiting in place. The server implements appropriate retry logic and error handling for rate-limited requests.

---

*Generated by ClickUp MCP Server API Documentation Generator*
*Project: ${JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')).name}*
*Version: ${JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')).version}*
`;
}

/**
 * Main execution
 */
async function main() {
    try {
        console.log('🚀 Generating API documentation...');
        
        const tools = await extractToolDefinitions();
        console.log(`📋 Found ${tools.length} tools`);
        
        const apiDocs = generateApiDocs(tools);
        
        const outputPath = path.join(projectRoot, 'docs', 'api-reference.md');
        
        // Ensure docs directory exists
        const docsDir = path.dirname(outputPath);
        if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
        }
        
        fs.writeFileSync(outputPath, apiDocs);
        
        console.log(`✅ API documentation generated at: ${outputPath}`);
        console.log(`📊 Documentation includes ${tools.length} tools across ${Object.keys(organizeToolsByCategory(tools)).length} categories`);
        
    } catch (error) {
        console.error('❌ Error generating API documentation:', error);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { extractToolDefinitions, generateApiDocs };

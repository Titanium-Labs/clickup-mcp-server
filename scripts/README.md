# Documentation Generation Scripts

This directory contains automated scripts for generating reference documentation and development artifacts for the ClickUp MCP Server project.

## 📋 Available Scripts

### 1. API Documentation Generator (`generate-api-docs.js`)

**Purpose**: Automatically extracts tool schemas from TypeScript source files and generates comprehensive API documentation.

**Features**:
- Scans all TypeScript files in the `src/tools` directory
- Extracts tool definitions, descriptions, and input schemas
- Organizes tools by category (Task Management, Workspace Operations, etc.)
- Generates detailed Markdown documentation with usage examples
- Includes parameter tables and JSON examples

**Usage**:
```bash
node scripts/generate-api-docs.js
# or
npm run docs:api
```

**Output**: `docs/api-reference.md`

### 2. Architecture Diagrams Generator (`generate-diagrams.js`)

**Purpose**: Creates Mermaid diagrams showing system architecture and operation flows.

**Features**:
- System overview diagram with component layers
- Task operation sequence diagrams
- Data flow and request processing diagrams
- Error handling flow diagrams
- Compatible with GitHub, VS Code, and Mermaid Live Editor

**Usage**:
```bash
node scripts/generate-diagrams.js  
# or
npm run docs:diagrams
```

**Output**: `docs/architecture-diagrams.md`

### 3. Complete Documentation Generator (`generate-all-docs.js`)

**Purpose**: Orchestrates all documentation generation and provides comprehensive reporting.

**Features**:
- Runs all documentation generators sequentially
- Provides progress tracking and error handling
- Generates summary report with file statistics
- Includes usage instructions and maintenance notes
- Validates all generated artifacts

**Usage**:
```bash
node scripts/generate-all-docs.js
# or  
npm run docs:all
# or
npm run docs
```

**Output**: 
- `docs/api-reference.md`
- `docs/architecture-diagrams.md`
- `docs/reference-artifacts-summary.md`

## 🚀 Quick Start

### Generate All Documentation
```bash
# Install dependencies first (if not already done)
npm install

# Generate all documentation
npm run docs
```

### Generate Specific Documentation
```bash
# API documentation only
npm run docs:api

# Architecture diagrams only
npm run docs:diagrams
```

## 📁 Output Structure

After running the generators, you'll have:

```
docs/
├── api-reference.md              # Complete API documentation
├── architecture-diagrams.md     # Mermaid architecture diagrams
└── reference-artifacts-summary.md # Generation report and usage guide
```

## 🛠️ VS Code Integration

The project includes a pre-configured VS Code workspace (`clickup-mcp-server.code-workspace`) with:

- **Tasks**: Run generators via Command Palette (Ctrl+Shift+P → "Tasks: Run Task")
- **Launch Configurations**: Debug and test the generators
- **Path Aliases**: Easy navigation with `@services`, `@tools`, etc.
- **Extension Recommendations**: Mermaid preview, Markdown tools, etc.

### VS Code Tasks Available:
- Generate API Docs
- Generate Diagrams  
- Generate All Documentation
- Build Project
- Start Development
- Clean Build

## 🔧 Development

### Adding New Tools

When you add new tools to the codebase:

1. Follow the existing tool pattern in `src/tools/`
2. Export tool definitions as `*Tool: Tool = {...}`
3. Re-run documentation generation: `npm run docs`
4. The generators will automatically detect and include new tools

### Modifying Generators

The generators are designed to be maintainable and extensible:

- **API Generator**: Modify `parseToolsFromFile()` to enhance tool extraction
- **Diagram Generator**: Add new diagram types in `generateCompleteDiagrams()`
- **VS Code Workspace**: Update settings in `clickup-mcp-server.code-workspace`

### Testing Generators

Each generator can be run independently for testing:

```bash
# Test API documentation generator
node scripts/generate-api-docs.js

# Test diagram generator  
node scripts/generate-diagrams.js

# Test complete workflow
node scripts/generate-all-docs.js
```

## 📊 Features Overview

| Feature | API Docs | Diagrams | VS Code Workspace | Summary Report |
|---------|----------|----------|------------------|----------------|
| Tool Extraction | ✅ | ❌ | ❌ | ✅ |
| Architecture Overview | ❌ | ✅ | ❌ | ✅ |
| Development Setup | ❌ | ❌ | ✅ | ✅ |
| Usage Instructions | ✅ | ✅ | ✅ | ✅ |
| Auto-Generated | ✅ | ✅ | ❌ | ✅ |
| GitHub Compatible | ✅ | ✅ | ❌ | ✅ |

## 🔄 Maintenance

### Recommended Update Schedule

- **After adding new tools**: Run `npm run docs`
- **After architectural changes**: Update diagram generator and run `npm run docs:diagrams`
- **Before releases**: Run `npm run docs` to ensure documentation is current
- **Weekly/Monthly**: Review and update documentation for accuracy

### CI/CD Integration

Consider adding documentation generation to your CI/CD pipeline:

```yaml
# Example GitHub Actions step
- name: Generate Documentation
  run: npm run docs
  
- name: Commit Documentation
  run: |
    git add docs/
    git commit -m "docs: update generated documentation" || exit 0
    git push
```

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot find module" errors**: Ensure you're running from the project root
2. **Permission denied**: Make sure scripts have execute permissions
3. **Empty documentation**: Check that TypeScript files follow the expected tool pattern
4. **Mermaid not rendering**: Verify syntax using [Mermaid Live Editor](https://mermaid.live/)

### Debug Mode

For debugging, you can modify the generators to add more verbose logging:

```javascript
// Add at the top of any generator
const DEBUG = process.env.DEBUG === 'true';
if (DEBUG) console.log('Debug info:', ...);
```

Then run:
```bash
DEBUG=true node scripts/generate-api-docs.js
```

## 📚 References

- [Mermaid Documentation](https://mermaid.js.org/)
- [VS Code Workspace Settings](https://code.visualstudio.com/docs/editor/multi-root-workspaces)
- [TypeScript AST Explorer](https://ts-ast-viewer.com/) - For advanced tool parsing
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP specification

---

*Generated documentation scripts for the ClickUp MCP Server project*

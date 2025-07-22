#!/usr/bin/env node

/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 * 
 * Mermaid Diagram Generator
 * 
 * Generates architecture diagrams and sequence flows for the ClickUp MCP Server
 * using Mermaid diagram syntax.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Generate system architecture diagram
 */
function generateArchitectureDiagram() {
    return `# ClickUp MCP Server Architecture

## System Overview

\`\`\`mermaid
graph TB
    %% Client Layer
    subgraph "Client Layer"
        AI[AI Assistant/LLM]
        Client[MCP Client]
    end
    
    %% MCP Protocol Layer
    subgraph "MCP Protocol"
        Transport[Transport Layer]
        Protocol[MCP Protocol Handler]
    end
    
    %% Server Core
    subgraph "ClickUp MCP Server"
        Server[MCP Server Core]
        Security[Security Middleware]
        Logger[Logging System]
        Config[Configuration Manager]
    end
    
    %% Services Layer
    subgraph "Services Layer"
        WorkspaceService[Workspace Service]
        TaskService[Task Service]
        ListService[List Service]
        FolderService[Folder Service]
        TagService[Tag Service]
        BulkService[Bulk Operations]
        TimeService[Time Tracking]
    end
    
    %% Tools Layer
    subgraph "Tools Layer"
        WorkspaceTools[Workspace Tools]
        TaskTools[Task Tools]
        ListTools[List Tools]
        FolderTools[Folder Tools]
        TagTools[Tag Tools]
        MemberTools[Member Tools]
    end
    
    %% External APIs
    subgraph "External Services"
        ClickUpAPI[ClickUp REST API]
        SponsorAPI[Sponsor Service API]
    end
    
    %% Utilities
    subgraph "Utilities"
        ConcurrencyUtils[Concurrency Utils]
        DateUtils[Date Utils]
        ColorProcessor[Color Processor]
        TokenUtils[Token Utils]
    end
    
    %% Connections
    AI --> Client
    Client --> Transport
    Transport --> Protocol
    Protocol --> Server
    Server --> Security
    Server --> Logger
    Server --> Config
    
    Server --> WorkspaceService
    Server --> TaskService
    Server --> ListService
    Server --> FolderService
    Server --> TagService
    Server --> BulkService
    Server --> TimeService
    
    WorkspaceService --> WorkspaceTools
    TaskService --> TaskTools
    ListService --> ListTools
    FolderService --> FolderTools
    TagService --> TagTools
    TaskService --> MemberTools
    
    WorkspaceService --> ClickUpAPI
    TaskService --> ClickUpAPI
    ListService --> ClickUpAPI
    FolderService --> ClickUpAPI
    TagService --> ClickUpAPI
    BulkService --> ClickUpAPI
    TimeService --> ClickUpAPI
    
    Server --> SponsorAPI
    
    TaskService --> ConcurrencyUtils
    BulkService --> ConcurrencyUtils
    TaskService --> DateUtils
    TimeService --> DateUtils
    TaskService --> ColorProcessor
    Server --> TokenUtils
    
    classDef clientLayer fill:#e1f5fe
    classDef protocolLayer fill:#f3e5f5
    classDef serverCore fill:#e8f5e8
    classDef servicesLayer fill:#fff3e0
    classDef toolsLayer fill:#fce4ec
    classDef externalLayer fill:#f1f8e9
    classDef utilsLayer fill:#f5f5f5
    
    class AI,Client clientLayer
    class Transport,Protocol protocolLayer
    class Server,Security,Logger,Config serverCore
    class WorkspaceService,TaskService,ListService,FolderService,TagService,BulkService,TimeService servicesLayer
    class WorkspaceTools,TaskTools,ListTools,FolderTools,TagTools,MemberTools toolsLayer
    class ClickUpAPI,SponsorAPI externalLayer
    class ConcurrencyUtils,DateUtils,ColorProcessor,TokenUtils utilsLayer
\`\`\`

## Component Layers

### 1. Client Layer
- **AI Assistant/LLM**: The AI model that interacts with the MCP server
- **MCP Client**: The client implementation handling MCP protocol communication

### 2. MCP Protocol Layer
- **Transport Layer**: Handles communication transport (stdio, SSE, WebSocket)
- **MCP Protocol Handler**: Manages MCP message parsing and validation

### 3. Server Core
- **MCP Server Core**: Main server orchestrator and request router
- **Security Middleware**: Authentication, authorization, and security validation
- **Logging System**: Centralized logging with different log levels
- **Configuration Manager**: Environment and runtime configuration management

### 4. Services Layer
- **Workspace Service**: Workspace hierarchy and member management
- **Task Service**: Core task CRUD operations and querying
- **List Service**: List management and operations
- **Folder Service**: Folder organization and management
- **Tag Service**: Tag creation and assignment operations
- **Bulk Operations**: Batch processing for multiple operations
- **Time Tracking**: Time entry management and tracking

### 5. Tools Layer
- **Tool Definitions**: MCP tool schema definitions for each category
- **Tool Handlers**: Implementation logic for each tool operation

### 6. External Services
- **ClickUp REST API**: Official ClickUp API for all data operations
- **Sponsor Service API**: Optional sponsorship and attribution service

### 7. Utilities
- **Concurrency Utils**: Batch processing and concurrent operation helpers
- **Date Utils**: Date parsing, formatting, and validation
- **Color Processor**: Color code processing and validation
- **Token Utils**: API token management and validation

`;
}

/**
 * Generate task operation sequence diagram
 */
function generateTaskSequenceDiagram() {
    return `## Task Operation Sequence Flows

### Create Task Flow

\`\`\`mermaid
sequenceDiagram
    participant Client as MCP Client
    participant Server as MCP Server
    participant Security as Security Middleware
    participant TaskTool as Task Tool Handler
    participant TaskService as Task Service
    participant ClickUp as ClickUp API
    participant Sponsor as Sponsor Service
    
    Client->>Server: create_task request
    Server->>Security: validate_request()
    Security->>Server: validation_result
    
    alt Valid Request
        Server->>TaskTool: handleCreateTask(params)
        TaskTool->>TaskService: createTask(taskData)
        
        TaskService->>TaskService: validateTaskData()
        TaskService->>ClickUp: POST /task
        ClickUp->>TaskService: task_response
        
        TaskService->>TaskTool: created_task
        TaskTool->>Sponsor: createResponse(task, showSponsor)
        Sponsor->>TaskTool: formatted_response
        TaskTool->>Server: success_response
        Server->>Client: task_created_response
    else Invalid Request
        Security->>Server: error_response
        Server->>Client: validation_error
    end
\`\`\`

### Bulk Task Operations Flow

\`\`\`mermaid
sequenceDiagram
    participant Client as MCP Client
    participant Server as MCP Server
    participant BulkTool as Bulk Task Tool
    participant TaskService as Task Service
    participant ConcUtils as Concurrency Utils
    participant ClickUp as ClickUp API
    
    Client->>Server: create_bulk_tasks request
    Server->>BulkTool: handleCreateBulkTasks(params)
    BulkTool->>TaskService: createBulkTasks(tasksData)
    
    TaskService->>ConcUtils: processBatch(tasks, createTask)
    
    loop For Each Task Batch
        ConcUtils->>TaskService: createTask(taskData)
        TaskService->>ClickUp: POST /task
        ClickUp->>TaskService: task_response
        TaskService->>ConcUtils: result
    end
    
    ConcUtils->>TaskService: batch_results
    TaskService->>BulkTool: BatchResult{successful, failed, totals}
    BulkTool->>Server: formatted_batch_response
    Server->>Client: bulk_operation_response
\`\`\`

### Workspace Hierarchy Flow

\`\`\`mermaid
sequenceDiagram
    participant Client as MCP Client
    participant Server as MCP Server
    participant WSTool as Workspace Tool
    participant WSService as Workspace Service
    participant ClickUp as ClickUp API
    
    Client->>Server: get_workspace_hierarchy request
    Server->>WSTool: handleGetWorkspaceHierarchy()
    WSTool->>WSService: getWorkspaceHierarchy()
    
    WSService->>ClickUp: GET /team (workspaces)
    ClickUp->>WSService: workspaces_response
    
    loop For Each Workspace
        WSService->>ClickUp: GET /space
        ClickUp->>WSService: spaces_response
        
        loop For Each Space
            WSService->>ClickUp: GET /folder
            ClickUp->>WSService: folders_response
            
            loop For Each Folder
                WSService->>ClickUp: GET /list
                ClickUp->>WSService: lists_response
            end
        end
    end
    
    WSService->>WSService: buildHierarchyTree()
    WSService->>WSTool: WorkspaceTree
    WSTool->>WSTool: formatTreeOutput()
    WSTool->>Server: formatted_hierarchy
    Server->>Client: hierarchy_response
\`\`\`

`;
}

/**
 * Generate data flow diagram
 */
function generateDataFlowDiagram() {
    return `## Data Flow Architecture

### MCP Request Processing Flow

\`\`\`mermaid
flowchart TD
    A[MCP Client Request] --> B{Request Type}
    
    B -->|Tool Call| C[Tool Validation]
    B -->|Resource Request| D[Resource Handler]
    B -->|Prompt Request| E[Prompt Handler]
    
    C --> F{Authentication}
    F -->|Valid| G[Tool Router]
    F -->|Invalid| H[Authentication Error]
    
    G --> I{Tool Category}
    I -->|Task| J[Task Tool Handler]
    I -->|Workspace| K[Workspace Tool Handler]  
    I -->|List| L[List Tool Handler]
    I -->|Folder| M[Folder Tool Handler]
    I -->|Tag| N[Tag Tool Handler]
    I -->|Member| O[Member Tool Handler]
    
    J --> P[Task Service]
    K --> Q[Workspace Service]
    L --> R[List Service]
    M --> S[Folder Service]
    N --> T[Tag Service]
    O --> U[Member Service]
    
    P --> V[ClickUp API Call]
    Q --> V
    R --> V
    S --> V
    T --> V
    U --> V
    
    V --> W{API Response}
    W -->|Success| X[Format Response]
    W -->|Error| Y[Error Handler]
    
    X --> Z[Sponsor Service]
    Z --> AA[Final Response]
    
    Y --> BB[Error Response]
    H --> BB
    
    AA --> CC[MCP Client Response]
    BB --> CC
    
    D --> DD[Resource Response]
    E --> EE[Prompt Response]
    DD --> CC
    EE --> CC
    
    classDef requestFlow fill:#e3f2fd
    classDef validation fill:#f3e5f5
    classDef handlers fill:#e8f5e8
    classDef services fill:#fff3e0
    classDef external fill:#f1f8e9
    classDef response fill:#fce4ec
    classDef error fill:#ffebee
    
    class A,CC requestFlow
    class B,C,F validation
    class G,I,J,K,L,M,N,O handlers
    class P,Q,R,S,T,U services
    class V,Z external
    class X,AA,DD,EE response
    class H,Y,BB error
\`\`\`

### Error Handling Flow

\`\`\`mermaid
flowchart TD
    A[Operation Start] --> B{Try Operation}
    
    B -->|Success| C[Format Success Response]
    B -->|Error| D[Error Handler]
    
    D --> E{Error Type}
    E -->|Authentication| F[Auth Error Response]
    E -->|Validation| G[Validation Error Response]
    E -->|API Error| H[API Error Response]
    E -->|Network| I[Network Error Response]
    E -->|Unknown| J[Generic Error Response]
    
    F --> K[Log Error]
    G --> K
    H --> K
    I --> K
    J --> K
    
    K --> L[Sponsor Error Response]
    C --> M[Sponsor Success Response]
    
    L --> N[Return to Client]
    M --> N
    
    classDef operation fill:#e8f5e8
    classDef success fill:#e8f5e8
    classDef error fill:#ffebee
    classDef logging fill:#f5f5f5
    classDef response fill:#fce4ec
    
    class A,B operation
    class C,M success
    class D,E,F,G,H,I,J error
    class K,L logging
    class N response
\`\`\`

`;
}

/**
 * Generate complete diagram documentation
 */
function generateCompleteDiagrams() {
    const architecture = generateArchitectureDiagram();
    const sequences = generateTaskSequenceDiagram();
    const dataFlow = generateDataFlowDiagram();
    
    return `${architecture}

${sequences}

${dataFlow}

## Diagram Usage

These Mermaid diagrams can be rendered in:

1. **GitHub**: Native Mermaid support in markdown files
2. **VS Code**: Using Mermaid Preview extension
3. **Mermaid Live Editor**: https://mermaid.live/
4. **Documentation Sites**: GitBook, Notion, etc.

## Diagram Types Included

1. **System Architecture**: High-level component overview and relationships
2. **Sequence Diagrams**: Request/response flows for key operations
3. **Data Flow Diagrams**: Request processing and error handling flows

## Maintenance Notes

- Update diagrams when major architectural changes occur
- Validate diagram syntax using Mermaid Live Editor
- Keep diagrams synchronized with actual codebase structure
- Consider generating diagrams programmatically from code analysis

---

*Generated by ClickUp MCP Server Diagram Generator*
*Date: ${new Date().toISOString()}*
`;
}

/**
 * Main execution function
 */
async function main() {
    try {
        console.log('🎨 Generating Mermaid diagrams...');
        
        const diagrams = generateCompleteDiagrams();
        
        const outputPath = path.join(projectRoot, 'docs', 'architecture-diagrams.md');
        
        // Ensure docs directory exists
        const docsDir = path.dirname(outputPath);
        if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
        }
        
        fs.writeFileSync(outputPath, diagrams);
        
        console.log(`✅ Architecture diagrams generated at: ${outputPath}`);
        console.log('📊 Generated diagrams:');
        console.log('   - System Architecture Overview');
        console.log('   - Task Operation Sequence Flows');
        console.log('   - Data Flow Architecture');
        console.log('   - Error Handling Flow');
        
    } catch (error) {
        console.error('❌ Error generating diagrams:', error);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { generateArchitectureDiagram, generateTaskSequenceDiagram, generateDataFlowDiagram, generateCompleteDiagrams };

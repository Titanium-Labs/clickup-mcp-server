# MCP Tools Enumeration and Classification

**Total Tools Found: 44 tools** (README claims 36 tools - discrepancy noted)

## Summary by Category

| Category | Count | Tools |
|----------|-------|-------|
| **Task Management** | 14 | create_task, get_task, get_tasks, update_task, move_task, duplicate_task, delete_task, get_task_comments, create_task_comment, create_bulk_tasks, update_bulk_tasks, move_bulk_tasks, delete_bulk_tasks, get_workspace_tasks |
| **Workspace Navigation** | 1 | get_workspace_hierarchy |
| **List Management** | 5 | create_list, create_list_in_folder, get_list, update_list, delete_list |
| **Folder Management** | 4 | create_folder, get_folder, update_folder, delete_folder |
| **Tag Management** | 6 | get_space_tags, create_space_tag, update_space_tag, delete_space_tag, add_tag_to_task, remove_tag_from_task |
| **Time Tracking** | 6 | get_task_time_entries, start_time_tracking, stop_time_tracking, add_time_entry, delete_time_entry, get_current_time_entry |
| **Member Management** | 3 | get_workspace_members, find_member_by_name, resolve_assignees |
| **Document Management** | 6 | create_document, get_document, list_documents, list_document_pages, get_document_pages, create_document_page, update_document_page |
| **File Attachments** | 1 | attach_task_file |

## Complete Tools Table

| Tool Name | Category | Handler Function | Required Parameters | Feature Flags | Description |
|-----------|----------|------------------|-------------------|---------------|-------------|
| **get_workspace_hierarchy** | Workspace Navigation | handleGetWorkspaceHierarchy | None | None | Gets complete workspace structure (spaces, folders, lists) |
| **create_task** | Task Management | createTaskHandler | name, (listId/listName) | None | Creates a single task in a ClickUp list |
| **get_task** | Task Management | getTaskHandler | (taskId/(taskName+listName)) | None | Gets task details by ID or name |
| **get_tasks** | Task Management | getTasksHandler | (listId/listName) | None | Retrieve tasks from a list with optional filtering |
| **update_task** | Task Management | updateTaskHandler | (taskId/(taskName+listName)) + at least one update field | None | Updates task properties |
| **move_task** | Task Management | moveTaskHandler | (taskId/(taskName+sourceListName)) + (listId/listName) | None | Moves task to different list |
| **duplicate_task** | Task Management | duplicateTaskHandler | (taskId/(taskName+sourceListName)) | None | Creates copy of task in same/different list |
| **delete_task** | Task Management | deleteTaskHandler | (taskId/(taskName+listName)) | None | PERMANENTLY deletes task |
| **get_task_comments** | Task Management | getTaskCommentsHandler | (taskId/(taskName+listName)) | None | Gets task comments with pagination |
| **create_task_comment** | Task Management | createTaskCommentHandler | commentText + (taskId/(taskName+listName)) | None | Creates task comment |
| **create_bulk_tasks** | Task Management | createBulkTasksHandler | tasks[] + (listId/listName) | None | Creates multiple tasks in one list |
| **update_bulk_tasks** | Task Management | updateBulkTasksHandler | tasks[] (with taskId/taskName) | None | Updates multiple tasks efficiently |
| **move_bulk_tasks** | Task Management | moveBulkTasksHandler | tasks[] + (listId/listName) | None | Moves multiple tasks |
| **delete_bulk_tasks** | Task Management | deleteBulkTasksHandler | tasks[] | None | PERMANENTLY deletes multiple tasks |
| **get_workspace_tasks** | Task Management | getWorkspaceTasksHandler | At least one filter (tags, list_ids, etc.) | None | Retrieve tasks from across entire workspace with filtering |
| **create_list** | List Management | handleCreateList | name + (spaceId/spaceName) | None | Creates list directly in a space |
| **create_list_in_folder** | List Management | handleCreateListInFolder | name + (folderId/(folderName+spaceId/spaceName)) | None | Creates list within a folder |
| **get_list** | List Management | handleGetList | (listId/listName) | None | Gets details of a ClickUp list |
| **update_list** | List Management | handleUpdateList | (listId/listName) + at least one update field | None | Updates list properties |
| **delete_list** | List Management | handleDeleteList | (listId/listName) | None | PERMANENTLY deletes list and all tasks |
| **create_folder** | Folder Management | handleCreateFolder | name + (spaceId/spaceName) | None | Creates folder in ClickUp space |
| **get_folder** | Folder Management | handleGetFolder | (folderId/(folderName+spaceId/spaceName)) | None | Gets folder details |
| **update_folder** | Folder Management | handleUpdateFolder | (folderId/(folderName+spaceId/spaceName)) + update fields | None | Updates folder properties |
| **delete_folder** | Folder Management | handleDeleteFolder | (folderId/(folderName+spaceId/spaceName)) | None | PERMANENTLY deletes folder and contents |
| **get_space_tags** | Tag Management | handleGetSpaceTags | (spaceId/spaceName) | None | Gets all tags in a ClickUp space |
| **create_space_tag** | Tag Management | handleCreateSpaceTag | tagName + (spaceId/spaceName) | None | Creates new tag in space |
| **update_space_tag** | Tag Management | handleUpdateSpaceTag | tagName + (spaceId/spaceName) + update fields | None | Updates existing tag in space |
| **delete_space_tag** | Tag Management | handleDeleteSpaceTag | tagName + (spaceId/spaceName) | None | Deletes tag from space |
| **add_tag_to_task** | Tag Management | handleAddTagToTask | tagName + (taskId/(taskName+listName)) | None | Adds existing tag to task |
| **remove_tag_from_task** | Tag Management | handleRemoveTagFromTask | tagName + (taskId/(taskName+listName)) | None | Removes tag from task |
| **get_task_time_entries** | Time Tracking | handleGetTaskTimeEntries | (taskId/(taskName+listName)) | None | Gets all time entries for a task |
| **start_time_tracking** | Time Tracking | handleStartTimeTracking | (taskId/(taskName+listName)) | None | Starts time tracking on a task |
| **stop_time_tracking** | Time Tracking | handleStopTimeTracking | None | None | Stops currently running time tracker |
| **add_time_entry** | Time Tracking | handleAddTimeEntry | (taskId/(taskName+listName)) + start + duration | None | Adds manual time entry to task |
| **delete_time_entry** | Time Tracking | handleDeleteTimeEntry | timeEntryId | None | Deletes a time entry |
| **get_current_time_entry** | Time Tracking | handleGetCurrentTimeEntry | None | None | Gets currently running time entry |
| **get_workspace_members** | Member Management | handleGetWorkspaceMembers | None | None | Returns all members in workspace |
| **find_member_by_name** | Member Management | handleFindMemberByName | nameOrEmail | None | Finds member by name or email |
| **resolve_assignees** | Member Management | handleResolveAssignees | assignees[] | None | Resolves assignee names/emails to user IDs |
| **attach_task_file** | File Attachments | handleAttachTaskFile | (taskId/(taskName+listName)) + file source | None | Attaches file to task (base64/URL/local path) |
| **create_document** | Document Management | handleCreateDocument | name + parent + visibility + create_page | `DOCUMENT_SUPPORT=true` | Creates document in space/folder/list |
| **get_document** | Document Management | handleGetDocument | documentId | `DOCUMENT_SUPPORT=true` | Gets details of a document |
| **list_documents** | Document Management | handleListDocuments | Optional filters | `DOCUMENT_SUPPORT=true` | Lists documents with filtering |
| **list_document_pages** | Document Management | handleListDocumentPages | documentId | `DOCUMENT_SUPPORT=true` | Lists all pages in a document |
| **get_document_pages** | Document Management | handleGetDocumentPages | documentId + pageIds[] | `DOCUMENT_SUPPORT=true` | Gets content of specific document pages |
| **create_document_page** | Document Management | handleCreateDocumentPage | documentId + name | `DOCUMENT_SUPPORT=true` | Creates new page in document |
| **update_document_page** | Document Management | handleUpdateDocumentPage | documentId + pageId | `DOCUMENT_SUPPORT=true` | Updates existing document page |

## Feature Flags Identified

| Feature Flag | Environment Variable | Default Value | Gated Tools |
|--------------|---------------------|---------------|-------------|
| **Document Support** | `DOCUMENT_SUPPORT` | `false` | All 7 document management tools |

## Tool Filtering Configuration

The server supports tool filtering via environment variables:
- `ENABLED_TOOLS`: Comma-separated list of tools to enable (takes precedence)
- `DISABLED_TOOLS`: Comma-separated list of tools to disable (ignored if ENABLED_TOOLS is set)

## Discrepancies Found

1. **Tool Count Mismatch**: 
   - README claims: 36 tools
   - Actually found: 44 tools
   - Difference: +8 tools

2. **Document Tools Missing from README Count**:
   - 7 document management tools (create_document, get_document, list_documents, list_document_pages, get_document_pages, create_document_page, update_document_page) appear to not be counted in the README's "36 tools"
   - This suggests the README count predates the document management feature

3. **Handler Function Patterns**:
   - Most task tools: Located in `src/tools/task/handlers.js`
   - Workspace tools: Direct handler functions (e.g., `handleGetWorkspaceHierarchy`)
   - Other tools: Handler functions in their respective module files
   - Consistent naming pattern: `handle[ToolName]` for most tools

## Zod Schema Analysis

All tools use TypeScript interfaces and JSON schema validation rather than Zod schemas. The input validation is handled through:
- JSON Schema definitions in `inputSchema` properties
- Custom validation functions in utility modules (e.g., `validateTaskIdentification`, `validateBulkTasks`)
- Service-layer validation in ClickUp API service classes

## Architecture Notes

The tools are well-organized with:
- **Modular structure**: Each category has its own file (task/, workspace.ts, list.ts, etc.)
- **Shared utilities**: Common validation and formatting functions
- **Service abstraction**: Tools use shared service instances for ClickUp API calls
- **Error handling**: Consistent error response formatting via `sponsorService`
- **Sponsor integration**: All responses go through sponsor service for optional sponsor messages

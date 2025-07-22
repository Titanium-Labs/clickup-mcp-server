/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * ClickUp MCP List Tools
 * 
 * This module defines list-related tools including creating, updating,
 * retrieving, and deleting lists. It supports creating lists both in spaces
 * and in folders.
 */

import { 
  CreateListData, 
  ClickUpList,
  CreateListFromTemplateData
} from '../services/clickup/types.js';
import { listService, workspaceService } from '../services/shared.js';
import config from '../config.js';
import { sponsorService } from '../utils/sponsor-service.js';

/**
 * Tool definition for creating a list directly in a space
 */
export const createListTool = {
  name: "create_list",
  description: `Creates a list in a ClickUp space. Use spaceId (preferred) or spaceName + list name. Name is required. For lists in folders, use create_list_in_folder. Optional: content, dueDate, priority, assignee, status.`,
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the list"
      },
      spaceId: {
        type: "string",
        description: "ID of the space to create the list in. Use this instead of spaceName if you have the ID."
      },
      spaceName: {
        type: "string",
        description: "Name of the space to create the list in. Alternative to spaceId - one of them MUST be provided."
      },
      content: {
        type: "string",
        description: "Description or content of the list"
      },
      dueDate: {
        type: "string",
        description: "Due date for the list (Unix timestamp in milliseconds)"
      },
      priority: {
        type: "number",
        description: "Priority level: 1 (urgent), 2 (high), 3 (normal), 4 (low)"
      },
      assignee: {
        type: "number",
        description: "User ID to assign the list to"
      },
      status: {
        type: "string",
        description: "Status of the list"
      }
    },
    required: ["name"]
  }
};

/**
 * Tool definition for creating a list within a folder
 */
export const createListInFolderTool = {
  name: "create_list_in_folder",
  description: `Creates a list in a ClickUp folder. Use folderId (preferred) or folderName + space info + list name. Name is required. When using folderName, spaceId/spaceName required as folder names may not be unique. Optional: content, status.`,
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the list"
      },
      folderId: {
        type: "string",
        description: "ID of the folder to create the list in. If you have this, you don't need folderName or space information."
      },
      folderName: {
        type: "string",
        description: "Name of the folder to create the list in. When using this, you MUST also provide either spaceName or spaceId."
      },
      spaceId: {
        type: "string",
        description: "ID of the space containing the folder. Required when using folderName instead of folderId."
      },
      spaceName: {
        type: "string", 
        description: "Name of the space containing the folder. Required when using folderName instead of folderId."
      },
      content: {
        type: "string",
        description: "Description or content of the list"
      },
      status: {
        type: "string",
        description: "Status of the list (uses folder default if not specified)"
      }
    },
    required: ["name"]
  }
};

/**
 * Tool definition for creating a list from a template in a folder
 */
export const createListFromTemplateTool = {
  name: "create_list_from_template",
  description: `Creates a list from a template in a ClickUp folder. Use folderId + templateId + list name. Supports date remapping and selective import of template features. Name and templateId required.`,
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the new list to be created"
      },
      templateId: {
        type: "string",
        description: "ID of the template to use for creating the list"
      },
      folderId: {
        type: "string",
        description: "ID of the folder to create the list in. If you have this, you don't need folderName or space information."
      },
      folderName: {
        type: "string",
        description: "Name of the folder to create the list in. When using this, you MUST also provide either spaceName or spaceId."
      },
      spaceId: {
        type: "string",
        description: "ID of the space containing the folder. Required when using folderName instead of folderId."
      },
      spaceName: {
        type: "string", 
        description: "Name of the space containing the folder. Required when using folderName instead of folderId."
      },
      return_immediately: {
        type: "boolean",
        description: "Return list ID immediately without waiting for full creation (default: true)"
      },
      content: {
        type: "string",
        description: "Description or content of the list"
      },
      time_estimate: {
        type: "number",
        description: "Include time (hours, minutes and seconds)"
      },
      automation: {
        type: "boolean",
        description: "Import automation settings from template"
      },
      include_views: {
        type: "boolean",
        description: "Import views from template"
      },
      old_due_date: {
        type: "boolean",
        description: "Import tasks' due dates from template"
      },
      old_start_date: {
        type: "boolean",
        description: "Import tasks' start dates from template"
      },
      old_followers: {
        type: "boolean",
        description: "Import tasks' watchers from template"
      },
      comment_attachments: {
        type: "boolean",
        description: "Import tasks' comment attachments from template"
      },
      recur_settings: {
        type: "boolean",
        description: "Import tasks' recurring settings from template"
      },
      old_tags: {
        type: "boolean",
        description: "Import tasks' tags from template"
      },
      old_statuses: {
        type: "boolean",
        description: "Import tasks' status settings from template"
      },
      subtasks: {
        type: "boolean",
        description: "Import tasks' subtasks from template"
      },
      custom_type: {
        type: "boolean",
        description: "Import tasks' task types from template"
      },
      old_assignees: {
        type: "boolean",
        description: "Import tasks' assignees from template"
      },
      attachments: {
        type: "boolean",
        description: "Import tasks' attachments from template"
      },
      comment: {
        type: "boolean",
        description: "Import tasks' comments from template"
      },
      old_status: {
        type: "boolean",
        description: "Import tasks' current statuses from template"
      },
      external_dependencies: {
        type: "boolean",
        description: "Import tasks' external dependencies from template"
      },
      internal_dependencies: {
        type: "boolean",
        description: "Import tasks' internal dependencies from template"
      },
      priority: {
        type: "boolean",
        description: "Import tasks' priorities from template"
      },
      custom_fields: {
        type: "boolean",
        description: "Import tasks' Custom Fields from template"
      },
      old_checklists: {
        type: "boolean",
        description: "Import tasks' checklists from template"
      },
      relationships: {
        type: "boolean",
        description: "Import tasks' relationships from template"
      },
      old_subtask_assignees: {
        type: "boolean",
        description: "Import tasks' subtask assignees from template"
      },
      start_date: {
        type: "string",
        description: "Project start date for remapping dates (ISO datetime format: YYYY-MM-DDTHH:mm:ss)"
      },
      due_date: {
        type: "string",
        description: "Project due date for remapping dates (ISO datetime format: YYYY-MM-DDTHH:mm:ss)"
      },
      remap_start_date: {
        type: "boolean",
        description: "Remap start dates based on project start/due dates"
      },
      skip_weekends: {
        type: "boolean",
        description: "Skip weekends when remapping dates"
      },
      archived: {
        type: "number",
        description: "Include archived tasks (0 or 1)"
      }
    },
    required: ["name", "templateId"]
  }
};

/**
 * Tool definition for retrieving list details
 */
export const getListTool = {
  name: "get_list",
  description: `Gets details of a ClickUp list. Use listId (preferred) or listName. Returns list details including name, content, and space info. ListId more reliable as names may not be unique.`,
  inputSchema: {
    type: "object",
    properties: {
      listId: {
        type: "string",
        description: "ID of the list to retrieve. Use this instead of listName if you have the ID."
      },
      listName: {
        type: "string",
        description: "Name of the list to retrieve. May be ambiguous if multiple lists have the same name."
      }
    },
    required: []
  }
};

/**
 * Tool definition for updating a list
 */
export const updateListTool = {
  name: "update_list",
  description: `Updates a ClickUp list. Use listId (preferred) or listName + at least one update field (name/content/status). ListId more reliable as names may not be unique. Only specified fields updated.`,
  inputSchema: {
    type: "object",
    properties: {
      listId: {
        type: "string",
        description: "ID of the list to update. Use this instead of listName if you have the ID."
      },
      listName: {
        type: "string",
        description: "Name of the list to update. May be ambiguous if multiple lists have the same name."
      },
      name: {
        type: "string",
        description: "New name for the list"
      },
      content: {
        type: "string",
        description: "New description or content for the list"
      },
      status: {
        type: "string",
        description: "New status for the list"
      }
    },
    required: []
  }
};

/**
 * Tool definition for deleting a list
 */
export const deleteListTool = {
  name: "delete_list",
  description: `PERMANENTLY deletes a ClickUp list and all its tasks. Use listId (preferred/safest) or listName. WARNING: Cannot be undone, all tasks will be deleted, listName risky if not unique.`,
  inputSchema: {
    type: "object",
    properties: {
      listId: {
        type: "string",
        description: "ID of the list to delete. Use this instead of listName if you have the ID."
      },
      listName: {
        type: "string",
        description: "Name of the list to delete. May be ambiguous if multiple lists have the same name."
      }
    },
    required: []
  }
};

/**
 * Helper function to find a list ID by name
 * Uses the ClickUp service's global list search functionality
 */
export async function findListIDByName(workspaceService: any, listName: string): Promise<{ id: string; name: string } | null> {
  // Use workspace service to find the list in the hierarchy
  const hierarchy = await workspaceService.getWorkspaceHierarchy();
  const listInfo = workspaceService.findIDByNameInHierarchy(hierarchy, listName, 'list');
  if (!listInfo) return null;
  return { id: listInfo.id, name: listName };
}

/**
 * Handler for the create_list tool
 * Creates a new list directly in a space
 */
export async function handleCreateList(parameters: any) {
  const { name, spaceId, spaceName, content, dueDate, priority, assignee, status } = parameters;
  
  // Validate required fields
  if (!name) {
    throw new Error("List name is required");
  }
  
  let targetSpaceId = spaceId;
  
  // If no spaceId but spaceName is provided, look up the space ID
  if (!targetSpaceId && spaceName) {
    const spaceIdResult = await workspaceService.findSpaceIDByName(spaceName);
    if (!spaceIdResult) {
      throw new Error(`Space "${spaceName}" not found`);
    }
    targetSpaceId = spaceIdResult;
  }
  
  if (!targetSpaceId) {
    throw new Error("Either spaceId or spaceName must be provided");
  }

  // Prepare list data
  const listData: CreateListData = {
    name
  };

  // Add optional fields if provided
  if (content) listData.content = content;
  if (dueDate) listData.due_date = parseInt(dueDate);
  if (priority) listData.priority = priority;
  if (assignee) listData.assignee = assignee;
  if (status) listData.status = status;

  try {
    // Create the list
    const newList = await listService.createList(targetSpaceId, listData);
    
    return sponsorService.createResponse({
      id: newList.id,
      name: newList.name,
      content: newList.content,
      space: {
        id: newList.space.id,
        name: newList.space.name
      },
      url: `https://app.clickup.com/${config.clickupTeamId}/v/l/${newList.id}`,
      message: `List "${name}" created successfully`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to create list: ${error.message}`);
  }
}

/**
 * Handler for the create_list_in_folder tool
 * Creates a new list inside a folder
 */
export async function handleCreateListInFolder(parameters: any) {
  const { name, folderId, folderName, spaceId, spaceName, content, status } = parameters;
  
  // Validate required fields
  if (!name) {
    throw new Error("List name is required");
  }
  
  let targetFolderId = folderId;
  
  // If no folderId but folderName is provided, look up the folder ID
  if (!targetFolderId && folderName) {
    let targetSpaceId = spaceId;
    
    // If no spaceId provided but spaceName is, look up the space ID first
    if (!targetSpaceId && spaceName) {
      const spaceIdResult = await workspaceService.findSpaceByName(spaceName);
      if (!spaceIdResult) {
        throw new Error(`Space "${spaceName}" not found`);
      }
      targetSpaceId = spaceIdResult.id;
    }
    
    if (!targetSpaceId) {
      throw new Error("When using folderName to identify a folder, you must also provide either spaceId or spaceName to locate the correct folder. This is because folder names might not be unique across different spaces.");
    }
    
    // Find the folder in the workspace hierarchy
    const hierarchy = await workspaceService.getWorkspaceHierarchy();
    const folderInfo = workspaceService.findIDByNameInHierarchy(hierarchy, folderName, 'folder');
    if (!folderInfo) {
      throw new Error(`Folder "${folderName}" not found in space`);
    }
    targetFolderId = folderInfo.id;
  }
  
  if (!targetFolderId) {
    throw new Error("Either folderId or folderName must be provided");
  }

  // Prepare list data
  const listData: CreateListData = {
    name
  };

  // Add optional fields if provided
  if (content) listData.content = content;
  if (status) listData.status = status;

  try {
    // Create the list in the folder
    const newList = await listService.createListInFolder(targetFolderId, listData);
    
    return sponsorService.createResponse({
      id: newList.id,
      name: newList.name,
      content: newList.content,
      folder: {
        id: newList.folder.id,
        name: newList.folder.name
      },
      space: {
        id: newList.space.id,
        name: newList.space.name
      },
      url: `https://app.clickup.com/${config.clickupTeamId}/v/l/${newList.id}`,
      message: `List "${name}" created successfully in folder "${newList.folder.name}"`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to create list in folder: ${error.message}`);
  }
}

/**
 * Handler for the create_list_from_template tool
 * Creates a new list from a template inside a folder
 */
export async function handleCreateListFromTemplate(parameters: any) {
  const { 
    name, templateId, folderId, folderName, spaceId, spaceName,
    return_immediately, content, time_estimate, automation, include_views,
    old_due_date, old_start_date, old_followers, comment_attachments,
    recur_settings, old_tags, old_statuses, subtasks, custom_type,
    old_assignees, attachments, comment, old_status, external_dependencies,
    internal_dependencies, priority, custom_fields, old_checklists,
    relationships, old_subtask_assignees, start_date, due_date,
    remap_start_date, skip_weekends, archived
  } = parameters;
  
  // Validate required fields
  if (!name) {
    throw new Error("List name is required");
  }
  if (!templateId) {
    throw new Error("Template ID is required");
  }
  
  let targetFolderId = folderId;
  
  // If no folderId but folderName is provided, look up the folder ID
  if (!targetFolderId && folderName) {
    let targetSpaceId = spaceId;
    
    // If no spaceId provided but spaceName is, look up the space ID first
    if (!targetSpaceId && spaceName) {
      const spaceIdResult = await workspaceService.findSpaceByName(spaceName);
      if (!spaceIdResult) {
        throw new Error(`Space "${spaceName}" not found`);
      }
      targetSpaceId = spaceIdResult.id;
    }
    
    if (!targetSpaceId) {
      throw new Error("When using folderName to identify a folder, you must also provide either spaceId or spaceName to locate the correct folder. This is because folder names might not be unique across different spaces.");
    }
    
    // Find the folder in the workspace hierarchy
    const hierarchy = await workspaceService.getWorkspaceHierarchy();
    const folderInfo = workspaceService.findIDByNameInHierarchy(hierarchy, folderName, 'folder');
    if (!folderInfo) {
      throw new Error(`Folder "${folderName}" not found in space`);
    }
    targetFolderId = folderInfo.id;
  }
  
  if (!targetFolderId) {
    throw new Error("Either folderId or folderName must be provided");
  }

  // Prepare list template data
  const listData: CreateListFromTemplateData = {
    name,
    options: {}
  };

  // Add all optional template options
  if (return_immediately !== undefined) listData.options!.return_immediately = return_immediately;
  if (content) listData.options!.content = content;
  if (time_estimate !== undefined) listData.options!.time_estimate = time_estimate;
  if (automation !== undefined) listData.options!.automation = automation;
  if (include_views !== undefined) listData.options!.include_views = include_views;
  if (old_due_date !== undefined) listData.options!.old_due_date = old_due_date;
  if (old_start_date !== undefined) listData.options!.old_start_date = old_start_date;
  if (old_followers !== undefined) listData.options!.old_followers = old_followers;
  if (comment_attachments !== undefined) listData.options!.comment_attachments = comment_attachments;
  if (recur_settings !== undefined) listData.options!.recur_settings = recur_settings;
  if (old_tags !== undefined) listData.options!.old_tags = old_tags;
  if (old_statuses !== undefined) listData.options!.old_statuses = old_statuses;
  if (subtasks !== undefined) listData.options!.subtasks = subtasks;
  if (custom_type !== undefined) listData.options!.custom_type = custom_type;
  if (old_assignees !== undefined) listData.options!.old_assignees = old_assignees;
  if (attachments !== undefined) listData.options!.attachments = attachments;
  if (comment !== undefined) listData.options!.comment = comment;
  if (old_status !== undefined) listData.options!.old_status = old_status;
  if (external_dependencies !== undefined) listData.options!.external_dependencies = external_dependencies;
  if (internal_dependencies !== undefined) listData.options!.internal_dependencies = internal_dependencies;
  if (priority !== undefined) listData.options!.priority = priority;
  if (custom_fields !== undefined) listData.options!.custom_fields = custom_fields;
  if (old_checklists !== undefined) listData.options!.old_checklists = old_checklists;
  if (relationships !== undefined) listData.options!.relationships = relationships;
  if (old_subtask_assignees !== undefined) listData.options!.old_subtask_assignees = old_subtask_assignees;
  if (start_date) listData.options!.start_date = start_date;
  if (due_date) listData.options!.due_date = due_date;
  if (remap_start_date !== undefined) listData.options!.remap_start_date = remap_start_date;
  if (skip_weekends !== undefined) listData.options!.skip_weekends = skip_weekends;
  if (archived !== undefined) listData.options!.archived = archived;

  try {
    // Create the list from template in the folder
    const newList = await listService.createListFromTemplate(targetFolderId, templateId, listData);
    
    return sponsorService.createResponse({
      id: newList.id,
      name: newList.name,
      content: newList.content,
      folder: {
        id: newList.folder?.id,
        name: newList.folder?.name
      },
      space: {
        id: newList.space.id,
        name: newList.space.name
      },
      url: `https://app.clickup.com/${config.clickupTeamId}/v/l/${newList.id}`,
      templateId,
      message: `List "${name}" created successfully from template in folder${newList.folder ? ` "${newList.folder.name}"` : ''}`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to create list from template: ${error.message}`);
  }
}

/**
 * Handler for the get_list tool
 * Retrieves details about a specific list
 */
export async function handleGetList(parameters: any) {
  const { listId, listName } = parameters;
  
  let targetListId = listId;
  
  // If no listId provided but listName is, look up the list ID
  if (!targetListId && listName) {
    const listResult = await findListIDByName(workspaceService, listName);
    if (!listResult) {
      throw new Error(`List "${listName}" not found`);
    }
    targetListId = listResult.id;
  }
  
  if (!targetListId) {
    throw new Error("Either listId or listName must be provided");
  }

  try {
    // Get the list
    const list = await listService.getList(targetListId);
    
    return sponsorService.createResponse({
      id: list.id,
      name: list.name,
      content: list.content,
      space: {
        id: list.space.id,
        name: list.space.name
      },
      url: `https://app.clickup.com/${config.clickupTeamId}/v/l/${list.id}`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to retrieve list: ${error.message}`);
  }
}

/**
 * Handler for the update_list tool
 * Updates an existing list's properties
 */
export async function handleUpdateList(parameters: any) {
  const { listId, listName, name, content, status } = parameters;
  
  let targetListId = listId;
  
  // If no listId provided but listName is, look up the list ID
  if (!targetListId && listName) {
    const listResult = await findListIDByName(workspaceService, listName);
    if (!listResult) {
      throw new Error(`List "${listName}" not found`);
    }
    targetListId = listResult.id;
  }
  
  if (!targetListId) {
    throw new Error("Either listId or listName must be provided");
  }
  
  // Ensure at least one update field is provided
  if (!name && !content && !status) {
    throw new Error("At least one of name, content, or status must be provided for update");
  }

  // Prepare update data
  const updateData: Partial<CreateListData> = {};
  if (name) updateData.name = name;
  if (content) updateData.content = content;
  if (status) updateData.status = status;

  try {
    // Update the list
    const updatedList = await listService.updateList(targetListId, updateData);
    
    return sponsorService.createResponse({
      id: updatedList.id,
      name: updatedList.name,
      content: updatedList.content,
      space: {
        id: updatedList.space.id,
        name: updatedList.space.name
      },
      url: `https://app.clickup.com/${config.clickupTeamId}/v/l/${updatedList.id}`,
      message: `List "${updatedList.name}" updated successfully`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to update list: ${error.message}`);
  }
}

/**
 * Handler for the delete_list tool
 * Permanently removes a list from the workspace
 */
export async function handleDeleteList(parameters: any) {
  const { listId, listName } = parameters;
  
  let targetListId = listId;
  
  // If no listId provided but listName is, look up the list ID
  if (!targetListId && listName) {
    const listResult = await findListIDByName(workspaceService, listName);
    if (!listResult) {
      throw new Error(`List "${listName}" not found`);
    }
    targetListId = listResult.id;
  }
  
  if (!targetListId) {
    throw new Error("Either listId or listName must be provided");
  }

  try {
    // Get list details before deletion for confirmation message
    const list = await listService.getList(targetListId);
    const listName = list.name;
    
    // Delete the list
    await listService.deleteList(targetListId);
    
    return sponsorService.createResponse({
      success: true,
      message: `List "${listName || targetListId}" deleted successfully`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to delete list: ${error.message}`);
  }
} 
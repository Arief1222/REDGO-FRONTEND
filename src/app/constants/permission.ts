/**
 * Permission Constants
 * Centralized permission definitions
 */

export const PERMISSIONS = {
  // User permissions
  USER_VIEW: 'users.read',
  USER_CREATE: 'users.create',
  USER_EDIT: 'users.update',
  USER_DELETE: 'users.delete',

  // Role permissions
  ROLE_VIEW: 'roles.read',
  ROLE_CREATE: 'roles.create',
  ROLE_EDIT: 'roles.update',
  ROLE_DELETE: 'roles.delete',

  // RAG permissions
  RAG_VIEW: 'rag.read',
  RAG_CREATE: 'rag.create',
  RAG_EDIT: 'rag.update',
  RAG_DELETE: 'rag.delete',

  // Chat permissions
  CHAT_VIEW: 'chat.read',
  CHAT_CREATE: 'chat.create',
  CHAT_EDIT: 'chat.update',
  CHAT_DELETE: 'chat.delete',

  // Prompt permissions
  PROMPT_VIEW: 'prompts.read',
  PROMPT_CREATE: 'prompts.create',
  PROMPT_EDIT: 'prompts.update',
  //PROMPT_DELETE: 'prompts.delete',

  PRIVACY_VIEW: 'privacy.read',
  TOS_VIEW: 'tos.read',
}
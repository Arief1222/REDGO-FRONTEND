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

  // // Item permissions
  // ITEMS_VIEW: 'items.read',
  // ITEMS_CREATE: 'items.create',
  // ITEMS_EDIT: 'items.update',
  // ITEMS_DELETE: 'items.delete',

  // // Supplier permissions
  // SUPPLIER_VIEW: 'suppliers.read',
  // SUPPLIER_CREATE: 'suppliers.create',
  // SUPPLIER_EDIT: 'suppliers.update',
  // SUPPLIER_DELETE: 'suppliers.delete',

  // // Warehouse permissions
  // WAREHOUSE_VIEW: 'warehouse.read',
  // WAREHOUSE_CREATE: 'warehouse.create',
  // WAREHOUSE_EDIT: 'warehouse.update',
  // WAREHOUSE_DELETE: 'warehouse.delete',

  // // Receiving permissions
  // RECEIVINGS_VIEW: 'receivings.read',
  // RECEIVINGS_CREATE: 'receivings.create',
  // RECEIVINGS_UPDATE: 'receivings.update',
  // RECEIVINGS_DELETE: 'receivings.delete',
  // RECEIVINGS_POST: 'receivings.post',

  // // Issuing permissions
  // ISSUINGS_VIEW: 'issuings.read',
  // ISSUINGS_CREATE: 'issuings.create',
  // ISSUINGS_UPDATE: 'issuings.update',
  // ISSUINGS_DELETE: 'issuings.delete',
  // ISSUINGS_POST: 'issuings.post',

  // Add more permissions as needed
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

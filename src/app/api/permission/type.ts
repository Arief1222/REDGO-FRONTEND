/** Permission types */

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface ListPermissionsParams {
  page?: number;
  limit?: number;
}

export type PermissionSet = {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  confrim: boolean;
  completed: boolean;
  cancel: boolean;
};

export interface RoleFormData {
  name: string;
  description: string;
  status: string;
  permissions: Record<string, PermissionSet>;  // <-- This must be this shape
}
export interface Role {
  id: number;
  name: string;
  description?: string;
  status: string;
  permissions: Record<string, PermissionSet>;
  updatedAt: string
}

export interface RoleDto {
  id: number;
  name: string;
}


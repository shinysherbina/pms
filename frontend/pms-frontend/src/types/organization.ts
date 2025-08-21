export interface Organization {
  id: number;
  name: string;
  slug?: string; // URL-friendly identifier (e.g., "acme-corp")
  createdAt?: string; // ISO 8601 timestamp
  updatedAt?: string;
  ownerId?: number; // Assuming user IDs are numeric; change to string if needed
  isActive?: boolean;
  metadata?: Record<string, unknown>; // Safer than `any` for custom fields
}

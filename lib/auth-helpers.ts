// lib/auth-helpers.ts
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@prisma/client';

/**
 * Get user ID for database queries
 * Redirects to sign-in if not authenticated
 */
export async function getUserId(): Promise<string> {
  const user = await getCurrentUser();
  return user.id;
}

/**
 * Check if user has required role
 */
export async function requireRole(allowedRoles: string[]) {
  const user = await getCurrentUser();
  
  // Assuming Stack Auth stores role in user object
  // Adjust based on your Stack Auth configuration
  const userRole = user.clientMetadata?.role as string;
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    throw new Error('Unauthorized: Insufficient permissions');
  }
  
  return user;
}
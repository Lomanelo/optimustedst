# User Management System Guide

## Overview

The Optimus Education admin dashboard now includes a comprehensive user management system with role-based permissions. This system allows administrators to control which users have access to specific admin features.

## User Roles

### 1. Admin

- **Full Access**: Admins have access to all admin features and the user management tab
- **Cannot be restricted**: Admin permissions cannot be toggled off
- **User Management**: Only admins can access the `/admin/users` page to manage other users

### 2. Moderator

- **Limited Admin Access**: Can be granted specific permissions to admin features
- **Configurable**: Permissions can be toggled on/off by admins
- **No User Management**: Cannot access user management unless specifically granted

### 3. Student

- **Dashboard Only**: Default role with access only to student dashboard
- **Can be elevated**: Can be granted specific admin permissions
- **Default Registration**: New users are automatically assigned this role

## Permission System

### Available Permissions

- **Dashboard**: Access to admin dashboard overview
- **Programs**: Manage educational programs
- **Blog**: Create and edit blog posts
- **CMS**: Edit website content and translations
- **Contacts**: Manage contact information and emails
- **Users**: Manage user roles and permissions (Admin only)
- **Settings**: Manage social media links and site settings

### Permission Logic

1. **All Roles**: Any role can be granted any specific permissions by an admin
2. **Permission-Based Access**: Admin menu items only show if user has the required permission
3. **Flexible System**: Students, Moderators, and Admins can all have customized access
4. **Route Protection**: Admin pages check for specific permissions, not just role

## User Management Interface

### Features

- **User Statistics**: View total users, admins, active users, and new registrations
- **Search & Filter**: Find users by email/name, filter by role or status
- **Role Management**: Change user roles with dropdown selection
- **Permission Toggles**: Individual permission controls for non-admin users
- **Status Control**: Activate/deactivate user accounts
- **Last Login Tracking**: Monitor user activity

### Usage

1. Navigate to `/admin/users` (Admin only)
2. Use search/filters to find specific users
3. Click the settings icon to edit user roles
4. Toggle permissions by clicking permission badges
5. Use status buttons to activate/deactivate accounts

## Database Structure

### User Document (`users/{uid}`)

```typescript
{
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'student' | 'moderator';
  permissions: {
    dashboard: boolean;
    programs: boolean;
    blog: boolean;
    cms: boolean;
    contacts: boolean;
    users: boolean;
    settings: boolean;
  };
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLogin?: Timestamp;
}
```

## Security Implementation

### Route Protection

- Admin layout checks user role and permissions
- Individual admin pages verify access rights
- Unauthorized users are redirected to appropriate dashboards

### API Security

- User service methods validate permissions
- Database rules should restrict user document modifications
- Only admins can modify other users' permissions

### Frontend Access Control

- Menu items filtered based on permissions
- Components check permissions before rendering admin features
- Auth context provides `hasPermission()` helper

## Migration

### Existing Users

New users automatically get the updated structure. Existing users will be migrated when they log in:

1. Missing `permissions` field defaults to no admin access
2. Missing `isActive` field defaults to `true`
3. Users maintain their existing roles

### Manual Migration

For bulk updates, use the Firebase console or create a migration script to update all user documents with the new structure.

## Usage Examples

### Check Permission in Component

```typescript
const { hasPermission } = useAuth();

if (hasPermission("programs")) {
  // Show programs management UI
}
```

### Role-based Menu

```typescript
const adminMenuItems = [
  { href: "/admin/programs", label: "Programs", permission: "programs" },
  // ...
].filter((item) => userRole === "admin" || hasPermission(item.permission));
```

### Service Usage

```typescript
// Update user role
await userService.updateUserRole(userId, "moderator");

// Toggle specific permission
await userService.updateUserPermissions(userId, {
  ...currentPermissions,
  blog: true,
});

// Check user stats
const stats = await userService.getUserStats();
```

## Best Practices

1. **Principle of Least Privilege**: Only grant necessary permissions
2. **Regular Audits**: Review user permissions periodically
3. **Role Clarity**: Use moderator role for users who need limited admin access
4. **Admin Protection**: Always maintain at least one admin user
5. **Activity Monitoring**: Check last login times for security

## Troubleshooting

### Common Issues

1. **User can't access admin**: Check role and specific permissions
2. **Menu items missing**: Verify permission filters in layout components
3. **Database errors**: Ensure user documents have required fields
4. **Permission changes not reflecting**: User may need to log out and back in

### Debug Steps

1. Check user document in Firestore
2. Verify auth context is loading permissions
3. Test permission checks in browser console
4. Review admin layout permission filtering

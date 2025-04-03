# Settings Page

The settings page provides a comprehensive interface for users to manage their account, preferences, and application settings.

## Overview

The settings page is organized into five main sections:

1. **Account Settings**: Manage profile information, change password, and delete account
2. **Appearance Settings**: Customize theme and UI preferences
3. **Privacy & Security Settings**: Manage cookie preferences, data export, and security options
4. **Notification Settings**: Configure email and in-app notification preferences
5. **Application Settings**: Set language, timezone, date formats, and default views

## Component Structure

The settings page is built using a modular component structure:

```
settings/
├── SettingsLayout.vue           # Main layout with tabs
├── sections/
│   ├── AccountSettings.vue      # Profile, password, account management
│   ├── AppearanceSettings.vue   # Theme, UI customization
│   ├── PrivacySettings.vue      # Privacy and security settings
│   ├── NotificationSettings.vue # Email and in-app notification preferences
│   └── AppSettings.vue          # Language, timezone, defaults
└── components/
    ├── ProfilePictureUpload.vue # Profile picture upload component
    ├── PasswordChange.vue       # Password change form
    ├── DeleteAccount.vue        # Account deletion confirmation
    ├── ThemeSelector.vue        # Theme selection component
    └── SettingsCard.vue         # Reusable card for settings sections
```

## Account Settings

The Account Settings section allows users to:

- Update their profile information (name, email)
- Upload or change their profile picture
- Change their password
- Delete their account

### Profile Picture Upload

The profile picture upload component supports:
- Image preview
- File type validation (JPEG, PNG, GIF)
- Size validation (max 5MB)
- Image removal

### Password Change

The password change form includes:
- Current password verification
- Password strength meter
- Password requirements validation
- Confirmation matching

### Account Deletion

The account deletion process includes:
- Confirmation dialog
- Password verification
- Explicit confirmation text entry

## Appearance Settings

The Appearance Settings section allows users to:

- Select theme (Light, Dark, System)
- Adjust font size
- Configure animation preferences
- Toggle dense mode
- Toggle high contrast mode

## Privacy & Security Settings

The Privacy & Security Settings section allows users to:

- Manage cookie preferences
- Export personal data
- View privacy policy
- Manage active sessions
- Configure two-factor authentication (coming soon)

## Notification Settings

The Notification Settings section allows users to configure:

- Email notifications
  - Account updates
  - Security alerts
  - Product updates
  - Newsletter
  - Tips & tutorials
- In-app notifications
  - New features
  - Reminders
  - Mentions
  - Comments
  - Updates

## Application Settings

The Application Settings section allows users to configure:

- Language
- Timezone
- Date format
- Time format
- Week start day
- Default view

## Usage

To access the settings page, navigate to `/dashboard/settings` or click on the Settings option in the sidebar.

## API Integration

The settings components are designed to integrate with the following API endpoints:

- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/profile/image` - Upload profile image
- `DELETE /api/auth/profile/image` - Remove profile image
- `POST /api/auth/password/change` - Change password
- `DELETE /api/auth/account` - Delete user account
- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/preferences` - Update user preferences

## Responsive Design

The settings page is fully responsive:

- On desktop, it displays a sidebar with tabs and content side by side
- On mobile, it collapses to a dropdown menu for tab selection
- All forms and components adapt to different screen sizes

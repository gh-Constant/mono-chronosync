-- PostgreSQL Database Schema for Chronosync
-- This file contains the complete database schema using standard PostgreSQL syntax

-- =============================================
-- AUTHENTICATION & USER MANAGEMENT
-- =============================================

-- Users table - Core user information
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password BYTEA DEFAULT NULL, -- NULL allowed for OAuth users
    image TEXT,
    email_verified TIMESTAMPTZ,
    verification_token VARCHAR(255),
    verification_token_expires TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- OAuth accounts table - For third-party authentication
CREATE TABLE IF NOT EXISTS oauth_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(255) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_account_id)
);

-- =============================================
-- TODO APPLICATION TABLES
-- =============================================

-- Task types/categories
CREATE TABLE IF NOT EXISTS task_types (
    type_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type_name TEXT NOT NULL,
    color VARCHAR(30), -- Optional color for UI representation (hex code or name)
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, type_name) -- Prevent duplicate type names for the same user
);

-- Todo lists
CREATE TABLE IF NOT EXISTS todo_lists (
    list_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type_id BIGINT REFERENCES task_types(type_id) ON DELETE SET NULL,
    list_name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Todo tasks
CREATE TABLE IF NOT EXISTS todo_tasks (
    task_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    list_id BIGINT REFERENCES todo_lists(list_id) ON DELETE CASCADE,
    parent_task_id BIGINT REFERENCES todo_tasks(task_id) ON DELETE CASCADE, -- NULL for main tasks, set for subtasks
    type_id BIGINT REFERENCES task_types(type_id) ON DELETE SET NULL, -- Optional task type/category
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Store the user who owns this task
    title TEXT NOT NULL,
    description TEXT,
    priority INTEGER, -- NULL means no priority, otherwise 1-5 (or whatever scale you prefer)
    duration INTERVAL, -- NULL means no duration
    due_date TIMESTAMPTZ,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- APP USAGE TRACKING TABLES
-- =============================================

-- Application types
CREATE TABLE IF NOT EXISTS app_types (
    type_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type_name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Applications
CREATE TABLE IF NOT EXISTS applications (
    app_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    app_name TEXT NOT NULL,
    package_name TEXT NOT NULL UNIQUE,
    type_id BIGINT REFERENCES app_types(type_id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Operating systems
CREATE TABLE IF NOT EXISTS operating_systems (
    os_name TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Devices
CREATE TABLE IF NOT EXISTS devices (
    device_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    device_name TEXT NOT NULL,
    os_name TEXT REFERENCES operating_systems(os_name),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Application groups
CREATE TABLE IF NOT EXISTS app_groups (
    group_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    group_name TEXT NOT NULL,
    parent_group_id BIGINT REFERENCES app_groups(group_id) ON DELETE CASCADE,
    work_category INTEGER DEFAULT 0 CHECK (work_category >= 0 AND work_category <= 3),
    daily_time_limit INTERVAL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- App usage sessions
CREATE TABLE IF NOT EXISTS app_usage_sessions (
    session_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    device_id BIGINT REFERENCES devices(device_id),
    app_id BIGINT REFERENCES applications(app_id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- App group members (junction table)
CREATE TABLE IF NOT EXISTS app_group_members (
    group_id BIGINT REFERENCES app_groups(group_id),
    app_id BIGINT REFERENCES applications(app_id),
    daily_time_limit INTERVAL,
    PRIMARY KEY (group_id, app_id)
);

-- =============================================
-- INDEXES
-- =============================================

-- Authentication indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_oauth_accounts_user_id ON oauth_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_accounts_provider ON oauth_accounts(provider);

-- Todo app indexes
CREATE INDEX IF NOT EXISTS idx_todo_lists_user_id ON todo_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_todo_tasks_list_id ON todo_tasks(list_id);
CREATE INDEX IF NOT EXISTS idx_todo_tasks_parent_id ON todo_tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_todo_tasks_completed ON todo_tasks(completed);
CREATE INDEX IF NOT EXISTS idx_todo_tasks_type_id ON todo_tasks(type_id);
CREATE INDEX IF NOT EXISTS idx_todo_tasks_user_id ON todo_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_task_types_user_id ON task_types(user_id);

-- App usage tracking indexes
CREATE INDEX IF NOT EXISTS idx_app_usage_user_id ON app_usage_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_app_usage_app_id ON app_usage_sessions(app_id);
CREATE INDEX IF NOT EXISTS idx_app_usage_start_time ON app_usage_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_app_usage_device_id ON app_usage_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_app_groups_user_id ON app_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_app_usage_user_time ON app_usage_sessions(user_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_app_groups_parent ON app_groups(parent_group_id);
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_os_name ON devices(os_name);
CREATE INDEX IF NOT EXISTS idx_applications_type_id ON applications(type_id);
CREATE INDEX IF NOT EXISTS idx_app_group_members_app_id ON app_group_members(app_id);

-- =============================================
-- DEFAULT DATA
-- =============================================

-- Default app types
INSERT INTO app_types (type_name) VALUES 
    ('Game'),
    ('Social'),
    ('Productivity'),
    ('Entertainment')
ON CONFLICT DO NOTHING;

-- Default operating systems
INSERT INTO operating_systems (os_name) VALUES 
    ('Android'),
    ('iOS')
ON CONFLICT DO NOTHING;

-- Default application
INSERT INTO applications (app_name, package_name, type_id) 
VALUES ('Chronosync', 'com.chronosync.app', 1) 
ON CONFLICT DO NOTHING;

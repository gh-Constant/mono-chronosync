-- Table Creation (with IF NOT EXISTS)

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS oauth_accounts;
DROP TABLE IF EXISTS task_types;
DROP TABLE IF EXISTS todo_lists;
DROP TABLE IF EXISTS todo_tasks;
DROP TABLE IF EXISTS app_types;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS operating_systems;
DROP TABLE IF EXISTS devices;

-- Create updated users table first to fix dependenciesd
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password BYTEA DEFAULT NULL,  -- Explicitly allow NULL for OAuth users
    salt BYTEA DEFAULT NULL,            -- Explicitly allow NULL for OAuth users
    image TEXT,
    email_verified TIMESTAMPTZ,
    verification_token VARCHAR(255),
    verification_token_expires TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create OAuth accounts table
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

-- Table for todo task types/categories
CREATE TABLE IF NOT EXISTS task_types (
    type_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type_name TEXT NOT NULL,
    color VARCHAR(30), -- Optional color for UI representation (hex code or name)
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, type_name) -- Prevent duplicate type names for the same user
);

-- Table for todo lists
CREATE TABLE IF NOT EXISTS todo_lists (
    list_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type_id BIGINT REFERENCES task_types(type_id) ON DELETE SET NULL,
    list_name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table for todo tasks
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

-- Table des types d'applications
CREATE TABLE IF NOT EXISTS app_types (
    type_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type_name text NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des applications
CREATE TABLE IF NOT EXISTS applications (
    app_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    app_name text NOT NULL,
    package_name text NOT NULL UNIQUE,
    type_id bigint REFERENCES app_types(type_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des systèmes d'exploitation
CREATE TABLE IF NOT EXISTS operating_systems (
    os_name text PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des appareils
CREATE TABLE IF NOT EXISTS devices (
    device_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    device_name text NOT NULL,
    os_name text REFERENCES operating_systems(os_name),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des groupes d'applications
CREATE TABLE IF NOT EXISTS app_groups (
    group_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    group_name text NOT NULL,
    parent_group_id bigint REFERENCES app_groups(group_id) ON DELETE CASCADE,
    work_category integer DEFAULT 0 CHECK (work_category >= 0 AND work_category <= 3),
    daily_time_limit interval,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des sessions d'utilisation
CREATE TABLE IF NOT EXISTS app_usage_sessions (
    session_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    device_id bigint REFERENCES devices(device_id),
    app_id bigint REFERENCES applications(app_id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table de liaison entre applications et groupes
CREATE TABLE IF NOT EXISTS app_group_members (
    group_id bigint REFERENCES app_groups(group_id),
    app_id bigint REFERENCES applications(app_id),
    daily_time_limit interval,
    PRIMARY KEY (group_id, app_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS IDX_users_email ON users (email);
CREATE INDEX IF NOT EXISTS IDX_oauth_accounts_user_id ON oauth_accounts(user_id);
CREATE INDEX IF NOT EXISTS IDX_oauth_accounts_provider ON oauth_accounts(provider);
CREATE INDEX IF NOT EXISTS IDX_todo_lists_user_id ON todo_lists(user_id);
CREATE INDEX IF NOT EXISTS IDX_todo_tasks_list_id ON todo_tasks(list_id);
CREATE INDEX IF NOT EXISTS IDX_todo_tasks_parent_id ON todo_tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS IDX_todo_tasks_completed ON todo_tasks(completed);
CREATE INDEX IF NOT EXISTS IDX_todo_tasks_type_id ON todo_tasks(type_id);
CREATE INDEX IF NOT EXISTS IDX_todo_tasks_user_id ON todo_tasks(user_id);
CREATE INDEX IF NOT EXISTS IDX_task_types_user_id ON task_types(user_id);

-- Insert default app types only if they do not already exist
INSERT INTO app_types (type_name)
SELECT type_name FROM (VALUES ('Web Application'), ('Application'), ('Project'), ('Contact')) AS new_types(type_name)
WHERE NOT EXISTS (SELECT 1 FROM app_types WHERE app_types.type_name = new_types.type_name);

-- Insert default operating systems if they do not already exist
INSERT INTO operating_systems (os_name)
SELECT os_name FROM (VALUES('macOS'), ('Windows'), ('Linux'), ('iOS'), ('Android')) as new_os(os_name)
WHERE NOT EXISTS (select 1 from operating_systems where operating_systems.os_name = new_os.os_name);

-- Insert example applications if they don't exist
INSERT INTO applications (app_name, package_name, type_id)
SELECT a.app_name, a.package_name, at.type_id
FROM (
    VALUES 
    ('Visual Studio Code', 'com.microsoft.vscode', 'Application'),
    ('Chrome', 'com.google.chrome', 'Web Application'),
    ('Slack', 'com.slack', 'Application'),
    ('Spotify', 'com.spotify', 'Application'),
    ('Terminal', 'com.apple.terminal', 'Application')
) as a(app_name, package_name, type_name)
JOIN app_types at ON at.type_name = a.type_name
WHERE NOT EXISTS (
    SELECT 1 FROM applications WHERE package_name = a.package_name
);

-- Insert example device for user 1 if it doesn't exist
INSERT INTO devices (user_id, device_name, os_name)
SELECT 1, 'MacBook Pro', 'macOS'
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1)
AND NOT EXISTS (
    SELECT 1 FROM devices 
    WHERE user_id = 1 AND device_name = 'MacBook Pro'
);

-- Insert example app usage sessions for user 1
DO $$
DECLARE
    v_device_id bigint;
    v_vscode_id bigint;
    v_chrome_id bigint;
    v_slack_id bigint;
    v_spotify_id bigint;
BEGIN
    -- Get device ID
    SELECT device_id INTO v_device_id
    FROM devices
    WHERE user_id = 1 AND device_name = 'MacBook Pro'
    LIMIT 1;

    -- Get app IDs
    SELECT app_id INTO v_vscode_id FROM applications WHERE package_name = 'com.microsoft.vscode';
    SELECT app_id INTO v_chrome_id FROM applications WHERE package_name = 'com.google.chrome';
    SELECT app_id INTO v_slack_id FROM applications WHERE package_name = 'com.slack';
    SELECT app_id INTO v_spotify_id FROM applications WHERE package_name = 'com.spotify';

    -- Only insert if we have both device and apps
    IF v_device_id IS NOT NULL AND v_vscode_id IS NOT NULL THEN
        -- Insert example sessions for today
        INSERT INTO app_usage_sessions (user_id, device_id, app_id, start_time, end_time)
        SELECT 1, v_device_id, app_id, start_time, end_time
        FROM (
            VALUES 
            (v_vscode_id, CURRENT_DATE + INTERVAL '9 hours', CURRENT_DATE + INTERVAL '11 hours'),
            (v_chrome_id, CURRENT_DATE + INTERVAL '11 hours', CURRENT_DATE + INTERVAL '12 hours'),
            (v_slack_id, CURRENT_DATE + INTERVAL '13 hours', CURRENT_DATE + INTERVAL '14 hours'),
            (v_spotify_id, CURRENT_DATE + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '15 hours'),
            -- Yesterday's sessions
            (v_vscode_id, CURRENT_DATE - INTERVAL '1 day' + INTERVAL '10 hours', CURRENT_DATE - INTERVAL '1 day' + INTERVAL '12 hours'),
            (v_chrome_id, CURRENT_DATE - INTERVAL '1 day' + INTERVAL '14 hours', CURRENT_DATE - INTERVAL '1 day' + INTERVAL '16 hours')
        ) as sessions(app_id, start_time, end_time)
        WHERE NOT EXISTS (
            SELECT 1 FROM app_usage_sessions 
            WHERE user_id = 1 
            AND start_time >= CURRENT_DATE - INTERVAL '1 day'
        );
    END IF;
END $$;

-- Create indexes for optimization
CREATE INDEX IF NOT EXISTS idx_app_usage_user_id ON app_usage_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_app_usage_app_id ON app_usage_sessions(app_id);
CREATE INDEX IF NOT EXISTS idx_app_usage_start_time ON app_usage_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_app_usage_device_id ON app_usage_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_app_groups_user_id ON app_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_app_usage_user_time ON app_usage_sessions(user_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_app_groups_parent ON app_groups(parent_group_id);
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_os_name ON devices(os_name);
CREATE INDEX IF NOT EXISTS idx_app_usage_sessions_user_id ON app_usage_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_app_usage_sessions_device_id ON app_usage_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_applications_type_id ON applications(type_id);

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
# *** Remember to change! (HOST_NAME, PORT, USER_NAME, DATABASE_NAME) *** 
psql -h HOST_NAME -p PORT -U USER_NAME -d DATABASE_NAME -c "
/* PostgreSQL edition */
WITH fk_info AS (
    SELECT array_to_string(array_agg(CONCAT('{\"schema\":\"', replace(schema_name, '\"', ''), '\"',
                                            ',\"table\":\"', replace(table_name::text, '\"', ''), '\"',
                                            ',\"column\":\"', replace(fk_column::text, '\"', ''), '\"',
                                            ',\"foreign_key_name\":\"', foreign_key_name, '\"',
                                            ',\"reference_schema\":\"', COALESCE(reference_schema, 'public'), '\"',
                                            ',\"reference_table\":\"', reference_table, '\"',
                                            ',\"reference_column\":\"', reference_column, '\"',
                                            ',\"fk_def\":\"', replace(fk_def, '\"', ''),
                                            '\"}')), ',') as fk_metadata
    FROM (
            SELECT c.conname AS foreign_key_name,
                    n.nspname AS schema_name,
                    CASE
                        WHEN position('.' in conrelid::regclass::text) > 0
                        THEN split_part(conrelid::regclass::text, '.', 2)
                        ELSE conrelid::regclass::text
                    END AS table_name,
                    a.attname AS fk_column,
                    nr.nspname AS reference_schema,
                    CASE
                        WHEN position('.' in confrelid::regclass::text) > 0
                        THEN split_part(confrelid::regclass::text, '.', 2)
                        ELSE confrelid::regclass::text
                    END AS reference_table,
                    af.attname AS reference_column,
                    pg_get_constraintdef(c.oid) as fk_def
                FROM
                    pg_constraint AS c
                JOIN
                    pg_attribute AS a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
                JOIN
                    pg_class AS cl ON cl.oid = c.conrelid
                JOIN
                    pg_namespace AS n ON n.oid = cl.relnamespace
                JOIN
                    pg_attribute AS af ON af.attnum = ANY(c.confkey) AND af.attrelid = c.confrelid
                JOIN
                    pg_class AS clf ON clf.oid = c.confrelid
                JOIN
                    pg_namespace AS nr ON nr.oid = clf.relnamespace
                WHERE
                    c.contype = 'f'
                    AND connamespace::regnamespace::text NOT IN ('information_schema', 'pg_catalog')
    ) AS x
), pk_info AS (
    SELECT array_to_string(array_agg(CONCAT('{\"schema\":\"', replace(schema_name, '\"', ''), '\"',
                                            ',\"table\":\"', replace(pk_table, '\"', ''), '\"',
                                            ',\"column\":\"', replace(pk_column, '\"', ''), '\"',
                                            ',\"pk_def\":\"', replace(pk_def, '\"', ''),
                                            '\"}')), ',') AS pk_metadata
    FROM (
            SELECT connamespace::regnamespace::text AS schema_name,
                CASE
                    WHEN strpos(conrelid::regclass::text, '.') > 0
                    THEN split_part(conrelid::regclass::text, '.', 2)
                    ELSE conrelid::regclass::text
                END AS pk_table,
                unnest(string_to_array(substring(pg_get_constraintdef(oid) FROM '\((.*?)\)'), ',')) AS pk_column,
                pg_get_constraintdef(oid) as pk_def
            FROM
              pg_constraint
            WHERE
              contype = 'p'
              AND connamespace::regnamespace::text NOT IN ('information_schema', 'pg_catalog')
    ) AS y
),
indexes_cols AS (
    SELECT  tnsp.nspname                                                                AS schema_name,
        trel.relname                                                                    AS table_name,
            pg_relation_size('\"' || tnsp.nspname || '\".' || '\"' || irel.relname || '\"') AS index_size,
            irel.relname                                                                AS index_name,
            am.amname                                                                   AS index_type,
            a.attname                                                                   AS col_name,
            (CASE WHEN i.indisunique = TRUE THEN 'true' ELSE 'false' END)               AS is_unique,
            irel.reltuples                                                              AS cardinality,
            1 + Array_position(i.indkey, a.attnum)                                      AS column_position,
            CASE o.OPTION & 1 WHEN 1 THEN 'DESC' ELSE 'ASC' END                         AS direction,
            CASE WHEN indpred IS NOT NULL THEN 'true' ELSE 'false' END                  AS is_partial_index
    FROM pg_index AS i
        JOIN pg_class AS trel ON trel.oid = i.indrelid
        JOIN pg_namespace AS tnsp ON trel.relnamespace = tnsp.oid
        JOIN pg_class AS irel ON irel.oid = i.indexrelid
        JOIN pg_am AS am ON irel.relam = am.oid
        CROSS JOIN LATERAL unnest (i.indkey)
        WITH ORDINALITY AS c (colnum, ordinality) LEFT JOIN LATERAL unnest (i.indoption)
        WITH ORDINALITY AS o (option, ordinality)
        ON c.ordinality = o.ordinality JOIN pg_attribute AS a ON trel.oid = a.attrelid AND a.attnum = c.colnum
    WHERE tnsp.nspname NOT LIKE 'pg_%'
    GROUP BY tnsp.nspname, trel.relname, irel.relname, am.amname, i.indisunique, i.indexrelid, irel.reltuples, a.attname, Array_position(i.indkey, a.attnum), o.OPTION, i.indpred
),
cols AS (
    SELECT array_to_string(array_agg(CONCAT('{\"schema\":\"', cols.table_schema,
                                            '\",\"table\":\"', cols.table_name,
                                            '\",\"name\":\"', cols.column_name,
                                            '\",\"ordinal_position\":\"', cols.ordinal_position,
                                            '\",\"type\":\"', LOWER(replace(cols.data_type, '\"', '')),
                                            '\",\"character_maximum_length\":\"', COALESCE(cols.character_maximum_length::text, 'null'),
                                            '\",\"precision\":',
                                                CASE
                                                    WHEN cols.data_type = 'numeric' OR cols.data_type = 'decimal'
                                                    THEN CONCAT('{\"precision\":', COALESCE(cols.numeric_precision::text, 'null'),
                                                                ',\"scale\":', COALESCE(cols.numeric_scale::text, 'null'), '}')
                                                    ELSE 'null'
                                                END,
                                            ',\"nullable\":', CASE WHEN (cols.IS_NULLABLE = 'YES') THEN 'true' ELSE 'false' END,
                                            ',\"default\":\"', COALESCE(replace(replace(cols.column_default, '\"', '\\\"'), '\\x', '\\\\x'), ''),
                                            '\",\"collation\":\"', COALESCE(cols.COLLATION_NAME, ''),
                                            '\",\"comment\":\"', COALESCE(replace(replace(dsc.description, '\"', '\\\"'), '\\x', '\\\\x'), ''),
                                            '\"}')), ',') AS cols_metadata
    FROM information_schema.columns cols
    LEFT JOIN pg_catalog.pg_class c
        ON c.relname = cols.table_name
    JOIN pg_catalog.pg_namespace n
        ON n.oid = c.relnamespace AND n.nspname = cols.table_schema
    LEFT JOIN pg_catalog.pg_description dsc ON dsc.objoid = c.oid
                                        AND dsc.objsubid = cols.ordinal_position
    WHERE cols.table_schema NOT IN ('information_schema', 'pg_catalog')
), indexes_metadata AS (
    SELECT array_to_string(array_agg(CONCAT('{\"schema\":\"', schema_name,
                                            '\",\"table\":\"', table_name,
                                            '\",\"name\":\"', index_name,
                                            '\",\"column\":\"', replace(col_name :: TEXT, '\"', E'\"'),
                                            '\",\"index_type\":\"', index_type,
                                            '\",\"cardinality\":', cardinality,
                                            ',\"size\":', index_size,
                                            ',\"unique\":', is_unique,
                                            ',\"is_partial_index\":', is_partial_index,
                                            ',\"column_position\":', column_position,
                                            ',\"direction\":\"', LOWER(direction),
                                            '\"}')), ',') AS indexes_metadata
    FROM indexes_cols x 
), tbls AS (
    SELECT array_to_string(array_agg(CONCAT('{',
                        '\"schema\":\"', tbls.TABLE_SCHEMA, '\",',
                        '\"table\":\"', tbls.TABLE_NAME, '\",',
                        '\"rows\":', COALESCE((SELECT s.n_live_tup
                                                FROM pg_stat_user_tables s
                                                WHERE tbls.TABLE_SCHEMA = s.schemaname AND tbls.TABLE_NAME = s.relname),
                                                0), ', \"type\":\"', tbls.TABLE_TYPE, '\",', '\"engine\":\"\",', '\"collation\":\"\",',
                        '\"comment\":\"', COALESCE(replace(replace(dsc.description, '\"', '\\\"'), '\\x', '\\\\x'), ''),
                        '\"}'
                )),
                ',') AS tbls_metadata
        FROM information_schema.tables tbls
        LEFT JOIN pg_catalog.pg_class c ON c.relname = tbls.TABLE_NAME
        JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
                                            AND n.nspname = tbls.TABLE_SCHEMA
        LEFT JOIN pg_catalog.pg_description dsc ON dsc.objoid = c.oid
                                                AND dsc.objsubid = 0
        WHERE tbls.TABLE_SCHEMA NOT IN ('information_schema', 'pg_catalog') 
), config AS (
    SELECT array_to_string(
                      array_agg(CONCAT('{\"name\":\"', conf.name, '\",\"value\":\"', replace(conf.setting, '\"', E'\"'), '\"}')),
                      ',') AS config_metadata
    FROM pg_settings conf
), views AS (
    SELECT array_to_string(array_agg(CONCAT('{\"schema\":\"', views.schemaname,
                      '\",\"view_name\":\"', viewname,
                      '\",\"view_definition\":\"', encode(convert_to(REPLACE(definition, '\"', '\\\"'), 'UTF8'), 'base64'),
                    '\"}')),
                      ',') AS views_metadata
    FROM pg_views views
    WHERE views.schemaname NOT IN ('information_schema', 'pg_catalog') 
)
SELECT CONCAT('{    \"fk_info\": [', COALESCE(fk_metadata, ''),
                    '], \"pk_info\": [', COALESCE(pk_metadata, ''),
                    '], \"columns\": [', COALESCE(cols_metadata, ''),
                    '], \"indexes\": [', COALESCE(indexes_metadata, ''),
                    '], \"tables\":[', COALESCE(tbls_metadata, ''),
                    '], \"views\":[', COALESCE(views_metadata, ''),
                    '], \"database_name\": \"', CURRENT_DATABASE(), '', '\", \"version\": \"', '',
              '\"}') AS metadata_json_to_import
FROM fk_info, pk_info, cols, indexes_metadata, tbls, config, views;
    
" -t -A > output.json;
-- Create updated users table first to fix dependenciesd
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password BYTEA DEFAULT NULL,  -- Explicitly allow NULL for OAuth users      -- Explicitly allow NULL for OAuth users
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

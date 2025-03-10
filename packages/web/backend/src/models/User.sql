-- Table Creation (with IF NOT EXISTS)

-- Create updated users table first to fix dependencies
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password BYTEA DEFAULT NULL,  -- Explicitly allow NULL for OAuth users
    salt BYTEA DEFAULT NULL,            -- Explicitly allow NULL for OAuth users
    image TEXT,
    email_verified TIMESTAMPTZ,
    email_verification_token VARCHAR(255),
    email_verification_token_expires TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    refresh_token TEXT DEFAULT NULL,
    refresh_token_expires TIMESTAMPTZ DEFAULT NULL,
    last_login TIMESTAMPTZ,
    account_status VARCHAR(50) DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'banned')),
    failed_login_attempts INTEGER DEFAULT 0,
    last_failed_login TIMESTAMPTZ
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

-- Create indexes
CREATE INDEX IF NOT EXISTS IDX_users_email ON users (email);
CREATE INDEX IF NOT EXISTS IDX_oauth_accounts_user_id ON oauth_accounts(user_id);
CREATE INDEX IF NOT EXISTS IDX_oauth_accounts_provider ON oauth_accounts(provider);

-- Add index for refresh token lookups
CREATE INDEX IF NOT EXISTS IDX_users_refresh_token ON users (refresh_token);

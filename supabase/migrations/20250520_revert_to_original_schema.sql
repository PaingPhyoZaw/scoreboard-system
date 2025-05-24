-- Drop new tables and functions if they exist
DROP FUNCTION IF EXISTS get_all_engineers_stats();
DROP FUNCTION IF EXISTS get_role_performance();
DROP TABLE IF EXISTS score_category_values;
DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS score_categories;

-- Revert users table to original structure
ALTER TABLE IF EXISTS users 
    ALTER COLUMN id TYPE BIGINT,
    ALTER COLUMN id SET DEFAULT nextval('users_id_seq');

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can update their own record" ON users;
DROP POLICY IF EXISTS "Users can insert their own scores" ON scores;
DROP POLICY IF EXISTS "Users can update their own scores" ON scores;
DROP POLICY IF EXISTS "Score category values are viewable by authenticated users" ON score_category_values;
DROP POLICY IF EXISTS "Users can insert their score category values" ON score_category_values;
DROP POLICY IF EXISTS "Users can update their score category values" ON score_category_values;
DROP POLICY IF EXISTS "Users are viewable by authenticated users." ON users;
DROP POLICY IF EXISTS "Users are insertable by authenticated users." ON users;
DROP POLICY IF EXISTS "Users are updatable by authenticated users." ON users;
DROP POLICY IF EXISTS "Users are deletable by authenticated users." ON users;

-- Restore original policies
CREATE POLICY "Users are viewable by authenticated users."
    ON users FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users are insertable by authenticated users."
    ON users FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users are updatable by authenticated users."
    ON users FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Users are deletable by authenticated users."
    ON users FOR DELETE
    TO authenticated
    USING (true);

-- Keep the evaluation_fields table as is
-- It should already be in its original state with:
-- id, name, field_type, max_score, role_id, created_at, updated_at

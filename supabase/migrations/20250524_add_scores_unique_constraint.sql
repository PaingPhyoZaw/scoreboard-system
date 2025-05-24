-- Add unique constraint to scores table
ALTER TABLE scores 
ADD CONSTRAINT scores_user_id_score_date_key UNIQUE (user_id, score_date);

-- Drop existing function
DROP FUNCTION IF EXISTS get_all_engineers_stats();

-- Create or replace the function for engineer stats
CREATE OR REPLACE FUNCTION get_all_engineers_stats()
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH monthly_scores AS (
        SELECT 
            u.id as user_id,
            SUM(s.total_score) as total_score,
            COUNT(s.id) * 10 as max_possible_score  -- Assuming each day has max score of 10
        FROM users u
        LEFT JOIN scores s ON s.user_id = u.id 
            AND s.score_date >= date_trunc('month', current_date)
        GROUP BY u.id
    )
    SELECT 
        json_build_object(
            'id', u.id,
            'name', u.full_name,
            'role', r.name,
            'totalScore', COALESCE(ms.total_score, 0),
            'maxPossibleScore', COALESCE(ms.max_possible_score, 0)
        )
    FROM users u
    JOIN roles r ON r.id = u.role_id
    LEFT JOIN monthly_scores ms ON ms.user_id = u.id
    WHERE r.name = 'Engineer'
    ORDER BY ms.total_score DESC NULLS LAST;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_all_engineers_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_engineers_stats() TO service_role;

-- Insert sample scores
INSERT INTO scores (user_id, score_date, total_score)
SELECT 
    u.id,
    d::date,
    7 + random() * 3  -- Random score between 7 and 10
FROM users u
CROSS JOIN generate_series(
    date_trunc('month', current_date)::date,
    current_date,
    '1 day'::interval
) d
JOIN roles r ON r.id = u.role_id
WHERE r.name = 'Engineer'
ON CONFLICT (user_id, score_date) DO NOTHING;

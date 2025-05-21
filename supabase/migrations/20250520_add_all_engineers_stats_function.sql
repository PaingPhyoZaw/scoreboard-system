-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_all_engineers_stats();

-- Create function to get all engineers' month-to-date stats
CREATE FUNCTION get_all_engineers_stats()
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH monthly_scores AS (
        SELECT 
            u.id as user_id,
            COALESCE(AVG(s.total_score), 0) as avg_score,
            COALESCE(MAX(s.target_score), 85) as target_score
        FROM users u
        LEFT JOIN scores s ON s.user_id = u.id 
            AND s.score_date >= date_trunc('month', current_date)
        GROUP BY u.id
    ),
    category_scores AS (
        SELECT 
            s.user_id,
            json_agg(
                json_build_object(
                    'category', c.name,
                    'score', COALESCE(AVG(scv.score), 0),
                    'maxScore', c.max_score
                )
            ) as breakdown
        FROM users u
        CROSS JOIN score_categories c
        LEFT JOIN scores s ON s.user_id = u.id 
            AND s.score_date >= date_trunc('month', current_date)
        LEFT JOIN score_category_values scv ON scv.score_id = s.id 
            AND scv.category_id = c.id
        GROUP BY s.user_id, c.id
    )
    SELECT 
        json_build_object(
            'id', u.id,
            'name', u.full_name,
            'role', r.name,
            'monthToDateScore', ms.avg_score,
            'targetScore', ms.target_score,
            'scoreBreakdown', COALESCE(cs.breakdown, '[]'::json)
        )
    FROM users u
    JOIN roles r ON r.id = u.role_id
    LEFT JOIN monthly_scores ms ON ms.user_id = u.id
    LEFT JOIN category_scores cs ON cs.user_id = u.id
    WHERE r.name = 'Engineer'
    ORDER BY ms.avg_score DESC;
END;
$$;

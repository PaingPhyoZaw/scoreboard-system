-- Drop existing functions
DROP FUNCTION IF EXISTS get_score_statistics();
DROP FUNCTION IF EXISTS get_most_improved();
DROP FUNCTION IF EXISTS get_top_performer();

-- Function to get most improved user (comparing current month's average with last month's)
CREATE OR REPLACE FUNCTION get_most_improved()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    WITH current_month_scores AS (
        SELECT 
            user_id,
            AVG(total_score) as avg_score
        FROM scores
        WHERE score_date >= date_trunc('month', current_date)
        GROUP BY user_id
    ),
    last_month_scores AS (
        SELECT 
            user_id,
            AVG(total_score) as avg_score
        FROM scores
        WHERE score_date >= date_trunc('month', current_date - interval '1 month')
            AND score_date < date_trunc('month', current_date)
        GROUP BY user_id
    ),
    improvement AS (
        SELECT 
            u.id,
            u.full_name,
            r.name as role,
            cms.avg_score as current_score,
            COALESCE(lms.avg_score, 0) as last_score,
            COALESCE(cms.avg_score - lms.avg_score, 0) as improvement
        FROM users u
        JOIN roles r ON r.id = u.role_id
        LEFT JOIN current_month_scores cms ON cms.user_id = u.id
        LEFT JOIN last_month_scores lms ON lms.user_id = u.id
        WHERE cms.avg_score > 0  -- Only consider users with scores this month
    )
    SELECT json_build_object(
        'id', id,
        'name', full_name,
        'role', role,
        'improvement', ROUND(improvement::numeric, 1),
        'currentScore', ROUND(current_score::numeric, 1),
        'lastScore', ROUND(last_score::numeric, 1)
    ) INTO result
    FROM improvement
    WHERE improvement > 0  -- Only positive improvement
    ORDER BY improvement DESC
    LIMIT 1;

    RETURN COALESCE(result, '{}'::json);
END;
$$;

-- Function to get top performer of current month
CREATE OR REPLACE FUNCTION get_top_performer()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    WITH monthly_scores AS (
        SELECT 
            user_id,
            AVG(total_score) as avg_score,
            COUNT(*) as score_count
        FROM scores
        WHERE score_date >= date_trunc('month', current_date)
        GROUP BY user_id
        HAVING COUNT(*) >= 5  -- Must have at least 5 scores to qualify
    )
    SELECT json_build_object(
        'id', u.id,
        'name', u.full_name,
        'role', r.name,
        'score', ROUND(ms.avg_score::numeric, 1)
    ) INTO result
    FROM monthly_scores ms
    JOIN users u ON u.id = ms.user_id
    JOIN roles r ON r.id = u.role_id
    ORDER BY ms.avg_score DESC
    LIMIT 1;

    RETURN COALESCE(result, '{}'::json);
END;
$$;

-- Function to get overall score statistics
CREATE OR REPLACE FUNCTION get_score_statistics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    WITH monthly_stats AS (
        SELECT 
            COUNT(DISTINCT user_id) as active_users,
            COUNT(*) as total_scores,
            AVG(total_score) as average_score,
            MAX(total_score) as highest_score,
            MIN(total_score) as lowest_score
        FROM scores
        WHERE score_date >= date_trunc('month', current_date)
    )
    SELECT json_build_object(
        'activeUsers', active_users,
        'totalScores', total_scores,
        'averageScore', ROUND(COALESCE(average_score, 0)::numeric, 1),
        'highestScore', ROUND(COALESCE(highest_score, 0)::numeric, 1),
        'lowestScore', ROUND(COALESCE(lowest_score, 0)::numeric, 1)
    ) INTO result
    FROM monthly_stats;

    RETURN COALESCE(result, '{}'::json);
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_most_improved() TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_performer() TO authenticated;
GRANT EXECUTE ON FUNCTION get_score_statistics() TO authenticated;

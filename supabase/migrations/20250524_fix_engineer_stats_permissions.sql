-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_all_engineers_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_engineers_stats() TO service_role;

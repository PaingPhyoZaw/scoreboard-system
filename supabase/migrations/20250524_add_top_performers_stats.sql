-- Function to get overall dashboard statistics
create or replace function get_dashboard_stats()
returns table (
  overall_completion numeric,
  team_average_score numeric,
  top_performer_id uuid,
  top_performer_score numeric,
  top_performer_percentage numeric
)
language plpgsql
security definer
as $$
declare
  v_overall_completion numeric;
  v_team_average_score numeric;
  v_top_performer record;
begin
  -- Get overall completion and team average
  with user_stats as (
    select 
      user_id,
      sum(total_score) as total_score,
      round((sum(total_score)::numeric / nullif(sum(target_score), 0) * 100), 1) as completion_percentage
    from scores
    group by user_id
  )
  select 
    round(avg(completion_percentage), 1),
    round(avg(total_score), 1)
  into
    v_overall_completion,
    v_team_average_score
  from user_stats;

  -- Get top performer
  with top_stats as (
    select 
      user_id,
      sum(total_score) as total_score,
      round((sum(total_score)::numeric / nullif(sum(target_score), 0) * 100), 1) as completion_percentage
    from scores
    group by user_id
    order by sum(total_score) desc
    limit 1
  )
  select 
    user_id,
    total_score,
    completion_percentage
  into v_top_performer
  from top_stats;

  -- Return final results
  return query
  select
    coalesce(v_overall_completion, 0),
    coalesce(v_team_average_score, 0),
    v_top_performer.user_id,
    coalesce(v_top_performer.total_score, 0),
    coalesce(v_top_performer.completion_percentage, 0);
end;
$$;

-- Grant access to the function
grant execute on function get_dashboard_stats to authenticated;
grant execute on function get_dashboard_stats to service_role;
      total_score,
      completion_percentage
    from user_scores
    order by total_score desc
    limit 1
  )
  select
    round(avg(us.completion_percentage), 1) as overall_completion,
    round(avg(s.total_score), 1) as team_average_score,
    tp.user_id as top_performer_id,
    tp.total_score as top_performer_score,
    tp.completion_percentage as top_performer_percentage
  from user_scores us
  cross join top_performer tp
  left join scores s on true;
end;
$$;

-- Grant access to the function
grant execute on function get_top_performers_stats to authenticated;
grant execute on function get_top_performers_stats to service_role;

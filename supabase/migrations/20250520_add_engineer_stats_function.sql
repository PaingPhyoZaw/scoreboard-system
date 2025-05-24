-- Create function to get engineer's month-to-date stats
create or replace function get_engineer_month_to_date_stats()
returns json
language plpgsql
security definer
as $$
declare
  current_user_id uuid;
  result json;
begin
  -- Get the current authenticated user's ID
  current_user_id := auth.uid();
  
  -- Get the user's month-to-date stats
  select json_build_object(
    'monthToDateScore', coalesce(avg(s.total_score), 0),
    'targetScore', coalesce(max(s.target_score), 0),
    'scoreBreakdown', (
      select json_agg(json_build_object(
        'category', c.name,
        'score', coalesce(avg(sc.score), 0),
        'maxScore', c.max_score
      ))
      from score_categories c
      left join score_category_values sc on sc.category_id = c.id
      and sc.score_id in (
        select id from scores 
        where user_id = current_user_id 
        and score_date >= date_trunc('month', current_date)
      )
      group by c.id, c.name, c.max_score
    )
  ) into result
  from scores s
  where s.user_id = current_user_id
  and s.score_date >= date_trunc('month', current_date);

  return result;
end;
$$;

create or replace function public.get_score_statistics()
returns table (
  total_scores bigint,
  average_score numeric,
  highest_score numeric,
  lowest_score numeric
)
language plpgsql
security definer
as $$
begin
  return query
  select
    count(*)::bigint as total_scores,
    round(avg(total_score)::numeric, 2) as average_score,
    max(total_score)::numeric as highest_score,
    min(total_score)::numeric as lowest_score
  from scores
  where score_date >= current_date - interval '30 days';
end;
$$;

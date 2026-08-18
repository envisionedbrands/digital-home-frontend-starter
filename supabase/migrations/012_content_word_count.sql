-- 012: store word_count on content_objects so pages stop reading every body.
--
-- /blog and /llms.txt were selecting the FULL BODY of every published article on
-- every request purely to print "8 min read". That payload grows with the
-- archive and is discarded immediately. A trigger keeps the count correct
-- without any application involvement, so no writer needs to remember it.
--
-- Safe to run more than once.

alter table content_objects
  add column if not exists word_count integer;

create or replace function content_objects_set_word_count()
returns trigger
language plpgsql
as $$
begin
  -- Strip tags, collapse whitespace, count what's left.
  new.word_count := coalesce(
    array_length(
      regexp_split_to_array(
        btrim(regexp_replace(coalesce(new.body, ''), '<[^>]*>', ' ', 'g')),
        '\s+'
      ),
      1
    ),
    0
  );
  return new;
end;
$$;

drop trigger if exists trg_content_objects_word_count on content_objects;
create trigger trg_content_objects_word_count
  before insert or update of body on content_objects
  for each row execute function content_objects_set_word_count();

-- Backfill everything that already exists.
update content_objects
set word_count = coalesce(
  array_length(
    regexp_split_to_array(
      btrim(regexp_replace(coalesce(body, ''), '<[^>]*>', ' ', 'g')),
      '\s+'
    ),
    1
  ),
  0
)
where word_count is null;

-- Confirmation: every published article should have a non-null count.
select count(*) filter (where word_count is null) as still_null,
       count(*)                                   as total,
       min(word_count)                            as min_words,
       max(word_count)                            as max_words
from content_objects
where status = 'published';

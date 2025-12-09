-- DDL view, fungsi, dan trigger utama aplikasi (schema public)
-- Diambil dari output_schema.sql (Supabase pg_dump)

------------------------------------------------------------
-- FUNCTION: public.set_updated_at_timestamp()
------------------------------------------------------------

CREATE FUNCTION public.set_updated_at_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

ALTER FUNCTION public.set_updated_at_timestamp() OWNER TO postgres;


------------------------------------------------------------
-- FUNCTION: public.get_daily_nutrition(p_user_id uuid, p_date date)
-- Mengembalikan total kalori, protein, karbohidrat, dan lemak
-- untuk satu user pada satu tanggal tertentu, berdasarkan tabel
-- public.food_logs dan public.makanan.
------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_daily_nutrition(
  p_user_id uuid,
  p_date date
)
RETURNS TABLE (
  total_calories numeric,
  total_protein  numeric,
  total_carbs    numeric,
  total_fat      numeric
)
LANGUAGE sql
AS $$
  SELECT
    COALESCE(SUM(fl.calories), 0)            AS total_calories,
    COALESCE(SUM(m.proteins), 0)            AS total_protein,
    COALESCE(SUM(m.carbohydrate), 0)        AS total_carbs,
    COALESCE(SUM(m.fat), 0)                 AS total_fat
  FROM public.food_logs fl
  LEFT JOIN public.makanan m ON m.id = fl.food_id
  WHERE fl.user_id = p_user_id
    AND fl.date = p_date;
$$;

ALTER FUNCTION public.get_daily_nutrition(uuid, date) OWNER TO postgres;


------------------------------------------------------------
-- VIEW: public.view_forum_comments
------------------------------------------------------------

CREATE VIEW public.view_forum_comments AS
 SELECT c.id,
    c.forum_id,
    f.title AS forum_title,
    c.user_id,
    u.username,
    u.email,
    u.role,
    c.content,
    c.parent_comment_id,
    c.created_at AS comment_created_at,
    c.updated_at AS comment_updated_at
   FROM ((public.forum_comments c
     JOIN public.forums f ON ((f.id = c.forum_id)))
     JOIN public.users u ON ((u.id = c.user_id)));

ALTER VIEW public.view_forum_comments OWNER TO postgres;


------------------------------------------------------------
-- VIEW: public.view_forums
------------------------------------------------------------

CREATE VIEW public.view_forums AS
 SELECT f.id,
    f.user_id,
    u.username,
    u.email,
    u.role,
    f.title,
    f.content,
    f.is_locked,
    f.created_at AS forum_created_at,
    f.updated_at AS forum_updated_at,
    COALESCE(fc_stats.comment_count, (0)::bigint) AS comment_count
   FROM ((public.forums f
     JOIN public.users u ON ((u.id = f.user_id)))
     LEFT JOIN ( SELECT forum_comments.forum_id,
            count(*) AS comment_count
           FROM public.forum_comments
          GROUP BY forum_comments.forum_id) fc_stats ON ((fc_stats.forum_id = f.id)));

ALTER VIEW public.view_forums OWNER TO postgres;


------------------------------------------------------------
-- TRIGGER: set_forum_comments_updated_at on public.forum_comments
------------------------------------------------------------

CREATE TRIGGER set_forum_comments_updated_at
BEFORE UPDATE ON public.forum_comments
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();


------------------------------------------------------------
-- TRIGGER: set_forums_updated_at on public.forums
------------------------------------------------------------

CREATE TRIGGER set_forums_updated_at
BEFORE UPDATE ON public.forums
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

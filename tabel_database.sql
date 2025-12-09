-- DDL utama untuk tabel aplikasi di schema public
-- Diambil dari output_schema.sql (Supabase pg_dump)

------------------------------------------------------------
-- Tabel: public.users
------------------------------------------------------------

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    firebase_uid text NOT NULL,
    email text,
    username text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    daily_calorie_target numeric DEFAULT 2000,
    role text DEFAULT 'user'::text NOT NULL,
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['user'::text, 'admin'::text])))
);

ALTER TABLE public.users OWNER TO postgres;

COMMENT ON TABLE public.users IS 'data user';

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_firebase_uid_key UNIQUE (firebase_uid);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


------------------------------------------------------------
-- Tabel: public.makanan
------------------------------------------------------------

CREATE TABLE public.makanan (
    id bigint NOT NULL,
    calories double precision,
    proteins double precision,
    fat double precision,
    carbohydrate numeric,
    name text,
    image text
);

ALTER TABLE public.makanan OWNER TO postgres;

COMMENT ON TABLE public.makanan IS 'berisi data makanan';

CREATE SEQUENCE public.makanan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.makanan_id_seq OWNER TO postgres;

ALTER SEQUENCE public.makanan_id_seq OWNED BY public.makanan.id;

ALTER TABLE ONLY public.makanan
    ALTER COLUMN id SET DEFAULT nextval('public.makanan_id_seq'::regclass);

ALTER TABLE ONLY public.makanan
    ADD CONSTRAINT makanan_pkey PRIMARY KEY (id);


------------------------------------------------------------
-- Tabel: public.food_logs
------------------------------------------------------------

CREATE TABLE public.food_logs (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    food_id bigint,
    food_name_custom text,
    date date NOT NULL,
    logged_at timestamp with time zone DEFAULT now() NOT NULL,
    portion numeric DEFAULT 1,
    calories numeric NOT NULL
);

ALTER TABLE public.food_logs OWNER TO postgres;

COMMENT ON TABLE public.food_logs IS 'data makanan user yang disimpan untuk menghitung kalori';

CREATE SEQUENCE public.food_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.food_logs_id_seq OWNER TO postgres;

ALTER SEQUENCE public.food_logs_id_seq OWNED BY public.food_logs.id;

ALTER TABLE ONLY public.food_logs
    ALTER COLUMN id SET DEFAULT nextval('public.food_logs_id_seq'::regclass);

ALTER TABLE ONLY public.food_logs
    ADD CONSTRAINT food_logs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.food_logs
    ADD CONSTRAINT food_logs_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.makanan(id);

ALTER TABLE ONLY public.food_logs
    ADD CONSTRAINT food_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


------------------------------------------------------------
-- Tabel: public.forums
------------------------------------------------------------

CREATE TABLE public.forums (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    is_locked boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.forums OWNER TO postgres;

CREATE SEQUENCE public.forums_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.forums_id_seq OWNER TO postgres;

ALTER SEQUENCE public.forums_id_seq OWNED BY public.forums.id;

ALTER TABLE ONLY public.forums
    ALTER COLUMN id SET DEFAULT nextval('public.forums_id_seq'::regclass);

ALTER TABLE ONLY public.forums
    ADD CONSTRAINT forums_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.forums
    ADD CONSTRAINT forums_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


------------------------------------------------------------
-- Tabel: public.forum_comments
------------------------------------------------------------

CREATE TABLE public.forum_comments (
    id bigint NOT NULL,
    forum_id bigint NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    parent_comment_id bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.forum_comments OWNER TO postgres;

CREATE SEQUENCE public.forum_comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.forum_comments_id_seq OWNER TO postgres;

ALTER SEQUENCE public.forum_comments_id_seq OWNED BY public.forum_comments.id;

ALTER TABLE ONLY public.forum_comments
    ALTER COLUMN id SET DEFAULT nextval('public.forum_comments_id_seq'::regclass);

ALTER TABLE ONLY public.forum_comments
    ADD CONSTRAINT forum_comments_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.forum_comments
    ADD CONSTRAINT forum_comments_forum_id_fkey FOREIGN KEY (forum_id) REFERENCES public.forums(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.forum_comments
    ADD CONSTRAINT forum_comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.forum_comments(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.forum_comments
    ADD CONSTRAINT forum_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


------------------------------------------------------------
-- Tabel: public.testimonials
------------------------------------------------------------

CREATE TABLE public.testimonials (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    username character varying(100) NOT NULL,
    job character varying(100) NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.testimonials OWNER TO postgres;

COMMENT ON TABLE public.testimonials IS 'berisi data testimonial user';

CREATE SEQUENCE public.testimonials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.testimonials_id_seq OWNER TO postgres;

ALTER SEQUENCE public.testimonials_id_seq OWNED BY public.testimonials.id;

ALTER TABLE ONLY public.testimonials
    ALTER COLUMN id SET DEFAULT nextval('public.testimonials_id_seq'::regclass);

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

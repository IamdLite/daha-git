--
-- PostgreSQL database dump
--


-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: courselevel; Type: TYPE; Schema: public; Owner: my_user
--

CREATE TYPE public.courselevel AS ENUM (
    'BEGINNER',
    'INTERMEDIATE',
    'ADVANCED',
    'ALL_LEVELS'
);


ALTER TYPE public.courselevel OWNER TO my_user;

--
-- Name: userrole; Type: TYPE; Schema: public; Owner: my_user
--

CREATE TYPE public.userrole AS ENUM (
    'ADMIN',
    'USER'
);


ALTER TYPE public.userrole OWNER TO my_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: category; Type: TABLE; Schema: public; Owner: my_user
--

CREATE TABLE public.category (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.category OWNER TO my_user;

--
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: my_user
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.category_id_seq OWNER TO my_user;

--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: my_user
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- Name: course; Type: TABLE; Schema: public; Owner: my_user
--

CREATE TABLE public.course (
    id integer NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    url character varying NOT NULL,
    provider character varying NOT NULL,
    level public.courselevel NOT NULL,
    category_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.course OWNER TO my_user;

--
-- Name: course_id_seq; Type: SEQUENCE; Schema: public; Owner: my_user
--

CREATE SEQUENCE public.course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.course_id_seq OWNER TO my_user;

--
-- Name: course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: my_user
--

ALTER SEQUENCE public.course_id_seq OWNED BY public.course.id;


--
-- Name: coursegradelink; Type: TABLE; Schema: public; Owner: my_user
--

CREATE TABLE public.coursegradelink (
    course_id integer NOT NULL,
    grade_id integer NOT NULL
);


ALTER TABLE public.coursegradelink OWNER TO my_user;

--
-- Name: grade; Type: TABLE; Schema: public; Owner: my_user
--

CREATE TABLE public.grade (
    id integer NOT NULL,
    level integer NOT NULL
);


ALTER TABLE public.grade OWNER TO my_user;

--
-- Name: grade_id_seq; Type: SEQUENCE; Schema: public; Owner: my_user
--

CREATE SEQUENCE public.grade_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.grade_id_seq OWNER TO my_user;

--
-- Name: grade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: my_user
--

ALTER SEQUENCE public.grade_id_seq OWNED BY public.grade.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: my_user
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying,
    first_name character varying NOT NULL,
    role public.userrole NOT NULL,
    saved_filters json,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO my_user;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: my_user
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO my_user;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: my_user
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: category id; Type: DEFAULT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- Name: course id; Type: DEFAULT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.course ALTER COLUMN id SET DEFAULT nextval('public.course_id_seq'::regclass);


--
-- Name: grade id; Type: DEFAULT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.grade ALTER COLUMN id SET DEFAULT nextval('public.grade_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: my_user
--

COPY public.category (id, name) FROM stdin;
1	╨Ш╤Б╨║╤Г╤Б╤Б╤В╨▓╨╡╨╜╨╜╤Л╨╣ ╨╕╨╜╤В╨╡╨╗╨╗╨╡╨║╤В
2	╨Я╤А╨╛╨│╤А╨░╨╝╨╝╨╕╤А╨╛╨▓╨░╨╜╨╕╨╡
3	╨Ш╨╜╤Д╨╛╤А╨╝╨░╤Ж╨╕╨╛╨╜╨╜╨░╤П ╨▒╨╡╨╖╨╛╨┐╨░╤Б╨╜╨╛╤Б╤В╤М
5	╨Я╤А╨╡╨┤╨┐╤А╨╕╨╜╨╕╨╝╨░╤В╨╡╨╗╤М╤Б╤В╨▓╨╛
4	╨а╨╛╨▒╨╛╤В╨╛╤В╨╡╤Е╨╜╨╕╨║╨░
6	╨д╨╕╨╜╨░╨╜╤Б╨╛╨▓╨░╤П ╨│╤А╨░╨╝╨╛╤В╨╜╨╛╤Б╤В╤М
7	╨Э╨░╤Г╨║╨░
\.


--
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: my_user
--

COPY public.course (id, title, description, url, provider, level, category_id, created_at, updated_at) FROM stdin;
57	╨Я╤А╨╛╨│╤А╨░╨╝╨╝╨╕╤А╨╛╨▓╨░╨╜╨╕╨╡ ╨╝╨╕╨║╤А╨╛╨║╨╛╨╜╤В╤А╨╛╨╗╨╗╨╡╤А╨╛╨▓ Arduino	╨Я╨╛╤Б╨╗╨╡ ╨║╤Г╤А╤Б╨░ ╤Б╨╝╨╛╨╢╨╡╤И╤М ╤Б╨╛╨╖╨┤╨░╨▓╨░╤В╤М ╤Б╨╛╨▒╤Б╤В╨▓╨╡╨╜╨╜╤Л╨╡ ╤Г╤Б╤В╤А╨╛╨╣╤Б╤В╨▓╨░ ╤Г╨╝╨╜╨╛╨│╨╛ ╨┤╨╛╨╝╨░. ╨г╤З╨░╤Б╤В╨╜╨╕╨║╨╕ ╤Б╨╛╨╖╨┤╨░╨┤╤Г╤В ╤Б╨╛╨▒╤Б╤В╨▓╨╡╨╜╨╜╤Л╨╡ ╤А╨╛╨▒╨╛╤В╨╕╨╖╨╕╤А╨╛╨▓╨░╨╜╨╜╤Л╨╡ ╤Б╨╕╤Б╤В╨╡╨╝╤Л ╤Б ╨┐╤А╨╕╨╝╨╡╨╜╨╡╨╜╨╕╨╡╨╝ ╤Б╨╛╨▓╤А╨╡╨╝╨╡╨╜╨╜╤Л╤Е ╤В╨╡╤Е╨╜╨╛╨╗╨╛╨│╨╕╨╣. ╨Я╤А╨╛╨│╤А╨░╨╝╨╝╨░ ╨▓╨║╨╗╤О╤З╨░╨╡╤В ╨┐╤А╨╛╨╡╨║╤В╨╕╤А╨╛╨▓╨░╨╜╨╕╨╡, ╤Б╨▒╨╛╤А╨║╤Г ╨╕ ╨┐╤А╨╛╨│╤А╨░╨╝╨╝╨╕╤А╨╛╨▓╨░╨╜╨╕╨╡ ╨░╨▓╤В╨╛╨╜╨╛╨╝╨╜╤Л╤Е ╤Г╤Б╤В╤А╨╛╨╣╤Б╤В╨▓.	https://amperka.ru/	╨б╨║╨╛╨╗╤В╨╡╤Е	BEGINNER	4	2025-06-20 16:20:35.642504	2025-06-20 16:20:35.642504
58	╨а╨░╨╖╤А╨░╨▒╨╛╤В╨║╨░ ╨╕╨│╤А ╨╜╨░ Unity	╨Т╨╛╨╖╨╝╨╛╨╢╨╜╨╛╤Б╤В╤М ╨┤╨╛╨▒╨░╨▓╨╕╤В╤М ╨┐╤А╨╛╨╡╨║╤В╤Л ╨▓ ╨┐╨╛╤А╤В╤Д╨╛╨╗╨╕╨╛ ╨┤╨╗╤П ╨▒╤Г╨┤╤Г╤Й╨╕╤Е ╤А╨░╨▒╨╛╤В╨╛╨┤╨░╤В╨╡╨╗╨╡╨╣. ╨Ю╨▒╤Г╤З╨╡╨╜╨╕╨╡ ╤Б╤В╤А╨╛╨╕╤В╤Б╤П ╨╜╨░ ╤А╨╡╤И╨╡╨╜╨╕╨╕ ╨┐╤А╨░╨║╤В╨╕╤З╨╡╤Б╨║╨╕╤Е ╨╖╨░╨┤╨░╤З ╤Б ╨┐╨╛╤Б╤В╨╡╨┐╨╡╨╜╨╜╤Л╨╝ ╨┐╨╛╨▓╤Л╤И╨╡╨╜╨╕╨╡╨╝ ╤Б╨╗╨╛╨╢╨╜╨╛╤Б╤В╨╕. ╨г╤З╨░╤Б╤В╨╜╨╕╨║╨╕ ╨╜╨░╤Г╤З╨░╤В╤Б╤П ╨┐╨╕╤Б╨░╤В╤М ╨╛╨┐╤В╨╕╨╝╨░╨╗╤М╨╜╤Л╨╣ ╨╕ ╤З╨╕╤В╨░╨╡╨╝╤Л╨╣ ╨║╨╛╨┤, ╤А╨░╨▒╨╛╤В╨░╤П ╨╜╨░╨┤ ╤А╨╡╨░╨╗╤М╨╜╤Л╨╝╨╕ ╨┐╤А╨╛╨╡╨║╤В╨░╨╝╨╕.	https://unity.com/learn	VK	INTERMEDIATE	2	2025-06-20 16:28:18.495708	2025-06-20 16:28:18.495708
59	╨Ю╤Б╨╜╨╛╨▓╤Л ╨║╨╕╨▒╨╡╤А╨▒╨╡╨╖╨╛╨┐╨░╤Б╨╜╨╛╤Б╤В╨╕	╨Я╤А╨╡╨┐╨╛╨┤╨░╤О╤В ╨┤╨╡╨╣╤Б╤В╨▓╤Г╤О╤Й╨╕╨╡ ╤Н╨║╤Б╨┐╨╡╤А╤В╤Л ╨┐╨╛ ╨╕╨╜╤Д╨╛╤А╨╝╨░╤Ж╨╕╨╛╨╜╨╜╨╛╨╣ ╨▒╨╡╨╖╨╛╨┐╨░╤Б╨╜╨╛╤Б╤В╨╕. ╨Ш╨╖╤Г╤З╨░╤О╤В╤Б╤П ╨╝╨╡╤В╨╛╨┤╤Л ╨╖╨░╤Й╨╕╤В╤Л ╨╕╨╜╤Д╨╛╤А╨╝╨░╤Ж╨╕╨╕ ╨╕ ╨┐╤А╨╛╤В╨╕╨▓╨╛╨┤╨╡╨╣╤Б╤В╨▓╨╕╤П ╤Б╨╛╨▓╤А╨╡╨╝╨╡╨╜╨╜╤Л╨╝ ╨║╨╕╨▒╨╡╤А╤Г╨│╤А╨╛╨╖╨░╨╝. ╨Ъ╤Г╤А╤Б ╨┤╨░╨╡╤В ╨┐╤А╨░╨║╤В╨╕╤З╨╡╤Б╨║╨╕╨╡ ╨╜╨░╨▓╤Л╨║╨╕ ╨╛╨▒╨╜╨░╤А╤Г╨╢╨╡╨╜╨╕╤П ╤Г╤П╨╖╨▓╨╕╨╝╨╛╤Б╤В╨╡╨╣ ╨╕ ╨┐╨╛╤Б╤В╤А╨╛╨╡╨╜╨╕╤П ╨╖╨░╤Й╨╕╤Й╨╡╨╜╨╜╤Л╤Е ╤Б╨╕╤Б╤В╨╡╨╝.	https://securitytrainings.ru/	╨б╨▒╨╡╤А╨Ъ╨╕╨▒╨╡╤А	BEGINNER	3	2025-06-20 16:29:56.184946	2025-06-20 16:29:56.184946
60	╨н╤В╨╕╤З╨╜╤Л╨╣ ╤Е╨░╨║╨╕╨╜╨│ ╨╕ ╤В╨╡╤Б╤В╨╕╤А╨╛╨▓╨░╨╜╨╕╨╡ ╨╜╨░ ╨┐╤А╨╛╨╜╨╕╨║╨╜╨╛╨▓╨╡╨╜╨╕╨╡	╨Я╨╛╨╝╨╛╨│╨░╨╡╤В ╤А╨░╨╖╨▓╨╕╤В╤М ╨░╨╜╨░╨╗╨╕╤В╨╕╤З╨╡╤Б╨║╨╛╨╡ ╨╝╤Л╤И╨╗╨╡╨╜╨╕╨╡ ╨╕ ╨▓╨╜╨╕╨╝╨░╨╜╨╕╨╡ ╨║ ╨┤╨╡╤В╨░╨╗╤П╨╝. ╨Ш╨╖╤Г╤З╨░╤О╤В╤Б╤П ╨╝╨╡╤В╨╛╨┤╤Л ╨╖╨░╤Й╨╕╤В╤Л ╨╕╨╜╤Д╨╛╤А╨╝╨░╤Ж╨╕╨╕ ╨╕ ╨┐╤А╨╛╤В╨╕╨▓╨╛╨┤╨╡╨╣╤Б╤В╨▓╨╕╤П ╤Б╨╛╨▓╤А╨╡╨╝╨╡╨╜╨╜╤Л╨╝ ╨║╨╕╨▒╨╡╤А╤Г╨│╤А╨╛╨╖╨░╨╝. ╨Ъ╤Г╤А╤Б ╨┤╨░╨╡╤В ╨┐╤А╨░╨║╤В╨╕╤З╨╡╤Б╨║╨╕╨╡ ╨╜╨░╨▓╤Л╨║╨╕ ╨╛╨▒╨╜╨░╤А╤Г╨╢╨╡╨╜╨╕╤П ╤Г╤П╨╖╨▓╨╕╨╝╨╛╤Б╤В╨╡╨╣ ╨╕ ╨┐╨╛╤Б╤В╤А╨╛╨╡╨╜╨╕╤П ╨╖╨░╤Й╨╕╤Й╨╡╨╜╨╜╤Л╤Е ╤Б╨╕╤Б╤В╨╡╨╝.	https://skillbox.ru/	╨Ы╨░╨▒╨╛╤А╨░╤В╨╛╤А╨╕╤П ╨Ъ╨░╤Б╨┐╨╡╤А╤Б╨║╨╛╨│╨╛	ADVANCED	3	2025-06-20 16:31:17.899969	2025-06-20 16:31:17.899969
61	╨Я╤А╨╡╨┤╨┐╤А╨╕╨╜╨╕╨╝╨░╤В╨╡╨╗╤М╤Б╤В╨▓╨╛ ╨┤╨╗╤П ╤И╨║╨╛╨╗╤М╨╜╨╕╨║╨╛╨▓	╨Т╨╛╨╖╨╝╨╛╨╢╨╜╨╛╤Б╤В╤М ╨╖╨░╨┐╤Г╤Б╤В╨╕╤В╤М ╤Б╨▓╨╛╨╣ ╨┐╨╡╤А╨▓╤Л╨╣ ╨▒╨╕╨╖╨╜╨╡╤Б-╨┐╤А╨╛╨╡╨║╤В ╨┐╨╛╨┤ ╨╜╨░╤Б╤В╨░╨▓╨╜╨╕╤З╨╡╤Б╤В╨▓╨╛╨╝. ╨б╨╗╤Г╤И╨░╤В╨╡╨╗╨╕ ╤А╨░╨╖╤А╨░╨▒╨╛╤В╨░╤О╤В ╤Б╨╛╨▒╤Б╤В╨▓╨╡╨╜╨╜╤Л╨╣ ╨▒╨╕╨╖╨╜╨╡╤Б-╨┐╨╗╨░╨╜ ╨╕ ╨╕╨╖╤Г╤З╨░╤В ╤Б╤В╤А╨░╤В╨╡╨│╨╕╨╕ ╨┐╤А╨╕╨▓╨╗╨╡╤З╨╡╨╜╨╕╤П ╨╕╨╜╨▓╨╡╤Б╤В╨╕╤Ж╨╕╨╣. ╨Т ╨┐╤А╨╛╨│╤А╨░╨╝╨╝╤Г ╨▓╨║╨╗╤О╤З╨╡╨╜╤Л ╨╝╨░╤Б╤В╨╡╤А-╨║╨╗╨░╤Б╤Б╤Л ╨╛╤В ╤Г╤Б╨┐╨╡╤И╨╜╤Л╤Е ╨┐╤А╨╡╨┤╨┐╤А╨╕╨╜╨╕╨╝╨░╤В╨╡╨╗╨╡╨╣ ╨╕ ╨▓╨╡╨╜╤З╤Г╤А╨╜╤Л╤Е ╨╕╨╜╨▓╨╡╤Б╤В╨╛╤А╨╛╨▓.	https://business-youth.ru/	╨Т╤Л╤Б╤И╨░╤П ╤И╨║╨╛╨╗╨░ ╤Н╨║╨╛╨╜╨╛╨╝╨╕╨║╨╕	ADVANCED	5	2025-06-20 16:33:36.941707	2025-06-20 16:33:36.941707
62	╨Ю╤В ╨╕╨┤╨╡╨╕ ╨┤╨╛ ╤Б╤В╨░╤А╤В╨░╨┐╨░	╨и╨░╨╜╤Б ╨┐╨╛╨╗╤Г╤З╨╕╤В╤М ╤Д╨╕╨╜╨░╨╜╤Б╨╕╤А╨╛╨▓╨░╨╜╨╕╨╡ ╨╛╤В ╨╕╨╜╨▓╨╡╤Б╤В╨╛╤А╨╛╨▓ ╨┤╨╗╤П ╨╗╤Г╤З╤И╨╕╤Е ╨┐╤А╨╛╨╡╨║╤В╨╛╨▓. ╨б╨╗╤Г╤И╨░╤В╨╡╨╗╨╕ ╤А╨░╨╖╤А╨░╨▒╨╛╤В╨░╤О╤В ╤Б╨╛╨▒╤Б╤В╨▓╨╡╨╜╨╜╤Л╨╣ ╨▒╨╕╨╖╨╜╨╡╤Б-╨┐╨╗╨░╨╜ ╨╕ ╨╕╨╖╤Г╤З╨░╤В ╤Б╤В╤А╨░╤В╨╡╨│╨╕╨╕ ╨┐╤А╨╕╨▓╨╗╨╡╤З╨╡╨╜╨╕╤П ╨╕╨╜╨▓╨╡╤Б╤В╨╕╤Ж╨╕╨╣. ╨Т ╨┐╤А╨╛╨│╤А╨░╨╝╨╝╤Г ╨▓╨║╨╗╤О╤З╨╡╨╜╤Л ╨╝╨░╤Б╤В╨╡╤А-╨║╨╗╨░╤Б╤Б╤Л ╨╛╤В ╤Г╤Б╨┐╨╡╤И╨╜╤Л╤Е ╨┐╤А╨╡╨┤╨┐╤А╨╕╨╜╨╕╨╝╨░╤В╨╡╨╗╨╡╨╣ ╨╕ ╨▓╨╡╨╜╤З╤Г╤А╨╜╤Л╤Е ╨╕╨╜╨▓╨╡╤Б╤В╨╛╤А╨╛╨▓.	https://practicumglobal.ru/	╨б╨║╨╛╨╗╨║╨╛╨▓╨╛	INTERMEDIATE	5	2025-06-20 16:36:37.07279	2025-06-20 16:36:37.07279
52	╨Ю╤Б╨╜╨╛╨▓╤Л ╨╝╨░╤И╨╕╨╜╨╜╨╛╨│╨╛ ╨╛╨▒╤Г╤З╨╡╨╜╨╕╤П ╨╕ ╨╜╨╡╨╣╤А╨╛╨╜╨╜╤Л╤Е ╤Б╨╡╤В╨╡╨╣	╨Т╨╡╨┤╤Г╤В ╤Б╨┐╨╡╤Ж╨╕╨░╨╗╨╕╤Б╤В╤Л ╨╕╨╖ ╨п╨╜╨┤╨╡╨║╤Б╨░ ╤Б ╤А╨╡╨░╨╗╤М╨╜╤Л╨╝╨╕ ╨║╨╡╨╣╤Б╨░╨╝╨╕ ╨╕╨╖ ╨╕╨╜╨┤╤Г╤Б╤В╤А╨╕╨╕. ╨б╨╗╤Г╤И╨░╤В╨╡╨╗╨╕ ╨╛╤Б╨▓╨░╨╕╨▓╨░╤О╤В ╨┐╤А╨░╨║╤В╨╕╤З╨╡╤Б╨║╨╕╨╡ ╨╜╨░╨▓╤Л╨║╨╕ ╨┐╨╛╤Б╤В╤А╨╛╨╡╨╜╨╕╤П ╨╜╨╡╨╣╤А╨╛╨╜╨╜╤Л╤Е ╤Б╨╡╤В╨╡╨╣ ╨╕ ╤А╨░╨▒╨╛╤В╤Л ╤Б ╨▒╨╛╨╗╤М╤И╨╕╨╝╨╕ ╨┤╨░╨╜╨╜╤Л╨╝╨╕. ╨Ъ╤Г╤А╤Б ╨▓╨║╨╗╤О╤З╨░╨╡╤В ╤А╨░╨▒╨╛╤В╤Г ╤Б ╤А╨╡╨░╨╗╤М╨╜╤Л╨╝╨╕ ╨┐╤А╨╛╨╡╨║╤В╨░╨╝╨╕ ╨╕ ╨░╨║╤В╤Г╨░╨╗╤М╨╜╤Л╨╝╨╕ ╨╕╨╜╤Б╤В╤А╤Г╨╝╨╡╨╜╤В╨░╨╝╨╕ ╨╕╤Б╨║╤Г╤Б╤Б╤В╨▓╨╡╨╜╨╜╨╛╨│╨╛ ╨╕╨╜╤В╨╡╨╗╨╗╨╡╨║╤В╨░.	https://practicum.yandex.ru/	╨п╨╜╨┤╨╡╨║╤Б	BEGINNER	1	2025-06-20 15:44:40.588039	2025-06-20 15:44:40.588039
55	Python ╨┤╨╗╤П ╨╕╤Б╨║╤Г╤Б╤Б╤В╨▓╨╡╨╜╨╜╨╛╨│╨╛ ╨╕╨╜╤В╨╡╨╗╨╗╨╡╨║╤В╨░	╨Я╨╛╨╝╨╛╨╢╨╡╤В ╨┐╨╛╨┤╨│╨╛╤В╨╛╨▓╨╕╤В╤М╤Б╤П ╨║ ╤Г╤З╨░╤Б╤В╨╕╤О ╨▓ ╨╛╨╗╨╕╨╝╨┐╨╕╨░╨┤╨░╤Е ╨┐╨╛ ╨┐╤А╨╛╨│╤А╨░╨╝╨╝╨╕╤А╨╛╨▓╨░╨╜╨╕╤О. ╨б╨╗╤Г╤И╨░╤В╨╡╨╗╨╕ ╨╛╤Б╨▓╨░╨╕╨▓╨░╤О╤В ╨┐╤А╨░╨║╤В╨╕╤З╨╡╤Б╨║╨╕╨╡ ╨╜╨░╨▓╤Л╨║╨╕ ╨┐╨╛╤Б╤В╤А╨╛╨╡╨╜╨╕╤П ╨╜╨╡╨╣╤А╨╛╨╜╨╜╤Л╤Е ╤Б╨╡╤В╨╡╨╣ ╨╕ ╤А╨░╨▒╨╛╤В╤Л ╤Б ╨▒╨╛╨╗╤М╤И╨╕╨╝╨╕ ╨┤╨░╨╜╨╜╤Л╨╝╨╕. ╨Ъ╤Г╤А╤Б ╨▓╨║╨╗╤О╤З╨░╨╡╤В ╤А╨░╨▒╨╛╤В╤Г ╤Б ╤А╨╡╨░╨╗╤М╨╜╤Л╨╝╨╕ ╨┐╤А╨╛╨╡╨║╤В╨░╨╝╨╕ ╨╕ ╨░╨║╤В╤Г╨░╨╗╤М╨╜╤Л╨╝╨╕ ╨╕╨╜╤Б╤В╤А╤Г╨╝╨╡╨╜╤В╨░╨╝╨╕ ╨╕╤Б╨║╤Г╤Б╤Б╤В╨▓╨╡╨╜╨╜╨╛╨│╨╛ ╨╕╨╜╤В╨╡╨╗╨╗╨╡╨║╤В╨░.	https://stepik.org/	╨б╨╕╤А╨╕╤Г╤Б	BEGINNER	2	2025-06-20 15:59:17.413674	2025-06-20 15:59:17.413674
56	╨а╨╛╨▒╨╛╤В╨╛╤В╨╡╤Е╨╜╨╕╨║╨░ ╨┤╨╗╤П ╨╜╨░╤З╨╕╨╜╨░╤О╤Й╨╕╤Е	╨Т╨║╨╗╤О╤З╨░╨╡╤В ╨┐╤А╨░╨║╤В╨╕╤З╨╡╤Б╨║╨╕╨╡ ╨╖╨░╨╜╤П╤В╨╕╤П ╤Б╨╛ ╤Б╨▒╨╛╤А╨║╨╛╨╣ ╤А╨╡╨░╨╗╤М╨╜╤Л╤Е ╤А╨╛╨▒╨╛╤В╨╛╨▓. ╨г╤З╨░╤Б╤В╨╜╨╕╨║╨╕ ╤Б╨╛╨╖╨┤╨░╨┤╤Г╤В ╤Б╨╛╨▒╤Б╤В╨▓╨╡╨╜╨╜╤Л╨╡ ╤А╨╛╨▒╨╛╤В╨╕╨╖╨╕╤А╨╛╨▓╨░╨╜╨╜╤Л╨╡ ╤Б╨╕╤Б╤В╨╡╨╝╤Л ╤Б ╨┐╤А╨╕╨╝╨╡╨╜╨╡╨╜╨╕╨╡╨╝ ╤Б╨╛╨▓╤А╨╡╨╝╨╡╨╜╨╜╤Л╤Е ╤В╨╡╤Е╨╜╨╛╨╗╨╛╨│╨╕╨╣. ╨Я╤А╨╛╨│╤А╨░╨╝╨╝╨░ ╨▓╨║╨╗╤О╤З╨░╨╡╤В ╨┐╤А╨╛╨╡╨║╤В╨╕╤А╨╛╨▓╨░╨╜╨╕╨╡, ╤Б╨▒╨╛╤А╨║╤Г ╨╕ ╨┐╤А╨╛╨│╤А╨░╨╝╨╝╨╕╤А╨╛╨▓╨░╨╜╨╕╨╡ ╨░╨▓╤В╨╛╨╜╨╛╨╝╨╜╤Л╤Е ╤Г╤Б╤В╤А╨╛╨╣╤Б╤В╨▓.	https://robbo.ru/	╨Ш╨╜╨╜╨╛╨┐╨╛╨╗╨╕╤Б	BEGINNER	4	2025-06-20 16:18:56.631968	2025-06-20 16:18:56.631968
63	╨Ы╨╕╤З╨╜╤Л╨╡ ╤Д╨╕╨╜╨░╨╜╤Б╤Л ╨┤╨╗╤П ╨┐╨╛╨┤╤А╨╛╤Б╤В╨║╨╛╨▓	╨Э╨░╤Г╤З╨╕╤В ╨│╤А╨░╨╝╨╛╤В╨╜╨╛ ╤Г╨┐╤А╨░╨▓╨╗╤П╤В╤М ╤Б╨▓╨╛╨╕╨╝ ╨▒╤О╨┤╨╢╨╡╤В╨╛╨╝ ╨╕ ╨┐╨╗╨░╨╜╨╕╤А╨╛╨▓╨░╤В╤М ╨╜╨░╨║╨╛╨┐╨╗╨╡╨╜╨╕╤П. ╨г╤З╨░╤Б╤В╨╜╨╕╨║╨╕ ╨╜╨░╤Г╤З╨░╤В╤Б╤П ╤Н╤Д╤Д╨╡╨║╤В╨╕╨▓╨╜╨╛ ╤Г╨┐╤А╨░╨▓╨╗╤П╤В╤М ╨╗╨╕╤З╨╜╤Л╨╝╨╕ ╤Д╨╕╨╜╨░╨╜╤Б╨░╨╝╨╕ ╨╕ ╤Б╨╛╨╖╨┤╨░╨▓╨░╤В╤М ╨┐╨░╤Б╤Б╨╕╨▓╨╜╤Л╨╣ ╨┤╨╛╤Е╨╛╨┤. ╨Ъ╤Г╤А╤Б ╨▓╨║╨╗╤О╤З╨░╨╡╤В ╤А╨░╨╖╨▒╨╛╤А ╤А╨╡╨░╨╗╤М╨╜╤Л╤Е ╨╕╨╜╨▓╨╡╤Б╤В╨╕╤Ж╨╕╨╛╨╜╨╜╤Л╤Е ╤Б╤В╤А╨░╤В╨╡╨│╨╕╨╣ ╨╕ ╤Д╨╕╨╜╨░╨╜╤Б╨╛╨▓╤Л╤Е ╨╕╨╜╤Б╤В╤А╤Г╨╝╨╡╨╜╤В╨╛╨▓.	https://fincult.info/	╨ж╨╡╨╜╤В╤А╨░╨╗╤М╨╜╤Л╨╣ ╨▒╨░╨╜╨║ ╨а╨д	BEGINNER	6	2025-06-20 17:47:01.486756	2025-06-20 17:47:01.486756
64	╨Ш╨╜╨▓╨╡╤Б╤В╨╕╤А╨╛╨▓╨░╨╜╨╕╨╡ ╨┤╨╗╤П ╨╜╨░╤З╨╕╨╜╨░╤О╤Й╨╕╤Е	╨Я╤А╨░╨║╤В╨╕╤З╨╡╤Б╨║╨╕╨╡ ╨╜╨░╨▓╤Л╨║╨╕ ╤А╨░╨▒╨╛╤В╤Л ╤Б ╨▒╨╕╤А╨╢╨╡╨▓╤Л╨╝╨╕ ╨╕╨╜╤Б╤В╤А╤Г╨╝╨╡╨╜╤В╨░╨╝╨╕ ╨╜╨░ ╤Г╤З╨╡╨▒╨╜╨╛╨╝ ╤Б╤З╨╡╤В╨╡. ╨г╤З╨░╤Б╤В╨╜╨╕╨║╨╕ ╨╜╨░╤Г╤З╨░╤В╤Б╤П ╤Н╤Д╤Д╨╡╨║╤В╨╕╨▓╨╜╨╛ ╤Г╨┐╤А╨░╨▓╨╗╤П╤В╤М ╨╗╨╕╤З╨╜╤Л╨╝╨╕ ╤Д╨╕╨╜╨░╨╜╤Б╨░╨╝╨╕ ╨╕ ╤Б╨╛╨╖╨┤╨░╨▓╨░╤В╤М ╨┐╨░╤Б╤Б╨╕╨▓╨╜╤Л╨╣ ╨┤╨╛╤Е╨╛╨┤. ╨Ъ╤Г╤А╤Б ╨▓╨║╨╗╤О╤З╨░╨╡╤В ╤А╨░╨╖╨▒╨╛╤А ╤А╨╡╨░╨╗╤М╨╜╤Л╤Е ╨╕╨╜╨▓╨╡╤Б╤В╨╕╤Ж╨╕╨╛╨╜╨╜╤Л╤Е ╤Б╤В╤А╨░╤В╨╡╨│╨╕╨╣ ╨╕ ╤Д╨╕╨╜╨░╨╜╤Б╨╛╨▓╤Л╤Е ╨╕╨╜╤Б╤В╤А╤Г╨╝╨╡╨╜╤В╨╛╨▓.	https://www.tinkoff.ru/invest/education/	╨в╨╕╨╜╤М╨║╨╛╤Д╤Д	INTERMEDIATE	6	2025-06-20 17:48:41.63064	2025-06-20 17:48:41.63064
65	╨б╨╛╨▓╤А╨╡╨╝╨╡╨╜╨╜╨░╤П ╤Д╨╕╨╖╨╕╨║╨░ ╨┤╨╗╤П ╤И╨║╨╛╨╗╤М╨╜╨╕╨║╨╛╨▓	╨Я╨╛╨╝╨╛╨╢╨╡╤В ╨┐╨╛╨┤╨│╨╛╤В╨╛╨▓╨╕╤В╤М╤Б╤П ╨║ ╨╛╨╗╨╕╨╝╨┐╨╕╨░╨┤╨░╨╝ ╨╕ ╨┐╨╛╤Б╤В╤Г╨┐╨╗╨╡╨╜╨╕╤О ╨▓ ╤В╨╡╤Е╨╜╨╕╤З╨╡╤Б╨║╨╕╨╡ ╨▓╤Г╨╖╤Л. ╨Я╤А╨╛╨│╤А╨░╨╝╨╝╨░ ╤Б╨╛╤З╨╡╤В╨░╨╡╤В ╤В╨╡╨╛╤А╨╡╤В╨╕╤З╨╡╤Б╨║╤Г╤О ╨┐╨╛╨┤╨│╨╛╤В╨╛╨▓╨║╤Г ╤Б ╨┐╤А╨░╨║╤В╨╕╤З╨╡╤Б╨║╨╕╨╝╨╕ ╤Н╨║╤Б╨┐╨╡╤А╨╕╨╝╨╡╨╜╤В╨░╨╝╨╕ ╨╕ ╨╕╤Б╤Б╨╗╨╡╨┤╨╛╨▓╨░╨╜╨╕╤П╨╝╨╕. ╨г╤З╨░╤Б╤В╨╜╨╕╨║╨╕ ╤А╨░╨▒╨╛╤В╨░╤О╤В ╤Б ╤Б╨╛╨▓╤А╨╡╨╝╨╡╨╜╨╜╤Л╨╝ ╨╜╨░╤Г╤З╨╜╤Л╨╝ ╨╛╨▒╨╛╤А╤Г╨┤╨╛╨▓╨░╨╜╨╕╨╡╨╝ ╨┐╨╛╨┤ ╤А╤Г╨║╨╛╨▓╨╛╨┤╤Б╤В╨▓╨╛╨╝ ╤Г╤З╨╡╨╜╤Л╤Е-╨┐╤А╨░╨║╤В╨╕╨║╨╛╨▓.	https://mipt.ru/online-courses/	╨Ь╨д╨в╨Ш	ADVANCED	7	2025-06-20 17:50:15.646531	2025-06-20 17:50:15.646531
66	╨н╨║╤Б╨┐╨╡╤А╨╕╨╝╨╡╨╜╤В╨░╨╗╤М╨╜╨░╤П ╤Е╨╕╨╝╨╕╤П	╨Ф╨╛╤Б╤В╤Г╨┐ ╨║ ╨╗╨░╨▒╨╛╤А╨░╤В╨╛╤А╨╕╤П╨╝ ╤Б ╤Б╨╛╨▓╤А╨╡╨╝╨╡╨╜╨╜╤Л╨╝ ╨╛╨▒╨╛╤А╤Г╨┤╨╛╨▓╨░╨╜╨╕╨╡╨╝. ╨Я╤А╨╛╨│╤А╨░╨╝╨╝╨░ ╤Б╨╛╤З╨╡╤В╨░╨╡╤В ╤В╨╡╨╛╤А╨╡╤В╨╕╤З╨╡╤Б╨║╤Г╤О ╨┐╨╛╨┤╨│╨╛╤В╨╛╨▓╨║╤Г ╤Б ╨┐╤А╨░╨║╤В╨╕╤З╨╡╤Б╨║╨╕╨╝╨╕ ╤Н╨║╤Б╨┐╨╡╤А╨╕╨╝╨╡╨╜╤В╨░╨╝╨╕ ╨╕ ╨╕╤Б╤Б╨╗╨╡╨┤╨╛╨▓╨░╨╜╨╕╤П╨╝╨╕. ╨г╤З╨░╤Б╤В╨╜╨╕╨║╨╕ ╤А╨░╨▒╨╛╤В╨░╤О╤В ╤Б ╤Б╨╛╨▓╤А╨╡╨╝╨╡╨╜╨╜╤Л╨╝ ╨╜╨░╤Г╤З╨╜╤Л╨╝ ╨╛╨▒╨╛╤А╤Г╨┤╨╛╨▓╨░╨╜╨╕╨╡╨╝ ╨┐╨╛╨┤ ╤А╤Г╨║╨╛╨▓╨╛╨┤╤Б╤В╨▓╨╛╨╝ ╤Г╤З╨╡╨╜╤Л╤Е-╨┐╤А╨░╨║╤В╨╕╨║╨╛╨▓.	https://chemgood.ru/courses/	╨Ь╨У╨г ╨╕╨╝. ╨Ы╨╛╨╝╨╛╨╜╨╛╤Б╨╛╨▓╨░	INTERMEDIATE	7	2025-06-20 17:52:07.120869	2025-06-20 17:52:07.120869
67	╨С╨╕╨╛╨╗╨╛╨│╨╕╤П ╨▒╤Г╨┤╤Г╤Й╨╡╨│╨╛	╨Т╨║╨╗╤О╤З╨░╨╡╤В ╤Н╨║╤Б╨║╤Г╤А╤Б╨╕╨╕ ╨▓ ╨╕╤Б╤Б╨╗╨╡╨┤╨╛╨▓╨░╤В╨╡╨╗╤М╤Б╨║╨╕╨╡ ╤Ж╨╡╨╜╤В╤А╤Л ╨╕ ╤А╨░╨▒╨╛╤В╤Г ╤Б ╤Г╤З╨╡╨╜╤Л╨╝╨╕. ╨Я╤А╨╛╨│╤А╨░╨╝╨╝╨░ ╤Б╨╛╤З╨╡╤В╨░╨╡╤В ╤В╨╡╨╛╤А╨╡╤В╨╕╤З╨╡╤Б╨║╤Г╤О ╨┐╨╛╨┤╨│╨╛╤В╨╛╨▓╨║╤Г ╤Б ╨┐╤А╨░╨║╤В╨╕╤З╨╡╤Б╨║╨╕╨╝╨╕ ╤Н╨║╤Б╨┐╨╡╤А╨╕╨╝╨╡╨╜╤В╨░╨╝╨╕ ╨╕ ╨╕╤Б╤Б╨╗╨╡╨┤╨╛╨▓╨░╨╜╨╕╤П╨╝╨╕. ╨г╤З╨░╤Б╤В╨╜╨╕╨║╨╕ ╤А╨░╨▒╨╛╤В╨░╤О╤В ╤Б ╤Б╨╛╨▓╤А╨╡╨╝╨╡╨╜╨╜╤Л╨╝ ╨╜╨░╤Г╤З╨╜╤Л╨╝ ╨╛╨▒╨╛╤А╤Г╨┤╨╛╨▓╨░╨╜╨╕╨╡╨╝ ╨┐╨╛╨┤ ╤А╤Г╨║╨╛╨▓╨╛╨┤╤Б╤В╨▓╨╛╨╝ ╤Г╤З╨╡╨╜╤Л╤Е-╨┐╤А╨░╨║╤В╨╕╨║╨╛╨▓.	https://biomolecula.ru/	╨Ы╨╡╤В╨╛╨▓╨╛	INTERMEDIATE	7	2025-06-20 17:53:50.500337	2025-06-20 17:53:50.500337
68	╨Р╤Б╤В╤А╨╛╨╜╨╛╨╝╨╕╤П ╨╕ ╨║╨╛╤Б╨╝╨╕╤З╨╡╤Б╨║╨╕╨╡ ╤В╨╡╤Е╨╜╨╛╨╗╨╛╨│╨╕╨╕	╨Т╨╛╨╖╨╝╨╛╨╢╨╜╨╛╤Б╤В╤М ╨╜╨░╨▒╨╗╤О╨┤╨░╤В╤М ╨╖╨░ ╨╜╨╡╨▒╨╡╤Б╨╜╤Л╨╝╨╕ ╤В╨╡╨╗╨░╨╝╨╕ ╤З╨╡╤А╨╡╨╖ ╨┐╤А╨╛╤Д╨╡╤Б╤Б╨╕╨╛╨╜╨░╨╗╤М╨╜╤Л╨╡ ╤В╨╡╨╗╨╡╤Б╨║╨╛╨┐╤Л. ╨Я╤А╨╛╨│╤А╨░╨╝╨╝╨░ ╤Б╨╛╤З╨╡╤В╨░╨╡╤В ╤В╨╡╨╛╤А╨╡╤В╨╕╤З╨╡╤Б╨║╤Г╤О ╨┐╨╛╨┤╨│╨╛╤В╨╛╨▓╨║╤Г ╤Б ╨┐╤А╨░╨║╤В╨╕╤З╨╡╤Б╨║╨╕╨╝╨╕ ╤Н╨║╤Б╨┐╨╡╤А╨╕╨╝╨╡╨╜╤В╨░╨╝╨╕ ╨╕ ╨╕╤Б╤Б╨╗╨╡╨┤╨╛╨▓╨░╨╜╨╕╤П╨╝╨╕. ╨г╤З╨░╤Б╤В╨╜╨╕╨║╨╕ ╤А╨░╨▒╨╛╤В╨░╤О╤В ╤Б ╤Б╨╛╨▓╤А╨╡╨╝╨╡╨╜╨╜╤Л╨╝ ╨╜╨░╤Г╤З╨╜╤Л╨╝ ╨╛╨▒╨╛╤А╤Г╨┤╨╛╨▓╨░╨╜╨╕╨╡╨╝ ╨┐╨╛╨┤ ╤А╤Г╨║╨╛╨▓╨╛╨┤╤Б╤В╨▓╨╛╨╝ ╤Г╤З╨╡╨╜╤Л╤Е-╨┐╤А╨░╨║╤В╨╕╨║╨╛╨▓.	https://www.planetarium-moscow.ru/about/about/	╨б╨╕╤А╨╕╤Г╤Б	BEGINNER	7	2025-06-20 17:55:10.642432	2025-06-20 17:55:10.642432
69	╨Т╨╡╨▒-╤А╨░╨╖╤А╨░╨▒╨╛╤В╨║╨░ ╨┤╨╗╤П ╨╜╨░╤З╨╕╨╜╨░╤О╤Й╨╕╤Е	╨б╨╡╤А╤В╨╕╤Д╨╕╨║╨░╤В ╨┐╤А╨╕╨╖╨╜╨░╨╡╤В╤Б╤П IT-╨║╨╛╨╝╨┐╨░╨╜╨╕╤П╨╝╨╕ ╨┐╤А╨╕ ╨┐╤А╨╕╨╡╨╝╨╡ ╨╜╨░ ╤Б╤В╨░╨╢╨╕╤А╨╛╨▓╨║╤Г. ╨Ю╨▒╤Г╤З╨╡╨╜╨╕╨╡ ╤Б╤В╤А╨╛╨╕╤В╤Б╤П ╨╜╨░ ╤А╨╡╤И╨╡╨╜╨╕╨╕ ╨┐╤А╨░╨║╤В╨╕╤З╨╡╤Б╨║╨╕╤Е ╨╖╨░╨┤╨░╤З ╤Б ╨┐╨╛╤Б╤В╨╡╨┐╨╡╨╜╨╜╤Л╨╝ ╨┐╨╛╨▓╤Л╤И╨╡╨╜╨╕╨╡╨╝ ╤Б╨╗╨╛╨╢╨╜╨╛╤Б╤В╨╕. ╨г╤З╨░╤Б╤В╨╜╨╕╨║╨╕ ╨╜╨░╤Г╤З╨░╤В╤Б╤П ╨┐╨╕╤Б╨░╤В╤М ╨╛╨┐╤В╨╕╨╝╨░╨╗╤М╨╜╤Л╨╣ ╨╕ ╤З╨╕╤В╨░╨╡╨╝╤Л╨╣ ╨║╨╛╨┤, ╤А╨░╨▒╨╛╤В╨░╤П ╨╜╨░╨┤ ╤А╨╡╨░╨╗╤М╨╜╤Л╨╝╨╕ ╨┐╤А╨╛╨╡╨║╤В╨░╨╝╨╕.	https://www.planetarium-moscow.ru/about/about/	╨п╨╜╨┤╨╡╨║╤Б	BEGINNER	2	2025-06-20 17:56:55.698649	2025-06-20 17:56:55.698649
70	╨Ъ╤А╨╕╨┐╤В╨╛╨│╤А╨░╤Д╨╕╤П ╨╕ ╨╖╨░╤Й╨╕╤В╨░ ╨┤╨░╨╜╨╜╤Л╤Е	╨а╨░╨╖╤А╨░╨▒╨╛╤В╨░╨╜ ╤Б╨╛╨▓╨╝╨╡╤Б╤В╨╜╨╛ ╤Б ╨╗╨░╨▒╨╛╤А╨░╤В╨╛╤А╨╕╨╡╨╣ ╨Ъ╨░╤Б╨┐╨╡╤А╤Б╨║╨╛╨│╨╛. ╨Ш╨╖╤Г╤З╨░╤О╤В╤Б╤П ╨╝╨╡╤В╨╛╨┤╤Л ╨╖╨░╤Й╨╕╤В╤Л ╨╕╨╜╤Д╨╛╤А╨╝╨░╤Ж╨╕╨╕ ╨╕ ╨┐╤А╨╛╤В╨╕╨▓╨╛╨┤╨╡╨╣╤Б╤В╨▓╨╕╤П ╤Б╨╛╨▓╤А╨╡╨╝╨╡╨╜╨╜╤Л╨╝ ╨║╨╕╨▒╨╡╤А╤Г╨│╤А╨╛╨╖╨░╨╝. ╨Ъ╤Г╤А╤Б ╨┤╨░╨╡╤В ╨┐╤А╨░╨║╤В╨╕╤З╨╡╤Б╨║╨╕╨╡ ╨╜╨░╨▓╤Л╨║╨╕ ╨╛╨▒╨╜╨░╤А╤Г╨╢╨╡╨╜╨╕╤П ╤Г╤П╨╖╨▓╨╕╨╝╨╛╤Б╤В╨╡╨╣ ╨╕ ╨┐╨╛╤Б╤В╤А╨╛╨╡╨╜╨╕╤П ╨╖╨░╤Й╨╕╤Й╨╡╨╜╨╜╤Л╤Е ╤Б╨╕╤Б╤В╨╡╨╝.	https://academy.kaspersky.ru/	╨Т╤Л╤Б╤И╨░╤П ╤И╨║╨╛╨╗╨░ ╤Н╨║╨╛╨╜╨╛╨╝╨╕╨║╨╕	ADVANCED	3	2025-06-20 17:59:49.815213	2025-06-20 17:59:49.815213
71	╨Ъ╨╛╨╝╨┐╤М╤О╤В╨╡╤А╨╜╨╛╨╡ ╨╖╤А╨╡╨╜╨╕╨╡ ╨╕ ╤А╨░╤Б╨┐╨╛╨╖╨╜╨░╨▓╨░╨╜╨╕╨╡ ╨╛╨▒╤А╨░╨╖╨╛╨▓	╨Ч╨░╨╜╤П╤В╨╕╤П ╨┐╤А╨╛╤Е╨╛╨┤╤П╤В ╨╜╨░ ╨╛╨▒╨╛╤А╤Г╨┤╨╛╨▓╨░╨╜╨╕╨╕, ╨╕╤Б╨┐╨╛╨╗╤М╨╖╤Г╨╡╨╝╨╛╨╝ ╨▓ ╤А╨╡╨░╨╗╤М╨╜╤Л╤Е ╨┐╤А╨╛╨╡╨║╤В╨░╤Е. ╨б╨╗╤Г╤И╨░╤В╨╡╨╗╨╕ ╨╛╤Б╨▓╨░╨╕╨▓╨░╤О╤В ╨┐╤А╨░╨║╤В╨╕╤З╨╡╤Б╨║╨╕╨╡ ╨╜╨░╨▓╤Л╨║╨╕ ╨┐╨╛╤Б╤В╤А╨╛╨╡╨╜╨╕╤П ╨╜╨╡╨╣╤А╨╛╨╜╨╜╤Л╤Е ╤Б╨╡╤В╨╡╨╣ ╨╕ ╤А╨░╨▒╨╛╤В╤Л ╤Б ╨▒╨╛╨╗╤М╤И╨╕╨╝╨╕ ╨┤╨░╨╜╨╜╤Л╨╝╨╕. ╨Ъ╤Г╤А╤Б ╨▓╨║╨╗╤О╤З╨░╨╡╤В ╤А╨░╨▒╨╛╤В╤Г ╤Б ╤А╨╡╨░╨╗╤М╨╜╤Л╨╝╨╕ ╨┐╤А╨╛╨╡╨║╤В╨░╨╝╨╕ ╨╕ ╨░╨║╤В╤Г╨░╨╗╤М╨╜╤Л╨╝╨╕ ╨╕╨╜╤Б╤В╤А╤Г╨╝╨╡╨╜╤В╨░╨╝╨╕ ╨╕╤Б╨║╤Г╤Б╤Б╤В╨▓╨╡╨╜╨╜╨╛╨│╨╛ ╨╕╨╜╤В╨╡╨╗╨╗╨╡╨║╤В╨░.	https://neural-university.ru/	╨б╨▒╨╡╤А	ADVANCED	1	2025-06-20 18:04:04.986494	2025-06-20 18:04:04.986494
\.


--
-- Data for Name: coursegradelink; Type: TABLE DATA; Schema: public; Owner: my_user
--

COPY public.coursegradelink (course_id, grade_id) FROM stdin;
52	3
52	4
55	3
55	4
55	5
56	1
56	2
56	3
57	2
57	3
57	4
58	2
58	3
58	4
58	5
59	3
59	4
59	5
60	4
60	5
61	2
61	3
61	4
61	5
62	3
62	4
62	5
63	1
63	2
63	3
63	4
63	5
64	4
64	5
65	3
65	4
65	5
66	2
66	3
66	4
66	5
67	3
67	4
67	5
68	1
68	2
68	3
68	4
68	5
69	2
69	3
69	4
69	5
70	4
70	5
71	4
71	5
\.


--
-- Data for Name: grade; Type: TABLE DATA; Schema: public; Owner: my_user
--

COPY public.grade (id, level) FROM stdin;
1	7
2	8
3	9
4	10
5	11
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: my_user
--

COPY public."user" (id, username, first_name, role, saved_filters, created_at) FROM stdin;
123456789	test_admin	Admin	ADMIN	{"level": "BEGINNER", "grade_id": 3, "category_id": 1}	2025-06-20 18:02:41.53402
\.


--
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: my_user
--

SELECT pg_catalog.setval('public.category_id_seq', 70, true);


--
-- Name: course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: my_user
--

SELECT pg_catalog.setval('public.course_id_seq', 71, true);


--
-- Name: grade_id_seq; Type: SEQUENCE SET; Schema: public; Owner: my_user
--

SELECT pg_catalog.setval('public.grade_id_seq', 50, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: my_user
--

SELECT pg_catalog.setval('public.user_id_seq', 1, false);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (id);


--
-- Name: coursegradelink coursegradelink_pkey; Type: CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.coursegradelink
    ADD CONSTRAINT coursegradelink_pkey PRIMARY KEY (course_id, grade_id);


--
-- Name: grade grade_level_key; Type: CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.grade
    ADD CONSTRAINT grade_level_key UNIQUE (level);


--
-- Name: grade grade_pkey; Type: CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.grade
    ADD CONSTRAINT grade_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: ix_category_name; Type: INDEX; Schema: public; Owner: my_user
--

CREATE UNIQUE INDEX ix_category_name ON public.category USING btree (name);


--
-- Name: ix_course_title; Type: INDEX; Schema: public; Owner: my_user
--

CREATE UNIQUE INDEX ix_course_title ON public.course USING btree (title);


--
-- Name: ix_user_username; Type: INDEX; Schema: public; Owner: my_user
--

CREATE INDEX ix_user_username ON public."user" USING btree (username);


--
-- Name: course course_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id);


--
-- Name: coursegradelink coursegradelink_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.coursegradelink
    ADD CONSTRAINT coursegradelink_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(id);


--
-- Name: coursegradelink coursegradelink_grade_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.coursegradelink
    ADD CONSTRAINT coursegradelink_grade_id_fkey FOREIGN KEY (grade_id) REFERENCES public.grade(id);


--
-- PostgreSQL database dump complete
--


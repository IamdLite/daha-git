--
-- PostgreSQL database cluster dump
--

SET client_min_messages TO WARNING;

-- Started on 2025-06-22 15:31:54

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

-- CREATE ROLE my_user;
-- ALTER ROLE my_user WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 17.0

-- Started on 2025-06-22 15:31:54

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Completed on 2025-06-22 15:31:55

--
-- PostgreSQL database dump complete
--

--
-- Database "my_courses_db" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 17.0

-- Started on 2025-06-22 15:31:55

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3405 (class 1262 OID 16384)
-- Name: my_courses_db; Type: DATABASE; Schema: -; Owner: my_user
--

CREATE DATABASE my_courses_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE my_courses_db OWNER TO my_user;

\connect my_courses_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 848 (class 1247 OID 16392)
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
-- TOC entry 845 (class 1247 OID 16386)
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
-- TOC entry 217 (class 1259 OID 16411)
-- Name: category; Type: TABLE; Schema: public; Owner: my_user
--

CREATE TABLE public.category (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.category OWNER TO my_user;

--
-- TOC entry 216 (class 1259 OID 16410)
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: my_user
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.category_id_seq OWNER TO my_user;

--
-- TOC entry 3406 (class 0 OID 0)
-- Dependencies: 216
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: my_user
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- TOC entry 221 (class 1259 OID 16432)
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
-- TOC entry 220 (class 1259 OID 16431)
-- Name: course_id_seq; Type: SEQUENCE; Schema: public; Owner: my_user
--

CREATE SEQUENCE public.course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_id_seq OWNER TO my_user;

--
-- TOC entry 3407 (class 0 OID 0)
-- Dependencies: 220
-- Name: course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: my_user
--

ALTER SEQUENCE public.course_id_seq OWNED BY public.course.id;


--
-- TOC entry 222 (class 1259 OID 16448)
-- Name: coursegradelink; Type: TABLE; Schema: public; Owner: my_user
--

CREATE TABLE public.coursegradelink (
    course_id integer NOT NULL,
    grade_id integer NOT NULL
);


ALTER TABLE public.coursegradelink OWNER TO my_user;

--
-- TOC entry 215 (class 1259 OID 16402)
-- Name: grade; Type: TABLE; Schema: public; Owner: my_user
--

CREATE TABLE public.grade (
    id integer NOT NULL,
    level integer NOT NULL
);


ALTER TABLE public.grade OWNER TO my_user;

--
-- TOC entry 214 (class 1259 OID 16401)
-- Name: grade_id_seq; Type: SEQUENCE; Schema: public; Owner: my_user
--

CREATE SEQUENCE public.grade_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.grade_id_seq OWNER TO my_user;

--
-- TOC entry 3408 (class 0 OID 0)
-- Dependencies: 214
-- Name: grade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: my_user
--

ALTER SEQUENCE public.grade_id_seq OWNED BY public.grade.id;


--
-- TOC entry 219 (class 1259 OID 16421)
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
-- TOC entry 218 (class 1259 OID 16420)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: my_user
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO my_user;

--
-- TOC entry 3409 (class 0 OID 0)
-- Dependencies: 218
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: my_user
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 3225 (class 2604 OID 16414)
-- Name: category id; Type: DEFAULT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- TOC entry 3228 (class 2604 OID 16435)
-- Name: course id; Type: DEFAULT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.course ALTER COLUMN id SET DEFAULT nextval('public.course_id_seq'::regclass);


--
-- TOC entry 3224 (class 2604 OID 16405)
-- Name: grade id; Type: DEFAULT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.grade ALTER COLUMN id SET DEFAULT nextval('public.grade_id_seq'::regclass);


--
-- TOC entry 3226 (class 2604 OID 16424)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 3394 (class 0 OID 16411)
-- Dependencies: 217
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: my_user
--

COPY public.category (id, name) FROM stdin;
1	Искусственный интеллект
2	Программирование
3	Информационная безопасность
5	Предпринимательство
4	Робототехника
6	Финансовая грамотность
7	Наука
\.


--
-- TOC entry 3398 (class 0 OID 16432)
-- Dependencies: 221
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: my_user
--

COPY public.course (id, title, description, url, provider, level, category_id, created_at, updated_at) FROM stdin;
57	Программирование микроконтроллеров Arduino	После курса сможешь создавать собственные устройства умного дома. Участники создадут собственные роботизированные системы с применением современных технологий. Программа включает проектирование, сборку и программирование автономных устройств.	https://amperka.ru/	Сколтех	BEGINNER	4	2025-06-20 16:20:35.642504	2025-06-20 16:20:35.642504
58	Разработка игр на Unity	Возможность добавить проекты в портфолио для будущих работодателей. Обучение строится на решении практических задач с постепенным повышением сложности. Участники научатся писать оптимальный и читаемый код, работая над реальными проектами.	https://unity.com/learn	VK	INTERMEDIATE	2	2025-06-20 16:28:18.495708	2025-06-20 16:28:18.495708
59	Основы кибербезопасности	Преподают действующие эксперты по информационной безопасности. Изучаются методы защиты информации и противодействия современным киберугрозам. Курс дает практические навыки обнаружения уязвимостей и построения защищенных систем.	https://securitytrainings.ru/	СберКибер	BEGINNER	3	2025-06-20 16:29:56.184946	2025-06-20 16:29:56.184946
60	Этичный хакинг и тестирование на проникновение	Помогает развить аналитическое мышление и внимание к деталям. Изучаются методы защиты информации и противодействия современным киберугрозам. Курс дает практические навыки обнаружения уязвимостей и построения защищенных систем.	https://skillbox.ru/	Лаборатория Касперского	ADVANCED	3	2025-06-20 16:31:17.899969	2025-06-20 16:31:17.899969
61	Предпринимательство для школьников	Возможность запустить свой первый бизнес-проект под наставничеством. Слушатели разработают собственный бизнес-план и изучат стратегии привлечения инвестиций. В программу включены мастер-классы от успешных предпринимателей и венчурных инвесторов.	https://business-youth.ru/	Высшая школа экономики	ADVANCED	5	2025-06-20 16:33:36.941707	2025-06-20 16:33:36.941707
62	От идеи до стартапа	Шанс получить финансирование от инвесторов для лучших проектов. Слушатели разработают собственный бизнес-план и изучат стратегии привлечения инвестиций. В программу включены мастер-классы от успешных предпринимателей и венчурных инвесторов.	https://practicumglobal.ru/	Сколково	INTERMEDIATE	5	2025-06-20 16:36:37.07279	2025-06-20 16:36:37.07279
52	Основы машинного обучения и нейронных сетей	Ведут специалисты из Яндекса с реальными кейсами из индустрии. Слушатели осваивают практические навыки построения нейронных сетей и работы с большими данными. Курс включает работу с реальными проектами и актуальными инструментами искусственного интеллекта.	https://practicum.yandex.ru/	Яндекс	BEGINNER	1	2025-06-20 15:44:40.588039	2025-06-20 15:44:40.588039
55	Python для искусственного интеллекта	Поможет подготовиться к участию в олимпиадах по программированию. Слушатели осваивают практические навыки построения нейронных сетей и работы с большими данными. Курс включает работу с реальными проектами и актуальными инструментами искусственного интеллекта.	https://stepik.org/	Сириус	BEGINNER	2	2025-06-20 15:59:17.413674	2025-06-20 15:59:17.413674
56	Робототехника для начинающих	Включает практические занятия со сборкой реальных роботов. Участники создадут собственные роботизированные системы с применением современных технологий. Программа включает проектирование, сборку и программирование автономных устройств.	https://robbo.ru/	Иннополис	BEGINNER	4	2025-06-20 16:18:56.631968	2025-06-20 16:18:56.631968
63	Личные финансы для подростков	Научит грамотно управлять своим бюджетом и планировать накопления. Участники научатся эффективно управлять личными финансами и создавать пассивный доход. Курс включает разбор реальных инвестиционных стратегий и финансовых инструментов.	https://fincult.info/	Центральный банк РФ	BEGINNER	6	2025-06-20 17:47:01.486756	2025-06-20 17:47:01.486756
64	Инвестирование для начинающих	Практические навыки работы с биржевыми инструментами на учебном счете. Участники научатся эффективно управлять личными финансами и создавать пассивный доход. Курс включает разбор реальных инвестиционных стратегий и финансовых инструментов.	https://www.tinkoff.ru/invest/education/	Тинькофф	INTERMEDIATE	6	2025-06-20 17:48:41.63064	2025-06-20 17:48:41.63064
65	Современная физика для школьников	Поможет подготовиться к олимпиадам и поступлению в технические вузы. Программа сочетает теоретическую подготовку с практическими экспериментами и исследованиями. Участники работают с современным научным оборудованием под руководством ученых-практиков.	https://mipt.ru/online-courses/	МФТИ	ADVANCED	7	2025-06-20 17:50:15.646531	2025-06-20 17:50:15.646531
66	Экспериментальная химия	Доступ к лабораториям с современным оборудованием. Программа сочетает теоретическую подготовку с практическими экспериментами и исследованиями. Участники работают с современным научным оборудованием под руководством ученых-практиков.	https://chemgood.ru/courses/	МГУ им. Ломоносова	INTERMEDIATE	7	2025-06-20 17:52:07.120869	2025-06-20 17:52:07.120869
67	Биология будущего	Включает экскурсии в исследовательские центры и работу с учеными. Программа сочетает теоретическую подготовку с практическими экспериментами и исследованиями. Участники работают с современным научным оборудованием под руководством ученых-практиков.	https://biomolecula.ru/	Летово	INTERMEDIATE	7	2025-06-20 17:53:50.500337	2025-06-20 17:53:50.500337
68	Астрономия и космические технологии	Возможность наблюдать за небесными телами через профессиональные телескопы. Программа сочетает теоретическую подготовку с практическими экспериментами и исследованиями. Участники работают с современным научным оборудованием под руководством ученых-практиков.	https://www.planetarium-moscow.ru/about/about/	Сириус	BEGINNER	7	2025-06-20 17:55:10.642432	2025-06-20 17:55:10.642432
69	Веб-разработка для начинающих	Сертификат признается IT-компаниями при приеме на стажировку. Обучение строится на решении практических задач с постепенным повышением сложности. Участники научатся писать оптимальный и читаемый код, работая над реальными проектами.	https://www.planetarium-moscow.ru/about/about/	Яндекс	BEGINNER	2	2025-06-20 17:56:55.698649	2025-06-20 17:56:55.698649
70	Криптография и защита данных	Разработан совместно с лабораторией Касперского. Изучаются методы защиты информации и противодействия современным киберугрозам. Курс дает практические навыки обнаружения уязвимостей и построения защищенных систем.	https://academy.kaspersky.ru/	Высшая школа экономики	ADVANCED	3	2025-06-20 17:59:49.815213	2025-06-20 17:59:49.815213
71	Компьютерное зрение и распознавание образов	Занятия проходят на оборудовании, используемом в реальных проектах. Слушатели осваивают практические навыки построения нейронных сетей и работы с большими данными. Курс включает работу с реальными проектами и актуальными инструментами искусственного интеллекта.	https://neural-university.ru/	Сбер	ADVANCED	1	2025-06-20 18:04:04.986494	2025-06-20 18:04:04.986494
72	Тест	тест тест	https://fastapi.tiangolo.com/project-generation/	Тест	BEGINNER	7	2025-06-21 16:51:57.3492	2025-06-21 16:51:57.3492
\.


--
-- TOC entry 3399 (class 0 OID 16448)
-- Dependencies: 222
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
72	1
72	2
\.


--
-- TOC entry 3392 (class 0 OID 16402)
-- Dependencies: 215
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
-- TOC entry 3396 (class 0 OID 16421)
-- Dependencies: 219
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: my_user
--

COPY public."user" (id, username, first_name, role, saved_filters, created_at) FROM stdin;
123456789	test_admin	Admin	ADMIN	{"level": "BEGINNER", "grade_id": 3, "category_id": 1}	2025-06-20 18:02:41.53402
\.


--
-- TOC entry 3410 (class 0 OID 0)
-- Dependencies: 216
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: my_user
--

SELECT pg_catalog.setval('public.category_id_seq', 70, true);


--
-- TOC entry 3411 (class 0 OID 0)
-- Dependencies: 220
-- Name: course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: my_user
--

SELECT pg_catalog.setval('public.course_id_seq', 139, true);


--
-- TOC entry 3412 (class 0 OID 0)
-- Dependencies: 214
-- Name: grade_id_seq; Type: SEQUENCE SET; Schema: public; Owner: my_user
--

SELECT pg_catalog.setval('public.grade_id_seq', 50, true);


--
-- TOC entry 3413 (class 0 OID 0)
-- Dependencies: 218
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: my_user
--

SELECT pg_catalog.setval('public.user_id_seq', 1, false);


--
-- TOC entry 3236 (class 2606 OID 16418)
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- TOC entry 3242 (class 2606 OID 16441)
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (id);


--
-- TOC entry 3245 (class 2606 OID 16452)
-- Name: coursegradelink coursegradelink_pkey; Type: CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.coursegradelink
    ADD CONSTRAINT coursegradelink_pkey PRIMARY KEY (course_id, grade_id);


--
-- TOC entry 3232 (class 2606 OID 16409)
-- Name: grade grade_level_key; Type: CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.grade
    ADD CONSTRAINT grade_level_key UNIQUE (level);


--
-- TOC entry 3234 (class 2606 OID 16407)
-- Name: grade grade_pkey; Type: CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.grade
    ADD CONSTRAINT grade_pkey PRIMARY KEY (id);


--
-- TOC entry 3240 (class 2606 OID 16429)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 3237 (class 1259 OID 16419)
-- Name: ix_category_name; Type: INDEX; Schema: public; Owner: my_user
--

CREATE UNIQUE INDEX ix_category_name ON public.category USING btree (name);


--
-- TOC entry 3243 (class 1259 OID 16447)
-- Name: ix_course_title; Type: INDEX; Schema: public; Owner: my_user
--

CREATE UNIQUE INDEX ix_course_title ON public.course USING btree (title);


--
-- TOC entry 3238 (class 1259 OID 16430)
-- Name: ix_user_username; Type: INDEX; Schema: public; Owner: my_user
--

CREATE INDEX ix_user_username ON public."user" USING btree (username);


--
-- TOC entry 3246 (class 2606 OID 16442)
-- Name: course course_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id);


--
-- TOC entry 3247 (class 2606 OID 16453)
-- Name: coursegradelink coursegradelink_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.coursegradelink
    ADD CONSTRAINT coursegradelink_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(id);


--
-- TOC entry 3248 (class 2606 OID 16458)
-- Name: coursegradelink coursegradelink_grade_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.coursegradelink
    ADD CONSTRAINT coursegradelink_grade_id_fkey FOREIGN KEY (grade_id) REFERENCES public.grade(id);


-- Completed on 2025-06-22 15:31:55

--
-- PostgreSQL database dump complete
--

-- Completed on 2025-06-22 15:31:55

--
-- PostgreSQL database cluster dump complete
--


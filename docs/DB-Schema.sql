--
-- PostgreSQL database dump
--

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 17.4

-- Started on 2025-12-21 21:41:08

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
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pubweb_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO pubweb_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 232 (class 1259 OID 23306)
-- Name: accommodation; Type: TABLE; Schema: public; Owner: pubweb_user
--

CREATE TABLE public.accommodation (
    id integer NOT NULL,
    venue_id integer,
    description text,
    features text[],
    booking_url character varying(500),
    booking_email character varying(255)
);


ALTER TABLE public.accommodation OWNER TO pubweb_user;

--
-- TOC entry 231 (class 1259 OID 23305)
-- Name: accommodation_id_seq; Type: SEQUENCE; Schema: public; Owner: pubweb_user
--

CREATE SEQUENCE public.accommodation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accommodation_id_seq OWNER TO pubweb_user;

--
-- TOC entry 3550 (class 0 OID 0)
-- Dependencies: 231
-- Name: accommodation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pubweb_user
--

ALTER SEQUENCE public.accommodation_id_seq OWNED BY public.accommodation.id;


--
-- TOC entry 218 (class 1259 OID 23193)
-- Name: app_user; Type: TABLE; Schema: public; Owner: pubweb_user
--

CREATE TABLE public.app_user (
    id integer NOT NULL,
    venue_id integer,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    name character varying(255),
    role character varying(50) DEFAULT 'admin'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp without time zone
);


ALTER TABLE public.app_user OWNER TO pubweb_user;

--
-- TOC entry 217 (class 1259 OID 23192)
-- Name: app_user_id_seq; Type: SEQUENCE; Schema: public; Owner: pubweb_user
--

CREATE SEQUENCE public.app_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.app_user_id_seq OWNER TO pubweb_user;

--
-- TOC entry 3551 (class 0 OID 0)
-- Dependencies: 217
-- Name: app_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pubweb_user
--

ALTER SEQUENCE public.app_user_id_seq OWNED BY public.app_user.id;


--
-- TOC entry 236 (class 1259 OID 23341)
-- Name: attractions; Type: TABLE; Schema: public; Owner: pubweb_user
--

CREATE TABLE public.attractions (
    id integer NOT NULL,
    venue_id integer,
    name character varying(255) NOT NULL,
    description text,
    category character varying(50) NOT NULL,
    distance character varying(50),
    website_url character varying(500),
    image character varying(500)
);


ALTER TABLE public.attractions OWNER TO pubweb_user;

--
-- TOC entry 235 (class 1259 OID 23340)
-- Name: attractions_id_seq; Type: SEQUENCE; Schema: public; Owner: pubweb_user
--

CREATE SEQUENCE public.attractions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attractions_id_seq OWNER TO pubweb_user;

--
-- TOC entry 3552 (class 0 OID 0)
-- Dependencies: 235
-- Name: attractions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pubweb_user
--

ALTER SEQUENCE public.attractions_id_seq OWNED BY public.attractions.id;


--
-- TOC entry 220 (class 1259 OID 23211)
-- Name: awards; Type: TABLE; Schema: public; Owner: pubweb_user
--

CREATE TABLE public.awards (
    id integer NOT NULL,
    venue_id integer,
    name character varying(255) NOT NULL,
    body character varying(100) NOT NULL,
    rating character varying(50),
    year integer,
    entity_type character varying(50) DEFAULT 'venue'::character varying
);


ALTER TABLE public.awards OWNER TO pubweb_user;

--
-- TOC entry 219 (class 1259 OID 23210)
-- Name: awards_id_seq; Type: SEQUENCE; Schema: public; Owner: pubweb_user
--

CREATE SEQUENCE public.awards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.awards_id_seq OWNER TO pubweb_user;

--
-- TOC entry 3553 (class 0 OID 0)
-- Dependencies: 219
-- Name: awards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pubweb_user
--

ALTER SEQUENCE public.awards_id_seq OWNED BY public.awards.id;


--
-- TOC entry 230 (class 1259 OID 23290)
-- Name: menu_items; Type: TABLE; Schema: public; Owner: pubweb_user
--

CREATE TABLE public.menu_items (
    id integer NOT NULL,
    section_id integer,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2),
    price_note character varying(100),
    dietary_tags text[],
    is_available boolean DEFAULT true,
    sort_order integer DEFAULT 0
);


ALTER TABLE public.menu_items OWNER TO pubweb_user;

--
-- TOC entry 229 (class 1259 OID 23289)
-- Name: menu_items_id_seq; Type: SEQUENCE; Schema: public; Owner: pubweb_user
--

CREATE SEQUENCE public.menu_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_items_id_seq OWNER TO pubweb_user;

--
-- TOC entry 3554 (class 0 OID 0)
-- Dependencies: 229
-- Name: menu_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pubweb_user
--

ALTER SEQUENCE public.menu_items_id_seq OWNED BY public.menu_items.id;


--
-- TOC entry 228 (class 1259 OID 23275)
-- Name: menu_sections; Type: TABLE; Schema: public; Owner: pubweb_user
--

CREATE TABLE public.menu_sections (
    id integer NOT NULL,
    menu_id integer,
    name character varying(255) NOT NULL,
    description text,
    sort_order integer DEFAULT 0
);


ALTER TABLE public.menu_sections OWNER TO pubweb_user;

--
-- TOC entry 227 (class 1259 OID 23274)
-- Name: menu_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: pubweb_user
--

CREATE SEQUENCE public.menu_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_sections_id_seq OWNER TO pubweb_user;

--
-- TOC entry 3555 (class 0 OID 0)
-- Dependencies: 227
-- Name: menu_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pubweb_user
--

ALTER SEQUENCE public.menu_sections_id_seq OWNED BY public.menu_sections.id;


--
-- TOC entry 226 (class 1259 OID 23254)
-- Name: menus; Type: TABLE; Schema: public; Owner: pubweb_user
--

CREATE TABLE public.menus (
    id integer NOT NULL,
    venue_id integer,
    name character varying(255) NOT NULL,
    slug character varying(100) NOT NULL,
    description text,
    type character varying(50) DEFAULT 'regular'::character varying,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    pdf_url character varying(500),
    image_url character varying(500),
    event_start date,
    event_end date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.menus OWNER TO pubweb_user;

--
-- TOC entry 225 (class 1259 OID 23253)
-- Name: menus_id_seq; Type: SEQUENCE; Schema: public; Owner: pubweb_user
--

CREATE SEQUENCE public.menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menus_id_seq OWNER TO pubweb_user;

--
-- TOC entry 3556 (class 0 OID 0)
-- Dependencies: 225
-- Name: menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pubweb_user
--

ALTER SEQUENCE public.menus_id_seq OWNED BY public.menus.id;


--
-- TOC entry 222 (class 1259 OID 23224)
-- Name: opening_hours; Type: TABLE; Schema: public; Owner: pubweb_user
--

CREATE TABLE public.opening_hours (
    id integer NOT NULL,
    venue_id integer,
    day character varying(10) NOT NULL,
    is_closed boolean DEFAULT false,
    periods jsonb
);


ALTER TABLE public.opening_hours OWNER TO pubweb_user;

--
-- TOC entry 221 (class 1259 OID 23223)
-- Name: opening_hours_id_seq; Type: SEQUENCE; Schema: public; Owner: pubweb_user
--

CREATE SEQUENCE public.opening_hours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.opening_hours_id_seq OWNER TO pubweb_user;

--
-- TOC entry 3557 (class 0 OID 0)
-- Dependencies: 221
-- Name: opening_hours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pubweb_user
--

ALTER SEQUENCE public.opening_hours_id_seq OWNED BY public.opening_hours.id;


--
-- TOC entry 238 (class 1259 OID 23355)
-- Name: page_content; Type: TABLE; Schema: public; Owner: pubweb_user
--

CREATE TABLE public.page_content (
    id integer NOT NULL,
    venue_id integer,
    page character varying(50) NOT NULL,
    title character varying(255),
    subtitle character varying(255)
);


ALTER TABLE public.page_content OWNER TO pubweb_user;

--
-- TOC entry 237 (class 1259 OID 23354)
-- Name: page_content_id_seq; Type: SEQUENCE; Schema: public; Owner: pubweb_user
--

CREATE SEQUENCE public.page_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.page_content_id_seq OWNER TO pubweb_user;

--
-- TOC entry 3558 (class 0 OID 0)
-- Dependencies: 237
-- Name: page_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pubweb_user
--

ALTER SEQUENCE public.page_content_id_seq OWNED BY public.page_content.id;


--
-- TOC entry 240 (class 1259 OID 23371)
-- Name: page_sections; Type: TABLE; Schema: public; Owner: pubweb_user
--

CREATE TABLE public.page_sections (
    id integer NOT NULL,
    page_content_id integer,
    title character varying(255),
    content text,
    image character varying(500),
    layout character varying(50) DEFAULT 'text-only'::character varying,
    sort_order integer DEFAULT 0
);


ALTER TABLE public.page_sections OWNER TO pubweb_user;

--
-- TOC entry 239 (class 1259 OID 23370)
-- Name: page_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: pubweb_user
--

CREATE SEQUENCE public.page_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.page_sections_id_seq OWNER TO pubweb_user;

--
-- TOC entry 3559 (class 0 OID 0)
-- Dependencies: 239
-- Name: page_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pubweb_user
--

ALTER SEQUENCE public.page_sections_id_seq OWNED BY public.page_sections.id;


--
-- TOC entry 234 (class 1259 OID 23322)
-- Name: rooms; Type: TABLE; Schema: public; Owner: pubweb_user
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    venue_id integer,
    name character varying(255) NOT NULL,
    slug character varying(100) NOT NULL,
    description text,
    type character varying(50) NOT NULL,
    sleeps integer NOT NULL,
    features text[],
    images text[],
    price_from numeric(10,2),
    price_currency character varying(10) DEFAULT 'GBP'::character varying,
    is_available boolean DEFAULT true,
    sort_order integer DEFAULT 0
);


ALTER TABLE public.rooms OWNER TO pubweb_user;

--
-- TOC entry 233 (class 1259 OID 23321)
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: pubweb_user
--

CREATE SEQUENCE public.rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rooms_id_seq OWNER TO pubweb_user;

--
-- TOC entry 3560 (class 0 OID 0)
-- Dependencies: 233
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pubweb_user
--

ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;


--
-- TOC entry 224 (class 1259 OID 23239)
-- Name: special_closures; Type: TABLE; Schema: public; Owner: pubweb_user
--

CREATE TABLE public.special_closures (
    id integer NOT NULL,
    venue_id integer,
    date date NOT NULL,
    reason character varying(255),
    is_closed boolean DEFAULT true,
    periods jsonb
);


ALTER TABLE public.special_closures OWNER TO pubweb_user;

--
-- TOC entry 223 (class 1259 OID 23238)
-- Name: special_closures_id_seq; Type: SEQUENCE; Schema: public; Owner: pubweb_user
--

CREATE SEQUENCE public.special_closures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.special_closures_id_seq OWNER TO pubweb_user;

--
-- TOC entry 3561 (class 0 OID 0)
-- Dependencies: 223
-- Name: special_closures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pubweb_user
--

ALTER SEQUENCE public.special_closures_id_seq OWNED BY public.special_closures.id;


--
-- TOC entry 216 (class 1259 OID 23181)
-- Name: venues; Type: TABLE; Schema: public; Owner: pubweb_user
--

CREATE TABLE public.venues (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    tagline character varying(255),
    description text,
    address_line1 character varying(255) NOT NULL,
    address_line2 character varying(255),
    town character varying(100) NOT NULL,
    county character varying(100),
    postcode character varying(20) NOT NULL,
    country character varying(100) DEFAULT 'United Kingdom'::character varying,
    phone character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    booking_email character varying(255),
    facebook character varying(255),
    instagram character varying(255),
    twitter character varying(255),
    tripadvisor character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.venues OWNER TO pubweb_user;

--
-- TOC entry 215 (class 1259 OID 23180)
-- Name: venues_id_seq; Type: SEQUENCE; Schema: public; Owner: pubweb_user
--

CREATE SEQUENCE public.venues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.venues_id_seq OWNER TO pubweb_user;

--
-- TOC entry 3562 (class 0 OID 0)
-- Dependencies: 215
-- Name: venues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pubweb_user
--

ALTER SEQUENCE public.venues_id_seq OWNED BY public.venues.id;


--
-- TOC entry 3335 (class 2604 OID 23309)
-- Name: accommodation id; Type: DEFAULT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.accommodation ALTER COLUMN id SET DEFAULT nextval('public.accommodation_id_seq'::regclass);


--
-- TOC entry 3315 (class 2604 OID 23196)
-- Name: app_user id; Type: DEFAULT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.app_user ALTER COLUMN id SET DEFAULT nextval('public.app_user_id_seq'::regclass);


--
-- TOC entry 3340 (class 2604 OID 23344)
-- Name: attractions id; Type: DEFAULT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.attractions ALTER COLUMN id SET DEFAULT nextval('public.attractions_id_seq'::regclass);


--
-- TOC entry 3318 (class 2604 OID 23214)
-- Name: awards id; Type: DEFAULT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.awards ALTER COLUMN id SET DEFAULT nextval('public.awards_id_seq'::regclass);


--
-- TOC entry 3332 (class 2604 OID 23293)
-- Name: menu_items id; Type: DEFAULT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.menu_items ALTER COLUMN id SET DEFAULT nextval('public.menu_items_id_seq'::regclass);


--
-- TOC entry 3330 (class 2604 OID 23278)
-- Name: menu_sections id; Type: DEFAULT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.menu_sections ALTER COLUMN id SET DEFAULT nextval('public.menu_sections_id_seq'::regclass);


--
-- TOC entry 3324 (class 2604 OID 23257)
-- Name: menus id; Type: DEFAULT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.menus ALTER COLUMN id SET DEFAULT nextval('public.menus_id_seq'::regclass);


--
-- TOC entry 3320 (class 2604 OID 23227)
-- Name: opening_hours id; Type: DEFAULT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.opening_hours ALTER COLUMN id SET DEFAULT nextval('public.opening_hours_id_seq'::regclass);


--
-- TOC entry 3341 (class 2604 OID 23358)
-- Name: page_content id; Type: DEFAULT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.page_content ALTER COLUMN id SET DEFAULT nextval('public.page_content_id_seq'::regclass);


--
-- TOC entry 3342 (class 2604 OID 23374)
-- Name: page_sections id; Type: DEFAULT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.page_sections ALTER COLUMN id SET DEFAULT nextval('public.page_sections_id_seq'::regclass);


--
-- TOC entry 3336 (class 2604 OID 23325)
-- Name: rooms id; Type: DEFAULT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);


--
-- TOC entry 3322 (class 2604 OID 23242)
-- Name: special_closures id; Type: DEFAULT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.special_closures ALTER COLUMN id SET DEFAULT nextval('public.special_closures_id_seq'::regclass);


--
-- TOC entry 3311 (class 2604 OID 23184)
-- Name: venues id; Type: DEFAULT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.venues ALTER COLUMN id SET DEFAULT nextval('public.venues_id_seq'::regclass);


--
-- TOC entry 3372 (class 2606 OID 23313)
-- Name: accommodation accommodation_pkey; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.accommodation
    ADD CONSTRAINT accommodation_pkey PRIMARY KEY (id);


--
-- TOC entry 3374 (class 2606 OID 23315)
-- Name: accommodation accommodation_venue_id_key; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.accommodation
    ADD CONSTRAINT accommodation_venue_id_key UNIQUE (venue_id);


--
-- TOC entry 3348 (class 2606 OID 23204)
-- Name: app_user app_user_email_key; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_email_key UNIQUE (email);


--
-- TOC entry 3350 (class 2606 OID 23202)
-- Name: app_user app_user_pkey; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (id);


--
-- TOC entry 3381 (class 2606 OID 23348)
-- Name: attractions attractions_pkey; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.attractions
    ADD CONSTRAINT attractions_pkey PRIMARY KEY (id);


--
-- TOC entry 3353 (class 2606 OID 23217)
-- Name: awards awards_pkey; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.awards
    ADD CONSTRAINT awards_pkey PRIMARY KEY (id);


--
-- TOC entry 3370 (class 2606 OID 23299)
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3367 (class 2606 OID 23283)
-- Name: menu_sections menu_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.menu_sections
    ADD CONSTRAINT menu_sections_pkey PRIMARY KEY (id);


--
-- TOC entry 3362 (class 2606 OID 23266)
-- Name: menus menus_pkey; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT menus_pkey PRIMARY KEY (id);


--
-- TOC entry 3364 (class 2606 OID 23268)
-- Name: menus menus_venue_id_slug_key; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT menus_venue_id_slug_key UNIQUE (venue_id, slug);


--
-- TOC entry 3356 (class 2606 OID 23232)
-- Name: opening_hours opening_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.opening_hours
    ADD CONSTRAINT opening_hours_pkey PRIMARY KEY (id);


--
-- TOC entry 3385 (class 2606 OID 23362)
-- Name: page_content page_content_pkey; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.page_content
    ADD CONSTRAINT page_content_pkey PRIMARY KEY (id);


--
-- TOC entry 3387 (class 2606 OID 23364)
-- Name: page_content page_content_venue_id_page_key; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.page_content
    ADD CONSTRAINT page_content_venue_id_page_key UNIQUE (venue_id, page);


--
-- TOC entry 3389 (class 2606 OID 23380)
-- Name: page_sections page_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.page_sections
    ADD CONSTRAINT page_sections_pkey PRIMARY KEY (id);


--
-- TOC entry 3377 (class 2606 OID 23332)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- TOC entry 3379 (class 2606 OID 23334)
-- Name: rooms rooms_venue_id_slug_key; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_venue_id_slug_key UNIQUE (venue_id, slug);


--
-- TOC entry 3358 (class 2606 OID 23247)
-- Name: special_closures special_closures_pkey; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.special_closures
    ADD CONSTRAINT special_closures_pkey PRIMARY KEY (id);


--
-- TOC entry 3346 (class 2606 OID 23191)
-- Name: venues venues_pkey; Type: CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venues_pkey PRIMARY KEY (id);


--
-- TOC entry 3351 (class 1259 OID 23394)
-- Name: idx_app_user_email; Type: INDEX; Schema: public; Owner: pubweb_user
--

CREATE INDEX idx_app_user_email ON public.app_user USING btree (email);


--
-- TOC entry 3382 (class 1259 OID 23391)
-- Name: idx_attractions_venue; Type: INDEX; Schema: public; Owner: pubweb_user
--

CREATE INDEX idx_attractions_venue ON public.attractions USING btree (venue_id);


--
-- TOC entry 3368 (class 1259 OID 23389)
-- Name: idx_menu_items_section; Type: INDEX; Schema: public; Owner: pubweb_user
--

CREATE INDEX idx_menu_items_section ON public.menu_items USING btree (section_id);


--
-- TOC entry 3365 (class 1259 OID 23388)
-- Name: idx_menu_sections_menu; Type: INDEX; Schema: public; Owner: pubweb_user
--

CREATE INDEX idx_menu_sections_menu ON public.menu_sections USING btree (menu_id);


--
-- TOC entry 3359 (class 1259 OID 23387)
-- Name: idx_menus_slug; Type: INDEX; Schema: public; Owner: pubweb_user
--

CREATE INDEX idx_menus_slug ON public.menus USING btree (venue_id, slug);


--
-- TOC entry 3360 (class 1259 OID 23386)
-- Name: idx_menus_venue; Type: INDEX; Schema: public; Owner: pubweb_user
--

CREATE INDEX idx_menus_venue ON public.menus USING btree (venue_id);


--
-- TOC entry 3354 (class 1259 OID 23392)
-- Name: idx_opening_hours_venue; Type: INDEX; Schema: public; Owner: pubweb_user
--

CREATE INDEX idx_opening_hours_venue ON public.opening_hours USING btree (venue_id);


--
-- TOC entry 3383 (class 1259 OID 23393)
-- Name: idx_page_content_venue; Type: INDEX; Schema: public; Owner: pubweb_user
--

CREATE INDEX idx_page_content_venue ON public.page_content USING btree (venue_id, page);


--
-- TOC entry 3375 (class 1259 OID 23390)
-- Name: idx_rooms_venue; Type: INDEX; Schema: public; Owner: pubweb_user
--

CREATE INDEX idx_rooms_venue ON public.rooms USING btree (venue_id);


--
-- TOC entry 3397 (class 2606 OID 23316)
-- Name: accommodation accommodation_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.accommodation
    ADD CONSTRAINT accommodation_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE;


--
-- TOC entry 3390 (class 2606 OID 23205)
-- Name: app_user app_users_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_users_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE;


--
-- TOC entry 3399 (class 2606 OID 23349)
-- Name: attractions attractions_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.attractions
    ADD CONSTRAINT attractions_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE;


--
-- TOC entry 3391 (class 2606 OID 23218)
-- Name: awards awards_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.awards
    ADD CONSTRAINT awards_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE;


--
-- TOC entry 3396 (class 2606 OID 23300)
-- Name: menu_items menu_items_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.menu_sections(id) ON DELETE CASCADE;


--
-- TOC entry 3395 (class 2606 OID 23284)
-- Name: menu_sections menu_sections_menu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.menu_sections
    ADD CONSTRAINT menu_sections_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.menus(id) ON DELETE CASCADE;


--
-- TOC entry 3394 (class 2606 OID 23269)
-- Name: menus menus_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT menus_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE;


--
-- TOC entry 3392 (class 2606 OID 23233)
-- Name: opening_hours opening_hours_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.opening_hours
    ADD CONSTRAINT opening_hours_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE;


--
-- TOC entry 3400 (class 2606 OID 23365)
-- Name: page_content page_content_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.page_content
    ADD CONSTRAINT page_content_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE;


--
-- TOC entry 3401 (class 2606 OID 23381)
-- Name: page_sections page_sections_page_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.page_sections
    ADD CONSTRAINT page_sections_page_content_id_fkey FOREIGN KEY (page_content_id) REFERENCES public.page_content(id) ON DELETE CASCADE;


--
-- TOC entry 3398 (class 2606 OID 23335)
-- Name: rooms rooms_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE;


--
-- TOC entry 3393 (class 2606 OID 23248)
-- Name: special_closures special_closures_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pubweb_user
--

ALTER TABLE ONLY public.special_closures
    ADD CONSTRAINT special_closures_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE;


--
-- TOC entry 2099 (class 826 OID 23179)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO pubweb_user;


--
-- TOC entry 2098 (class 826 OID 23178)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO pubweb_user;


-- Completed on 2025-12-21 21:41:10

--
-- PostgreSQL database dump complete
--


--
-- PostgreSQL database dump
--

\restrict lNAoZUFsx3xOaasAqVvy2be3qqr8LaHepmLtdDHpt6Aie8xZyKb3jBNXWEeo91F

-- Dumped from database version 17.8 (Debian 17.8-1.pgdg13+1)
-- Dumped by pg_dump version 17.8 (Debian 17.8-1.pgdg13+1)

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
-- Name: paymentmethod; Type: TYPE; Schema: public; Owner: luxe_user
--

CREATE TYPE public.paymentmethod AS ENUM (
    'card',
    'wallet'
);


ALTER TYPE public.paymentmethod OWNER TO luxe_user;

--
-- Name: paymentstatus; Type: TYPE; Schema: public; Owner: luxe_user
--

CREATE TYPE public.paymentstatus AS ENUM (
    'pending',
    'authorized',
    'paid',
    'failed',
    'refunded'
);


ALTER TYPE public.paymentstatus OWNER TO luxe_user;

--
-- Name: reservationstatus; Type: TYPE; Schema: public; Owner: luxe_user
--

CREATE TYPE public.reservationstatus AS ENUM (
    'pending',
    'confirmed',
    'checked_in',
    'checked_out',
    'cancelled'
);


ALTER TYPE public.reservationstatus OWNER TO luxe_user;

--
-- Name: userrole; Type: TYPE; Schema: public; Owner: luxe_user
--

CREATE TYPE public.userrole AS ENUM (
    'admin',
    'guest'
);


ALTER TYPE public.userrole OWNER TO luxe_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: luxe_user
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO luxe_user;

--
-- Name: guests; Type: TABLE; Schema: public; Owner: luxe_user
--

CREATE TABLE public.guests (
    id uuid NOT NULL,
    first_name character varying(80) NOT NULL,
    last_name character varying(80) NOT NULL,
    email character varying(120) NOT NULL,
    phone character varying(30) NOT NULL,
    document_type character varying(30),
    document_number character varying(60),
    date_of_birth date,
    address character varying(180),
    city character varying(80),
    country character varying(80),
    notes text,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.guests OWNER TO luxe_user;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: luxe_user
--

CREATE TABLE public.payments (
    id uuid NOT NULL,
    reservation_id uuid NOT NULL,
    method public.paymentmethod NOT NULL,
    status public.paymentstatus NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character(3) NOT NULL,
    provider character varying(80),
    provider_txn_id character varying(120),
    card_last4 character varying(4),
    card_brand character varying(30),
    paid_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.payments OWNER TO luxe_user;

--
-- Name: reservations; Type: TABLE; Schema: public; Owner: luxe_user
--

CREATE TABLE public.reservations (
    id uuid NOT NULL,
    guest_id uuid NOT NULL,
    room_id uuid NOT NULL,
    check_in_date date NOT NULL,
    check_out_date date NOT NULL,
    adults integer NOT NULL,
    children integer NOT NULL,
    status public.reservationstatus NOT NULL,
    special_requests text,
    subtotal numeric(10,2) NOT NULL,
    taxes numeric(10,2) NOT NULL,
    service_fee numeric(10,2) NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    created_by_user_id uuid,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT check_dates CHECK ((check_out_date > check_in_date))
);


ALTER TABLE public.reservations OWNER TO luxe_user;

--
-- Name: room_amenities; Type: TABLE; Schema: public; Owner: luxe_user
--

CREATE TABLE public.room_amenities (
    id uuid NOT NULL,
    code character varying(60) NOT NULL,
    label character varying(100) NOT NULL
);


ALTER TABLE public.room_amenities OWNER TO luxe_user;

--
-- Name: room_amenity_map; Type: TABLE; Schema: public; Owner: luxe_user
--

CREATE TABLE public.room_amenity_map (
    room_id uuid NOT NULL,
    amenity_id uuid NOT NULL
);


ALTER TABLE public.room_amenity_map OWNER TO luxe_user;

--
-- Name: rooms; Type: TABLE; Schema: public; Owner: luxe_user
--

CREATE TABLE public.rooms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug character varying(120) NOT NULL,
    name character varying(120) NOT NULL,
    description text,
    price_per_night numeric(10,2) NOT NULL,
    size_m2 integer,
    view_type character varying(50),
    floor character varying(30),
    max_adults integer DEFAULT 1 NOT NULL,
    max_children integer DEFAULT 0 NOT NULL,
    max_guests integer DEFAULT 1 NOT NULL,
    quantity integer DEFAULT 1,
    image_url text,
    rating numeric(2,1) DEFAULT 0.0,
    total_reviews integer DEFAULT 0,
    check_in_time time without time zone,
    check_out_time time without time zone,
    cancellation_policy text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.rooms OWNER TO luxe_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: luxe_user
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role public.userrole NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO luxe_user;

--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: luxe_user
--

COPY public.alembic_version (version_num) FROM stdin;
4b9b03a65576
\.


--
-- Data for Name: guests; Type: TABLE DATA; Schema: public; Owner: luxe_user
--

COPY public.guests (id, first_name, last_name, email, phone, document_type, document_number, date_of_birth, address, city, country, notes, created_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: luxe_user
--

COPY public.payments (id, reservation_id, method, status, amount, currency, provider, provider_txn_id, card_last4, card_brand, paid_at, created_at) FROM stdin;
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: luxe_user
--

COPY public.reservations (id, guest_id, room_id, check_in_date, check_out_date, adults, children, status, special_requests, subtotal, taxes, service_fee, total_amount, created_by_user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: room_amenities; Type: TABLE DATA; Schema: public; Owner: luxe_user
--

COPY public.room_amenities (id, code, label) FROM stdin;
2b8693ec-65e6-4014-ab57-f18a6dfc1614	wifi	Free WiFi
db343d64-68ad-494e-a9d1-0b4896251e9f	smart-tv	Smart TV
921230f6-28de-4ab5-a3d2-faa7c91571a8	minibar	Minibar
b29a5ee6-46e1-4000-aed4-a63fdce96b25	coffee	Coffee Maker
04cd7276-761b-4745-b804-1d3d58f1d303	climate	Climate Control
4c2c757a-bf1c-4643-a96d-e9d138579f74	safe	In-Room Safe
9fffb2a6-9c85-4d0e-8cab-f37c23e89f68	balcony	Balcony/Terrace
9600830a-2718-42d4-9ddf-755f3ad59cab	workspace	Work Desk
5307c78e-0d8e-4fb0-b6fb-0af2bb01947e	signature-bedding	Premium Bedding
aa89d989-4185-43dc-8e3b-6d6083c05155	pillow-menu	Pillow Menu
e565f157-4238-4245-8f84-d45b9323b8e2	turndown-service	Turndown Service
74e4ff59-6724-478c-b17e-d9da5301274e	lounge-access	Lounge Access
3a844fff-3b9a-4e0c-8921-6d56894ac787	private-pool	Private Pool
c3158399-8bba-4147-a108-2779a072d0b1	jacuzzi	Jacuzzi
052fb6dc-0055-4351-ae51-9a895bd1b8f1	kitchen	Full Kitchen
efb7f29c-ca57-44ef-b020-ff7b7a9eb885	living-room	Living Room
86eb7c25-a796-4ba5-8185-c7c1908c139b	bar	Mini Bar
d3536ab9-cb3e-4f5f-99a4-29252ab8e1d5	dining-room	Dining Area
fdf75bdd-f6a9-406f-8c98-e514d0930b26	spa	Spa Access
4a46ac83-ee07-4c1a-95dd-8a0c0669fdb8	gym	Gym Access
4571cb51-aaa4-4262-8b88-b740cb44d5b5	butler-service	Butler Service
f6740313-b063-4b32-91aa-91e5bad4839c	laundry	In-Room Laundry
d69d82c6-3784-4c64-b8b3-cdf966961e89	family-services	Family Services
1ba839b4-d28d-4bbd-ab3f-dd98e38086a5	games	Games/Console
06e8e203-0f2a-43e5-9b66-cb170b459533	desk	Work Desk
7d1af915-2476-417a-99fd-8c03d8300454	pool-access	Pool Access
1166757d-ccec-49de-b43c-7887ea9941e9	spa-access	Spa Access
23be0db8-704b-4d67-a390-799ece4ca91e	sound-system	Sound System
7bcdc063-42d9-4c9d-93a0-034b36fc8d40	outdoor-seating	Outdoor Seating
dd936a31-85b1-4c49-97b3-cad30e2a032c	smart-lighting	Smart Lighting
f66046ae-c4bf-4724-a304-bad305636dd7	wardrobe	Wardrobe
9fe2b216-7f3f-4e2e-bbeb-29dbb234224d	premium-minibar	Premium Minibar
5963adc9-e6f3-4c26-a72e-45b172edfb53	private-dining	Private Dining
c5536300-de54-47f8-ab81-ee10e14762ca	console	Gaming Console
9af0f180-c0ae-402d-8f3e-4e00670ce8d6	private-chef-optional	Private Chef (Optional)
e73a56ab-1657-486a-82aa-256a6bfe421c	private-transport-optional	Private Transport (Optional)
\.


--
-- Data for Name: room_amenity_map; Type: TABLE DATA; Schema: public; Owner: luxe_user
--

COPY public.room_amenity_map (room_id, amenity_id) FROM stdin;
4adc15ad-5f71-4dcc-bb4b-090a49e102ec	2b8693ec-65e6-4014-ab57-f18a6dfc1614
4adc15ad-5f71-4dcc-bb4b-090a49e102ec	db343d64-68ad-494e-a9d1-0b4896251e9f
4adc15ad-5f71-4dcc-bb4b-090a49e102ec	921230f6-28de-4ab5-a3d2-faa7c91571a8
4adc15ad-5f71-4dcc-bb4b-090a49e102ec	b29a5ee6-46e1-4000-aed4-a63fdce96b25
4adc15ad-5f71-4dcc-bb4b-090a49e102ec	04cd7276-761b-4745-b804-1d3d58f1d303
4adc15ad-5f71-4dcc-bb4b-090a49e102ec	4c2c757a-bf1c-4643-a96d-e9d138579f74
4adc15ad-5f71-4dcc-bb4b-090a49e102ec	9fffb2a6-9c85-4d0e-8cab-f37c23e89f68
4adc15ad-5f71-4dcc-bb4b-090a49e102ec	9600830a-2718-42d4-9ddf-755f3ad59cab
4adc15ad-5f71-4dcc-bb4b-090a49e102ec	5307c78e-0d8e-4fb0-b6fb-0af2bb01947e
4adc15ad-5f71-4dcc-bb4b-090a49e102ec	aa89d989-4185-43dc-8e3b-6d6083c05155
4adc15ad-5f71-4dcc-bb4b-090a49e102ec	e565f157-4238-4245-8f84-d45b9323b8e2
4adc15ad-5f71-4dcc-bb4b-090a49e102ec	74e4ff59-6724-478c-b17e-d9da5301274e
3d503bf5-2fde-422e-ae32-85deebaf6435	2b8693ec-65e6-4014-ab57-f18a6dfc1614
3d503bf5-2fde-422e-ae32-85deebaf6435	db343d64-68ad-494e-a9d1-0b4896251e9f
3d503bf5-2fde-422e-ae32-85deebaf6435	921230f6-28de-4ab5-a3d2-faa7c91571a8
3d503bf5-2fde-422e-ae32-85deebaf6435	b29a5ee6-46e1-4000-aed4-a63fdce96b25
3d503bf5-2fde-422e-ae32-85deebaf6435	04cd7276-761b-4745-b804-1d3d58f1d303
3d503bf5-2fde-422e-ae32-85deebaf6435	9fffb2a6-9c85-4d0e-8cab-f37c23e89f68
3d503bf5-2fde-422e-ae32-85deebaf6435	5307c78e-0d8e-4fb0-b6fb-0af2bb01947e
3d503bf5-2fde-422e-ae32-85deebaf6435	e565f157-4238-4245-8f84-d45b9323b8e2
3d503bf5-2fde-422e-ae32-85deebaf6435	74e4ff59-6724-478c-b17e-d9da5301274e
3d503bf5-2fde-422e-ae32-85deebaf6435	3a844fff-3b9a-4e0c-8921-6d56894ac787
3d503bf5-2fde-422e-ae32-85deebaf6435	c3158399-8bba-4147-a108-2779a072d0b1
3d503bf5-2fde-422e-ae32-85deebaf6435	efb7f29c-ca57-44ef-b020-ff7b7a9eb885
3d503bf5-2fde-422e-ae32-85deebaf6435	23be0db8-704b-4d67-a390-799ece4ca91e
3d503bf5-2fde-422e-ae32-85deebaf6435	7bcdc063-42d9-4c9d-93a0-034b36fc8d40
3d503bf5-2fde-422e-ae32-85deebaf6435	dd936a31-85b1-4c49-97b3-cad30e2a032c
8395f05f-17b1-4263-b361-f7164bb70889	2b8693ec-65e6-4014-ab57-f18a6dfc1614
8395f05f-17b1-4263-b361-f7164bb70889	db343d64-68ad-494e-a9d1-0b4896251e9f
8395f05f-17b1-4263-b361-f7164bb70889	9fffb2a6-9c85-4d0e-8cab-f37c23e89f68
8395f05f-17b1-4263-b361-f7164bb70889	5307c78e-0d8e-4fb0-b6fb-0af2bb01947e
8395f05f-17b1-4263-b361-f7164bb70889	aa89d989-4185-43dc-8e3b-6d6083c05155
8395f05f-17b1-4263-b361-f7164bb70889	e565f157-4238-4245-8f84-d45b9323b8e2
8395f05f-17b1-4263-b361-f7164bb70889	3a844fff-3b9a-4e0c-8921-6d56894ac787
8395f05f-17b1-4263-b361-f7164bb70889	c3158399-8bba-4147-a108-2779a072d0b1
8395f05f-17b1-4263-b361-f7164bb70889	052fb6dc-0055-4351-ae51-9a895bd1b8f1
8395f05f-17b1-4263-b361-f7164bb70889	86eb7c25-a796-4ba5-8185-c7c1908c139b
8395f05f-17b1-4263-b361-f7164bb70889	d3536ab9-cb3e-4f5f-99a4-29252ab8e1d5
8395f05f-17b1-4263-b361-f7164bb70889	fdf75bdd-f6a9-406f-8c98-e514d0930b26
8395f05f-17b1-4263-b361-f7164bb70889	4a46ac83-ee07-4c1a-95dd-8a0c0669fdb8
8395f05f-17b1-4263-b361-f7164bb70889	4571cb51-aaa4-4262-8b88-b740cb44d5b5
8395f05f-17b1-4263-b361-f7164bb70889	f66046ae-c4bf-4724-a304-bad305636dd7
8395f05f-17b1-4263-b361-f7164bb70889	9fe2b216-7f3f-4e2e-bbeb-29dbb234224d
8395f05f-17b1-4263-b361-f7164bb70889	5963adc9-e6f3-4c26-a72e-45b172edfb53
19cd3058-edbe-4c87-acd0-334e0c3dc74a	2b8693ec-65e6-4014-ab57-f18a6dfc1614
19cd3058-edbe-4c87-acd0-334e0c3dc74a	db343d64-68ad-494e-a9d1-0b4896251e9f
19cd3058-edbe-4c87-acd0-334e0c3dc74a	921230f6-28de-4ab5-a3d2-faa7c91571a8
19cd3058-edbe-4c87-acd0-334e0c3dc74a	b29a5ee6-46e1-4000-aed4-a63fdce96b25
19cd3058-edbe-4c87-acd0-334e0c3dc74a	04cd7276-761b-4745-b804-1d3d58f1d303
19cd3058-edbe-4c87-acd0-334e0c3dc74a	4c2c757a-bf1c-4643-a96d-e9d138579f74
19cd3058-edbe-4c87-acd0-334e0c3dc74a	5307c78e-0d8e-4fb0-b6fb-0af2bb01947e
19cd3058-edbe-4c87-acd0-334e0c3dc74a	06e8e203-0f2a-43e5-9b66-cb170b459533
bdd9a627-2b04-4232-bc38-f08b988738d6	2b8693ec-65e6-4014-ab57-f18a6dfc1614
bdd9a627-2b04-4232-bc38-f08b988738d6	db343d64-68ad-494e-a9d1-0b4896251e9f
bdd9a627-2b04-4232-bc38-f08b988738d6	921230f6-28de-4ab5-a3d2-faa7c91571a8
bdd9a627-2b04-4232-bc38-f08b988738d6	b29a5ee6-46e1-4000-aed4-a63fdce96b25
bdd9a627-2b04-4232-bc38-f08b988738d6	04cd7276-761b-4745-b804-1d3d58f1d303
bdd9a627-2b04-4232-bc38-f08b988738d6	4c2c757a-bf1c-4643-a96d-e9d138579f74
bdd9a627-2b04-4232-bc38-f08b988738d6	9fffb2a6-9c85-4d0e-8cab-f37c23e89f68
bdd9a627-2b04-4232-bc38-f08b988738d6	5307c78e-0d8e-4fb0-b6fb-0af2bb01947e
bdd9a627-2b04-4232-bc38-f08b988738d6	06e8e203-0f2a-43e5-9b66-cb170b459533
bdd9a627-2b04-4232-bc38-f08b988738d6	7d1af915-2476-417a-99fd-8c03d8300454
d32ed38b-7423-4ebb-b8d0-c00cfd6a3e4e	2b8693ec-65e6-4014-ab57-f18a6dfc1614
d32ed38b-7423-4ebb-b8d0-c00cfd6a3e4e	db343d64-68ad-494e-a9d1-0b4896251e9f
d32ed38b-7423-4ebb-b8d0-c00cfd6a3e4e	921230f6-28de-4ab5-a3d2-faa7c91571a8
d32ed38b-7423-4ebb-b8d0-c00cfd6a3e4e	b29a5ee6-46e1-4000-aed4-a63fdce96b25
d32ed38b-7423-4ebb-b8d0-c00cfd6a3e4e	04cd7276-761b-4745-b804-1d3d58f1d303
d32ed38b-7423-4ebb-b8d0-c00cfd6a3e4e	4c2c757a-bf1c-4643-a96d-e9d138579f74
d32ed38b-7423-4ebb-b8d0-c00cfd6a3e4e	9fffb2a6-9c85-4d0e-8cab-f37c23e89f68
d32ed38b-7423-4ebb-b8d0-c00cfd6a3e4e	5307c78e-0d8e-4fb0-b6fb-0af2bb01947e
d32ed38b-7423-4ebb-b8d0-c00cfd6a3e4e	e565f157-4238-4245-8f84-d45b9323b8e2
d32ed38b-7423-4ebb-b8d0-c00cfd6a3e4e	efb7f29c-ca57-44ef-b020-ff7b7a9eb885
d32ed38b-7423-4ebb-b8d0-c00cfd6a3e4e	06e8e203-0f2a-43e5-9b66-cb170b459533
d32ed38b-7423-4ebb-b8d0-c00cfd6a3e4e	1166757d-ccec-49de-b43c-7887ea9941e9
3c471905-0619-46aa-9689-29d9ac526f29	2b8693ec-65e6-4014-ab57-f18a6dfc1614
3c471905-0619-46aa-9689-29d9ac526f29	db343d64-68ad-494e-a9d1-0b4896251e9f
3c471905-0619-46aa-9689-29d9ac526f29	04cd7276-761b-4745-b804-1d3d58f1d303
3c471905-0619-46aa-9689-29d9ac526f29	9fffb2a6-9c85-4d0e-8cab-f37c23e89f68
3c471905-0619-46aa-9689-29d9ac526f29	5307c78e-0d8e-4fb0-b6fb-0af2bb01947e
3c471905-0619-46aa-9689-29d9ac526f29	052fb6dc-0055-4351-ae51-9a895bd1b8f1
3c471905-0619-46aa-9689-29d9ac526f29	d3536ab9-cb3e-4f5f-99a4-29252ab8e1d5
3c471905-0619-46aa-9689-29d9ac526f29	f6740313-b063-4b32-91aa-91e5bad4839c
3c471905-0619-46aa-9689-29d9ac526f29	d69d82c6-3784-4c64-b8b3-cdf966961e89
3c471905-0619-46aa-9689-29d9ac526f29	1ba839b4-d28d-4bbd-ab3f-dd98e38086a5
3c471905-0619-46aa-9689-29d9ac526f29	c5536300-de54-47f8-ab81-ee10e14762ca
d1f68cc8-fbcb-49db-8d0b-93aa55993ac5	2b8693ec-65e6-4014-ab57-f18a6dfc1614
d1f68cc8-fbcb-49db-8d0b-93aa55993ac5	db343d64-68ad-494e-a9d1-0b4896251e9f
d1f68cc8-fbcb-49db-8d0b-93aa55993ac5	9fffb2a6-9c85-4d0e-8cab-f37c23e89f68
d1f68cc8-fbcb-49db-8d0b-93aa55993ac5	9600830a-2718-42d4-9ddf-755f3ad59cab
d1f68cc8-fbcb-49db-8d0b-93aa55993ac5	5307c78e-0d8e-4fb0-b6fb-0af2bb01947e
d1f68cc8-fbcb-49db-8d0b-93aa55993ac5	e565f157-4238-4245-8f84-d45b9323b8e2
d1f68cc8-fbcb-49db-8d0b-93aa55993ac5	74e4ff59-6724-478c-b17e-d9da5301274e
d1f68cc8-fbcb-49db-8d0b-93aa55993ac5	052fb6dc-0055-4351-ae51-9a895bd1b8f1
d1f68cc8-fbcb-49db-8d0b-93aa55993ac5	86eb7c25-a796-4ba5-8185-c7c1908c139b
d1f68cc8-fbcb-49db-8d0b-93aa55993ac5	d3536ab9-cb3e-4f5f-99a4-29252ab8e1d5
d1f68cc8-fbcb-49db-8d0b-93aa55993ac5	f6740313-b063-4b32-91aa-91e5bad4839c
d1f68cc8-fbcb-49db-8d0b-93aa55993ac5	1166757d-ccec-49de-b43c-7887ea9941e9
11c16dde-c2dd-4b85-aedd-3dca4735c384	2b8693ec-65e6-4014-ab57-f18a6dfc1614
11c16dde-c2dd-4b85-aedd-3dca4735c384	db343d64-68ad-494e-a9d1-0b4896251e9f
11c16dde-c2dd-4b85-aedd-3dca4735c384	9fffb2a6-9c85-4d0e-8cab-f37c23e89f68
11c16dde-c2dd-4b85-aedd-3dca4735c384	5307c78e-0d8e-4fb0-b6fb-0af2bb01947e
11c16dde-c2dd-4b85-aedd-3dca4735c384	aa89d989-4185-43dc-8e3b-6d6083c05155
11c16dde-c2dd-4b85-aedd-3dca4735c384	e565f157-4238-4245-8f84-d45b9323b8e2
11c16dde-c2dd-4b85-aedd-3dca4735c384	3a844fff-3b9a-4e0c-8921-6d56894ac787
11c16dde-c2dd-4b85-aedd-3dca4735c384	052fb6dc-0055-4351-ae51-9a895bd1b8f1
11c16dde-c2dd-4b85-aedd-3dca4735c384	86eb7c25-a796-4ba5-8185-c7c1908c139b
11c16dde-c2dd-4b85-aedd-3dca4735c384	d3536ab9-cb3e-4f5f-99a4-29252ab8e1d5
11c16dde-c2dd-4b85-aedd-3dca4735c384	fdf75bdd-f6a9-406f-8c98-e514d0930b26
11c16dde-c2dd-4b85-aedd-3dca4735c384	4a46ac83-ee07-4c1a-95dd-8a0c0669fdb8
11c16dde-c2dd-4b85-aedd-3dca4735c384	4571cb51-aaa4-4262-8b88-b740cb44d5b5
11c16dde-c2dd-4b85-aedd-3dca4735c384	f6740313-b063-4b32-91aa-91e5bad4839c
11c16dde-c2dd-4b85-aedd-3dca4735c384	9af0f180-c0ae-402d-8f3e-4e00670ce8d6
11c16dde-c2dd-4b85-aedd-3dca4735c384	e73a56ab-1657-486a-82aa-256a6bfe421c
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: luxe_user
--

COPY public.rooms (id, slug, name, description, price_per_night, size_m2, view_type, floor, max_adults, max_children, max_guests, quantity, image_url, rating, total_reviews, check_in_time, check_out_time, cancellation_policy, is_active, created_at) FROM stdin;
4adc15ad-5f71-4dcc-bb4b-090a49e102ec	deluxe-suite	Deluxe Suite	An elegant urban retreat featuring panoramic city views, premium furnishings, and smart-room technology designed for modern luxury comfort.	450.00	45	City	15-20	2	1	3	1	https://res.cloudinary.com/dnlptakhb/image/upload/v1771184687/hotel/Luxe.jpg	4.6	3847	15:00:00	12:00:00	Free cancellation up to 24 hours before arrival	t	2026-02-17 16:23:33.173517
3d503bf5-2fde-422e-ae32-85deebaf6435	garden-view-terrace	Garden View Terrace	A tranquil luxury suite featuring a private terrace overlooking landscaped gardens, combining indoor elegance with outdoor relaxation and wellness-focused amenities.	720.00	80	Garden	1-3	2	2	4	1	https://res.cloudinary.com/dnlptakhb/image/upload/v1771184696/hotel/Luxe-8.png	4.8	2156	14:00:00	12:00:00	\N	t	2026-02-17 16:23:33.177185
8395f05f-17b1-4263-b361-f7164bb70889	the-penthouse	The Penthouse	An iconic ultra-luxury residence featuring rooftop experiences, panoramic skyline views, and exclusive high-end hospitality designed for prestigious stays.	1600.00	180	Panoramic	Rooftop	4	2	6	1	https://res.cloudinary.com/dnlptakhb/image/upload/v1771184725/hotel/Luxe-19.jpg	4.9	892	12:00:00	14:00:00	\N	t	2026-02-17 16:23:33.177998
19cd3058-edbe-4c87-acd0-334e0c3dc74a	single-sanctuary	Single Sanctuary	A refined personal retreat offering smart design, premium bedding, and modern connectivity for independent urban travelers.	120.00	25	City	8-12	1	1	2	1	https://res.cloudinary.com/dnlptakhb/image/upload/v1771184710/hotel/Luxe-23.jpg	4.3	5621	\N	\N	\N	t	2026-02-17 16:23:33.178905
bdd9a627-2b04-4232-bc38-f08b988738d6	double-elegance	Double Elegance	A stylish and comfortable shared space featuring warm contemporary interiors, premium bedding, and curated comfort amenities.	220.00	40	Garden	5-10	2	1	3	1	https://res.cloudinary.com/dnlptakhb/image/upload/v1771184705/hotel/Luxe-6.jpg	4.5	4293	\N	\N	\N	t	2026-02-17 16:23:33.179938
d32ed38b-7423-4ebb-b8d0-c00cfd6a3e4e	grand-panoramic-suite	Grand Panoramic Suite	A spacious premium suite with panoramic urban views, elegant interiors, and abundant natural light designed for elevated comfort.	420.00	60	Panoramic	18-22	2	2	4	1	https://res.cloudinary.com/dnlptakhb/image/upload/v1771184688/hotel/Luxe-9.jpg	4.7	2847	\N	\N	\N	t	2026-02-17 16:23:33.180551
3c471905-0619-46aa-9689-29d9ac526f29	family-hearth	Family Hearth	A spacious family luxury suite offering multi-zone living, entertainment amenities, and comfort-focused design for memorable shared stays.	520.00	75	City	4-8	2	3	5	1	https://res.cloudinary.com/dnlptakhb/image/upload/v1771184699/hotel/Luxe-7.png	4.6	3156	\N	\N	\N	t	2026-02-17 16:23:33.181164
d1f68cc8-fbcb-49db-8d0b-93aa55993ac5	presidential-suite	Presidential Suite	A prestigious luxury residence offering grand living spaces, refined design, and elevated hospitality for distinguished guests.	1700.00	140	City	20-25	5	3	8	1	https://res.cloudinary.com/dnlptakhb/image/upload/v1771184689/hotel/Luxe-10.jpg	4.8	2100	\N	\N	\N	t	2026-02-17 16:23:33.182027
11c16dde-c2dd-4b85-aedd-3dca4735c384	presidential-penthouse	Presidential Penthouse	The ultimate ultra-luxury urban residence offering unmatched privacy, private pool experiences, and elite personalized hospitality.	2400.00	175	Panoramic	Rooftop	5	3	8	1	https://res.cloudinary.com/dnlptakhb/image/upload/v1771184706/hotel/Luxe-20.jpg	4.9	2156	\N	\N	\N	t	2026-02-17 16:23:33.183864
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: luxe_user
--

COPY public.users (id, name, email, password_hash, role, created_at) FROM stdin;
56142c65-cb33-4a25-8fb9-83595b5c70ba	Administrador	admin@luxehotel.com	$2b$12$Z/APPnIzKgYckJho5kewhe6hzJJz./q3yYKI0jdRZ817Dx2vblvma	admin	2026-02-17 15:39:55.090338
\.


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: guests guests_pkey; Type: CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.guests
    ADD CONSTRAINT guests_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);


--
-- Name: room_amenities room_amenities_code_key; Type: CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.room_amenities
    ADD CONSTRAINT room_amenities_code_key UNIQUE (code);


--
-- Name: room_amenities room_amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.room_amenities
    ADD CONSTRAINT room_amenities_pkey PRIMARY KEY (id);


--
-- Name: room_amenity_map room_amenity_map_pkey; Type: CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.room_amenity_map
    ADD CONSTRAINT room_amenity_map_pkey PRIMARY KEY (room_id, amenity_id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_slug_key; Type: CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_slug_key UNIQUE (slug);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: payments payments_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON DELETE CASCADE;


--
-- Name: reservations reservations_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: reservations reservations_guest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_guest_id_fkey FOREIGN KEY (guest_id) REFERENCES public.guests(id) ON DELETE RESTRICT;


--
-- Name: reservations reservations_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE RESTRICT;


--
-- Name: room_amenity_map room_amenity_map_amenity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.room_amenity_map
    ADD CONSTRAINT room_amenity_map_amenity_id_fkey FOREIGN KEY (amenity_id) REFERENCES public.room_amenities(id) ON DELETE CASCADE;


--
-- Name: room_amenity_map room_amenity_map_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: luxe_user
--

ALTER TABLE ONLY public.room_amenity_map
    ADD CONSTRAINT room_amenity_map_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict lNAoZUFsx3xOaasAqVvy2be3qqr8LaHepmLtdDHpt6Aie8xZyKb3jBNXWEeo91F


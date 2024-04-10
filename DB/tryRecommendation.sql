PGDMP  *    *        
        |            CSCI3100 Project    16.2    16.2 1    0           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            1           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            2           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            3           1262    16556    CSCI3100 Project    DATABASE     �   CREATE DATABASE "CSCI3100 Project" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Chinese (Traditional)_Hong Kong SAR.950';
 "   DROP DATABASE "CSCI3100 Project";
                postgres    false                        3079    16646    pg_trgm 	   EXTENSION     ;   CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;
    DROP EXTENSION pg_trgm;
                   false            4           0    0    EXTENSION pg_trgm    COMMENT     e   COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';
                        false    2            �           1247    16613    contenttypet    TYPE     G   CREATE TYPE public.contenttypet AS ENUM (
    'post',
    'comment'
);
    DROP TYPE public.contenttypet;
       public          postgres    false            v           1247    16566    privacyt    TYPE     E   CREATE TYPE public.privacyt AS ENUM (
    'public',
    'private'
);
    DROP TYPE public.privacyt;
       public          postgres    false            s           1247    16558 	   usertypet    TYPE     M   CREATE TYPE public.usertypet AS ENUM (
    'user',
    'admin',
    'dev'
);
    DROP TYPE public.usertypet;
       public          postgres    false            �            1259    16636    comments    TABLE     �   CREATE TABLE public.comments (
    commentid integer NOT NULL,
    authorid integer NOT NULL,
    content text,
    likes integer DEFAULT 0 NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.comments;
       public         heap    postgres    false            �            1259    16635    comments_commentid_seq    SEQUENCE     �   CREATE SEQUENCE public.comments_commentid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.comments_commentid_seq;
       public          postgres    false    227            5           0    0    comments_commentid_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.comments_commentid_seq OWNED BY public.comments.commentid;
          public          postgres    false    226            �            1259    16629    followrequests    TABLE     �   CREATE TABLE public.followrequests (
    followerid integer NOT NULL,
    followingid integer NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
 "   DROP TABLE public.followrequests;
       public         heap    postgres    false            �            1259    16617    likes    TABLE     �   CREATE TABLE public.likes (
    contenttype public.contenttypet NOT NULL,
    contentid integer NOT NULL,
    userid integer NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.likes;
       public         heap    postgres    false    901            �            1259    16604    media    TABLE     �   CREATE TABLE public.media (
    mediaid character varying(32) NOT NULL,
    ownerid integer NOT NULL,
    privacy public.privacyt NOT NULL,
    uri text,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.media;
       public         heap    postgres    false    886            �            1259    16594    messages    TABLE     �   CREATE TABLE public.messages (
    messageid integer NOT NULL,
    senderid integer NOT NULL,
    receiverid integer NOT NULL,
    content text,
    read boolean DEFAULT false NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.messages;
       public         heap    postgres    false            �            1259    16593    messages_messageid_seq    SEQUENCE     �   CREATE SEQUENCE public.messages_messageid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.messages_messageid_seq;
       public          postgres    false    221            6           0    0    messages_messageid_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.messages_messageid_seq OWNED BY public.messages.messageid;
          public          postgres    false    220            �            1259    16583    posts    TABLE       CREATE TABLE public.posts (
    postid integer NOT NULL,
    authorid integer NOT NULL,
    mediaid character varying(32),
    content text,
    privacy public.privacyt NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.posts;
       public         heap    postgres    false    886            �            1259    16582    posts_postid_seq    SEQUENCE     �   CREATE SEQUENCE public.posts_postid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.posts_postid_seq;
       public          postgres    false    219            7           0    0    posts_postid_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.posts_postid_seq OWNED BY public.posts.postid;
          public          postgres    false    218            �            1259    16623    relationships    TABLE     �   CREATE TABLE public.relationships (
    followerid integer NOT NULL,
    followingid integer NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
 !   DROP TABLE public.relationships;
       public         heap    postgres    false            �            1259    16572    users    TABLE     r  CREATE TABLE public.users (
    userid integer NOT NULL,
    username character varying(255) NOT NULL,
    salt character varying(64),
    password character varying(255),
    secureqans text,
    privacy public.privacyt NOT NULL,
    description text,
    active boolean DEFAULT true NOT NULL,
    usertype public.usertypet DEFAULT 'user'::public.usertypet NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false    883    883    886            �            1259    16571    users_userid_seq    SEQUENCE     �   CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.users_userid_seq;
       public          postgres    false    217            8           0    0    users_userid_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;
          public          postgres    false    216            �           2604    16639    comments commentid    DEFAULT     x   ALTER TABLE ONLY public.comments ALTER COLUMN commentid SET DEFAULT nextval('public.comments_commentid_seq'::regclass);
 A   ALTER TABLE public.comments ALTER COLUMN commentid DROP DEFAULT;
       public          postgres    false    226    227    227            y           2604    16597    messages messageid    DEFAULT     x   ALTER TABLE ONLY public.messages ALTER COLUMN messageid SET DEFAULT nextval('public.messages_messageid_seq'::regclass);
 A   ALTER TABLE public.messages ALTER COLUMN messageid DROP DEFAULT;
       public          postgres    false    221    220    221            v           2604    16586    posts postid    DEFAULT     l   ALTER TABLE ONLY public.posts ALTER COLUMN postid SET DEFAULT nextval('public.posts_postid_seq'::regclass);
 ;   ALTER TABLE public.posts ALTER COLUMN postid DROP DEFAULT;
       public          postgres    false    219    218    219            s           2604    16575    users userid    DEFAULT     l   ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);
 ;   ALTER TABLE public.users ALTER COLUMN userid DROP DEFAULT;
       public          postgres    false    216    217    217            -          0    16636    comments 
   TABLE DATA           O   COPY public.comments (commentid, authorid, content, likes, "time") FROM stdin;
    public          postgres    false    227   �6       +          0    16629    followrequests 
   TABLE DATA           I   COPY public.followrequests (followerid, followingid, "time") FROM stdin;
    public          postgres    false    225   �6       )          0    16617    likes 
   TABLE DATA           G   COPY public.likes (contenttype, contentid, userid, "time") FROM stdin;
    public          postgres    false    223   
7       (          0    16604    media 
   TABLE DATA           G   COPY public.media (mediaid, ownerid, privacy, uri, "time") FROM stdin;
    public          postgres    false    222   J7       '          0    16594    messages 
   TABLE DATA           Z   COPY public.messages (messageid, senderid, receiverid, content, read, "time") FROM stdin;
    public          postgres    false    221   g7       %          0    16583    posts 
   TABLE DATA           [   COPY public.posts (postid, authorid, mediaid, content, privacy, likes, "time") FROM stdin;
    public          postgres    false    219   �7       *          0    16623    relationships 
   TABLE DATA           H   COPY public.relationships (followerid, followingid, "time") FROM stdin;
    public          postgres    false    224   �7       #          0    16572    users 
   TABLE DATA           u   COPY public.users (userid, username, salt, password, secureqans, privacy, description, active, usertype) FROM stdin;
    public          postgres    false    217   -8       9           0    0    comments_commentid_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.comments_commentid_seq', 1, false);
          public          postgres    false    226            :           0    0    messages_messageid_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.messages_messageid_seq', 1, false);
          public          postgres    false    220            ;           0    0    posts_postid_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.posts_postid_seq', 1, true);
          public          postgres    false    218            <           0    0    users_userid_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.users_userid_seq', 4, true);
          public          postgres    false    216            �           2606    16645    comments comments_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (commentid);
 @   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
       public            postgres    false    227            �           2606    16634 "   followrequests followrequests_pkey 
   CONSTRAINT     u   ALTER TABLE ONLY public.followrequests
    ADD CONSTRAINT followrequests_pkey PRIMARY KEY (followerid, followingid);
 L   ALTER TABLE ONLY public.followrequests DROP CONSTRAINT followrequests_pkey;
       public            postgres    false    225    225            �           2606    16622    likes likes_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (contenttype, contentid, userid);
 :   ALTER TABLE ONLY public.likes DROP CONSTRAINT likes_pkey;
       public            postgres    false    223    223    223            �           2606    16611    media media_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (mediaid);
 :   ALTER TABLE ONLY public.media DROP CONSTRAINT media_pkey;
       public            postgres    false    222            �           2606    16603    messages messages_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (messageid);
 @   ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_pkey;
       public            postgres    false    221            �           2606    16592    posts posts_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (postid);
 :   ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_pkey;
       public            postgres    false    219            �           2606    16628     relationships relationships_pkey 
   CONSTRAINT     s   ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_pkey PRIMARY KEY (followerid, followingid);
 J   ALTER TABLE ONLY public.relationships DROP CONSTRAINT relationships_pkey;
       public            postgres    false    224    224            �           2606    16581    users users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    217            -      x������ � �      +      x������ � �      )   0   x�+�/.�44�4�4202�5 "C+S+s=#33#s�=... ��H      (      x������ � �      '      x������ � �      %   =   x�3�4�LLL�LLJ�,(M��L�4�4202�50�54P04�24�24�3�0032����� S?`      *   L   x�}ͱ�0��p���K���:��3�mp!��r+�"���!��왲;�D�.��n?�,�Ɉ�g����(
      #   �   x�u�]j1����)��l�=A^$[��i(�n��M(%P
�00��0���m�-��N�?��������#Z藢��m���������p�p������S�)� 	�h(#Svő�x$�8�UP��b��jV6�9��7�D5h��줵M��mHg��!2�炽����p�6;�wb�8��:p $D����mY�o�X.     
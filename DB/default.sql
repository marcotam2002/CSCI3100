PGDMP  &    
                |            CSCI3100 Project    16.2    16.2 (    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16398    CSCI3100 Project    DATABASE     �   CREATE DATABASE "CSCI3100 Project" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Chinese (Traditional)_Hong Kong SAR.950';
 "   DROP DATABASE "CSCI3100 Project";
                postgres    false            ]           1247    16441    contenttypet    TYPE     G   CREATE TYPE public.contenttypet AS ENUM (
    'post',
    'comment'
);
    DROP TYPE public.contenttypet;
       public          postgres    false            Q           1247    16400 	   usertypet    TYPE     M   CREATE TYPE public.usertypet AS ENUM (
    'user',
    'admin',
    'dev'
);
    DROP TYPE public.usertypet;
       public          postgres    false            �            1259    16456    comments    TABLE     �   CREATE TABLE public.comments (
    commentid integer NOT NULL,
    authorid integer NOT NULL,
    content text,
    likes integer DEFAULT 0 NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.comments;
       public         heap    postgres    false            �            1259    16455    comments_commentid_seq    SEQUENCE     �   CREATE SEQUENCE public.comments_commentid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.comments_commentid_seq;
       public          postgres    false    224            �           0    0    comments_commentid_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.comments_commentid_seq OWNED BY public.comments.commentid;
          public          postgres    false    223            �            1259    16445    likes    TABLE     �   CREATE TABLE public.likes (
    contenttype public.contenttypet NOT NULL,
    contentid integer NOT NULL,
    userid integer NOT NULL
);
    DROP TABLE public.likes;
       public         heap    postgres    false    861            �            1259    16430    messages    TABLE     �   CREATE TABLE public.messages (
    messageid integer NOT NULL,
    senderid integer NOT NULL,
    receiverid integer NOT NULL,
    content text,
    read boolean DEFAULT false NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.messages;
       public         heap    postgres    false            �            1259    16429    messages_messageid_seq    SEQUENCE     �   CREATE SEQUENCE public.messages_messageid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.messages_messageid_seq;
       public          postgres    false    220            �           0    0    messages_messageid_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.messages_messageid_seq OWNED BY public.messages.messageid;
          public          postgres    false    219            �            1259    16419    posts    TABLE     �   CREATE TABLE public.posts (
    postid integer NOT NULL,
    authorid integer NOT NULL,
    content text,
    likes integer DEFAULT 0 NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.posts;
       public         heap    postgres    false            �            1259    16418    posts_postid_seq    SEQUENCE     �   CREATE SEQUENCE public.posts_postid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.posts_postid_seq;
       public          postgres    false    218            �           0    0    posts_postid_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.posts_postid_seq OWNED BY public.posts.postid;
          public          postgres    false    217            �            1259    16450    relationships    TABLE     i   CREATE TABLE public.relationships (
    followerid integer NOT NULL,
    followingid integer NOT NULL
);
 !   DROP TABLE public.relationships;
       public         heap    postgres    false            �            1259    16408    users    TABLE     !  CREATE TABLE public.users (
    userid integer NOT NULL,
    username character varying(255) NOT NULL,
    salt character varying(64),
    password character varying(255),
    active boolean DEFAULT true NOT NULL,
    usertype public.usertypet DEFAULT 'user'::public.usertypet NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false    849    849            �            1259    16407    users_userid_seq    SEQUENCE     �   CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.users_userid_seq;
       public          postgres    false    216            �           0    0    users_userid_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;
          public          postgres    false    215            @           2604    16459    comments commentid    DEFAULT     x   ALTER TABLE ONLY public.comments ALTER COLUMN commentid SET DEFAULT nextval('public.comments_commentid_seq'::regclass);
 A   ALTER TABLE public.comments ALTER COLUMN commentid DROP DEFAULT;
       public          postgres    false    224    223    224            =           2604    16433    messages messageid    DEFAULT     x   ALTER TABLE ONLY public.messages ALTER COLUMN messageid SET DEFAULT nextval('public.messages_messageid_seq'::regclass);
 A   ALTER TABLE public.messages ALTER COLUMN messageid DROP DEFAULT;
       public          postgres    false    219    220    220            :           2604    16422    posts postid    DEFAULT     l   ALTER TABLE ONLY public.posts ALTER COLUMN postid SET DEFAULT nextval('public.posts_postid_seq'::regclass);
 ;   ALTER TABLE public.posts ALTER COLUMN postid DROP DEFAULT;
       public          postgres    false    217    218    218            7           2604    16411    users userid    DEFAULT     l   ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);
 ;   ALTER TABLE public.users ALTER COLUMN userid DROP DEFAULT;
       public          postgres    false    216    215    216            �          0    16456    comments 
   TABLE DATA           O   COPY public.comments (commentid, authorid, content, likes, "time") FROM stdin;
    public          postgres    false    224   �+       �          0    16445    likes 
   TABLE DATA           ?   COPY public.likes (contenttype, contentid, userid) FROM stdin;
    public          postgres    false    221   �+       �          0    16430    messages 
   TABLE DATA           Z   COPY public.messages (messageid, senderid, receiverid, content, read, "time") FROM stdin;
    public          postgres    false    220   �+       �          0    16419    posts 
   TABLE DATA           I   COPY public.posts (postid, authorid, content, likes, "time") FROM stdin;
    public          postgres    false    218   ,       �          0    16450    relationships 
   TABLE DATA           @   COPY public.relationships (followerid, followingid) FROM stdin;
    public          postgres    false    222   5,       �          0    16408    users 
   TABLE DATA           S   COPY public.users (userid, username, salt, password, active, usertype) FROM stdin;
    public          postgres    false    216   R,       �           0    0    comments_commentid_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.comments_commentid_seq', 1, false);
          public          postgres    false    223            �           0    0    messages_messageid_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.messages_messageid_seq', 1, false);
          public          postgres    false    219            �           0    0    posts_postid_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.posts_postid_seq', 1, false);
          public          postgres    false    217            �           0    0    users_userid_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_userid_seq', 1, false);
          public          postgres    false    215            N           2606    16465    comments comments_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (commentid);
 @   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
       public            postgres    false    224            J           2606    16449    likes likes_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (contenttype, contentid, userid);
 :   ALTER TABLE ONLY public.likes DROP CONSTRAINT likes_pkey;
       public            postgres    false    221    221    221            H           2606    16439    messages messages_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (messageid);
 @   ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_pkey;
       public            postgres    false    220            F           2606    16428    posts posts_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (postid);
 :   ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_pkey;
       public            postgres    false    218            L           2606    16454     relationships relationships_pkey 
   CONSTRAINT     s   ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_pkey PRIMARY KEY (followerid, followingid);
 J   ALTER TABLE ONLY public.relationships DROP CONSTRAINT relationships_pkey;
       public            postgres    false    222    222            D           2606    16417    users users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �     
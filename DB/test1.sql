PGDMP               
        |            CSCI3100 Project    16.2    16.2 .    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    17075    CSCI3100 Project    DATABASE     t   CREATE DATABASE "CSCI3100 Project" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
 "   DROP DATABASE "CSCI3100 Project";
                postgres    false                        3079    17158    pg_trgm 	   EXTENSION     ;   CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;
    DROP EXTENSION pg_trgm;
                   false            �           0    0    EXTENSION pg_trgm    COMMENT     e   COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';
                        false    2            r           1247    17077    contenttypet    TYPE     G   CREATE TYPE public.contenttypet AS ENUM (
    'post',
    'comment'
);
    DROP TYPE public.contenttypet;
       public          postgres    false            u           1247    17082    privacyt    TYPE     E   CREATE TYPE public.privacyt AS ENUM (
    'public',
    'private'
);
    DROP TYPE public.privacyt;
       public          postgres    false            x           1247    17088 	   usertypet    TYPE     M   CREATE TYPE public.usertypet AS ENUM (
    'user',
    'admin',
    'dev'
);
    DROP TYPE public.usertypet;
       public          postgres    false            �            1259    17095    comments    TABLE     �   CREATE TABLE public.comments (
    commentid integer NOT NULL,
    postid integer NOT NULL,
    authorid integer NOT NULL,
    content text,
    likes integer DEFAULT 0 NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.comments;
       public         heap    postgres    false            �            1259    17102    comments_commentid_seq    SEQUENCE     �   CREATE SEQUENCE public.comments_commentid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.comments_commentid_seq;
       public          postgres    false    216            �           0    0    comments_commentid_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.comments_commentid_seq OWNED BY public.comments.commentid;
          public          postgres    false    217            �            1259    17103    followrequests    TABLE     �   CREATE TABLE public.followrequests (
    followerid integer NOT NULL,
    followingid integer NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
 "   DROP TABLE public.followrequests;
       public         heap    postgres    false            �            1259    17107    likes    TABLE     �   CREATE TABLE public.likes (
    contenttype public.contenttypet NOT NULL,
    contentid integer NOT NULL,
    userid integer NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.likes;
       public         heap    postgres    false    882            �            1259    17111    messages    TABLE     �   CREATE TABLE public.messages (
    messageid integer NOT NULL,
    senderid integer NOT NULL,
    receiverid integer NOT NULL,
    content text,
    read boolean DEFAULT false NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.messages;
       public         heap    postgres    false            �            1259    17118    messages_messageid_seq    SEQUENCE     �   CREATE SEQUENCE public.messages_messageid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.messages_messageid_seq;
       public          postgres    false    220            �           0    0    messages_messageid_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.messages_messageid_seq OWNED BY public.messages.messageid;
          public          postgres    false    221            �            1259    17119    posts    TABLE     7  CREATE TABLE public.posts (
    postid integer NOT NULL,
    authorid integer NOT NULL,
    content text,
    mediauri text,
    privacy public.privacyt NOT NULL,
    isrepost boolean DEFAULT false NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.posts;
       public         heap    postgres    false    885            �            1259    17127    posts_postid_seq    SEQUENCE     �   CREATE SEQUENCE public.posts_postid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.posts_postid_seq;
       public          postgres    false    222            �           0    0    posts_postid_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.posts_postid_seq OWNED BY public.posts.postid;
          public          postgres    false    223            �            1259    17128    relationships    TABLE     �   CREATE TABLE public.relationships (
    followerid integer NOT NULL,
    followingid integer NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
 !   DROP TABLE public.relationships;
       public         heap    postgres    false            �            1259    17132    users    TABLE     r  CREATE TABLE public.users (
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
       public         heap    postgres    false    888    885    888            �            1259    17139    users_userid_seq    SEQUENCE     �   CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.users_userid_seq;
       public          postgres    false    225            �           0    0    users_userid_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;
          public          postgres    false    226            �           2604    17140    comments commentid    DEFAULT     x   ALTER TABLE ONLY public.comments ALTER COLUMN commentid SET DEFAULT nextval('public.comments_commentid_seq'::regclass);
 A   ALTER TABLE public.comments ALTER COLUMN commentid DROP DEFAULT;
       public          postgres    false    217    216            �           2604    17141    messages messageid    DEFAULT     x   ALTER TABLE ONLY public.messages ALTER COLUMN messageid SET DEFAULT nextval('public.messages_messageid_seq'::regclass);
 A   ALTER TABLE public.messages ALTER COLUMN messageid DROP DEFAULT;
       public          postgres    false    221    220            �           2604    17142    posts postid    DEFAULT     l   ALTER TABLE ONLY public.posts ALTER COLUMN postid SET DEFAULT nextval('public.posts_postid_seq'::regclass);
 ;   ALTER TABLE public.posts ALTER COLUMN postid DROP DEFAULT;
       public          postgres    false    223    222            �           2604    17143    users userid    DEFAULT     l   ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);
 ;   ALTER TABLE public.users ALTER COLUMN userid DROP DEFAULT;
       public          postgres    false    226    225            u          0    17095    comments 
   TABLE DATA           W   COPY public.comments (commentid, postid, authorid, content, likes, "time") FROM stdin;
    public          postgres    false    216   e3       w          0    17103    followrequests 
   TABLE DATA           I   COPY public.followrequests (followerid, followingid, "time") FROM stdin;
    public          postgres    false    218   �3       x          0    17107    likes 
   TABLE DATA           G   COPY public.likes (contenttype, contentid, userid, "time") FROM stdin;
    public          postgres    false    219   �3       y          0    17111    messages 
   TABLE DATA           Z   COPY public.messages (messageid, senderid, receiverid, content, read, "time") FROM stdin;
    public          postgres    false    220   �3       {          0    17119    posts 
   TABLE DATA           f   COPY public.posts (postid, authorid, content, mediauri, privacy, isrepost, likes, "time") FROM stdin;
    public          postgres    false    222   4       }          0    17128    relationships 
   TABLE DATA           H   COPY public.relationships (followerid, followingid, "time") FROM stdin;
    public          postgres    false    224   #4       ~          0    17132    users 
   TABLE DATA           u   COPY public.users (userid, username, salt, password, secureqans, privacy, description, active, usertype) FROM stdin;
    public          postgres    false    225   �4       �           0    0    comments_commentid_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.comments_commentid_seq', 1, false);
          public          postgres    false    217            �           0    0    messages_messageid_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.messages_messageid_seq', 1, false);
          public          postgres    false    221            �           0    0    posts_postid_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.posts_postid_seq', 1, false);
          public          postgres    false    223            �           0    0    users_userid_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.users_userid_seq', 8, true);
          public          postgres    false    226            �           2606    17145    comments comments_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (commentid);
 @   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
       public            postgres    false    216            �           2606    17147 "   followrequests followrequests_pkey 
   CONSTRAINT     u   ALTER TABLE ONLY public.followrequests
    ADD CONSTRAINT followrequests_pkey PRIMARY KEY (followerid, followingid);
 L   ALTER TABLE ONLY public.followrequests DROP CONSTRAINT followrequests_pkey;
       public            postgres    false    218    218            �           2606    17149    likes likes_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (contenttype, contentid, userid);
 :   ALTER TABLE ONLY public.likes DROP CONSTRAINT likes_pkey;
       public            postgres    false    219    219    219            �           2606    17151    messages messages_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (messageid);
 @   ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_pkey;
       public            postgres    false    220            �           2606    17153    posts posts_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (postid);
 :   ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_pkey;
       public            postgres    false    222            �           2606    17155     relationships relationships_pkey 
   CONSTRAINT     s   ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_pkey PRIMARY KEY (followerid, followingid);
 J   ALTER TABLE ONLY public.relationships DROP CONSTRAINT relationships_pkey;
       public            postgres    false    224    224            �           2606    17157    users users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    225            u      x������ � �      w   :   x�e�A�0E�sPQa���h�нn/-��Q[q�Հ�-�=�FS�d��q3� ���      x      x������ � �      y      x������ � �      {      x������ � �      }   �   x�m�˭C1����4��1�Z����ɻ�������[�y![�C9M �O���,UM���<�j ��!�M�H?2�9���eHZw8ڔ˫�N8np!Ղ�N��)�ª�u��Y���|5ۭ�)��f���.k!|8prvR]aE�1B4m�l6<�z�K����kE�ч��~9Y�      ~   x  x�eTIr[7]&����%ro�d%��-�|�<2qц�I�7���:/ߋ��Zz[^!�z�j#���~�/�Z҇H���ğ#�u��k�V�?O�3E�!#�Qc�}ĕWs�FlS=���5�s�ё�S��ݣi0>�|=�^_���ׇ߯o���z}����|~���΃�H��d�٭���t߸�.P�քg]��x�yd�d]����س�����i��1�5d�z�6���?E�EU#�C��Xk�F���N��/��L����}�}yy~�lK[�d��8��ltR�~��y��䰧����R+E�>�a���l5I4�N�y�E�P%5ӌ�� ��MD]<��<&�TL��Ƙ�9. }O��?���Ӄ��v�`���4��jGZ􊰻���xxiJ���:�\���%r���}R��I^�X��_]���k/:�Y�%R��I|y,�.�S����@����|�����?�_4�i{}�
���V�Fk#͐*ң%���
is �[�6��p/����Lcs��)�����)Zۖ�:s�4����a=	�h�����o!'�r�J���@���ψy%���@�{&8�9ھb��`�q�{��BԼV�	����� �1�SS�ۃ��{/yD���� �ֆv1�i���Em.�
�!FȜ�r��$�z~������|>g��:�����Q3� е���MdXe�CN16LM���� �#e�Tm-�DUM��h�lq\� 팃��I9�J�"��t�^8���/�H�����'�c�\X���~#7�eSѵ����a���F^:�J@��B��`��z0F%�J�;6Ox@HH%�v�.%�c#������x0�ذ#P� I1�7�B}G��oOOOܵ�     
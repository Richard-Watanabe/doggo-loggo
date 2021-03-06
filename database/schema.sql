set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";
CREATE TABLE "public"."users" (
  "userId" serial NOT NULL UNIQUE,
  "dogId" serial NOT NULL UNIQUE,
  "username" TEXT NOT NULL UNIQUE,
  "hashedPassword" TEXT NOT NULL,
  CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."dogs" (
  "dogId" serial NOT NULL,
  "dogName" TEXT,
  CONSTRAINT "dogs_pk" PRIMARY KEY ("dogId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."logs" (
  "logId" serial NOT NULL,
  "userId" integer NOT NULL,
  "dogId" integer NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" timestamp(6) with time zone NOT NULL default now(),
  "updatedAt" timestamp(6) with time zone NOT NULL default now(),
  CONSTRAINT "logs_pk" PRIMARY KEY ("logId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."owners" (
  "userId" serial NOT NULL,
  "dogId" serial NOT NULL UNIQUE
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."photos" (
  "photoId" serial NOT NULL,
  "userId" serial,
  "dogId" serial,
  "url" TEXT,
  CONSTRAINT "photos_pk" PRIMARY KEY ("photoId")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "owners" ADD CONSTRAINT "owners_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "owners" ADD CONSTRAINT "owners_fk1" FOREIGN KEY ("dogId") REFERENCES "dogs"("dogId");

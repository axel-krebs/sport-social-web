-- !Ups

/* User can login to application */
create table app_user (
	id integer,
	nickname varchar(50) not null,
	password varchar(50) not null,
	email varchar(50),
	verified boolean, -- should not be done by user!
	primary key (id)
);

create sequence app_user_seq as integer increment by 1 minvalue 1 no cycle;

/* user settings according to user input */
create table app_user_prefs (
	app_user_id integer,
	notify_me boolean,
	notify_per_email boolean,
	foreign key (app_user_id) references app_user(id)
);

/* Verein bzw. nationale (DFB) oder internationale (UEFA, FIFA) Organisation  */
create table organization (
	id integer,
	name varchar(50) not null,
	primary key (id)
);

/* Liga */
create table liga (
	id integer,
	category char(3) not null, /* Fussball, Basketball usw. */
	country char(2) not null,
	level smallint not null,
	name varchar(100) not null,
	primary key (id)
);

create table saison (
	id integer,
	start_date date,
	end_date date,
	description varchar(50),
	primary key (id)
);

/* Mannschaft, gehört zu einem Verein und spielt in einer Liga*/
create table team (
	id integer,
	liga_id integer,
	organization_id integer,
	saison_id integer,
	description varchar,
	primary key (id),
	foreign key (liga_id) references liga(id),
	foreign key (organization_id) references organization(id),
	foreign key (saison_id) references saison(id)
);

create sequence team_seq as integer increment by 1 minvalue 1 no cycle;

/* Funktion eines Mitspielers */
create table team_role (
	id integer,
	role_name varchar(50) not null,
	primary key (id)
);

/* Spieler, Trainer.. alle Team-Mitglieder */
create table player (
	id integer,
	surename varchar(100) not null,
	forename varchar(100) not null,
	date_birth date,	
	find_me boolean,
	primary key (id)
);

create sequence player_seq as integer increment by 1 minvalue 1 no cycle;

/* TODO: Angaben zur Person */
create table player_address (
	player_id integer,
	fon_stationary varchar(20),
	fon_mobile varchar(20),
	street varchar(50),
	area_code varchar(20),
	city_name varchar(50),
	foreign key (player_id) references player(id)
);

/* Connect players with teams (Zuordnungstabelle) */
create table team_player (
	team_id integer,
	player_id integer,
	team_role_id integer,
	from_date date,
	until_date date,
	primary key (team_id,player_id,team_role_id),
	foreign key (team_id) references team(id),
	foreign key (player_id) references player(id),
	foreign key (team_role_id) references team_role(id)
);

/* The game */
create table play_match (
	id integer,
	start_time timestamp,
	end_time timestamp,
	primary key (id)
);

create sequence play_match_seq as integer increment by 1 minvalue 1 no cycle;

/* A play_match can be assigned more than one team, e.g. car racing (Zuordnungstabelle) */
CREATE TABLE play_match_team (
	play_match_id integer,
	team_id integer,
	PRIMARY KEY (play_match_id,team_id),
	FOREIGN KEY (play_match_id) REFERENCES play_match(id),
	FOREIGN KEY (team_id) REFERENCES team(id)
);

create table score (
	play_match_id integer,
	player_id integer,
	score numeric, /* In football: goals, in racing: time value. else/other? */
	score_time date,
	foreign key (play_match_id) references play_match(id),
	foreign key (player_id) references player(id)
);

-- !Downs
drop table if exists score;
drop table if exists play_match_team;
drop table if exists play_match;
drop table if exists team_player;
drop table if exists player_address;
drop table if exists player;
drop table if exists player_settings;
drop table if exists team_role;
drop table if exists team;
drop table if exists saison;
drop table if exists organization;
drop table if exists liga;
drop sequence if exists player_seq;
drop sequence if exists team_seq;
drop sequence if exists play_match_seq;
drop sequence if exists app_user_seq;

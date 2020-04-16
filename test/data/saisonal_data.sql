INSERT INTO saison (id,start_date,end_date,description) 
values (1, to_date('01.01.2020','dd.MM.yyyy'), to_date('24.12.2020','dd.MM.yyyy'),'Saison 2020');

insert into team (id,liga_id,organization_id,saison_id,description)
values (nextval('team_seq'),62,11,1,'FC Freiburg - U19');

insert into player (id,surename,forename,date_birth)
values(nextval('player_seq'),'Yagas','Sinan',to_date('28.01.1992','dd.MM.yyyy'));

insert into team_player (team_id,player_id,team_role_id)
values ((select id from team where liga_id=62 and organization_id=11),(select id from player where surename='Yagas'),2);

insert into play_match (id,start_time,end_time)
values (nextval('play_match_seq'),to_date('19.01.2020 16:00','dd.MM.yyyy H24:MIN'),to_date('19.01.2020 17:30','dd.MM.yyyy H24:MIN'));

insert into score (play_match_id,player_id,score,score_time)
values (
	(select id from play_match where start_time=to_date('19.01.2020 16:00','dd.MM.yyyy H24:MIN')),
	(select id from player where surename='Yagas'),
	1.5555555555555555555555555555555555555555555555555555555555,
	now()
);

COMMIT;
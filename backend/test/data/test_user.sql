 insert into app_user(id,nickname,password,email,verified) values (nextval('app_user_seq'),'john','john123','john@acme.com',false);

 insert into app_user_prefs (app_user_id,notify_me,notify_per_email) values (
 	(select distinct id from app_user where nickname='john'),true,true
 );
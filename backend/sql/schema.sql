drop schema if exists csffinalproj;
create schema csffinalproj;

use csffinalproj;

create table users(
    user_id int auto_increment not null,
    username varchar(45) not null,
    password char(60) binary not null,
    roles varchar(45) not null,
    enabled tinyint(1) default 1,
    expired tinyint(1) default 1,
    locked tinyint(1) default 1,
    primary key(user_id)
);

create table userinfo(
    userinfo_id int auto_increment not null,
    user_id int,
    username varchar(45),
    profile_pic varchar(128) default '',
    date_joined date,
    primary key(userinfo_id),

    constraint fk_user_id_userinfo
        foreign key(user_id)
        references users(user_id)
);

create table listings(
    listing_id int auto_increment not null,
    title varchar(128),
    user_id int,
    curr_from varchar(32),
    curr_to varchar(32),
    rate float(24),
    description varchar(256),
    primary key(listing_id),

    constraint fk_user_id_listings
        foreign key(user_id)
        references users(user_id)
);

create table favourites(
    favourite_id int auto_increment not null,
    user_id int,
    listing_id int,
    primary key(favourite_id),

    constraint fk_user_id_favourites
        foreign key(user_id)
        references users(user_id),

    constraint fk_listing_id_favourites
        foreign key(listing_id)
        references listings(listing_id)
);

create table messages(
    message_id int auto_increment not null,
    chat_id varchar(45),
    sender varchar(45),
    content varchar(256),
    msg_timestamp timestamp,
    primary key(message_id)
);

create table chats(
    chat_number int auto_increment not null,
    chat_id varchar(45),
    listing_id int,
    username_1 varchar(45),
    username_2 varchar(45),
    primary key(chat_number),
    index username_ind (username_1, username_2),

    constraint fk_listing_id_chats
        foreign key(listing_id)
        references listings(listing_id)
);

create view listingsview as
	select l.listing_id,
    l.title,
    ui.user_id,
    ui.username,
    l.curr_from,
    l.curr_to,
    l.rate,
    l.description
    from listings l, userinfo ui, users u
    where u.user_id = ui.user_id
    and l.user_id = u.user_id;

create view favouritesview as
    select f.listing_id,
    l.title,
    ui.user_id,
    ui.username,
    l.curr_from,
    l.curr_to,
    l.rate,
    l.description
    from favourites f, listings l, userinfo ui, users u
    where f.listing_id = l.listing_id
    and f.user_id = u.user_id
    and u.user_id = ui.user_id;

create view chatsview as
    select c.chat_id,
    l.listing_id,
    l.title,
    ui.user_id,
    ui.username,
    l.curr_from,
    l.curr_to,
    l.rate,
    l.description
    from chats c, listings l, userinfo ui, users u
    where c.listing_id = l.listing_id
    and u.user_id = ui.user_id
    and l.user_id = u.user_id;
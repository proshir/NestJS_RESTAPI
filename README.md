# Description
This project was a test for entry into the payever company, and I was accepted.

The goal was to build a rest api system with nodejs to manage the user database with rabbit mq to send events.

## Installation

```bash
$ npm install
```

## ENV
set .env based on .env.example
like :
```bash
DATABASE_URL="<mongodb_srv_url>"
RABBITMQ_URL= "<amqps_url>"
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

```

## APIS

- Post | localhost:3000/api/users

Input:
```json
{
    "email": "hassanardeshir1026@gmail.com",
    "first_name": "Hassan3",
    "last_name": "Ardeshir3",
    "avatar": "https://i1.sndcdn.com/artworks-3xqiGCyxXzDm85k0-U9TWiw-t500x500.jpg"
}
```

Output:
```json
{
    "id": "6481d60b71cdc32a3b585893",
    "email": "hassanardeshir1026@gmail.com",
    "first_name": "Hassan3",
    "last_name": "Ardeshir3",
    "avatar": "https://i1.sndcdn.com/artworks-3xqiGCyxXzDm85k0-U9TWiw-t500x500.jpg",
    "avatar_hash": null
}
```

- Get | localhost:3000/api/user/1

Output:
```json
{
    "id": 1,
    "email": "george.bluth@reqres.in",
    "first_name": "George",
    "last_name": "Bluth",
    "avatar": "https://reqres.in/img/faces/1-image.jpg"
}
```

- Get | localhost:3000/api/user/{userId}/avatar

UserID in database (string) that we got in POST USERS

Like: localhost:3000/api/user/6481959cf04e0e37b5c9c39e/avatar

Output:
```
/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAg....
```

- Delete | localhost:3000/api/user/{userId}/avatar

Like: localhost:3000/api/user/6481959cf04e0e37b5c9c39e/avatar

Output:
```json
{
    "id": "6481d60b71cdc32a3b585893",
    "email": "hassanardeshir1026@gmail.com",
    "first_name": "Hassan3",
    "last_name": "Ardeshir3",
    "avatar": "https://i1.sndcdn.com/artworks-3xqiGCyxXzDm85k0-U9TWiw-t500x500.jpg",
    "avatar_hash": ""
}
```
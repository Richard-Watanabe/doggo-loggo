require('dotenv/config');
const express = require('express');
const db = require('./db');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const uploadsMiddleware = require('./uploads-middleware');
const argon2 = require('argon2');
const ClientError = require('./client-error');
const jwt = require('jsonwebtoken');
const path = require('path');
const authorizationMiddleware = require('./authorization-middleware');

const app = express();

app.use(staticMiddleware);

const jsonMiddleware = express.json();
app.use(jsonMiddleware);

app.post('/api/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are both required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
      with "insert_dog" as (
      insert into "dogs" ("dogName")
      values ($3)
      returning "dogId"
      ),
      "insert_owner" as (
      insert into "owners"
      default values
      returning "dogId"
    ),
      "insert_photo" as (
      insert into "photos"
      default values
      returning "dogId"
      ),
     "insert_user" as (
        insert into "users" ("username", "hashedPassword", "dogId")
        values ($1, $2, (select "dogId" from "insert_owner"))
        returning "userId", "username", "dogId"
        )
       select "dogId" from "insert_owner"
        ;
      `;
      const params = [username, hashedPassword, 'Name'];
      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.post('/api/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "users"."userId",
           "hashedPassword",
           "owners"."dogId"
      from "users"
      join "owners" using ("dogId")
     where "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword, dogId } = user;
      global.clickedDog = dogId;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId, username, dogId };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

app.post('/api/switch-dog', (req, res) => {
  const { clickedDogId } = req.body;
  global.clickedDog = clickedDogId;
  res.status(201).end();
});

app.post('/api/add-dog', (req, res, next) => {
  const { dogName } = req.body;
  const { userId } = req.user;
  if (!dogName) {
    res.status(400).json({
      error: 'Content is required'
    });
    return;
  }
  const sql = `
   with "insert_dog" as (
      insert into "dogs" ("dogName")
      values ($1)
    returning "dogId"
    ),
    "insert_photo" as (
      insert into "photos" ("dogId", "userId")
      values (default, $2)
      returning "dogId"
      ),
      "insert_owner" as (
      insert into "owners" ("dogId", "userId")
      values (default, $2)
      returning "dogId"
    )
    select "dogId" from "insert_owner"
  `;
  const params = [dogName, userId];
  db.query(sql, params)
    .then(result => {
      const dogId = result.rows;
      res.json({ dogId });
    })
    .catch(err => next(err));
});

app.patch('/api/dog-name', (req, res, next) => {
  const { dogName } = req.body;
  const { dogId } = req.user;
  if (!global.clickedDog || global.clickedDog < dogId) {
    global.clickedDog = dogId;
  }
  const sql = `
    update "dogs"
       set "dogName" = $1
     where "dogId" = $2
     returning *
  `;
  const params = [dogName, global.clickedDog];
  db.query(sql, params)
    .then(result => {
      const [dogId] = result.rows;
      res.json({ dogId });
    })
    .catch(err => next(err));
});

app.get('/api/dog-name', (req, res) => {
  const { dogId } = req.user;
  if (!global.clickedDog || global.clickedDog < dogId) {
    global.clickedDog = dogId;
  }
  const sql = `
    select "dogName"
      from "dogs"
    where "dogId" = $1
  `;
  const params = [global.clickedDog];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occurred'
      });
    });
});

app.post('/api/logs', (req, res, next) => {
  const { userId, dogId } = req.user;
  if (!global.clickedDog || global.clickedDog < dogId) {
    global.clickedDog = dogId;
  }
  const { content } = req.body;
  if (!content) {
    res.status(400).json({
      error: 'Content is required'
    });
    return;
  }
  const sql = `
    insert into "logs" ("content", "userId", "dogId")
    values ($1, $2, $3)
    returning *
  `;
  const params = [content, userId, global.clickedDog];
  db.query(sql, params)
    .then(result => {
      const newLog = result.rows[0];
      res.status(201).json(newLog);
    })
    .catch(err => next(err));
});

app.get('/api/logs', (req, res) => {
  const { dogId } = req.user;
  if (!global.clickedDog || global.clickedDog < dogId) {
    global.clickedDog = dogId;
  }
  const sql = `
    select "content", "logId", "createdAt"
      from "logs"
      join "dogs" using ("dogId")
    where "dogId" = $1
    order by "logId" desc
  `;
  const params = [global.clickedDog];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occurred'
      });
    });
});

app.patch('/api/photos', uploadsMiddleware, (req, res, next) => {
  const { userId, dogId } = req.user;
  if (!global.clickedDog || global.clickedDog < dogId) {
    global.clickedDog = dogId;
  }
  const url = `${req.file.location}`;
  const sql = `
    update "photos"
    set ("userId", "dogId", "url" ) = ($1, $2, $3)
    where "dogId" = $2
    returning *;
  `;
  const params = [userId, global.clickedDog, url];
  db.query(sql, params)
    .then(result => {
      res.status(201).send(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/all-dog', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
    select "dogName", "dogId" , "url"
      from "dogs"
      join "owners" using ("dogId")
      join "photos" using ("dogId")
      where "owners"."userId" = $1
      order by "dogs"."dogId"
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/photos', (req, res, next) => {
  const { dogId } = req.user;
  if (!global.clickedDog || global.clickedDog < dogId) {
    global.clickedDog = dogId;
  }
  const sql = `
    select *
      from "photos"
      join "dogs" using ("dogId")
    where "dogId" = $1
  `;
  const params = [global.clickedDog];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.use((req, res) => {
  res.sendFile('/index.html', {
    root: path.join(__dirname, 'public')
  });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});

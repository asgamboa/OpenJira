# Next.js OpenJira App

To run locally it needs the mongo database.

```
docker-compose up -d
```

\*The -d, stands for **detached**, which means that the process is going to run apart from the console

MongoDB Local URL

```
mongodb://localhost:27017/entriesdb
```

## To setup enviroment vars

Rename the file **.env.template** to **.env**

## Fill the DB with test data

Call:

```
http://localhost:3000/api/seed
```

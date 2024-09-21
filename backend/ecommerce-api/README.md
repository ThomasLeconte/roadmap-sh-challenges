# Ecommerce API

Roadmap.sh | Backend | Challenge #6 : [Ecommerce API](https://roadmap.sh/projects/ecommerce-api)

This projects uses SQLite database. It implements all needed features, and i've take time to build a lite ORM, and a migration database system.

## Install
> npm install

## Run
> ts-node src/index.ts

## Use
Use following HTTP requests :

> POST - /auth/register  

Register yourself

> POST - /auth/login  

Login yourself

> GET - /expenses  

Get your expenses
You can add "period" with by specifying delay and period type (ex: 5M for five past months, or 2W for last two weeks) to filter by creation date
Or you can add "startDate" or "endDate" to filter by creation date too

> POST - /expenses  

Add an expense

> PUT - /expenses/:id  

Update an expense

> DELETE - /expenses/:id  

Delete an expense
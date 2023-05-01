
# Sesame Coding Assignment

This repository is my implementation of the Sesame Lab's coding assignment to create a Questing Platform to verify and reward having USDC in the user's wallet.

This project is hosted on http://sesame.edisonqu.com/

## Tech Stack

Frontend Technologies:
- Tailwind CSS, ReactJS, Zustand
- Hosted on Vercel.com pointed to my domain

Backend Technologies:
- Flask, Flask SQLAlchemy, JWT
- Hosted on Amazon Lambda using Zeet

Database Technologies:
- PostgreSQL
- Hosted on Amazon RDS

## Prerequisites

This repo is ran using these requirements:
- Node.js >= v18.16.0
- Python3 >= 3.9.6
- PostgreSQL >= v15

### Frontend Setup

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

```shell
cd client
npm i # install the dependencies
```
This command will install all the dependencies listed in the package.json file.

Create and initiate your `.env` variables. Assuming you are still in the `/client` directory:
```shell
touch .env
```
Populate your `.env` file with these variables:
```shell
REACT_APP_BASE_URL=YOUR_BACKEND_URL # Normally http://127.0.0.1:8000
REACT_APP_TOKEN_CONTRACT_ADDRESS=YOUR_TOKEN_ADDRESS # Using USDC: 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
```

Run the development server with the following command:


```shell
npm start
```
This will open your default web browser and navigate to http://localhost:3000/. The page should automatically reload when you make changes to the source code.


### Backend Setup

This project uses [Python 3.9.6](https://www.python.org/downloads/). Install Python if you haven't already.

```shell
cd server
python3 -m venv venv
. venv/bin/activate
pip install requirements.txt
```

Create and initiate your `.env` variables. Assuming you are still in the `/server` directory: 
```shell
touch .env
```
Populate your `.env` file with these variables:
```text
JWT_SECRET_KEY= YOUR_ENCRYPTION_KEY # could be anything
QLALCHEMY_DATABASE_URI= postgreSQL://{YOUR_USERNAME}:{YOUR_PASSWORD}@{YOUR_DB_URL}:{YOUR_PORT}/{YOUR_DB_NAME}
```

Finally, run the command:

```shell
flask run
```

The usual host of a Flask application is `http://127.0.0.1:8000` with the port being `8000`.


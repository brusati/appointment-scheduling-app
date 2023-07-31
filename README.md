# Tp

## Frontend

Runs a frontend generated with Angular CLI version 16.1.5.

### Run Frontend

```
docker build -t front .
docker run -p 4200:4200 front
```

App runs in `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


## Backend Server

Runs a fastapi API with a SQLite db over a uvicorn server.

### Run Backend

```
docker build -t back .
docker run -p 8000:8000 back
```

App runs in `http://localhost:8000/`.

Docs in App runs in `http://localhost:8000/docs`.

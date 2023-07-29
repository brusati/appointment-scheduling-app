from typing import List

from fastapi import HTTPException, Depends, FastAPI
from sqlalchemy.orm import Session
from server.app import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/turno/", response_model=schemas.Turno)
def crear_turno(
    turno: schemas.TurnoCreate,
    db: Session = Depends(get_db)
):
    return crud.crear_turno(db=db, turno=turno)


@app.get("/turno/{turno_id}", response_model=schemas.Turno)
def obtener_turno(
    turno_id: int,
    db: Session = Depends(get_db)
):
    turno = crud.obtener_turno(db, turno_id)
    if turno is None:
        raise HTTPException(status_code=404, detail="Turno no existe")
    return turno


@app.get("/turno_fecha/", response_model=List[schemas.Turno])
def obtener_turno_fecha(
    fecha: schemas.FiltroFecha,
    db: Session = Depends(get_db)
):
    return crud.obtener_turno_fecha(db, fecha)


@app.put("/turno/{turno_id}", response_model=schemas.Turno)
def modificar_turno(
    turno_id: int,
    turno: schemas.TurnoCreate,
    db: Session = Depends(get_db)
):
    db_turno = crud.obtener_turno(db, turno_id)
    if db_turno is None:
        raise HTTPException(status_code=404, detail="Turno no existe")
    return crud.modificar_turno(db=db, turno_id=turno_id, turno=turno)


@app.delete("/turno/{turno_id}")
def eliminar_turno(
    turno_id: int,
    db: Session = Depends(get_db)
):
    db_turno = crud.obtener_turno(db, turno_id)
    if db_turno is None:
        raise HTTPException(status_code=404, detail="Turno no existe")
    return crud.borrar_turno(db=db, turno_id=turno_id)


@app.get("/")
def read_root():
    return {"Turno": "Api"}

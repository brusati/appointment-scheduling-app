import datetime
from typing import List

from sqlalchemy.orm import Session

from server.app import schemas, models


def crear_turno(db: Session, turno: schemas.TurnoCreate) -> models.Turno:
    db_turno = models.Turno(fecha=turno.fecha_turno, nombre_paciente=turno.nombre_paciente)
    db.add(db_turno)
    db.commit()
    db.refresh(db_turno)
    return db_turno


def borrar_turno(db: Session, turno_id: int) -> None:
    db_turno = obtener_turno(db, turno_id)
    db.delete(db_turno)
    db.commit()


def modificar_turno(db: Session, turno_id: int, turno: schemas.TurnoCreate) -> models.Turno:
    db_turno = obtener_turno(db, turno_id)
    db_turno.fecha_turno = turno.fecha_turno
    db_turno.nombre_paciente = turno.nombre_paciente
    db.commit()
    db.refresh(db_turno)
    return db_turno


def obtener_turno(db: Session, turno_id: int) -> models.Turno:
    return db.query(models.Turno).get(turno_id)


def obtener_turno_fecha(db: Session, fecha: schemas.FiltroFecha) -> List[models.Turno]:
    if fecha.dia is None:
        fecha_begin = datetime.datetime(year=fecha.anio, month=fecha.mes, day=1)
        fecha_end = datetime.datetime(year=fecha.anio, month=fecha.mes+1, day=1)
    else:
        fecha_begin = datetime.datetime(year=fecha.anio, month=fecha.mes, day=fecha.dia)
        fecha_end = datetime.datetime(year=fecha.anio, month=fecha.mes, day=fecha.dia+1)

    return db.query(models.Turno).filter(
        models.Turno.fecha_turno >= fecha_begin,
        models.Turno.fecha_turno < fecha_end).all()


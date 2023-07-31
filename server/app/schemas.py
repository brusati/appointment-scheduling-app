from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TurnoBase(BaseModel):
    nombre_paciente: str
    fecha_turno: datetime
    pago_senia: bool


class TurnoCreate(TurnoBase):
    pass


class Turno(TurnoBase):
    id: int

    class Config:
        from_attributes = True


class FiltroFecha(BaseModel):
    anio: int
    mes: int
    dia: Optional[int]


from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from .database import Base

#TODO: DB Models classes here

class Turno(Base):
    __tablename__ = "turno"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre_paciente = Column(String)
    fecha_turno = Column(DateTime)

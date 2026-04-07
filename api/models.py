from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base
class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)

class Order(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True, index=True)  # e.g. DFL-001
    customer = Column(String)
    status = Column(String)  # Pending, In Transit, Delivered
    truck_number = Column(String)
    route = Column(String)
    eta = Column(String)
    cargo = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class FleetVehicle(Base):
    __tablename__ = "fleet"
    id = Column(String, primary_key=True, index=True) # TRK-118
    name = Column(String)
    type = Column(String)
    capacity = Column(String)
    availability = Column(String)  # Available, On Route
    image = Column(String)

class ContactMessage(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender = Column(String)
    email = Column(String)
    topic = Column(String)
    excerpt = Column(String)
    status = Column(String, default="Pending")  # Pending, Resolved
    created_at = Column(DateTime, default=datetime.utcnow)

class CompanySettings(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    phone = Column(String)
    email = Column(String)
    address = Column(String)


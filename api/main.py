import argparse
import os
import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Literal, Optional

import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .database import engine, Base, get_db, SessionLocal
from . import models
# Create all tables if they don't exist
Base.metadata.create_all(bind=engine)

with SessionLocal() as _db:
    _admin = _db.query(models.Admin).filter_by(username="admin").first()
    if not _admin:
        hashed = bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        new_admin = models.Admin(username="admin", password_hash=hashed)
        _db.add(new_admin)
        _db.commit()
        print("--- DATABASE LOG: Formatted Admin User Created Automatically ---")
    
    if _db.query(models.FleetVehicle).count() == 0:
        _db.add_all([
            models.FleetVehicle(id="TRK-204", name="Freightliner Cascadia", type="Heavy Duty Tractor", capacity="34 tons", availability="Available", image="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80"),
            models.FleetVehicle(id="TRK-118", name="Volvo VNL", type="Long-Haul Carrier", capacity="28 tons", availability="On Route", image="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80")
        ])
        _db.commit()
    
    if _db.query(models.CompanySettings).count() == 0:
        new_settings = models.CompanySettings(
            name="Dafal LLC", 
            phone="8326499452", 
            email="dafalllc@proton.me", 
            address="4500 Travis St apt 5531 Houston Tx 77002"
        )
        _db.add(new_settings)
        _db.commit()

app = FastAPI(
    title="Dafal LLC API",
    version="1.0.0",
    description="FastAPI backend with PostgreSQL for Dafal LLC.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ALLOW_ORIGINS", "*").split(","),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = os.getenv("JWT_SECRET", "super_secret_dev_key")
ALGORITHM = "HS256"

# Pydantic Schemas
class TrackingOrder(BaseModel):
    id: str
    customer: str
    status: Literal["Pending", "In Transit", "Delivered"]
    truckNumber: str
    route: str
    eta: str
    cargo: str

class FleetVehicleSchema(BaseModel):
    id: str
    name: str
    type: str
    capacity: str
    availability: str

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class LoginRequest(BaseModel):
    username: str
    password: str

class SettingsSchema(BaseModel):
    name: str
    phone: str
    email: str
    address: str

class FleetUpdateSchema(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    capacity: Optional[str] = None

# Auth dependencies
def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/api/admin/login")
def login(login_req: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(models.Admin).filter(models.Admin.username == login_req.username).first()
    if not admin or not verify_password(login_req.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    access_token = create_access_token(data={"sub": admin.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/setup")
def setup_database(db: Session = Depends(get_db)):
    # Create an admin if none exists
    admin = db.query(models.Admin).first()
    if not admin:
        hashed = bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        new_admin = models.Admin(username="admin", password_hash=hashed)
        db.add(new_admin)
        
    # Seed fleet if empty
    if db.query(models.FleetVehicle).count() == 0:
        db.add_all([
            models.FleetVehicle(id="TRK-204", name="Freightliner Cascadia", type="Heavy Duty Tractor", capacity="34 tons", availability="Available", image="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80"),
            models.FleetVehicle(id="TRK-118", name="Volvo VNL", type="Long-Haul Carrier", capacity="28 tons", availability="On Route", image="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80")
        ])
    db.commit()
    return {"message": "Setup completed. Admin credentials: admin / password123"}

@app.get("/api/overview")
def overview(db: Session = Depends(get_db)):
    return {
        "total_orders": db.query(models.Order).count(),
        "active_deliveries": db.query(models.Order).filter(models.Order.status == "In Transit").count(),
        "completed_jobs": db.query(models.Order).filter(models.Order.status == "Delivered").count(),
        "available_trucks": db.query(models.FleetVehicle).filter(models.FleetVehicle.availability == "Available").count(),
    }

@app.get("/api/orders")
def list_orders(db: Session = Depends(get_db)):
    orders = db.query(models.Order).order_by(models.Order.created_at.desc()).all()
    # Map to schema required by frontend (camelCase matching)
    return [{
        "id": o.id, "customer": o.customer, "status": o.status,
        "truckNumber": o.truck_number, "route": o.route, "eta": o.eta, "cargo": o.cargo
    } for o in orders]

@app.get("/api/orders/{order_id}")
def get_order(order_id: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id.upper()).first()
    if not order:
        return {"error": "Order not found"}
    return {
        "id": order.id, "customer": order.customer, "status": order.status,
        "truckNumber": order.truck_number, "route": order.route, "eta": order.eta, "cargo": order.cargo
    }

@app.post("/api/orders")
def create_order(order: TrackingOrder, db: Session = Depends(get_db)):
    print(f"--- ROUTE LOG: Received order booking request for {order.customer} ---")
    new_order = models.Order(
        id=order.id, customer=order.customer, status=order.status,
        truck_number=order.truckNumber, route=order.route,
        eta=order.eta, cargo=order.cargo
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    print(f"--- ROUTE LOG: Order ID {new_order.id} was created successfully ---")
    return new_order

@app.put("/api/orders/{order_id}")
def update_order(order_id: str, payload: dict, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if 'status' in payload:
        new_status = payload['status']
        order.status = new_status
        if new_status == 'Delivered':
            order.eta = 'Delivered'
            # Release truck organically
            if order.truck_number and order.truck_number != "Awaiting assignment":
                truck = db.query(models.FleetVehicle).filter(models.FleetVehicle.id == order.truck_number).first()
                if truck: truck.availability = "Available"
            # Unassign truck from the visual order box
            order.truck_number = "Awaiting assignment"
            
    if 'truckNumber' in payload:
        new_truck = payload['truckNumber']
        if new_truck == "Awaiting assignment":
            if order.truck_number and order.truck_number != "Awaiting assignment":
                old_truck = db.query(models.FleetVehicle).filter(models.FleetVehicle.id == order.truck_number).first()
                if old_truck: old_truck.availability = "Available"
            order.status = "Pending"
            order.truck_number = "Awaiting assignment"
        else:
            order.truck_number = new_truck
            order.status = "In Transit"
            truck = db.query(models.FleetVehicle).filter(models.FleetVehicle.id == new_truck).first()
            if truck: truck.availability = "On Route"

    db.commit()
    return {"message": "Success"}

@app.get("/api/fleet")
def list_fleet(db: Session = Depends(get_db)):
    fleet = db.query(models.FleetVehicle).all()
    return [{"id": t.id, "name": t.name, "type": t.type, "capacity": t.capacity, "availability": t.availability, "image": t.image} for t in fleet]

@app.post("/api/fleet")
def add_truck(truck: FleetVehicleSchema, db: Session = Depends(get_db)):
    new_truck = models.FleetVehicle(
        id=truck.id, name=truck.name, type=truck.type, 
        capacity=truck.capacity, availability=truck.availability, 
        image="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80"
    )
    db.add(new_truck)
    db.commit()
    return new_truck

@app.put("/api/fleet/{fleet_id}/availability")
def toggle_fleet(fleet_id: str, db: Session = Depends(get_db)):
    truck = db.query(models.FleetVehicle).filter(models.FleetVehicle.id == fleet_id).first()
    if truck:
        truck.availability = "On Route" if truck.availability == "Available" else "Available"
        db.commit()
    return {"message": "Updated"}

@app.put("/api/fleet/{fleet_id}")
def update_fleet(fleet_id: str, payload: FleetUpdateSchema, db: Session = Depends(get_db)):
    truck = db.query(models.FleetVehicle).filter(models.FleetVehicle.id == fleet_id).first()
    if not truck:
        raise HTTPException(status_code=404, detail="Truck not found")
    if payload.name: truck.name = payload.name
    if payload.type: truck.type = payload.type
    if payload.capacity: truck.capacity = payload.capacity
    db.commit()
    return {"message": "Success"}

@app.delete("/api/fleet/{fleet_id}")
def delete_fleet(fleet_id: str, db: Session = Depends(get_db)):
    truck = db.query(models.FleetVehicle).filter(models.FleetVehicle.id == fleet_id).first()
    if truck:
        db.delete(truck)
        db.commit()
    return {"message": "Deleted"}

@app.post("/api/contact")
def submit_contact(payload: ContactRequest, db: Session = Depends(get_db)):
    msg = models.ContactMessage(
        sender=payload.name, email=payload.email, topic=payload.subject, excerpt=payload.message
    )
    db.add(msg)
    db.commit()
    return {"message": "Your message has been received.", "email": payload.email}

@app.get("/api/messages")
def list_messages(db: Session = Depends(get_db)):
    msgs = db.query(models.ContactMessage).order_by(models.ContactMessage.created_at.desc()).all()
    return [{"id": m.id, "sender": m.sender, "email": m.email, "topic": m.topic, "excerpt": m.excerpt, "status": m.status} for m in msgs]

@app.put("/api/messages/{msg_id}/resolve")
def resolve_msg(msg_id: int, db: Session = Depends(get_db)):
    msg = db.query(models.ContactMessage).filter(models.ContactMessage.id == msg_id).first()
    if msg:
        msg.status = "Resolved"
        db.commit()
    return {"message": "Resolved"}

@app.get("/api/settings")
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(models.CompanySettings).first()
    if not settings:
        return {"name":"Dafal LLC", "phone":"", "email":"", "address":""}
    return {"name": settings.name, "phone": settings.phone, "email": settings.email, "address": settings.address}

@app.put("/api/settings")
def update_settings(payload: SettingsSchema, db: Session = Depends(get_db)):
    settings = db.query(models.CompanySettings).first()
    if not settings:
        settings = models.CompanySettings()
        db.add(settings)
    settings.name = payload.name
    settings.phone = payload.phone
    settings.email = payload.email
    settings.address = payload.address
    db.commit()
    return {"message": "Updated successfully"}

# Mount React UI for production
front_end_path = os.path.join(os.path.dirname(__file__), "..", "dist")
if os.path.exists(front_end_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(front_end_path, "assets")), name="assets")
    
    @app.get("/{catchall:path}")
    def serve_react_app(catchall: str):
        # Prevent routing conflicts with backend /api
        if catchall.startswith("api/"):
            raise HTTPException(status_code=404, detail="API route not found")
        filepath = os.path.join(front_end_path, catchall)
        if os.path.isfile(filepath):
            return FileResponse(filepath)
        return FileResponse(os.path.join(front_end_path, "index.html"))

def resolve_server_config():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, help="Port to run the server on")
    parser.add_argument("--host", type=str, help="Host to run the server on")
    args = parser.parse_args()

    host = args.host or os.getenv("HOST", "0.0.0.0")
    port = args.port or int(os.getenv("PORT", "8000"))
    return host, port

if __name__ == "__main__":
    host, port = resolve_server_config()
    print(f"Starting Dafal LLC API on {host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=False, app_dir=os.path.dirname(__file__))


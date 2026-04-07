import sys, os
sys.path.append(os.path.join(os.getcwd(), 'api'))
from database import SessionLocal, engine
from models import CompanySettings, Base

Base.metadata.create_all(bind=engine)
db = SessionLocal()
settings = db.query(CompanySettings).first()
if settings:
    settings.phone = "8326499452"
    settings.email = "dafalllc@proton.me"
    settings.address = "4500 Travis St apt 5531 Houston Tx 77002"
    db.commit()
    print("Settings updated successfully.")
else:
    new_settings = CompanySettings(
        name="Dafal LLC", 
        phone="8326499452", 
        email="dafalllc@proton.me", 
        address="4500 Travis St apt 5531 Houston Tx 77002"
    )
    db.add(new_settings)
    db.commit()
    print("Settings inserted from scratch.")
db.close()

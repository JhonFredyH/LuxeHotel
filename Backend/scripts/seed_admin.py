import os
import sys
from pathlib import Path

from sqlalchemy.orm import Session

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from auth import hash_password
from database import SessionLocal
from models.user import User, UserRole


def seed_admin(db: Session) -> None:
    app_env = os.getenv("APP_ENV", "development").strip().lower()
    admin_email = os.getenv("ADMIN_EMAIL", "admin@luxehotel.com").strip().lower()
    admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
    admin_name = os.getenv("ADMIN_NAME", "Administrador").strip()

    is_production = app_env in {"prod", "production"}
    if is_production and admin_password == "admin123":
        raise RuntimeError(
            "ADMIN_PASSWORD no puede ser el valor por defecto en producción."
        )

    existing_admin = db.query(User).filter(User.email == admin_email).first()
    if existing_admin:
        print(f"[seed_admin] Admin already exists: {admin_email}")
        return

    admin_user = User(
        name=admin_name,
        email=admin_email,
        password_hash=hash_password(admin_password),
        role=UserRole.admin,
    )
    db.add(admin_user)
    db.commit()
    print(f"[seed_admin] Admin created: {admin_email}")


def main() -> None:
    db = SessionLocal()
    try:
        seed_admin(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()

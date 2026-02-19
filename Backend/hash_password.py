from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

if __name__ == "__main__":
    password = "user123"
    hashed = hash_password(password)
    print(f"🔑 Password: {password}")
    print(f"🔐 Hash generado:\n{hashed}")

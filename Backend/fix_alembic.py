from sqlalchemy import text

from database import engine


def ensure_enum(conn, enum_name: str, values: list[str]) -> None:
    values_sql = ", ".join(f"'{value}'" for value in values)
    conn.execute(text(f"""
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_type
                WHERE typname = '{enum_name}'
            ) THEN
                CREATE TYPE {enum_name} AS ENUM ({values_sql});
            END IF;
        END
        $$;
    """))


def column_exists(conn, table_name: str, column_name: str) -> bool:
    query = text("""
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = :table_name
          AND column_name = :column_name
        LIMIT 1
    """)
    return conn.execute(
        query,
        {"table_name": table_name, "column_name": column_name},
    ).scalar() is not None


def table_exists(conn, table_name: str) -> bool:
    query = text("""
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = :table_name
        LIMIT 1
    """)
    return conn.execute(query, {"table_name": table_name}).scalar() is not None


def main() -> None:
    room_status_values = ["available", "occupied", "maintenance", "cleaning"]

    with engine.begin() as conn:
        ensure_enum(conn, "roomstatus", room_status_values)
        ensure_enum(conn, "unit_status", room_status_values)

        room_column_fixes = [
            ("quantity", "ALTER TABLE rooms ADD COLUMN quantity INTEGER DEFAULT 1"),
            ("image_url", "ALTER TABLE rooms ADD COLUMN image_url TEXT"),
            ("rating", "ALTER TABLE rooms ADD COLUMN rating NUMERIC(2, 1) DEFAULT 0.0"),
            ("total_reviews", "ALTER TABLE rooms ADD COLUMN total_reviews INTEGER DEFAULT 0"),
            (
                "status",
                "ALTER TABLE rooms ADD COLUMN status roomstatus NOT NULL DEFAULT 'available'",
            ),
        ]

        for column_name, statement in room_column_fixes:
            if not column_exists(conn, "rooms", column_name):
                conn.execute(text(statement))
                print(f"Added rooms.{column_name}")

        guest_column_fixes = [
            ("password_hash", "ALTER TABLE guests ADD COLUMN password_hash VARCHAR(255)"),
            ("notes", "ALTER TABLE guests ADD COLUMN notes TEXT"),
        ]

        for column_name, statement in guest_column_fixes:
            if not column_exists(conn, "guests", column_name):
                conn.execute(text(statement))
                print(f"Added guests.{column_name}")

        if not table_exists(conn, "room_units"):
            conn.execute(text("""
                CREATE TABLE room_units (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
                    unit_number VARCHAR(20) NOT NULL,
                    status unit_status NOT NULL DEFAULT 'available',
                    notes TEXT,
                    last_cleaned_at TIMESTAMP,
                    created_at TIMESTAMP NOT NULL DEFAULT now(),
                    updated_at TIMESTAMP NOT NULL DEFAULT now()
                )
            """))
            print("Created table room_units")

    print("Database schema repair completed.")


if __name__ == "__main__":
    main()

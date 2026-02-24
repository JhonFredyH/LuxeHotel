"""add_password_hash_to_guests

Revision ID: add_pwd_guests
Revises: 
Create Date: 2026-02-20

"""
from alembic import op
import sqlalchemy as sa

revision = 'add_pwd_guests'
down_revision = '4b9b03a65576'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('guests',
        sa.Column('password_hash', sa.String(255), nullable=True)
    )


def downgrade():
    op.drop_column('guests', 'password_hash')

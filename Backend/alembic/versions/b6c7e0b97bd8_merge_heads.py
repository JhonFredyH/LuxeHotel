"""merge_heads

Revision ID: b6c7e0b97bd8
Revises: add_pwd_guests, a1b2c3d4e5f6
Create Date: 2026-02-24 20:54:07.093998

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b6c7e0b97bd8'
down_revision: Union[str, Sequence[str], None] = ('add_pwd_guests',)
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

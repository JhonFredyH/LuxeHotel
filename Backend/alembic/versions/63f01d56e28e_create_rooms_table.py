"""create rooms table

Revision ID: 63f01d56e28e
Revises: eb44ed6fb1d9
Create Date: 2026-02-17 10:21:05.891450

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '63f01d56e28e'
down_revision: Union[str, None] = 'eb44ed6fb1d9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('rooms',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('slug', sa.String(length=120), nullable=False),
        sa.Column('name', sa.String(length=120), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('price_per_night', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('size_m2', sa.Integer(), nullable=True),
        sa.Column('view_type', sa.String(length=50), nullable=True),
        sa.Column('floor', sa.String(length=30), nullable=True),
        sa.Column('max_adults', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('max_children', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('max_guests', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('quantity', sa.Integer(), nullable=True, server_default='1'),
        sa.Column('image_url', sa.Text(), nullable=True),
        sa.Column('rating', sa.Numeric(precision=2, scale=1), nullable=True, server_default='0.0'),
        sa.Column('total_reviews', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('check_in_time', sa.Time(), nullable=True),
        sa.Column('check_out_time', sa.Time(), nullable=True),
        sa.Column('cancellation_policy', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('slug')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('rooms')
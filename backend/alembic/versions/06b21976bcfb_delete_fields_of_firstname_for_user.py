"""Delete fields of firstname for user

Revision ID: 06b21976bcfb
Revises: 88f264b6f422
Create Date: 2025-07-03 20:43:58.248512

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '06b21976bcfb'
down_revision: Union[str, Sequence[str], None] = '88f264b6f422'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

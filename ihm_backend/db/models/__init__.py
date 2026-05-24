"""ihm_backend models."""

import pkgutil
from pathlib import Path


def load_all_models() -> None:
    """Load all models from this folder."""
    package_dir = Path(__file__).resolve().parent
    modules = pkgutil.walk_packages(
        path=[str(package_dir)],
        prefix="ihm_backend.db.models.",
    )
    for module in modules:
        __import__(module.name)


# Explicitly import models to ensure they're registered
from ihm_backend.db.models.users import User, Kitchen, UserRole, VendorCategory  # noqa: F401, E402
from ihm_backend.db.models.stall import Stall  # noqa: F401, E402
from ihm_backend.db.models.inventory import Inventory  # noqa: F401, E402
from ihm_backend.db.models.raw_material import RawMaterialRequests  # noqa: F401, E402
from ihm_backend.db.models.compiled_orders import CompiledOrders  # noqa: F401, E402
from ihm_backend.db.models.orders import Orders  # noqa: F401, E402

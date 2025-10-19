from fastapi import Depends, HTTPException, status
from ihm_backend.db.models.users import User, UserRole, current_active_user


def require_role(required_role: UserRole):
    def role_checker(user: User = Depends(current_active_user)):
        if user.role != required_role:
            raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Deniend. required role : {required_role}")
        return user
    return role_checker




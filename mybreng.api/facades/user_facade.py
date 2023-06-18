from hashlib import sha512
from base64 import b64encode
from database import UserTable
from dtos import UserDto


# noinspection PyMethodMayBeStatic
class UserFacade:
    def get_user_by_email_and_password(self, email: str, password: str) -> UserDto | None:
        user = UserTable.query.filter_by(email=email).first()
        if user is None:
            return None
        if self._calc_password_hash(password, user.password_salt) == user.password_hash:
            return self._map_to_user_dto(user)
        return None

    def _calc_password_hash(self, password: str, salt: str) -> str:
        manager = sha512()
        manager.update(bytes(password + salt, 'utf-8'))
        return b64encode(manager.digest()).decode('utf-8')

    def _map_to_user_dto(self, user: UserTable) -> UserDto:
        return UserDto(user.id, user.email)

    def get_user_by_id(self, user_id: str) -> UserDto | None:
        user = UserTable.query.filter_by(id=user_id).first()
        return None if user is None else self._map_to_user_dto(user)

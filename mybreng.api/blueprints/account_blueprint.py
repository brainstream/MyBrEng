from dependency_injector.wiring import Provide, inject
from flask import make_response, request
from flask.blueprints import Blueprint
from di import DI
from flask_login import login_user, logout_user
from dtos import LogInDtoSchema
from facades import UserFacade

account_blueprint = Blueprint('account', __name__)


@account_blueprint.route('/login', methods=['POST'])
@inject
def account_login(user_facade: UserFacade = Provide[DI.user_facade]):
    """
    ---
    post:
      operationId: account_login
      tags: [Account]

      description: Authenticates user by email and password
      requestBody:
        content:
          application/json:
            schema: LogInDto
      responses:
        200:
          description: Logged in successfully
        401:
          description: Failed to log in
    """
    schema = LogInDtoSchema()
    dto = schema.loads(request.get_data(as_text=True))
    user = user_facade.get_user_by_email_and_password(dto.email, dto.password)
    if user is None:
        return make_response('', 401)
    login_user(user, remember=True)
    return make_response('', 200)


@account_blueprint.route('/logout', methods=['POST'])
def account_logout():
    """
    ---
    post:
      operationId: account_logout
      tags: [Account]

      description: Log out user
      responses:
        200:
          description: Logged out successfully
        400:
          description: Failed to log out
    """
    return make_response('', 200 if logout_user() else 400)

from dependency_injector.wiring import Provide, inject
from flask import make_response
from flask.blueprints import Blueprint
from di import DI
from dtos import LogInDto
from facades import UserFacade

account_blueprint = Blueprint('account', __name__)


@account_blueprint.route('/login', methods=['POST'])
@inject
def account_login(credentials: LogInDto, user_facade: UserFacade = Provide[DI.user_facade]):
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
    user = user_facade.get_user_by_email_and_password(credentials.email, credentials.password)
    if user is None:
        return make_response('', 401)
    else:
        user_facade.log_in(user)
        return make_response('', 200)

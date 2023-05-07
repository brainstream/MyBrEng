from dependency_injector.wiring import Provide, inject
from flask import request, make_response, jsonify
from flask.blueprints import Blueprint
from flask_login import current_user, login_required

from di import DI
from dtos import RunCreateDtoSchema, RunSummaryDtoSchema
from facades import RunFacade

run_blueprint = Blueprint('run', __name__)


@run_blueprint.route('/', methods=['POST'])
@login_required
@inject
def run_create(run_facade: RunFacade = Provide[DI.run_facade]):
    """
    ---
    post:
      operationId: run_create
      tags: [Run]

      description: Creates a run
      requestBody:
        content:
          application/json:
            schema: RunCreateDto
      responses:
        200:
          description: A run created successfully
          content:
            application/json:
              schema: RunSummaryDto
        404:
          description: A student or a quiz with specified ID not found
    """
    run_create_schema = RunCreateDtoSchema()
    run_summary_schema = RunSummaryDtoSchema()
    dto = run_create_schema.load(request.get_json())
    result = run_facade.create_run(current_user.id, dto)
    return make_response('', 404) if result is None else jsonify(run_summary_schema.dump(result))

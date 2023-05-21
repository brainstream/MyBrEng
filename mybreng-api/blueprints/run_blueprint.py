from dependency_injector.wiring import Provide, inject
from flask import request, make_response, jsonify
from flask.blueprints import Blueprint
from flask_login import current_user, login_required

from di import DI
from dtos import RunCreateDtoSchema, RunSummaryDtoSchema, RunDtoSchema, RunFinishDtoSchema
from facades import RunFacade

run_blueprint = Blueprint('run', __name__)


@run_blueprint.route('/<run_id>', methods=['GET'])
@inject
def run_get(run_id: str, run_facade: RunFacade = Provide[DI.run_facade]):
    """
    ---
    get:
      operationId: run_get
      tags: [Run]
      description: Returns a run
      parameters:
      - in: path
        name: run_id
        schema:
          type: string
          format: uuid
          description: The Run ID
      responses:
        200:
          description: The Run
          content:
            application/json:
              schema: RunDto
        404:
          description: A Run with specified ID not found
    """
    run = run_facade.get_run(run_id)
    if run is None:
        return make_response(404, '')
    else:
        response_schema = RunDtoSchema()
        return jsonify(response_schema.dump(run))


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
    request_schema = RunCreateDtoSchema()
    dto = request_schema.loads(request.get_data(as_text=True))
    run = run_facade.create_run(current_user.id, dto)
    if run is None:
        return make_response('', 404)
    response_schema = RunSummaryDtoSchema()
    return jsonify(response_schema.dump(run))


@run_blueprint.route('/<run_id>', methods=['DELETE'])
@login_required
@inject
def run_delete(run_id: str, run_facade: RunFacade = Provide[DI.run_facade]):
    """
    ---
    delete:
      operationId: run_delete
      tags: [Run]
      description: Deletes a run
      parameters:
      - in: path
        name: run_id
        schema:
          type: string
          format: uuid
          description: The Run ID to delete
      responses:
        200:
          description: The Run deleted successfully
        404:
          description: A Run with specified ID not found
    """
    result = run_facade.delete_run(current_user.id, run_id)
    return make_response('', 200 if result else 404)


@run_blueprint.route('/finish', methods=['POST'])
@login_required
@inject
def run_finish(run_facade: RunFacade = Provide[DI.run_facade]):
    """
    ---
    post:
      operationId: run_finish
      tags: [Run]
      description: Finishes a run
      requestBody:
        content:
          application/json:
            schema: RunFinishDto
      responses:
        200:
          description: The Run
          content:
            application/json:
              schema: RunDto
        404:
          description: A Run with specified ID not found
    """
    request_schema = RunFinishDtoSchema()
    dto = request_schema.loads(request.get_data(as_text=True))
    run = run_facade.finish_run(dto)
    if run is None:
        return make_response('', 404)
    response_schema = RunDtoSchema()
    return jsonify(response_schema.dump(run))

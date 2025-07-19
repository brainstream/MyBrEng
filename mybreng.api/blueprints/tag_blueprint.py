from dependency_injector.wiring import Provide, inject
from flask import make_response, request, jsonify
from flask.blueprints import Blueprint
from di import DI
from flask_login import current_user, login_required
from dtos import TagDtoSchema, TagEditDtoSchema
from facades import TagFacade

tag_blueprint = Blueprint('tag', __name__)

@tag_blueprint.route('/', methods=['GET'])
@login_required
@inject
def tag_list(tag_facade: TagFacade = Provide[DI.tag_facade]):
    """
    ---
    get:
      operationId: tag_list
      tags: [Tag]
      description: Returns a list of all user`s tags
      responses:
        200:
          description: List of tags
          content:
            application/json:
              schema:
                type: array
                items: TagDto
    """
    schema = TagDtoSchema()
    tags = tag_facade.get_tags(current_user.id)
    return jsonify(schema.dump(tags, many=True))

@tag_blueprint.route('/', methods=['POST'])
@login_required
@inject
def tag_save(tag_facade: TagFacade = Provide[DI.tag_facade]):
    """
    ---
    post:
      operationId: tag_save
      tags: [Tag]
      description: Edits or creates a tag
      requestBody:
        content:
          application/json:
            schema: TagEditDto
      responses:
        200:
          description: Tag saved successfully
          content:
            application/json:
              schema: TagDto
        404:
          description: Tag with specified ID not found
    """
    request_schema = TagEditDtoSchema()
    edit_dto = request_schema.loads(request.get_data(as_text=True))
    tag = tag_facade.create_tag(current_user.id, edit_dto) if edit_dto.id is None else \
        tag_facade.edit_tag(current_user.id, edit_dto)
    if tag is None:
        return make_response('', 404)
    response_schema = TagDtoSchema()
    return jsonify(response_schema.dump(tag))

@tag_blueprint.route('/<tag_id>', methods=['DELETE'])
@login_required
@inject
def tag_delete(tag_id: str, tag_facade: TagFacade = Provide[DI.tag_facade]):
    """
    ---
    delete:
      operationId: tag_delete
      tags: [Tag]
      description: Deletes a tag
      parameters:
      - in: path
        name: tag_id
        schema:
          type: string
          format: uuid
          description: Tag ID to delete
      responses:
        200:
          description: Tag deleted successful
        404:
          description: Tag with specified ID not found
    """
    return make_response('', 200 if tag_facade.delete_tag(current_user.id, tag_id) else 404)

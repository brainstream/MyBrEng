from dependency_injector.wiring import inject, Provide
from flask import Blueprint, request, make_response, jsonify
from flask_login import current_user, login_required

from di import DI
from dtos import ArtifactListDtoSchema, ArtifactListQueryDtoSchema, ArtifactDtoSchema
from facades import ArtifactFacade

artifact_blueprint = Blueprint('artifact', __name__)

@artifact_blueprint.route('/', methods=['POST'])
@login_required
@inject
def artifact_upload(artifact_facade: ArtifactFacade = Provide[DI.artifact_facade]):
    """
    ---
    post:
      operationId: artifact_upload
      tags: [Artifacts]

      description: Stores artifact in the database
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
      responses:
        200:
          description: File successfully uploaded
          content:
          content:
            application/json:
              schema: ArtifactDto
        400:
          description: No file part or invalid request
        413:
          description: "The file size is too large, maximum size: 15 MiB"
    """
    if 'file' not in request.files:
        return make_response('No file part', 401)
    file = request.files['file']
    if file.name == '':
        return make_response('No selected file', 401)
    if file.content_length > 15728640:
        return make_response('The file size is too large, maximum size: 15 MiB', 413)
    schema = ArtifactDtoSchema()
    artifact = artifact_facade.upload(current_user.id, file)
    return jsonify(schema.dump(artifact))

@artifact_blueprint.route('/<artifact_id>', methods=['GET'])
@inject
# anonymous access allowed
def artifact_content(artifact_id: str, artifact_facade: ArtifactFacade = Provide[DI.artifact_facade]):
    """
    ---
    get:
      operationId: artifact_content
      tags: [Artifacts]
      description: Returns an artifact content
      parameters:
      - in: path
        name: artifact_id
        schema:
          type: string
          format: uuid
          description: The Artifact ID
      responses:
        200:
          description: The Artifact
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
        404:
          description: An Artifact with specified ID not found
    """
    artifact = artifact_facade.get_content(current_user.id, artifact_id)
    if artifact is None:
        return make_response(404, '')
    response = make_response(artifact.content, 200)
    response.headers.set('Content-Type', artifact.mime)
    return response

@artifact_blueprint.route('/list', methods=['GET'])
@login_required
@inject
def artifact_list(artifact_facade: ArtifactFacade = Provide[DI.artifact_facade]):
    """
    ---
    get:
      operationId: artifact_list
      tags: [Artifacts]
      description: Returns a paginated list of all user artifacts
      parameters:
        - in: query
          name: take
          required: false
          description: Maximum number of records returned
          schema:
             type: int
             default: 50
        - in: query
          name: skip
          required: false
          description: The number of records to skip in the query
          schema:
             type: int
             default: 0
      responses:
        200:
          description: List of artifacts
          content:
            application/json:
              schema: ArtifactListDto
    """
    request_schema = ArtifactListQueryDtoSchema()
    query = request_schema.load(request.args)
    schema = ArtifactListDtoSchema()
    result = artifact_facade.get_list(current_user.id, query.take, query.skip)
    return jsonify(schema.dump(result))

@artifact_blueprint.route('/<artifact_id>', methods=['DELETE'])
@login_required
@inject
def artifact_delete(artifact_id: str, artifact_facade: ArtifactFacade = Provide[DI.artifact_facade]):
    """
    ---
    delete:
      operationId: artifact_delete
      tags: [Artifacts]
      description: Deletes an artifact
      parameters:
      - in: path
        name: artifact_id
        schema:
          type: string
          format: uuid
          description: Artifact ID to delete
      responses:
        200:
          description: Artifact deleted successful
        404:
          description: Artifact with specified ID not found
    """
    return make_response('', 200 if artifact_facade.delete_artifact(current_user.id, artifact_id) else 404)

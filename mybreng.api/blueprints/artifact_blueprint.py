from dependency_injector.wiring import inject, Provide
from flask import Blueprint, request, make_response
from flask_login import current_user

from di import DI
from facades import ArtifactFacade

artifact_blueprint = Blueprint('artifact', __name__)

@artifact_blueprint.route('/', methods=['POST'])
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
                description:
                  type: string
      responses:
        200:
          description: File successfully uploaded
          content:
            text/plain:
              schema:
                type: string
                format: uuid
        400:
          description: No file part or invalid request
    """
    if 'file' not in request.files:
        return make_response('No file part', 401)
    file = request.files['file']
    if file.name == '':
        return make_response('No selected file', 401)
    artifact_id = artifact_facade.upload(current_user.id, file)
    return make_response(artifact_id, 200)

@artifact_blueprint.route('/<artifact_id>', methods=['GET'])
@inject
def artifact_get(artifact_id: str, artifact_facade: ArtifactFacade = Provide[DI.artifact_facade]):
    """
    ---
    get:
      operationId: artifact_get
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
              schema: string
              format: binary
        404:
          description: An Artifact with specified ID not found
    """
    artifact = artifact_facade.get(current_user.id, artifact_id)
    if artifact is None:
        return make_response(404, '')
    response = make_response(artifact.content(), 200)
    response.headers.set('Content-Type', artifact.mime())
    response.headers.set('Content-Disposition', 'attachment', filename=artifact.filename())
    return response

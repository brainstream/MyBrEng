import uuid
from pathlib import Path
from werkzeug.datastructures import FileStorage
from database import db, ArtifactTable
from dtos import ArtifactDto
from mappers import map_artifact_to_dto


# noinspection PyMethodMayBeStatic
class ArtifactFacade:
    def upload(self, owner_id: str, file: FileStorage) -> str:
        artifact = ArtifactTable()
        artifact.id = str(uuid.uuid4())
        artifact.name = Path(file.filename).name
        artifact.content = file.stream.read()
        artifact.owner_id = owner_id
        artifact.mime = file.mimetype
        db.session.add(artifact)
        db.session.commit()
        return artifact.id

    def get(self, owner_id: str, artifact_id: str) -> ArtifactDto | None:
        artifact = ArtifactTable.query \
            .where(ArtifactTable.id == artifact_id, ArtifactTable.owner_id == owner_id) \
            .first()
        if artifact is None:
            return None
        return map_artifact_to_dto(artifact)

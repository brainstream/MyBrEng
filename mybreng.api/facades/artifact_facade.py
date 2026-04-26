import uuid
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy.orm import undefer
from werkzeug.datastructures import FileStorage
from database import db, ArtifactTable
from dtos import ArtifactContentDto, ArtifactListDto, ArtifactDto
from mappers import map_artifact_to_content_dto, map_artifacts_to_list_dto, map_artifact_to_dto


# noinspection PyMethodMayBeStatic
class ArtifactFacade:
    def upload(self, owner_id: str, file: FileStorage) -> ArtifactDto:
        artifact = ArtifactTable()
        artifact.id = str(uuid.uuid4())
        artifact.name = Path(file.filename).name
        artifact.content = file.stream.read()
        artifact.owner_id = owner_id
        artifact.mime = file.mimetype
        artifact.upload_date = datetime.now(timezone.utc)
        db.session.add(artifact)
        db.session.commit()
        return map_artifact_to_dto(artifact)

    def get_content(self, owner_id: str, artifact_id: str) -> ArtifactContentDto | None:
        artifact = ArtifactTable.query \
            .where(ArtifactTable.id == artifact_id, ArtifactTable.owner_id == owner_id) \
            .options(undefer(ArtifactTable.content)) \
            .first()
        if artifact is None:
            return None
        return map_artifact_to_content_dto(artifact)

    def get_list(self, owner_id: str, page_size: int, page_index: int) -> ArtifactListDto:
        query = ArtifactTable.query.where(ArtifactTable.owner_id == owner_id)
        total_count = query.count()
        start_index = page_index * page_size
        page = query.order_by(ArtifactTable.upload_date.desc()).offset(start_index).limit(page_size).all()
        return map_artifacts_to_list_dto(page, start_index, total_count)

from database import ArtifactTable
from dtos import ArtifactDto


def map_artifact_to_dto(artifact: ArtifactTable) -> ArtifactDto:
    return ArtifactDto(artifact.content, artifact.name, artifact.mime)

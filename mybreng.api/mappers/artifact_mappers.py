from database import ArtifactTable
from dtos import ArtifactContentDto, ArtifactListDto, ArtifactDto


def map_artifact_to_content_dto(artifact: ArtifactTable) -> ArtifactContentDto:
    return ArtifactContentDto(content=artifact.content, filename=artifact.name, mime=artifact.mime)

def map_artifacts_to_list_dto(artifacts: list[ArtifactTable], start_index: int, total_count: int) -> ArtifactListDto:
    return ArtifactListDto(
        artifacts=[map_artifact_to_dto(a) for a in artifacts],
        start_index=start_index,
        total_count=total_count
    )

def map_artifact_to_dto(artifact: ArtifactTable) -> ArtifactDto:
    return ArtifactDto(
        id=artifact.id,
        filename=artifact.name,
        mime=artifact.mime,
        upload_date=artifact.upload_date
    )

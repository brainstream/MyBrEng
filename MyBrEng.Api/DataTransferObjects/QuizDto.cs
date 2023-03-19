namespace MyBrEng.Api.DataTransferObjects;

public record QuizDto(
    Guid Id,
    string Title,
    string? Description
);
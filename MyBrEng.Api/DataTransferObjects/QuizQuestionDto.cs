using MyBrEng.Api.DataLayer;

namespace MyBrEng.Api.DataTransferObjects;

public record QuizQuestionDto(
    Guid Id,
    QuizQuestionType Type,
    string Text,
    int OrdinalNumber
);
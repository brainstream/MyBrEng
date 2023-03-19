using Microsoft.AspNetCore.Mvc;
using MyBrEng.Api.DataTransferObjects;

namespace MyBrEng.Api.Controllers;

[ApiController]
[ApiVersion("1")]
[Route("api/v{version:apiVersion}/quiz")]
public class QuizController : ControllerBase
{
    private static List<QuizDto> quizzes;

    static QuizController() {
        quizzes = Enumerable
            .Range(0, 100)
            .Select(i => new QuizDto(Guid.NewGuid(), $"Quiz #{i}", $"Description of the Quiz #{i}"))
            .ToList();
    }

    [HttpGet("list")]
    [ProducesResponseType(typeof(IReadOnlyCollection<QuizDto>), StatusCodes.Status200OK)]
    public IActionResult List()
    {
        return Ok(quizzes.AsReadOnly());
    }
}

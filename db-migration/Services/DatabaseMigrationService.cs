using DevExpress.Xpo;
using Microsoft.Extensions.Logging;

namespace DatabaseMigration.Services;

class DatabaseMigrationService : IDatabaseMigrationService
{
    readonly ILogger<DatabaseMigrationService> logger;
    readonly SourceUnitOfWork srcUnitOfWork;
    readonly DestinationUnitOfWork destUnitOfWork;

    public DatabaseMigrationService(
        ILogger<DatabaseMigrationService> logger,
        SourceUnitOfWork unitOfWork,
        DestinationUnitOfWork destUnitOfWork)
    {
        this.logger = logger;
        this.srcUnitOfWork = unitOfWork;
        this.destUnitOfWork = destUnitOfWork;
    }

    public async Task RunAsync(CancellationToken cancellationToken)
    {
        logger.LogInformation("Migration started");
        await MigrateUsersAsync(cancellationToken);
        await MigrateQuizzesAsync(cancellationToken);
        await MigrateQuizQuestionsAsync(cancellationToken);
        await MigrateQuizAnswerVariantAsync(cancellationToken);
        await MigrateStudentsAsync(cancellationToken);
        await MigrateRunsAsync(cancellationToken);
        await MigrateRunAnswersAsync(cancellationToken);
        logger.LogInformation("Migration finished");
    }

    async Task MigrateUsersAsync(CancellationToken cancellationToken)
    {
        logger.LogInformation("START MIGRATION Users");
        var users = srcUnitOfWork.Query<User>().ToList();
        foreach (var user in users)
        {
            await EnsureDestinationUserAsync(user, cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();
        }
        logger.LogInformation("FINISHT MIGRATION Users");
    }

    async Task<User> EnsureDestinationUserAsync(User sourceUser, CancellationToken cancellationToken)
    {
        logger.LogInformation("User {id}", sourceUser.Id);
        var destUser = destUnitOfWork.GetObjectByKey<User>(sourceUser.Id);
        if (destUser == null)
        {
            destUser = new User(destUnitOfWork)
            {
                Id = sourceUser.Id,
                Email = sourceUser.Email,
                PasswordHash = sourceUser.PasswordHash,
                PasswordSalt = sourceUser.PasswordSalt
            };
            await destUnitOfWork.CommitChangesAsync(cancellationToken);
            logger.LogInformation("User {id} created", sourceUser.Id);
        }
        else
        {
            logger.LogInformation("User {id} already exists", sourceUser.Id);
        }
        return destUser;
    }

    async Task MigrateQuizzesAsync(CancellationToken cancellationToken)
    {
        logger.LogInformation("START MIGRATION Quizzes");
        var quizzes = srcUnitOfWork.Query<Quiz>().ToList();
        foreach (var quiz in quizzes)
        {
            await EnsureDestinationQuizAsync(quiz, cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();
        }
        logger.LogInformation("FINISH MIGRATION Quizzes");
    }

    async Task<Quiz> EnsureDestinationQuizAsync(Quiz sourceQuiz, CancellationToken cancellationToken)
    {
        logger.LogInformation("Quiz {id}", sourceQuiz.Id);
        var destQuiz = destUnitOfWork.GetObjectByKey<Quiz>(sourceQuiz.Id);
        if (destQuiz == null)
        {
            destQuiz = new Quiz(destUnitOfWork)
            {
                Id = sourceQuiz.Id,
                Title = sourceQuiz.Title,
                Description = sourceQuiz.Description,
                Owner = await EnsureDestinationUserAsync(sourceQuiz.Owner, cancellationToken)
            };
            await destUnitOfWork.CommitChangesAsync(cancellationToken);
            logger.LogInformation("Quiz {id} created", sourceQuiz.Id);
        }
        else
        {
            logger.LogInformation("Quiz {id} already exists", sourceQuiz.Id);
        }
        return destQuiz;
    }

    async Task MigrateQuizQuestionsAsync(CancellationToken cancellationToken)
    {
        logger.LogInformation("START MIGRATION Quiz questions");
        var questions = srcUnitOfWork.Query<QuizQuestion>().ToList();
        foreach (var question in questions)
        {
            await EnsureDestinationQuizQuestionAsync(question, cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();
        }
        logger.LogInformation("FINISH MIGRATION Quiz questions");
    }

    async Task<QuizQuestion> EnsureDestinationQuizQuestionAsync(
        QuizQuestion sourceQuestion,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Quiz question {id}", sourceQuestion.Id);
        var destQuestion = destUnitOfWork.GetObjectByKey<QuizQuestion>(sourceQuestion.Id);
        if (destQuestion == null)
        {
            destQuestion = new QuizQuestion(destUnitOfWork)
            {
                Id = sourceQuestion.Id,
                Text = sourceQuestion.Text,
                Type = sourceQuestion.Type,
                OrdinalNumber = sourceQuestion.OrdinalNumber,
                Quiz = await EnsureDestinationQuizAsync(sourceQuestion.Quiz, cancellationToken)
            };
            await destUnitOfWork.CommitChangesAsync(cancellationToken);
            logger.LogInformation("Quiz question {id} created", sourceQuestion.Id);
        }
        else
        {
            logger.LogInformation("Quiz question {id} already exists", sourceQuestion.Id);
        }
        return destQuestion;
    }

    async Task MigrateQuizAnswerVariantAsync(CancellationToken cancellationToken)
    {
        logger.LogInformation("START MIGRATION Quiz answer variants");
        var answers = srcUnitOfWork.Query<QuizAnswerVariant>().ToList();
        foreach (var answer in answers)
        {
            await EnsureDestinationQuizAnswerVariantAsync(answer, cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();
        }
        logger.LogInformation("FINISH MIGRATION Quiz answer variants");
    }

    async Task<QuizAnswerVariant> EnsureDestinationQuizAnswerVariantAsync(
        QuizAnswerVariant sourceVariant,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Quiz answer variant {id}", sourceVariant.Id);
        var destVariant = destUnitOfWork.GetObjectByKey<QuizAnswerVariant>(sourceVariant.Id);
        if (destVariant == null)
        {
            destVariant = new QuizAnswerVariant(destUnitOfWork)
            {
                Id = sourceVariant.Id,
                Question = await EnsureDestinationQuizQuestionAsync(sourceVariant.Question, cancellationToken),
                Text = sourceVariant.Text,
                IsRight = sourceVariant.IsRight
            };
            await destUnitOfWork.CommitChangesAsync(cancellationToken);
            logger.LogInformation("Quiz answer variant {id} created", sourceVariant.Id);
        }
        else
        {
            logger.LogInformation("Quiz answer variant {id} already exists", sourceVariant.Id);
        }
        return destVariant;
    }

    async Task MigrateStudentsAsync(CancellationToken cancellationToken)
    {
        logger.LogInformation("START MIGRATION Students");
        var students = srcUnitOfWork.Query<Student>().ToList();
        foreach (var student in students)
        {
            await EnsureDestinationStudentAsync(student, cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();
        }
        logger.LogInformation("FINISH MIGRATION Students");
    }

    async Task<Student> EnsureDestinationStudentAsync(
        Student sourceStudent,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Student {id}", sourceStudent.Id);
        var destStudent = destUnitOfWork.GetObjectByKey<Student>(sourceStudent.Id);
        if (destStudent == null)
        {
            destStudent = new Student(destUnitOfWork)
            {
                Id = sourceStudent.Id,
                FirstName = sourceStudent.FirstName,
                LastName = sourceStudent.LastName,
                Owner = await EnsureDestinationUserAsync(sourceStudent.Owner, cancellationToken),
                Note = sourceStudent.Note
            };
            await destUnitOfWork.CommitChangesAsync(cancellationToken);
            logger.LogInformation("Student {id} created", sourceStudent.Id);
        }
        else
        {
            logger.LogInformation("Student {id} already exists", sourceStudent.Id);
        }
        return destStudent;
    }

    async Task MigrateRunsAsync(CancellationToken cancellationToken)
    {
        logger.LogInformation("START MIGRATION Runs");
        var runs = srcUnitOfWork.Query<Run>().ToList();
        foreach (var run in runs)
        {
            await EnsureDestinationRunAsync(run, cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();
        }
        logger.LogInformation("FINISH MIGRATION Runs");
    }

    async Task<Run> EnsureDestinationRunAsync(
        Run sourceRun,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Run {id}", sourceRun.Id);
        var destRun = destUnitOfWork.GetObjectByKey<Run>(sourceRun.Id);
        if (destRun == null)
        {
            destRun = new Run(destUnitOfWork)
            {
                Id = sourceRun.Id,
                Student = await EnsureDestinationStudentAsync(sourceRun.Student, cancellationToken),
                Quiz = await EnsureDestinationQuizAsync(sourceRun.Quiz, cancellationToken),
                CreationDate = sourceRun.CreationDate,
                StartDate = sourceRun.StartDate,
                FinishDate = sourceRun.FinishDate
            };
            await destUnitOfWork.CommitChangesAsync(cancellationToken);
            logger.LogInformation("Run {id} created", sourceRun.Id);
        }
        else
        {
            logger.LogInformation("Run {id} already exists", sourceRun.Id);
        }
        return destRun;
    }

    async Task MigrateRunAnswersAsync(CancellationToken cancellationToken)
    {
        logger.LogInformation("START MIGRATION Run answers");
        var answers = srcUnitOfWork.Query<RunAnswer>().ToList();
        foreach (var answer in answers)
        {
            Console.WriteLine(answer.Id);
            await EnsureDestinationRunAnswerAsync(answer, cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();
        }
        logger.LogInformation("FINISH MIGRATION Run answers");
    }

    async Task<RunAnswer> EnsureDestinationRunAnswerAsync(
        RunAnswer sourceRunAnswer,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Run answer {id}", sourceRunAnswer.Id);
        var destRunAnswer = destUnitOfWork.GetObjectByKey<RunAnswer>(sourceRunAnswer.Id);
        if (destRunAnswer == null)
        {
            destRunAnswer = new RunAnswer(destUnitOfWork)
            {
                Id = sourceRunAnswer.Id,
                Run = await EnsureDestinationRunAsync(sourceRunAnswer.Run, cancellationToken),
                Question = await EnsureDestinationQuizQuestionAsync(sourceRunAnswer.Question, cancellationToken),
                Variant = sourceRunAnswer.Variant == null
                    ? null
                    : await EnsureDestinationQuizAnswerVariantAsync(sourceRunAnswer.Variant, cancellationToken),
                Text = sourceRunAnswer.Text
            };
            await destUnitOfWork.CommitChangesAsync(cancellationToken);
            logger.LogInformation("Run answer {id} created", sourceRunAnswer.Id);
        }
        else
        {
            logger.LogInformation("Run answer {id} already exists", sourceRunAnswer.Id);
        }
        return destRunAnswer;
    }
}

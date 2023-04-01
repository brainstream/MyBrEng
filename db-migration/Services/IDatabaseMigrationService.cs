namespace DatabaseMigration.Services;

interface IDatabaseMigrationService
{
    Task RunAsync(CancellationToken cancellationToken);
}

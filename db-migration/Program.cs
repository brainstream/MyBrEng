using DatabaseMigration;
using DatabaseMigration.Services;
using DevExpress.Xpo.DB;
using DevExpress.Xpo.Metadata;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var cancellationTokenSource = new CancellationTokenSource();

Console.CancelKeyPress += (s, e) =>
{
    Console.WriteLine("Canceling...");
    cancellationTokenSource.Cancel();
    e.Cancel = true;
};

var builder = Host.CreateDefaultBuilder();

builder
    .ConfigureAppConfiguration((ctx, configBuilder) =>
    {
        configBuilder.AddJsonFile("appsettings.json");
        var config = configBuilder.Build();
        var env = config["environment"];
        configBuilder.AddJsonFile($"appsettings.{env}.json");
    })
    .ConfigureServices((ctx, services) =>
    {
        services.AddScoped<IDatabaseMigrationService, DatabaseMigrationService>();
        services.AddXpoCustomSession<SourceUnitOfWork>(true, dataLayerBuilder =>
            dataLayerBuilder
                .UseAutoCreationOption(AutoCreateOption.SchemaAlreadyExists)
                .UseThreadSafeDataLayer(true)
                .UseCustomDictionaryFactory(CreateXPDictionary)
                .UseConnectionString(ctx.Configuration["ConnectionStrings:Source"])
        );
        services.AddXpoCustomSession<DestinationUnitOfWork>(true, dataLayerBuilder =>
            dataLayerBuilder
                .UseAutoCreationOption(AutoCreateOption.SchemaOnly)
                .UseThreadSafeDataLayer(true)
                .UseCustomDictionaryFactory(CreateXPDictionary)
                .UseConnectionString(ctx.Configuration["ConnectionStrings:Destination"])
        );
    });

var host = builder.Build();

var migration = host.Services.GetRequiredService<IDatabaseMigrationService>();
await migration.RunAsync(cancellationTokenSource.Token);

XPDictionary CreateXPDictionary()
{
    var dict = new ReflectionDictionary();
    dict.CollectClassInfos(typeof(Quiz).Assembly);
    return dict;
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHealthChecks();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "mybreng_v1";
    config.ApiGroupNames = new[] { "1" };
    config.PostProcess = document =>
    {
        document.Info.Version = "Version 1";
        document.Info.Title = "MyBrEng API v1";
        document.Info.Description = "The OpenAPI interface for the MyBrEng application group";
    };
});
builder.Services.AddMediatR(config =>
    config.RegisterServicesFromAssemblies(typeof(Program).Assembly)
);
builder.Services.AddApiVersioning(opt =>
{
    opt.DefaultApiVersion = new ApiVersion(1, 0);
    opt.AssumeDefaultVersionWhenUnspecified = true;
    opt.ReportApiVersions = true;
    opt.ApiVersionReader = new UrlSegmentApiVersionReader();
});
builder.Services.AddVersionedApiExplorer(setup =>
{
    setup.GroupNameFormat = "VVV";
    setup.SubstituteApiVersionInUrl = true;
});

var app = builder.Build();
if (builder.Environment.IsProduction())
{
    app.UseHttpsRedirection();

}
app.UseApiVersioning();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHealthChecks("/health");
});
app.UseOpenApi(options =>
{
    options.DocumentName = "mybreng_v1";
    options.Path = "/openapi/{documentName}.json";
});
app.UseSwaggerUi3(options =>
{
    options.Path = "/openapi";
    options.DocumentPath = "/openapi/{documentName}.json";
});

app.Run();

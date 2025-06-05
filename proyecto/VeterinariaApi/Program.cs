using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using VeterinariaApi.Data;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 🔗 1. Configurar base de datos PostgreSQL
builder.Services.AddDbContext<ApiDbContext>(options =>
   options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 🔐 2. Configurar autenticación JWT

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not found.")
            )),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = "https://veterinariaApi.com",
            ValidAudience = "https://veterinariaApi.com",
            ValidateIssuerSigningKey = true,
        };
    });

// 🔒 3. Autorización
builder.Services.AddAuthorization();

// 🧩 4. Servicios de la API (Swagger, Controllers)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

var app = builder.Build();

// 🚀 5. Middleware

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication(); // Importante: primero autenticación
app.UseAuthorization();  // Luego autorización

app.MapControllers();    // Habilita tus controladores

// Mensaje simple para confirmar funcionamiento
app.MapGet("/", () => "✅ API Veterinaria funcionando correctamente");

app.Run();
using Microsoft.EntityFrameworkCore;
using VeterinariaApi.Models;

namespace VeterinariaApi.Data
{
    public class ApiDbContext : DbContext
    {
        public ApiDbContext(DbContextOptions<ApiDbContext> options)
            : base(options)
        {
        }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<Turno> Turnos { get; set; }
        public DbSet<HistoriaClinica> HistoriaClinica { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //no repetir email
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // 🌱 Usuarios de ejemplo (con contraseñas hasheadas)
            modelBuilder.Entity<Usuario>().HasData(
               new Usuario
               {
                   Id = 1,
                   Nombre = "Natalia",
                   Email = "agustina@example.com",
                   PasswordHash = BCrypt.Net.BCrypt.HashPassword("222222"),
                   Rol = "Admin"
               },
               new Usuario
               {
                   Id = 2,
                   Nombre = "Sandra López",
                   Email = "sandra@example.com",
                   PasswordHash = BCrypt.Net.BCrypt.HashPassword("222222"),
                   Rol = "Recepcionista"
               },
                new Usuario
                {
                    Id = 3,
                    Nombre = "Marcelo ",
                    Email = "marceloG@gmail.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("222222"),
                    Rol = "Veterinario"
                }
            );


            // 🌱 Clientes
            modelBuilder.Entity<Cliente>().HasData(
                new Cliente
                {
                    Id = 1,
                    Nombre = "Juan Pérez",
                    Telefono = "123456789",
                    Email = "juan@example.com"
                },
                new Cliente
                {
                    Id = 2,
                    Nombre = "Eliana Martinez",
                    Telefono = "987654321",
                    Email = "ElMartinez@example.com"
                },
                new Cliente
                {
                    Id = 3,
                    Nombre = "Paula",
                    Telefono = "213123123213",
                    Email = "p@example"
                }
            );


            // 🌱 Pacientes
            modelBuilder.Entity<Paciente>().HasData(
                new Paciente
                {
                    Id = 1,
                    Nombre = "luna",
                    Especie = "perra",
                    Raza = "caniche",
                    Edad = 4,
                    ClienteId = 1
                },
                new Paciente
                {
                    Id = 2,
                    Nombre = "roco",
                    Especie = "perro",
                    Raza = "labrador",
                    Edad = 3,
                    ClienteId = 2
                }
            );

            // 🌱 Turnos de ejemplo
            modelBuilder.Entity<Turno>().HasData(
                new Turno
                {
                    Id = 1,
                    FechaHora = new DateTime(2025, 7, 14, 0, 31, 0),
                    Estado = "Atendido",
                    Notas = "Paciente revisado, en buen estado",
                    PacienteId = 1,
                    VeterinarioId = 3
                }
            );

            // 🌱 Historia clínica de ejemplo
            modelBuilder.Entity<HistoriaClinica>().HasData(
                new HistoriaClinica
                {
                    Id = 1,
                    Fecha = DateTime.Parse("2025-07-14"),
                    Diagnostico = "Esterilización",
                    Tratamiento = "Antibiótico por 7 días",
                    Observaciones = "Reposo",
                    PacienteId = 1
                },
                 new HistoriaClinica
                 {
                     Id = 2,
                     Fecha = DateTime.Parse("2025-07-14"),
                     Diagnostico = "Gastroenteritis Leve",
                     Tratamiento = "Ninguno",
                     Observaciones = "Ninguno",
                     PacienteId = 2
                 }
            );
        }
    }
}
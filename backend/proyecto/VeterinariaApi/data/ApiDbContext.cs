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


        }
    }
}
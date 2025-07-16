using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace VeterinariaApi.Migrations
{
    /// <inheritdoc />
    public partial class SeedDataInicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Clientes",
                columns: new[] { "Id", "Direccion", "Email", "Nombre", "Telefono" },
                values: new object[,]
                {
                    { 1, null, "juan@example.com", "Juan Pérez", "123456789" },
                    { 2, null, "ElMartinez@example.com", "Eliana Martinez", "987654321" },
                    { 3, null, "p@example", "Paula", "213123123213" }
                });

            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "Id", "Email", "Nombre", "PasswordHash", "Rol" },
                values: new object[,]
                {
                    { 1, "agustina@example.com", "Natalia", "$2a$11$tK80SDdgUIM6nNduZ3BqPOANpF8VN/uMRfY6dYcFftCU8IvyUdQjO", "Admin" },
                    { 2, "sandra@example.com", "Sandra López", "$2a$11$MDgWtSRIViG1VW9vT1kpjuoUvI/X.BWUeXxHVFdm3N4m7K1ss3Qty", "Recepcionista" },
                    { 3, "marceloG@gmail.com", "Marcelo ", "$2a$11$Gr81xWNUyM6UtROkBi7RM.SQW130IAepNQLvj7FDW.DKR0apPAfsm", "Veterinario" }
                });

            migrationBuilder.InsertData(
                table: "Pacientes",
                columns: new[] { "Id", "ClienteId", "Edad", "Especie", "Nombre", "Peso", "Raza" },
                values: new object[,]
                {
                    { 1, 1, 4, "perra", "luna", 0f, "caniche" },
                    { 2, 2, 3, "perro", "roco", 0f, "labrador" }
                });

            migrationBuilder.InsertData(
                table: "HistoriaClinica",
                columns: new[] { "Id", "Diagnostico", "Fecha", "Observaciones", "PacienteId", "Tratamiento" },
                values: new object[,]
                {
                    { 1, "Esterilización", new DateTime(2025, 7, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Reposo", 1, "Antibiótico por 7 días" },
                    { 2, "Gastroenteritis Leve", new DateTime(2025, 7, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ninguno", 2, "Ninguno" }
                });

            migrationBuilder.InsertData(
                table: "Turnos",
                columns: new[] { "Id", "Estado", "FechaHora", "Notas", "PacienteId", "VeterinarioId" },
                values: new object[] { 1, "Atendido", new DateTime(2025, 7, 14, 0, 31, 0, 0, DateTimeKind.Unspecified), "Paciente revisado, en buen estado", 1, 3 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Clientes",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "HistoriaClinica",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "HistoriaClinica",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Turnos",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Pacientes",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Pacientes",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Clientes",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Clientes",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}

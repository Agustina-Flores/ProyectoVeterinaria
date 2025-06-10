namespace VeterinariaApi.Models
{
    public class Cliente
    {
        public int Id { get; set; }

        public string Nombre { get; set; }

        public string Telefono { get; set; }

        public string? Direccion { get; set; }

        public string? Email { get; set; }

        // Relación con mascotas (uno a muchos)
        public List<Paciente> Mascotas { get; set; } = new();
    }
}
namespace VeterinariaApi.Models
{
    public class Turno
    {
        public int Id { get; set; }
        public DateTime FechaHora { get; set; }
        public string Estado { get; set; }

        // Foreign keys
        public int PacienteId { get; set; }
        public int VeterinarioId { get; set; }

        // Propiedades de navegación
        public Paciente Paciente { get; set; }
        public Usuario Veterinario { get; set; }
        public string Notas { get; set; }  //  observaciones


    }
}
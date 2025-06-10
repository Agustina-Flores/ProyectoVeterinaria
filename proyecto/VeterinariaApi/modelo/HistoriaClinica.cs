namespace VeterinariaApi.Models
{
    public class HistoriaClinica
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public string Diagnostico { get; set; }
        public string Tratamiento { get; set; }
        public string Observaciones { get; set; }

        public int PacienteId { get; set; }  // FK a mascota
        public Paciente? Paciente { get; set; }  // Navegación
    }
}
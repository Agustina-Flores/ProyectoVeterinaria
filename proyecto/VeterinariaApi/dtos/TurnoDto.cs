public class TurnoDto
{
    public DateTime FechaHora { get; set; }
    public string Estado { get; set; }
    public int PacienteId { get; set; }
    public int VeterinarioId { get; set; }
    public string? Notas { get; set; } // Opcional
}
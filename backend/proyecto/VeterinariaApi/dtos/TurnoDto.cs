using System.ComponentModel.DataAnnotations;
public class TurnoDto
{
    [Required(ErrorMessage = "Fecha es obligatorio")]
    public DateTime FechaHora { get; set; }

    [Required(ErrorMessage = "Estado es obligatorio")]
    public string Estado { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "El paciente es obligatorio")]
    public int PacienteId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "El veterinario es obligatorio")]
    public int VeterinarioId { get; set; }
    public string? Notas { get; set; }
}
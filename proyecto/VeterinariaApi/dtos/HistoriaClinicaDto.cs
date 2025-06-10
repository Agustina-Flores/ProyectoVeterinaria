using System.ComponentModel.DataAnnotations;
public class HistoriaClinicaDto
{
    [Required(ErrorMessage = "Fecha es obligatorio")]
    public DateTime Fecha { get; set; }

    [Required(ErrorMessage = "Diagnostico es obligatorio")]
    public string Diagnostico { get; set; }

    [Required(ErrorMessage = "Tratamiento es obligatorio")]
    public string Tratamiento { get; set; }

    [Required(ErrorMessage = "Observaciones son obligatorias")]
    public string Observaciones { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "El paciente es obligatorio")]
    public int PacienteId { get; set; }
}

using System.ComponentModel.DataAnnotations;
public class PacienteDto
{
    [Required(ErrorMessage = "El nombre es obligatorio")]
    public string Nombre { get; set; }

    [Required(ErrorMessage = "Edad es obligatorio")]
    public int Edad { get; set; }

    [Required(ErrorMessage = "Raza es obligatorio")]
    public string Raza { get; set; }

    [Required(ErrorMessage = "Especie es obligatorio")]
    public string Especie { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "El cliente es obligatorio")]
    public int ClienteId { get; set; }
}
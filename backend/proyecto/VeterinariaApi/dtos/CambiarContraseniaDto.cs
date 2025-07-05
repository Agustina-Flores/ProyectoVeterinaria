using System.ComponentModel.DataAnnotations;
public class CambiarContraseniaDto
{
    [Required]
    public string PasswordActual { get; set; }

    [Required]
    [MinLength(6)]
    public string NuevaPassword { get; set; }
}
using System.ComponentModel.DataAnnotations;
public class ClienteDto
{
    [Required(ErrorMessage = "El nombre es obligatorio")]
    public string Nombre { get; set; }

    [Required(ErrorMessage = "El telefono es obligatorio")]
    public string Telefono { get; set; }

    [EmailAddress(ErrorMessage = "Formato de email inválido")]
    [Required(ErrorMessage = "El email es obligatorio")]
    public string Email { get; set; }
}
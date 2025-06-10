using System.ComponentModel.DataAnnotations;
public class RegisterDto
{
    [Required(ErrorMessage = "El nombre es obligatorio")]
    public string Nombre { get; set; }

    [Required(ErrorMessage = "El Email es obligatorio")]
    [EmailAddress(ErrorMessage = "Formato de email inválido")]
    public string Email { get; set; }

    [Required(ErrorMessage = "La contraseña es obligatoria")]
    public string Password { get; set; }

    [Required(ErrorMessage = "El Rol es obligatorio")]
    public string Rol { get; set; }
}
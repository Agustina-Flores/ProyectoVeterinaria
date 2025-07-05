using System.ComponentModel.DataAnnotations;
public class EditarUsuarioDto
{
    [Required(ErrorMessage = "El nombre es obligatorio")]
    public string Nombre { get; set; }

    [Required(ErrorMessage = "El Email es obligatorio")]
    [EmailAddress(ErrorMessage = "Formato de email inválido")]
    public string Email { get; set; }

    [Required(ErrorMessage = "El Rol es obligatorio")]
    public string Rol { get; set; }

    // Opcional: si querés permitir editar la contraseña desde este mismo formulario
    public string? NuevaPassword { get; set; }
}
using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using VeterinariaApi.Data;
using VeterinariaApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
namespace VeterinariaApi.Controllers
{

    [ApiController]
    [Route("api/[controller]")]

    public class AuthController : ControllerBase
    {

        private readonly ApiDbContext _context;
        private readonly IConfiguration _config;


        public AuthController(ApiDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        //api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var user = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == dto.Email);
                if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                    return Unauthorized("Credenciales inválidas");

                var token = GenerateJwtToken(user);
                return Ok(new
                {
                    token,
                    usuario = new
                    {
                        user.Nombre,
                        user.Email,
                        user.Rol
                    }
                });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { mensaje = "Ocurrió un error inesperado", detalle = ex.Message });
            }

        }

        //api/auth/register
        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var rolesValidos = new[] { "Admin", "Veterinario", "Recepcionista" };

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                if (!rolesValidos.Contains(dto.Rol))
                    return BadRequest(new { mensaje = "Rol inválido" });

                var existe = await _context.Usuarios.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower());
                if (existe) return BadRequest(new { mensaje = "El email ya está registrado" });

                var user = new Usuario
                {
                    Nombre = dto.Nombre,
                    Email = dto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Rol = dto.Rol
                };

                _context.Usuarios.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new { user.Nombre, user.Email, user.Rol, mensaje = "Usuario creado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Ocurrió un error inesperado", detalle = ex.Message });
            }

        }

        [Authorize]//solo logueados
        [HttpGet("dashboard")]
        public IActionResult VerClaims()
        {
            var data = new
            {
                message = "Bienvenido al Dashboard",
                fecha = DateTime.UtcNow,
                usuario = User.Identity.Name // en este punto, debería estar garantizado
            };

            return Ok(data);
        }

        //api/auth/usuarios
        [Authorize(Roles = "Admin")]
        [HttpGet("usuarios")]
        public IActionResult ObtenerUsuarios()
        {
            var usuarios = _context.Usuarios
                .Select(u => new
                {
                    u.Id,
                    u.Nombre,
                    u.Email,
                    u.Rol
                }).ToList();

            return Ok(usuarios);
        }

        //api/auth/usuarios/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut("usuarios/{id}")]
        public async Task<IActionResult> EditarUsuarios(int id, [FromBody] EditarUsuarioDto usuarioDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var usuario = await _context.Usuarios.FindAsync(id);
                if (usuario == null)
                    return NotFound(new { mensaje = "Usuario no encontrado" });

                var emailExiste = await _context.Usuarios
                    .AnyAsync(u => u.Email.ToLower() == usuarioDto.Email.ToLower() && u.Id != id);

                if (emailExiste)
                    return BadRequest(new { mensaje = "Ya existe un usuario con ese email" });

                usuario.Nombre = usuarioDto.Nombre;
                usuario.Email = usuarioDto.Email;
                usuario.Rol = usuarioDto.Rol;

                await _context.SaveChangesAsync();
                Console.WriteLine($"Nombre: {usuarioDto.Nombre}, Email: {usuarioDto.Email}, Rol: {usuarioDto.Rol}");
                return Ok(new { mensaje = "Usuario actualizado correctamente", usuario });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Ocurrió un error inesperado", detalle = ex.Message });

            }

        }

        //api/auth/usuarios/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("usuarios/{id}")]
        public async Task<IActionResult> EliminarUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return NotFound(new { mensaje = "Usuario no encontrado" });

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Usuario eliminado correctamente" });
        }
        private string GenerateJwtToken(Usuario user)
        {
            var claims = new[]
             {
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, user.Rol)
            };


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "https://veterinariaApi.com", //Quién va a consumir el token. Por lo general, tu frontend o la misma API.
                audience: "https://veterinariaApi.com",//Quién emite el token (tu backend)
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [Authorize(Roles = "Admin,Recepcionista,Veterinario")]
        [HttpPut("usuarios/cambiar-password/{email}")]
        public async Task<IActionResult> CambiarPassword(string email, [FromBody] CambiarContraseniaDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
            if (usuario == null)
                return NotFound(new { mensaje = "Usuario no encontrado" });


            if (!BCrypt.Net.BCrypt.Verify(dto.PasswordActual, usuario.PasswordHash))
                return BadRequest(new { mensaje = "La contraseña actual no es correcta" });

            usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NuevaPassword);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Contraseña actualizada correctamente" });
        }

        //api/auth/veterinarios
        [Authorize(Roles = "Admin,Recepcionista")]
        [HttpGet("veterinarios")]
        public async Task<IActionResult> GetVeterinarios()
        {
            var veterinarios = await _context.Usuarios
                .Where(u => u.Rol == "Veterinario")
                .Select(u => new
                {
                    u.Id,
                    u.Nombre,
                    u.Email
                })
                .ToListAsync();

            return Ok(veterinarios);
        }
    }
}
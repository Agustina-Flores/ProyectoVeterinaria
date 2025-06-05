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
            var user = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Credenciales inválidas");

            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        //api/auth/register
        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {

            var existe = _context.Usuarios
            .Any(u => u.Email.ToLower() == dto.Email.ToLower());

            if (existe)
                return BadRequest(new { mensaje = "El email ya está registrado" });

            var user = new Usuario
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Rol = dto.Rol
            };

            _context.Usuarios.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Usuario creado");
        }

        [Authorize]//solo usuarios logueados
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
                issuer: "https://veterinariaApi.com",
                audience: "https://veterinariaApi.com",
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
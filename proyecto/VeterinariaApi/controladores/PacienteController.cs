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
    [Route("api/pacientes")]

    public class PacienteController : ControllerBase
    {
        private readonly ApiDbContext _context;

        public PacienteController(ApiDbContext context)
        {
            _context = context;
        }

        //api/pacientes
        [Authorize(Roles = "Admin,Recepcionista,Veterinario")]
        [HttpPost]
        public async Task<IActionResult> CrearPaciente(PacienteDto dto)
        {
            var paciente = new Paciente
            {
                Nombre = dto.Nombre,
                Edad = dto.Edad,
                Especie = dto.Especie,
                Raza = dto.Raza,
                ClienteId = dto.ClienteId
            };

            _context.Pacientes.Add(paciente);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Paciente creado correctamente", paciente });
        }


        //api/pacientes
        [Authorize(Roles = "Admin,Recepcionista,Veterinario")]
        [HttpGet]
        public IActionResult ObtenerPacientes()
        {
            var pacientes = _context.Pacientes
                .Select(p => new
                {
                    p.Id,
                    p.Nombre,
                    p.Edad,
                    p.Raza,
                    p.Especie,
                    p.ClienteId
                }).ToList();

            return Ok(pacientes);
        }


        //api/pacientes/{id}
        [Authorize(Roles = "Admin,Recepcionista,Veterinario")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditarPaciente(int id, PacienteDto pacienteDto)
        {
            var paciente = await _context.Pacientes.FindAsync(id);
            if (paciente == null)
                return NotFound(new { mensaje = "Paciente no encontrado" });

            paciente.Nombre = pacienteDto.Nombre;
            paciente.Edad = pacienteDto.Edad;
            paciente.Raza = pacienteDto.Raza;
            paciente.Especie = pacienteDto.Especie;
            paciente.ClienteId = pacienteDto.ClienteId;
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Paciente actualizado correctamente" });
        }

        //api/pacientes/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarPaciente(int id)
        {
            var paciente = await _context.Pacientes.FindAsync(id);
            if (paciente == null)
                return NotFound(new { mensaje = "Paciente no encontrado" });

            _context.Pacientes.Remove(paciente);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Paciente eliminado correctamente" });
        }
    }
}
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
    [Route("api/turnos")]

    public class TurnoController : ControllerBase
    {
        private readonly ApiDbContext _context;

        public TurnoController(ApiDbContext context)
        {
            _context = context;
        }


        //api/turno
        [Authorize(Roles = "Admin,Recepcionista,Veterinario")]
        [HttpPost]
        public async Task<IActionResult> CrearTurno([FromBody] Turno turno)
        {
            var pacienteExiste = await _context.Pacientes.AnyAsync(p => p.Id == turno.PacienteId);
            if (!pacienteExiste)
                return BadRequest(new { mensaje = "El paciente no existe" });

            var veterinario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Id == turno.VeterinarioId && u.Rol == "Veterinario");
            if (veterinario == null)
                return BadRequest(new { mensaje = "El veterinario no existe o no tiene rol válido" });

            _context.Turnos.Add(turno);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Turno creado correctamente", turno });
        }

        //api/turnos
        [Authorize(Roles = "Admin,Recepcionista,Veterinario")]
        [HttpGet]
        public IActionResult ObtenerTurnos()
        {
            var turnos = _context.Turnos
               .Include(t => t.Paciente)
               .Include(t => t.Veterinario)
               .Select(t => new
               {
                   t.Id,
                   t.FechaHora,
                   t.Estado,
                   Paciente = new
                   {
                       t.Paciente.Id,
                       t.Paciente.Nombre
                   },
                   Veterinario = new
                   {
                       t.Veterinario.Id,
                       t.Veterinario.Nombre
                   },
                   t.Notas
               }).ToList();
            return Ok(turnos);
        }

        //api/turnos/{id}
        [Authorize(Roles = "Admin,Recepcionista,Veterinario")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditarTurnos(int id, TurnoDto turnoDto)
        {
            var turno = await _context.Turnos.FindAsync(id);
            if (turno == null)
                return NotFound(new { mensaje = "Turno no encontrado" });

            turno.FechaHora = turnoDto.FechaHora;
            turno.Estado = turnoDto.Estado;
            turno.PacienteId = turnoDto.PacienteId;
            turno.VeterinarioId = turnoDto.VeterinarioId;

            if (!string.IsNullOrWhiteSpace(turnoDto.Notas))
                turno.Notas = turnoDto.Notas;

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Turno actualizado correctamente" });
        }

        //api/turnos/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarTurno(int id)
        {
            var turno = await _context.Turnos.FindAsync(id);
            if (turno == null)
                return NotFound(new { mensaje = "Turno no encontrado" });

            _context.Turnos.Remove(turno);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Turno eliminado correctamente" });
        }

    }
}

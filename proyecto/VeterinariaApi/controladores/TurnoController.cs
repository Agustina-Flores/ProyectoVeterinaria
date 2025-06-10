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


        //api/turnos
        [Authorize(Roles = "Admin,Recepcionista")]
        [HttpPost]
        public async Task<IActionResult> CrearTurno(TurnoDto turnoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var pacienteExiste = await _context.Pacientes.FirstOrDefaultAsync(p => p.Id == turnoDto.PacienteId);
                if (pacienteExiste == null)
                    return BadRequest(new { mensaje = "El paciente no existe" });

                var veterinario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Id == turnoDto.VeterinarioId && u.Rol == "Veterinario");
                if (veterinario == null)
                    return BadRequest(new { mensaje = "El veterinario no existe o no tiene rol válido" });

                var turno = new Turno
                {
                    FechaHora = DateTime.SpecifyKind(turnoDto.FechaHora, DateTimeKind.Utc),
                    Estado = turnoDto.Estado,
                    PacienteId = turnoDto.PacienteId,
                    VeterinarioId = turnoDto.VeterinarioId,
                    Notas = turnoDto.Notas

                };
                _context.Turnos.Add(turno);
                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Turno creado correctamente", turno });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Ocurrió un error inesperado", detalle = ex.Message });
            }
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
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var turno = await _context.Turnos.FindAsync(id);
                if (turno == null)
                    return NotFound(new { mensaje = "Turno no encontrado" });

                turno.FechaHora = turnoDto.FechaHora.ToUniversalTime();
                turno.Estado = turnoDto.Estado;
                turno.PacienteId = turnoDto.PacienteId;
                turno.VeterinarioId = turnoDto.VeterinarioId;

                if (!string.IsNullOrWhiteSpace(turnoDto.Notas))
                    turno.Notas = turnoDto.Notas;

                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Turno actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Ocurrió un error inesperado", detalle = ex.Message });
            }
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

        //api/turnos/buscar?fecha=2025-06-06&veterinarioId=6
        [HttpGet("buscar")]
        public async Task<IActionResult> BuscarTurnos([FromQuery] DateTime? fecha, [FromQuery] int? veterinarioId)
        {
            var query = _context.Turnos
                .Include(t => t.Paciente)
                .Include(t => t.Veterinario)
                .AsQueryable();

            if (fecha.HasValue)
            {
                var fechaInicio = DateTime.SpecifyKind(fecha.Value.Date, DateTimeKind.Utc);
                var fechaFin = fechaInicio.AddDays(1);

                query = query.Where(t => t.FechaHora >= fechaInicio && t.FechaHora < fechaFin);
            }

            if (veterinarioId.HasValue)
                query = query.Where(t => t.VeterinarioId == veterinarioId.Value);

            var turnos = await query.ToListAsync();
            return Ok(turnos);
        }
    }
}

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
    [Route("api/historias")]
    public class HistoriasClinicasController : ControllerBase
    {
        private readonly ApiDbContext _context;

        public HistoriasClinicasController(ApiDbContext context)
        {
            _context = context;
        }

        //api/historias/paciente/{id}
        [Authorize(Roles = "Admin,Recepcionista,Veterinario")]
        [HttpGet("paciente/{pacienteId}")]
        public async Task<IActionResult> ObtenerHistoriasClinicas(int pacienteId)
        {
            var historias = await _context.HistoriaClinica
            .Where(h => h.PacienteId == pacienteId)
             .Include(h => h.Paciente)
                .Select(h => new HistoriaClinica
                {
                    Id = h.Id,
                    Fecha = h.Fecha,
                    Diagnostico = h.Diagnostico,
                    Tratamiento = h.Tratamiento,
                    Observaciones = h.Observaciones,
                    PacienteId = h.PacienteId,
                    Paciente = h.Paciente
                })
            .OrderByDescending(h => h.Fecha)
            .ToListAsync();

            if (historias == null || historias.Count == 0)
                return NotFound("No se encontraron historias para esta mascota.");

            return Ok(historias);

        }

        //api/historias
        [Authorize(Roles = "Admin,Veterinario")]
        [HttpPost]
        public async Task<IActionResult> CrearHistoria([FromBody] HistoriaClinicaDto historiadto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var historia = new HistoriaClinica
                {
                    Fecha = historiadto.Fecha == default ? DateTime.UtcNow : DateTime.SpecifyKind(historiadto.Fecha, DateTimeKind.Utc),
                    Diagnostico = historiadto.Diagnostico,
                    Tratamiento = historiadto.Tratamiento,
                    Observaciones = historiadto.Observaciones,
                    PacienteId = historiadto.PacienteId
                };

                _context.HistoriaClinica.Add(historia);
                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Historia Clínica creada correctamente", historia });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Ocurrió un error inesperado",
                    detalle = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }
    }
}
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
    [Route("api/clientes")]
    public class ClienteController : ControllerBase
    {
        private readonly ApiDbContext _context;

        public ClienteController(ApiDbContext context)
        {
            _context = context;
        }

        //api/clientes
        [Authorize(Roles = "Admin,Recepcionista")]
        [HttpPost]
        public async Task<IActionResult> CrearCliente(ClienteDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var emailExiste = await _context.Clientes
               .AnyAsync(c => c.Email.ToLower() == dto.Email.ToLower());

                if (emailExiste)
                    return BadRequest(new { mensaje = "Ya existe un cliente con ese email" });

                var cliente = new Cliente
                {
                    Nombre = dto.Nombre,
                    Telefono = dto.Telefono,
                    Email = dto.Email
                };

                _context.Clientes.Add(cliente);
                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Cliente creado correctamente", cliente });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Ocurrió un error inesperado", detalle = ex.Message });
            }

        }

        //api/clientes
        [Authorize(Roles = "Admin,Recepcionista,Veterinario")]
        [HttpGet]
        public async Task<IActionResult> ObtenerClientes()
        {
            var clientes = await _context.Clientes
                .Select(c => new
                {
                    c.Id,
                    c.Nombre,
                    c.Telefono,
                    c.Email
                }).ToListAsync();

            return Ok(clientes);
        }

        //api/clientes/{id}
        [Authorize(Roles = "Admin,Recepcionista")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditarCliente(int id, [FromBody] ClienteDto clienteDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var cliente = await _context.Clientes.FindAsync(id);
                if (cliente == null)
                    return NotFound(new { mensaje = "Cliente no encontrado" });

                var emailExiste = await _context.Clientes
                    .AnyAsync(c => c.Email.ToLower() == clienteDto.Email.ToLower() && c.Id != id);

                if (emailExiste)
                    return BadRequest(new { mensaje = "Ya existe un cliente con ese email" });

                cliente.Nombre = clienteDto.Nombre;
                cliente.Telefono = clienteDto.Telefono;
                cliente.Email = clienteDto.Email;

                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Cliente actualizado correctamente", cliente });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Ocurrió un error inesperado", detalle = ex.Message });

            }

        }

        //api/clientes/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
                return NotFound(new { mensaje = "Cliente no encontrado" });

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Cliente eliminado correctamente" });
        }

        [Authorize(Roles = "Admin,Recepcionista,Veterinario")]
        [HttpGet("{id}/pacientes")] // api/clientes/{id}/pacientes
        public async Task<IActionResult> ObtenerPacientesPorCliente(int id)
        {
            var pacientes = await _context.Pacientes
                .Where(p => p.ClienteId == id)
                .Select(p => new
                {
                    p.Id,
                    p.Nombre,
                    p.Edad,
                    p.Raza,
                    p.Especie,
                    p.ClienteId
                }).ToListAsync();

            return Ok(pacientes);
        }

    }
}


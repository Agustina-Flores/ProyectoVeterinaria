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

        //api/clientes
        [Authorize(Roles = "Admin,Recepcionista")]
        [HttpGet]
        public IActionResult ObtenerClientes()
        {
            var clientes = _context.Clientes
                .Select(c => new
                {
                    c.Id,
                    c.Nombre,
                    c.Telefono,
                    c.Email
                }).ToList();

            return Ok(clientes);
        }

        //api/clientes/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditarCliente(int id, ClienteDto clienteDto)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
                return NotFound(new { mensaje = "Cliente no encontrado" });

            cliente.Nombre = clienteDto.Nombre;
            cliente.Telefono = clienteDto.Telefono;
            cliente.Email = clienteDto.Email;

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Cliente actualizado correctamente" });
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
    }
}


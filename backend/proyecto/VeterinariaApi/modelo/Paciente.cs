namespace VeterinariaApi.Models
{
    public class Paciente
    {
        public int Id { get; set; }

        public string Nombre { get; set; }

        public string Especie { get; set; }

        public string Raza { get; set; }

        public int Edad { get; set; }

        public float Peso { get; set; }

        // Relación con el dueño
        public int ClienteId { get; set; }
        public Cliente Cliente { get; set; }
    }
}
using System.Diagnostics.Eventing.Reader;

namespace ContactInfo.Models.Domain
{
    public class Contact
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Email { get; set; }
        public required string PhoneNumber { get; set; }
        public bool Favorite { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

using ContactInfo.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace ContactInfo.Data
{
    public class ContactInfoDbContext : DbContext
    {
        public ContactInfoDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Contact> Contacts { get; set; }
    }
}

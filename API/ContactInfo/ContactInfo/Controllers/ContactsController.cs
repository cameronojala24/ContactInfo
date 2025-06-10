using ContactInfo.Data;
using ContactInfo.Models;
using ContactInfo.Models.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ContactInfo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ContactInfoDbContext dbContext;

        public ContactsController(ContactInfoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }


        [HttpGet]
        public IActionResult GetContacts()
        {
            var contacts = dbContext.Contacts.ToList();
            return Ok(contacts);
        }

        [HttpPost]
        public IActionResult AddContact(AddContactRequestDTO request) 
        {
            var domainModelContact = new Contact
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Favorite = request.Favorite
            };

            dbContext.Contacts.Add(domainModelContact);
            dbContext.SaveChanges();
            return Ok(domainModelContact);
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult DeleteContact(Guid id)
        {
            var contact = dbContext.Contacts.Find(id);

            if (contact is not null)
            {
                dbContext.Contacts.Remove(contact);
                dbContext.SaveChanges();
            }

            return Ok();
        }

        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult UpdateContact(Guid id, AddContactRequestDTO request)
        {
            var exisitingContact = dbContext.Contacts.Find(id);

            if (exisitingContact == null)
            {
                return NotFound();
            }

            exisitingContact.Name = request.Name;
            exisitingContact.Email = request.Email;
            exisitingContact.PhoneNumber = request.PhoneNumber;
            exisitingContact.Favorite = request.Favorite;

            dbContext.SaveChanges();

            return Ok(exisitingContact);
        }
    }
}

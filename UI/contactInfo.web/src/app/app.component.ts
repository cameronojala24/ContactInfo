import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  http = inject(HttpClient);

  isEditMode = false;
  editingContactId: string | null = null;
  
  showFavoritesOnly = false;

  contactsForm = new FormGroup({
    name: new FormControl<string>(''),
    email: new FormControl<string | null>(null),
    phoneNumber: new FormControl<string>(''),
    favorite: new FormControl<boolean>(false)
  });

  contacts$ = this.getContacts();
  contacts: Contact[] = [];

  ngOnInit() {
    this.getContacts().subscribe(data => {
      this.contacts = data;
    });
  }
  
  get filteredContacts() {
    return this.contacts?.filter(c => !this.showFavoritesOnly || c.favorite) || [];
  }
  
  onFormSubmit() {
    const contactData = {
      name: this.contactsForm.value.name,
      email: this.contactsForm.value.email,
      phoneNumber: this.contactsForm.value.phoneNumber,
      favorite: this.contactsForm.value.favorite,
    };

    if (this.isEditMode && this.editingContactId) {
      // Update existing contact
      this.http.put(`https://localhost:7117/api/Contacts/${this.editingContactId}`, contactData)
      .subscribe({
        next: () => {
          this.contacts$ = this.getContacts();
          this.contacts$.subscribe(data => {
            this.contacts = data;
          });
          this.contactsForm.reset();
          this.isEditMode = false;
          this.editingContactId = null;
        }
      });
    } else {
      // Add new contact
      this.http.post('https://localhost:7117/api/Contacts', contactData)
      .subscribe({
        next: () => {
          this.contacts$ = this.getContacts();
          this.contacts$.subscribe(data => {
            this.contacts = data;
          });
          this.contactsForm.reset();
        }
      });
    }
  }

  onDelete(id: string) {
    this.http.delete(`https://localhost:7117/api/Contacts/${id}`)
    .subscribe({
      next: (value) => {
        alert('Item deleted')
        this.contacts$ = this.getContacts();
        this.contacts$.subscribe(data => {
            this.contacts = data;
        });
      }
    });
  }

  onEdit(contact: Contact) {
    this.contactsForm.setValue({
      name: contact.name,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      favorite: contact.favorite
    });

    this.isEditMode = true;
    this.editingContactId = contact.id;
  }
  
  onCancelEdit() {
    this.contactsForm.reset();
    this.isEditMode = false;
    this.editingContactId = null;
  }

  private getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('https://localhost:7117/api/Contacts');
  }
}

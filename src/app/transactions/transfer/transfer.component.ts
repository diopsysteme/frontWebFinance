import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Contact {
  id: number;
  nom: string;
  telephone: string;
  prenom?: string;
  isFavorite?: boolean;
  name?: string;
}

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent {
  searchForm = new FormGroup({
    searchTerm: new FormControl<string | null>('', Validators.required)
  });

  contactForm = new FormGroup({
    name: new FormControl<string | null>('', Validators.required),
    phoneNumber: new FormControl<string | null>('', [
      Validators.required,
      Validators.pattern('^\\+?[1-9][0-9]{7,14}$')
    ])
  });

  transferForm = new FormGroup({
    receiverId: new FormControl<number | null>(null, Validators.required),
    montant: new FormControl<number | null>(null, [Validators.required, Validators.min(1)])
  });

  contacts: Contact[] = [];
  favoriteContacts: Contact[] = [];
  error: string = '';
  success: boolean = false;
  showContactForm: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchContacts();
  }

  fetchContacts(searchTerm: string = '') {
    const url = searchTerm ? `/test1/contacts?search=${searchTerm}` : `/test1/contacts`;
    this.apiService.get(url).pipe(
      catchError((err) => {
        this.error = 'Erreur lors de la récupération des contacts. Veuillez réessayer plus tard.';
        return of(null);
      })
    ).subscribe((response) => {
      if (response) {
        this.contacts = response.data.contacts;
        this.favoriteContacts = this.contacts.filter((contact) => contact.isFavorite);
      }
    });
  }

  handleTransfer() {
    if (this.transferForm.invalid) return;

    this.apiService.sendRequest('/transfer/send', this.transferForm.value).pipe(
      catchError((err) => {
        this.error = 'Erreur lors du transfert. Veuillez réessayer plus tard.';
        this.success = false;
        return of(null);
      })
    ).subscribe((response) => {
      if (response) {
        this.success = true;
        this.error = '';
        this.transferForm.reset();
      }
    });
  }

  toggleContactForm() {
    this.showContactForm = !this.showContactForm;
  }

  saveContact() {
    if (this.contactForm.invalid) return;

    this.apiService.sendRequest('test1/contacts', {nom:this.contactForm.value.name,telephone:this.contactForm.value.phoneNumber}).pipe(
      catchError((err) => {
        this.error = 'Erreur lors de lenregistrement du contact. Veuillez réessayer.';
        return of(null);
      })
    ).subscribe((newContact) => {
      // console.log(newContact);
      if (newContact) {
        this.contacts.push(newContact.data);
        if (newContact.isFavorite) {
          this.favoriteContacts.push(newContact);
        }
        this.contactForm.reset();
        this.showContactForm = false;
        this.selectContact(newContact);
      }
    });
  }

  selectContact(contact: Contact) {
    this.transferForm.get('receiverId')!.setValue(contact.id);
  }
}

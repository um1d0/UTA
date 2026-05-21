import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  submitted = false;
  showToast = false;

  form = {
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  };

  onSubmit() {
    this.submitted = true;
    const { firstName, lastName, email, subject, message } = this.form;
    if (!firstName || !lastName || !email || !subject || !message) return;

    this.showToast = true;
    this.submitted = false;
    this.form = { firstName: '', lastName: '', email: '', subject: '', message: '' };
    setTimeout(() => (this.showToast = false), 4000);
  }
}
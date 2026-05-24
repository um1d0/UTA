import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-userprofile',
  imports: [FormsModule, RouterLink],
  templateUrl: './userprofile.html',
  styleUrl: './userprofile.css',
})
export class Userprofile implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  user = signal<any>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  saveMessage = signal('');

  profileForm = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    pictureUrl: '',
    dateOfBirth: '',
  };

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.saveMessage.set('');

    this.http.get('https://shopapi.stepacademy.ge/api/users/me').subscribe({
      next: (response: any) => {
        const user = response?.data ?? response;
        this.applyProfile(user);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.saveMessage.set('Profile could not be loaded.');
      },
    });
  }

  saveProfile(): void {
    this.isSaving.set(true);
    this.saveMessage.set('');

    const details = {
      phoneNumber: this.toNullableString(this.profileForm.phoneNumber),
      address: this.toNullableString(this.profileForm.address),
      pictureUrl: this.toNullableString(this.profileForm.pictureUrl),
      dob: this.toIsoDateTime(this.profileForm.dateOfBirth),
    };

    const payload = {
      firstName: this.profileForm.firstName.trim(),
      lastName: this.profileForm.lastName.trim(),
      email: this.profileForm.email.trim(),
      details,
    };

    this.http.put('https://shopapi.stepacademy.ge/api/users', payload).subscribe({
      next: (response: any) => {
        const currentUser = this.user() ?? {};
        const mergedUser = {
          ...currentUser,
          ...payload,
          details: {
            ...(currentUser?.details ?? {}),
            ...details,
          },
        };

        const savedUser = response?.data ?? (this.hasProfileData(response) ? response : mergedUser);
        this.applyProfile(savedUser);
        this.isSaving.set(false);
        this.saveMessage.set('Profile updated successfully.');
      },
      error: (error: any) => {
        this.isSaving.set(false);
        this.saveMessage.set(error?.error?.message ?? 'Profile could not be updated.');
      },
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  initials(): string {
    const first = this.profileForm.firstName?.[0] ?? '';
    const last = this.profileForm.lastName?.[0] ?? '';
    return `${first}${last}`.toUpperCase() || 'U';
  }

  private applyProfile(user: any): void {
    const details = user?.details ?? {};
    const currentUser = this.user() ?? {};
    const nextUser = {
      ...currentUser,
      ...user,
      details: {
        ...(currentUser?.details ?? {}),
        ...details,
      },
    };

    this.user.set(nextUser);
    this.profileForm = {
      firstName: nextUser?.firstName ?? this.profileForm.firstName,
      lastName: nextUser?.lastName ?? this.profileForm.lastName,
      email: nextUser?.email ?? this.profileForm.email,
      phoneNumber: nextUser?.details?.phoneNumber ?? this.profileForm.phoneNumber,
      address: nextUser?.details?.address ?? this.profileForm.address,
      pictureUrl: nextUser?.details?.pictureUrl ?? this.profileForm.pictureUrl,
      dateOfBirth: this.toDateInputValue(
        nextUser?.details?.dob ?? nextUser?.details?.dateOfBirth ?? this.profileForm.dateOfBirth
      ),
    };
  }

  private toDateInputValue(value: string | null | undefined): string {
    if (!value) return '';
    return value.slice(0, 10);
  }

  private hasProfileData(value: any): boolean {
    return !!value && typeof value === 'object' && Object.keys(value).length > 0;
  }

  private toNullableString(value: string): string | null {
    return value.trim() || null;
  }

  private toIsoDateTime(value: string): string | null {
    if (!value) return null;
    return `${value}T00:00:00`;
  }
}
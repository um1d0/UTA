import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { Register } from './register';
import { Auth } from '../../../shared/services/auth';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let auth: Auth;
  let httpClient: { post: ReturnType<typeof vi.fn> };
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    httpClient = {
      post: vi.fn(() => of(null)),
    };
    router = {
      navigateByUrl: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        Auth,
        { provide: HttpClient, useValue: httpClient },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    auth = TestBed.inject(Auth);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('stores the registered email before opening the verification page', () => {
    component.registerData.email = 'student@example.com';

    component.onSubmit();

    expect(auth.pendingEmail()).toBe('student@example.com');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/verify-email');
  });
});

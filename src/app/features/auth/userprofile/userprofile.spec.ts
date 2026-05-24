import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Userprofile } from './userprofile';

describe('Userprofile', () => {
  let component: Userprofile;
  let fixture: ComponentFixture<Userprofile>;
  let httpClient: { get: ReturnType<typeof vi.fn>; put: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    httpClient = {
      get: vi.fn(() =>
        of({
          data: {
            firstName: 'First',
            lastName: 'Last',
            email: 'user@example.com',
            role: 'User',
            details: {
              phoneNumber: '555123456',
              address: 'Tbilisi',
              dob: '2000-01-01T00:00:00',
              pictureUrl: '',
            },
          },
        }),
      ),
      put: vi.fn(() => of({})),
    };

    await TestBed.configureTestingModule({
      imports: [Userprofile],
      providers: [
        provideRouter([]),
        {
          provide: HttpClient,
          useValue: httpClient,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Userprofile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save editable details inside the details payload', () => {
    component.profileForm = {
      firstName: 'First',
      lastName: 'Last',
      email: 'user@example.com',
      phoneNumber: '555000111',
      address: 'Batumi',
      pictureUrl: 'https://example.com/me.jpg',
      dateOfBirth: '1999-05-10',
    };

    component.saveProfile();

    expect(httpClient.put).toHaveBeenCalledWith('https://shopapi.stepacademy.ge/api/users', {
      firstName: 'First',
      lastName: 'Last',
      email: 'user@example.com',
      details: {
        phoneNumber: '555000111',
        address: 'Batumi',
        pictureUrl: 'https://example.com/me.jpg',
        dob: '1999-05-10T00:00:00',
      },
    });
  });
});

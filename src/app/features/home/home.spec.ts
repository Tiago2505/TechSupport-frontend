import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Home } from './home';
import { AuthService } from '../../core/services/auth.service';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    TestBed.inject(AuthService).setMockUser('USER');
    fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders four metric cards with the client status labels', () => {
    const labels = Array.from(
      fixture.nativeElement.querySelectorAll('.home__metric .ts-card__label') as NodeListOf<HTMLElement>,
    ).map((el) => el.textContent?.trim());

    expect(labels).toEqual(['Pendientes', 'En proceso', 'Resueltos', 'Cerrados']);
  });

  it('lists only the tickets reported by the current user', () => {
    const body = fixture.nativeElement.querySelector('.ts-table tbody') as HTMLElement;
    const text = body.textContent ?? '';

    expect(text).toContain('TS-1001'); // reported by Lucía Fernández
    expect(text).not.toContain('TS-1002'); // reported by Pedro Salas
  });

  it('exposes a highlighted call to action to create a new ticket', () => {
    const cta = fixture.nativeElement.querySelector('a.ts-btn-primary') as HTMLAnchorElement;
    expect(cta).not.toBeNull();
    expect(cta.textContent?.trim()).toContain('Crear Nuevo Ticket');
    expect(cta.getAttribute('href')).toBe('/dashboard/tickets/new');
  });
});

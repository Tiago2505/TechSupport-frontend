import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, provideRouter } from '@angular/router';

import { NewTicket } from './new-ticket';

function configure(queryParams: Record<string, string>) {
  const paramMap: ParamMap = convertToParamMap(queryParams);
  return TestBed.configureTestingModule({
    imports: [NewTicket],
    providers: [
      provideRouter([]),
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: paramMap } } },
    ],
  }).compileComponents();
}

describe('NewTicket', () => {
  let fixture: ComponentFixture<NewTicket>;

  it('starts with an empty form when there are no query params', async () => {
    await configure({});
    fixture = TestBed.createComponent(NewTicket);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.form.get('title')?.value).toBe('');
    expect(component.form.get('description')?.value).toBe('');
    expect(component.prefilled()).toBeFalse();
  });

  it('pre-fills the title and description from the query params', async () => {
    await configure({
      title: 'El equipo no enciende',
      description: 'Sin luces ni ventiladores tras revisar la corriente.',
    });
    fixture = TestBed.createComponent(NewTicket);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.form.get('title')?.value).toBe('El equipo no enciende');
    expect(component.form.get('description')?.value).toBe(
      'Sin luces ni ventiladores tras revisar la corriente.',
    );
    expect(component.prefilled()).toBeTrue();

    const banner = fixture.nativeElement.querySelector('.nt-alert--info');
    expect(banner).not.toBeNull();
  });

  it('does not mark the form as submitted while it is invalid', async () => {
    await configure({});
    fixture = TestBed.createComponent(NewTicket);
    fixture.detectChanges();

    fixture.componentInstance.onSubmit();
    expect(fixture.componentInstance.submitted()).toBeFalse();
  });

  it('marks the form as submitted once it is valid', async () => {
    await configure({
      title: 'Impresora sin red',
      description: 'La impresora de planta no aparece en la red desde ayer.',
    });
    fixture = TestBed.createComponent(NewTicket);
    fixture.detectChanges();

    fixture.componentInstance.onSubmit();
    expect(fixture.componentInstance.submitted()).toBeTrue();
  });
});

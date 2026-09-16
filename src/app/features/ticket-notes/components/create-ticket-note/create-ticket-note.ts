import { Component, effect, inject, input, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketNoteService } from '@features/ticket-notes/services/ticket-note.service';
import { EMPTY } from 'rxjs';
import { ErrorMessage } from '@shared/components/error-message/error-message';
import { SuccessMessage } from '@shared/components/success-message/success-message';
import { IsLoading } from '@shared/components/is-loading/is-loading';
import { HandleError } from '@shared/helpers';
import { TicketNoteEntity } from '@features/ticket-notes/entities/ticket-note.entity';

@Component({
  selector: 'create-ticket-note',
  imports: [ErrorMessage, SuccessMessage, IsLoading, ReactiveFormsModule],
  templateUrl: './create-ticket-note.html',
})
export class CreateTicketNote {

  constructor(){
    effect(()=>{
      if(this.createTicketNoteRxResource.hasValue() && this.createTicketNoteButtonPressed()){

        this.ticketNoteCreated.set(this.createTicketNoteRxResource.value());

        this.showMessageTimeout();

        this.reloadTimeout();
      }else if(this.createTicketNoteRxResource.error() && this.createTicketNoteButtonPressed()){
        this.showMessageTimeout();
      }
    });
  }

  ticketId = input.required<number>();


  formBuilder = inject(FormBuilder);
  ticketNoteService = inject(TicketNoteService);

  ticketNoteContent = signal<string>('');
  ticketNoteCreated = signal<TicketNoteEntity | null>(null);
  showMessage = signal<boolean>(false);
  createTicketNoteButtonPressed = signal<boolean>(false);

  createTicketNoteForm: FormGroup = this.formBuilder.group({
    content: ['', [Validators.required]]
  });

  createTicketNoteRxResource = rxResource({
    params: ()=>({ticketId: this.ticketId(), ticketNoteContent: this.ticketNoteContent()}),
    stream: ({params})=>{
      if(!params.ticketNoteContent || !params.ticketId) return EMPTY;


      return this.ticketNoteService.createTicketNote(params.ticketId, params.ticketNoteContent);
    }
  });

  createTicketNoteButton(){

    if(this.createTicketNoteForm.invalid) return this.createTicketNoteForm.markAllAsTouched();


    this.createTicketNoteButtonPressed.set(true);

    this.ticketNoteContent.set(this.createTicketNoteForm.get('content')?.value);

  }

  showMessageTimeout(){
    this.showMessage.set(true);
    setTimeout(() => {
      this.showMessage.set(false);
    }, 2000);
  }

  reloadTimeout(){
    setTimeout(() => {
      location.reload();
    }, 2000);
  }

  getErrorMessage(formControl: AbstractControl, fieldName: string): string{
    return HandleError.getErrorMessage(formControl, fieldName);
  }

  clearField(){
    this.createTicketNoteForm.get('content')?.setValue('');
  }
}

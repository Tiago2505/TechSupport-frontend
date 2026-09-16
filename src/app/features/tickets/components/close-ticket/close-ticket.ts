
import { Component, effect, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketService } from '@features/tickets/services/ticket.service';
import { EMPTY } from 'rxjs';
import { ErrorMessage } from '@shared/components/error-message/error-message';
import { SuccessMessage } from '@shared/components/success-message/success-message';
import { IsLoading } from '@shared/components/is-loading/is-loading';
import { HandleError } from '@shared/helpers';

@Component({
  selector: 'close-ticket',
  imports: [ErrorMessage, SuccessMessage, IsLoading, ReactiveFormsModule],
  templateUrl: './close-ticket.html',
})
export class CloseTicket {

  constructor(){
    effect(()=>{
      if(this.closeTicketRxResource.hasValue() && this.closeTicketButtonPressed()){

        this.ticketClosed.set(true);

        this.showMessageTimeout();

        this.reloadTimeout()

      }else if(this.closeTicketRxResource.error() && this.closeTicketButtonPressed()){
        this.showMessageTimeout();
      }
    });
  }

  ticketId = input.required<number>();

  formBuilder = inject(FormBuilder);
  ticketService = inject(TicketService);

  ticketResolution = signal<string>('');
  showMessage = signal<boolean>(false);
  ticketClosed = signal<boolean>(false);
  closeTicketButtonPressed = signal<boolean>(false);

  closeTicketForm : FormGroup = this.formBuilder.group({
    resolution: ['', Validators.required]
  });

  closeTicketRxResource = rxResource({
    params: ()=>({ticketId: this.ticketId(), ticketResolution: this.ticketResolution()}),
    stream: ({params})=>{
      if(!params.ticketResolution || !params.ticketId) return EMPTY;

      return this.ticketService.closeTicket(params.ticketId, params.ticketResolution);
    }

  });

  closeTicketButton(){
    if(this.closeTicketForm.invalid) return this.closeTicketForm.markAllAsTouched();

    this.closeTicketButtonPressed.set(true);

    this.ticketResolution.set(this.closeTicketForm.get('resolution')?.value);

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
    this.closeTicketForm.get('resolution')?.setValue('');
  }


}

import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateTicketDto } from '@features/tickets/dtos';
import { TicketService } from '@features/tickets/services/ticket.service';
import { UserEntity } from '@features/users/entities';
import { UserService } from '@features/users/services/user.service';
import { EMPTY } from 'rxjs';
import { ImageGrid } from '@shared/components/image-grid/image-grid';
import { FormSectionHeader } from './form-section-header/form-section-header';
import { TicketImagesSectionHeader } from './ticket-images-section-header/ticket-images-section-header';
import { TicketInformationSectionHeader } from './ticket-information-section-header/ticket-information-section-header';
import { TicketConfigurationSectionHeader } from './ticket-configuration-section-header/ticket-configuration-section-header';
import { TicketDeviceInformationSectionHeader } from './ticket-device-information-section-header/ticket-device-information-section-header';
import { TicketAdditionalInformationSectionHeader } from './ticket-additional-information-section-header/ticket-additional-information-section-header';
import { CreateTicketButtonIcon } from './create-ticket-button-icon/create-ticket-button-icon';
import { IsLoading } from '@shared/components/is-loading/is-loading';
import { SuccessMessage } from '@shared/components/success-message/success-message';
import { ErrorMessage } from '@shared/components/error-message/error-message';
import { HandleError } from '@shared/helpers';
import { NavigationService } from '@shared/services/navigation.service';

@Component({
  selector: 'app-create-ticket',
  imports: [
    ReactiveFormsModule,
    ImageGrid,
    FormSectionHeader,
    TicketImagesSectionHeader,
    TicketInformationSectionHeader,
    TicketConfigurationSectionHeader,
    TicketDeviceInformationSectionHeader,
    TicketAdditionalInformationSectionHeader,
    CreateTicketButtonIcon,
    IsLoading,
    SuccessMessage,
    ErrorMessage
],
  templateUrl: './create-ticket.html',
})
export class CreateTicket {
  constructor() {
    effect(() => {
      if (this.getAllUsersRxResource.hasValue()) {
        this.allUsers.set(this.getAllUsersRxResource.value());
      }
    });

    effect(()=>{
      if(this.createTicketRxResource.hasValue() && this.createTicketButtonPressed()){

        this.ticketCreated.set(true);

        this.showMessageTimeout();

        this.goToMyTickets();
      }else if(this.createTicketRxResource.error() && this.createTicketButtonPressed()){
        this.showMessageTimeout();
      }
    });
  }

  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  ticketService = inject(TicketService);
  navigationService = inject(NavigationService);

  allUsers = signal<UserEntity[]>([]);
  createTicketDto = signal<FormData | null>(null);
  manyImages = signal<boolean>(false);
  images = signal<File[]>([]);
  ticketCreated = signal<boolean>(false);
  showMessage =signal<boolean>(false);
  createTicketButtonPressed = signal<boolean>(false);

  createTicketForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    status: ['OPEN'],
    priority: ['MEDIUM'],
    categoryTicket: ['SOFTWARE'],
    technicianId: [null],
    deviceType: ['DESKTOP'],
    deviceBrand: [null],
    deviceModel: [null],
    operatingSystem: ['WINDOWS'],
  });

  getAllUsersRxResource = rxResource({
    stream: () => this.userService.getAll(),
  });

  createTicketRxResource = rxResource({
    params: () => ({ createTicketDto: this.createTicketDto() }),
    stream: ({ params }) => {
      if (!params.createTicketDto) return EMPTY;

      return this.ticketService.createTicket(params.createTicketDto);
    },
  });

  createTicketButton() {
    if (this.createTicketForm.invalid) return this.createTicketForm.markAllAsTouched();

    if (this.manyImages()) return;

    const ticketData: CreateTicketDto = {
      title: this.createTicketForm.get('title')?.value,
      description: this.createTicketForm.get('description')?.value,
      status: this.createTicketForm.get('status')?.value,
      priority: this.createTicketForm.get('priority')?.value,
      categoryTicket: this.createTicketForm.get('categoryTicket')?.value,
      technicianId: this.createTicketForm.get('technicianId')?.value,
      deviceType: this.createTicketForm.get('deviceType')?.value,
      deviceBrand: this.createTicketForm.get('deviceBrand')?.value,
      deviceModel: this.createTicketForm.get('deviceModel')?.value,
      operatingSystem: this.createTicketForm.get('operatingSystem')?.value,
    };

    const createTicketFormData = new FormData();

    if (this.images().length) {
      this.images().forEach((image) => createTicketFormData.append('images', image));
    }

    createTicketFormData.append('title', ticketData.title);
    createTicketFormData.append('description', ticketData.description);

    if (ticketData.status) createTicketFormData.append('status', ticketData.status);
    if (ticketData.priority) createTicketFormData.append('priority', ticketData.priority);
    if (ticketData.categoryTicket)
      createTicketFormData.append('categoryTicket', ticketData.categoryTicket);
    if (ticketData.technicianId)
      createTicketFormData.append('technicianId', ticketData.technicianId.toString());
    if (ticketData.deviceType) createTicketFormData.append('deviceType', ticketData.deviceType);
    if (ticketData.deviceBrand) createTicketFormData.append('deviceBrand', ticketData.deviceBrand);
    if (ticketData.deviceModel) createTicketFormData.append('deviceModel', ticketData.deviceModel);
    if (ticketData.operatingSystem)
      createTicketFormData.append('operatingSystem', ticketData.operatingSystem);

    this.createTicketButtonPressed.set(true);

    this.createTicketDto.set(createTicketFormData);
  }

  getErrorMessage(formControl: AbstractControl, fieldName: string):string{
    return HandleError.getErrorMessage(formControl, fieldName);
  }

  showMessageTimeout(){
    this.showMessage.set(true);
    setTimeout(() => {
      this.showMessage.set(false);

    }, 2000);
  }

  goToMyTickets(){
    setTimeout(() => {
      this.navigationService.goToMyTickets();
    }, 2000);
  }
}

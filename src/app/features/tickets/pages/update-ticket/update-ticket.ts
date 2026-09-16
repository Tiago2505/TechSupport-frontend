import { Component, effect, inject, signal } from '@angular/core';
import { UpdateTicketFormHeader } from './update-ticket-form-header/update-ticket-form-header';
import { GeneralInformationSectionHeader } from './general-information-section-header/general-information-section-header';
import { ImageGrid } from '@shared/components/image-grid/image-grid';
import { TicketConfigurationSectionHeader } from './ticket-configuration-section-header/ticket-configuration-section-header';
import { DeviceInformationSectionHeader } from './device-information-section-header/device-information-section-header';
import { AdditionalInformationSectionHeader } from './additional-information-section-header/additional-information-section-header';
import { ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs';
import { TicketService } from '@features/tickets/services/ticket.service';
import { EvidenceEntity, TicketEntity } from '@features/tickets/entities';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateTicketDto } from '@features/tickets/dtos';
import { ErrorMessage } from '@shared/components/error-message/error-message';
import { SuccessMessage } from '@shared/components/success-message/success-message';
import { IsLoading } from '@shared/components/is-loading/is-loading';
import { NavigationService } from '@shared/services/navigation.service';

@Component({
  selector: 'update-ticket',
  imports: [
    UpdateTicketFormHeader,
    GeneralInformationSectionHeader,
    ImageGrid,
    TicketConfigurationSectionHeader,
    DeviceInformationSectionHeader,
    AdditionalInformationSectionHeader,
    ReactiveFormsModule,
    ErrorMessage,
    SuccessMessage,
    IsLoading
],
  templateUrl: './update-ticket.html',
})
export class UpdateTicket {
  constructor() {
    effect(() => {
      if (this.getTicketRxResource.hasValue()) {
        this.ticketInformation.set(this.getTicketRxResource.value());

        this.updateTicketForm.patchValue(this.ticketInformation()!);
      }
    });

    effect(() => {
      if (this.updateTicketDtoRxResource.hasValue() && this.updateTicketButtonPressed()) {
        this.ticketUpdated.set(true);

        this.showMessageTimeout();

        setTimeout(() => {
          this.goToTickets();
        }, 2000);

      } else if (this.updateTicketDtoRxResource.error() && this.updateTicketButtonPressed()) {
        this.showMessageTimeout();
      }
    });
  }

  activatedRoute = inject(ActivatedRoute);
  ticketService = inject(TicketService);
  formBuilder = inject(FormBuilder);
  navigationService = inject(NavigationService);

  ticketId = this.activatedRoute.snapshot.paramMap.get('id');
  ticketInformation = signal<TicketEntity | null>(null);
  manyImages = signal<boolean>(false);
  newImages = signal<File[]>([]);
  deletedCurrentImages = signal<EvidenceEntity[]>([]);
  currentImages = signal<EvidenceEntity[]>([]);
  updateTicketFormData = signal<FormData | null>(null);
  showMessage = signal<boolean>(false);
  updateTicketButtonPressed = signal<boolean>(false);
  ticketUpdated = signal<boolean>(false);

  updateTicketForm: FormGroup = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    priority: [null],
    categoryTicket: [null],
    status: [null],
    deviceType: [null],
    deviceBrand: [null],
    deviceModel: [null],
    operatingSystem: [null],
  });

  getTicketRxResource = rxResource({
    params: () => ({ ticketId: this.ticketId }),
    stream: ({ params }) => {
      if (!params.ticketId) return EMPTY;

      return this.ticketService.getTicketById(Number(params.ticketId));
    },
  });

  updateTicketDtoRxResource = rxResource({
    params: () => ({ ticketId: this.ticketId, updateTicketFormData: this.updateTicketFormData() }),
    stream: ({ params }) => {
      if (!params.updateTicketFormData || !params.ticketId) return EMPTY;

      return this.ticketService.updateTicket(Number(params.ticketId), params.updateTicketFormData);
    },
  });

  updateTicketButton() {
    if (this.updateTicketForm.invalid) return this.updateTicketForm.markAllAsTouched();

    if (this.manyImages()) return;

    const updateTicketData: UpdateTicketDto = {
      title: this.updateTicketForm.get('title')?.value,
      description: this.updateTicketForm.get('description')?.value,
      status: this.updateTicketForm.get('status')?.value,
      priority: this.updateTicketForm.get('priority')?.value,
      categoryTicket: this.updateTicketForm.get('categoryTicket')?.value,
      deviceType: this.updateTicketForm.get('deviceType')?.value,
      deviceBrand: this.updateTicketForm.get('deviceBrand')?.value,
      deviceModel: this.updateTicketForm.get('deviceModel')?.value,
      operatingSystem: this.updateTicketForm.get('operatingSystem')?.value,

      currentImages: this.currentImages(),
      deletedCurrentImages: this.deletedCurrentImages(),
    };

    const updateFormData = new FormData();

    if (updateTicketData.title) {
      updateFormData.append('title', updateTicketData.title);
    }
    if (updateTicketData.description) {
      updateFormData.append('description', updateTicketData.description);
    }

    if (updateTicketData.status) {
      updateFormData.append('status', updateTicketData.status);
    }
    if (updateTicketData.priority) {
      updateFormData.append('priority', updateTicketData.priority);
    }
    if (updateTicketData.categoryTicket) {
      updateFormData.append('categoryTicket', updateTicketData.categoryTicket);
    }
    if (updateTicketData.deviceType) {
      updateFormData.append('deviceType', updateTicketData.deviceType);
    }
    if (updateTicketData.deviceBrand) {
      updateFormData.append('deviceBrand', updateTicketData.deviceBrand);
    }
    if (updateTicketData.operatingSystem) {
      updateFormData.append('operatingSystem', updateTicketData.operatingSystem);
    }
    if (updateTicketData.deviceModel) {
      updateFormData.append('deviceModel', updateTicketData.deviceModel);
    }
    if (updateTicketData.currentImages.length) {
      updateFormData.append('currentImages', JSON.stringify(this.currentImages()));
    }
    if (updateTicketData.deletedCurrentImages.length) {
      updateFormData.append('deletedCurrentImages', JSON.stringify(this.deletedCurrentImages()));
    }
    if (this.newImages().length) {
      this.newImages().forEach((file) => {
        updateFormData.append('newImages', file);
      });
    }

    this.updateTicketButtonPressed.set(true);

    this.updateTicketFormData.set(updateFormData);

  }

  showMessageTimeout() {
    this.showMessage.set(true);
    setTimeout(() => {
      this.showMessage.set(false);
    }, 2000);
  }

  goToTickets(){
    this.navigationService.goToTechnicianTickets();
  }
}

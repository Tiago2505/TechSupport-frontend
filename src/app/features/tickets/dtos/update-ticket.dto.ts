import { EvidenceEntity } from '../entities';
import {
  CategoryTicket,
  DeviceType,
  OperatingSystem,
  PriorityTicket,
  StatusTicket,
} from '../enums';
import { CreateTicketDto } from './create-ticket.dto';

export interface UpdateTicketDto {
  title?: string;
  description?: string;
  status?: StatusTicket;
  priority?: PriorityTicket;
  categoryTicket?: CategoryTicket;
  deviceType?: DeviceType;
  deviceBrand?: string;
  deviceModel?: string;
  operatingSystem?: OperatingSystem;
  currentImages: EvidenceEntity[];
  deletedCurrentImages: EvidenceEntity[];
}

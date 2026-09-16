import { CategoryTicket, DeviceType, OperatingSystem, PriorityTicket, StatusTicket } from "../enums";

export interface CreateTicketDto {
  title: string;
  description: string;
  status?: StatusTicket;
  priority?: PriorityTicket;
  categoryTicket?: CategoryTicket;
  technicianId?: number;
  deviceType?: DeviceType;
  deviceBrand?: string;
  deviceModel?: string;
  operatingSystem?: OperatingSystem;
}

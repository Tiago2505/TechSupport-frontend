import { TicketDiagnosisResponse } from "../dtos";
import { CategoryTicket, DeviceType, OperatingSystem, PriorityTicket, StatusTicket } from "../enums";
import { EvidenceEntity } from "./ticket-evidence.entity";

export interface TicketEntity {
  id:              number;
  title:           string;
  description:     string;
  evidence:        EvidenceEntity[];
  status:          StatusTicket;
  priority:        PriorityTicket;
  categoryTicket:  CategoryTicket;
  createdBy:       number;
  technicianId:    number | null;
  deviceType:      DeviceType;
  deviceBrand:     string | null;
  deviceModel:     string | null;
  operatingSystem: OperatingSystem;
  aiDiagnosis:     TicketDiagnosisResponse;
  createdAt:       string;
  deletedAt:       string | null;
  closedAt:        string | null;
  resolution:      string | null;
}

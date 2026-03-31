export interface ISailor {
  id: string;
  lastName: string;
  firstName: string;
  rate: string;
  payGrade: string;
  prd: string;
  eaos: string;
  command: string;
  uic: string;
  billet: string;
  lastContact: string;
  detailer: string;
}

export interface ICommEntry {
  sailorId: string;
  date: string;
  type: 'phone' | 'email' | 'note' | 'teams';
  summary: string;
}

export interface IBillet {
  id: string;
  commandId: string;
  commandName: string;
  rate: string;
  payGrade: string;
  title: string;
  filled: boolean;
  sailorId: string | null;
}

export interface ICommand {
  id: string;
  name: string;
  type: 'Sea' | 'Shore';
  homeport: string;
  billetCount: number;
}

export interface IFormStatus {
  sailorId: string;
  status: 'not_sent' | 'sent' | 'received' | 'overdue';
  sentDate: string | null;
  dueDate: string | null;
  receivedDate: string | null;
}

export interface IFormResponse {
  sailorId: string;
  formType: string;
  submittedDate: string;
  billetChoices: { rank: number; billet: string; command: string; location: string }[];
  geoPreference: string;
  seaShore: string;
  coloStatus: { requested: boolean; spouseInfo: string | null };
  efmpStatus: { enrolled: boolean; category: string | null };
  specialCircumstances: string;
}

export interface IAppointment {
  id: string;
  sailorId: string;
  date: string;
  time: string;
  duration: number;
  type: 'phone' | 'video' | 'in-person';
  reason: string;
  sailor?: {
    lastName: string;
    firstName: string;
    rate: string;
    payGrade: string;
    command: string;
    prd: string;
    eaos: string;
  };
}

export interface ITemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: string;
}

export interface IOrderStatus {
  sailorId: string;
  currentStage: string;
  stageDate: string;
  blockers: string | null;
}

export interface IPipelineStage {
  key: string;
  label: string;
  fullLabel: string;
}

export interface INotification {
  id: string;
  type: string;
  priority: number;
  icon: string;
  title: string;
  message: string;
  sailorId: string;
  date: string;
}

export interface IEscalation {
  sailorId: string;
  sailor: ISailor;
  prdTier: string;
  daysSinceContact: number;
  formStatus: string;
  reasons: string[];
  severity: string;
}

export type PrdTier = 'EXPIRED' | 'CRITICAL' | 'URGENT' | 'WATCH' | 'STABLE';

export interface IPrdResult {
  tier: PrdTier;
  months: number;
  label: string;
  cssClass: string;
}

export interface ICondition {
  column: string;
  operator: string;
  value: string;
}

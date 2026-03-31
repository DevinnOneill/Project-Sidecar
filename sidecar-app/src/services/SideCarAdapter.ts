import type {
  ISailor, ICommEntry, IBillet, ICommand, IFormStatus,
  IAppointment, ITemplate, IOrderStatus, INotification,
  IEscalation, IFormResponse, ICondition
} from '../models/ISailor';
import {
  SYNTHETIC_SAILORS, SYNTHETIC_COMM_LOG, SYNTHETIC_BILLETS,
  SYNTHETIC_COMMANDS, SYNTHETIC_FORM_STATUS, SYNTHETIC_APPOINTMENTS,
  SYNTHETIC_TEMPLATES, SYNTHETIC_ORDER_STATUS, SYNTHETIC_FORM_RESPONSES
} from './SyntheticData';
import { computePRDTier, today, formatDate, parseDate, monthsBetween } from './PrdEngine';

/**
 * SideCarAdapter — C-09 Compliant Data Access Layer
 *
 * All data access routes through this interface.
 * Phase 1A: returns embedded synthetic data.
 * Phase 1B: will call Microsoft Graph API via GCC High.
 * The interface contract does not change between phases.
 */
const dismissedNotificationIds: string[] = [];

export const SideCarAdapter = {
  async getSailors(filters?: {
    rate?: string;
    payGrade?: string;
    prdTier?: string;
    commandId?: string;
  }): Promise<ISailor[]> {
    let results = [...SYNTHETIC_SAILORS];
    if (filters) {
      if (filters.rate) results = results.filter(s => s.rate === filters.rate);
      if (filters.payGrade) results = results.filter(s => s.payGrade === filters.payGrade);
      if (filters.prdTier) results = results.filter(s => computePRDTier(s).tier === filters.prdTier);
      if (filters.commandId) results = results.filter(s => s.uic === filters.commandId);
    }
    return results;
  },

  async getSailor(sailorId: string): Promise<ISailor | null> {
    return SYNTHETIC_SAILORS.find(s => s.id === sailorId) || null;
  },

  async getCommLog(sailorId: string): Promise<ICommEntry[]> {
    return SYNTHETIC_COMM_LOG.filter(e => e.sailorId === sailorId);
  },

  async getBillets(commandId: string): Promise<IBillet[]> {
    return SYNTHETIC_BILLETS.filter(b => b.commandId === commandId);
  },

  async getAllBillets(): Promise<IBillet[]> {
    return [...SYNTHETIC_BILLETS];
  },

  async getCommands(filters?: { type?: string }): Promise<ICommand[]> {
    let results = [...SYNTHETIC_COMMANDS];
    if (filters?.type) results = results.filter(c => c.type === filters.type);
    return results;
  },

  async addCommEntry(sailorId: string, entry: { type: ICommEntry['type']; summary: string }): Promise<ICommEntry> {
    const newEntry: ICommEntry = {
      sailorId,
      date: formatDate(today()),
      type: entry.type,
      summary: entry.summary
    };
    SYNTHETIC_COMM_LOG.push(newEntry);
    return newEntry;
  },

  async getFormStatus(sailorId: string): Promise<IFormStatus | null> {
    return SYNTHETIC_FORM_STATUS.find(f => f.sailorId === sailorId) || null;
  },

  async getAllFormStatuses(): Promise<IFormStatus[]> {
    return [...SYNTHETIC_FORM_STATUS];
  },

  async getFormResponses(sailorId: string): Promise<IFormResponse | null> {
    return SYNTHETIC_FORM_RESPONSES.find(r => r.sailorId === sailorId) || null;
  },

  async getNotifications(): Promise<INotification[]> {
    const now = today();
    const notifications: INotification[] = [];
    let idCounter = 0;

    for (const s of SYNTHETIC_SAILORS) {
      const prd = computePRDTier(s);
      const prdDate = parseDate(s.prd);
      const mo = monthsBetween(now, prdDate);
      const contactDays = Math.floor((now.getTime() - parseDate(s.lastContact).getTime()) / (1000 * 60 * 60 * 24));

      if (prd.tier === 'CRITICAL') {
        notifications.push({
          id: `n-${idCounter++}`,
          type: 'prd_critical',
          priority: 1,
          icon: '⚠️',
          title: 'PRD CRITICAL',
          message: `${s.lastName}, ${s.firstName} (${s.rate} ${s.payGrade}) — PRD in ${mo} month(s). Orders required.`,
          sailorId: s.id,
          date: s.prd
        });
      }

      if (contactDays > 30) {
        notifications.push({
          id: `n-${idCounter++}`,
          type: 'stale_contact',
          priority: 2,
          icon: '📞',
          title: 'CONTACT STALE',
          message: `${s.lastName}, ${s.firstName} — Last contact ${contactDays} days ago. Follow-up recommended.`,
          sailorId: s.id,
          date: s.lastContact
        });
      }

      const form = SYNTHETIC_FORM_STATUS.find(f => f.sailorId === s.id);
      if (form?.status === 'overdue') {
        notifications.push({
          id: `n-${idCounter++}`,
          type: 'form_overdue',
          priority: 1,
          icon: '📋',
          title: 'PREFS OVERDUE',
          message: `${s.lastName}, ${s.firstName} — Preference form sent ${form.sentDate}, due ${form.dueDate}. No response.`,
          sailorId: s.id,
          date: form.dueDate || ''
        });
      }
    }

    notifications.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return notifications.filter(n => !dismissedNotificationIds.includes(n.id));
  },

  async dismissNotification(notificationId: string): Promise<void> {
    if (!dismissedNotificationIds.includes(notificationId)) {
      dismissedNotificationIds.push(notificationId);
    }
  },

  async getAppointments(dateRange: { start: string; end: string }): Promise<IAppointment[]> {
    const results = SYNTHETIC_APPOINTMENTS.filter(
      a => a.date >= dateRange.start && a.date <= dateRange.end
    );
    return results.map(a => {
      const sailor = SYNTHETIC_SAILORS.find(s => s.id === a.sailorId);
      return {
        ...a,
        sailor: sailor ? {
          lastName: sailor.lastName,
          firstName: sailor.firstName,
          rate: sailor.rate,
          payGrade: sailor.payGrade,
          command: sailor.command,
          prd: sailor.prd,
          eaos: sailor.eaos
        } : undefined
      };
    });
  },

  async getBookingLink(): Promise<{ url: string; label: string }> {
    return {
      url: 'https://outlook.office365.com/bes2/bookings/s/PERS401-Detailer/schedule',
      label: 'PERS-401 Detailer Booking Page'
    };
  },

  async getTemplates(): Promise<ITemplate[]> {
    return [...SYNTHETIC_TEMPLATES];
  },

  async getEscalations(): Promise<IEscalation[]> {
    const now = today();
    const escalations: IEscalation[] = [];

    for (const sailor of SYNTHETIC_SAILORS) {
      const prd = computePRDTier(sailor);
      const contactDate = parseDate(sailor.lastContact);
      const dsc = Math.floor((now.getTime() - contactDate.getTime()) / (1000 * 60 * 60 * 24));
      const formEntry = SYNTHETIC_FORM_STATUS.find(f => f.sailorId === sailor.id);
      const formOverdue = formEntry?.status === 'overdue';
      const reasons: string[] = [];

      if (prd.tier === 'CRITICAL' && dsc > 30) {
        reasons.push(`PRD critical + no contact >${dsc}d`);
      }
      if (prd.tier === 'CRITICAL' && formOverdue) {
        reasons.push('PRD critical + preference form overdue');
      }

      if (reasons.length > 0) {
        escalations.push({
          sailorId: sailor.id,
          sailor,
          prdTier: prd.tier,
          daysSinceContact: dsc,
          formStatus: formEntry?.status || 'not_sent',
          reasons,
          severity: 'critical'
        });
      }
    }

    return escalations.sort((a, b) => b.daysSinceContact - a.daysSinceContact);
  },

  async getOrderStatus(sailorId: string): Promise<IOrderStatus | null> {
    return SYNTHETIC_ORDER_STATUS.find(s => s.sailorId === sailorId) || null;
  },

  async getAllOrderStatuses(): Promise<IOrderStatus[]> {
    return [...SYNTHETIC_ORDER_STATUS];
  },

  getDataMode(): string {
    return 'embedded';
  },

  getLastUpdated(): string {
    return new Date().toISOString();
  },

  async executeAdvancedSearch(source: 'sailors' | 'billets' | 'commands', conditions: ICondition[]): Promise<any[]> {
    let dataset: any[] = [];
    if (source === 'sailors') dataset = [...SYNTHETIC_SAILORS];
    if (source === 'billets') dataset = [...SYNTHETIC_BILLETS];
    if (source === 'commands') dataset = [...SYNTHETIC_COMMANDS];

    const todayDate = today();

    return dataset.filter(item => {
      let pass = true;
      for (const cond of conditions) {
        if (!cond.value && cond.value !== '0' && cond.operator !== 'past' && cond.operator !== 'within') continue;

        let dataVal = item[cond.column];
        
        // Special mappings
        if (source === 'sailors' && cond.column === 'prdTier') {
          dataVal = computePRDTier(item).tier;
        }
        if (source === 'sailors' && cond.column === 'flags') {
           // We don't have flags defined in the basic ISailor but let's mock empty for now
           dataVal = '';
        }

        const dStr = String(dataVal || '').toLowerCase();
        const cStr = String(cond.value || '').toLowerCase();
        
        // Operators
        let m = false;
        switch (cond.operator) {
          case 'equals': m = (dStr === cStr); break;
          case 'not': m = (dStr !== cStr); break;
          case 'contains': m = dStr.includes(cStr); break;
          case 'starts': m = dStr.startsWith(cStr); break;
          case 'before': m = new Date(dataVal) < new Date(cond.value); break;
          case 'after': m = new Date(dataVal) > new Date(cond.value); break;
          case 'within': 
            if (dataVal) {
              const d = new Date(dataVal);
              const diffMs = d.getTime() - todayDate.getTime();
              const diffMo = diffMs / (1000*60*60*24*30.44);
              m = (diffMo >= 0 && diffMo <= parseFloat(cond.value));
            }
            break;
          case 'past':
            if (dataVal) {
              const d = new Date(dataVal);
              const diffMs = todayDate.getTime() - d.getTime();
              const diffMo = diffMs / (1000*60*60*24*30.44);
              m = (diffMo >= 0 && diffMo <= parseFloat(cond.value));
            }
            break;
          case 'gt': m = parseFloat(dataVal) > parseFloat(cond.value); break;
          case 'lt': m = parseFloat(dataVal) < parseFloat(cond.value); break;
          default: m = true;
        }
        if (!m) {
          pass = false;
          break;
        }
      }
      return pass;
    });
  }
};

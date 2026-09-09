import { computed, Injectable, signal } from '@angular/core';

export interface ChatMessage {
  readonly from: 'bot' | 'user';
  readonly text: string;
}

export interface ChatOption {
  readonly label: string;
  /** Id of the diagnosis node to move to when this option is chosen. */
  readonly next: string;
}

export interface SuggestedTicket {
  readonly title: string;
  readonly description: string;
}

export type DiagnosisOutcome = 'resolved' | 'technician';

interface DiagnosisNode {
  readonly message: string;
  readonly options?: ChatOption[];
  readonly outcome?: DiagnosisOutcome;
  readonly ticket?: SuggestedTicket;
}

const YES_NO = (yes: string, no: string): ChatOption[] => [
  { label: 'Sí', next: yes },
  { label: 'No', next: no },
];

/**
 * Scripted pre-diagnosis tree. Each node either asks another question or reaches
 * an outcome: the issue is solved with a self-service tip, or a technician is
 * needed and a ticket draft is proposed.
 */
const DIAGNOSIS: Record<string, DiagnosisNode> = {
  start: {
    message: 'Hola, soy el asistente de TechSupport. Cuéntame qué está ocurriendo con tu equipo.',
    options: [
      { label: 'El monitor no muestra imagen', next: 'screen' },
      { label: 'El equipo no enciende', next: 'power' },
      { label: 'El equipo va muy lento', next: 'slow' },
    ],
  },

  screen: {
    message: '¿El monitor muestra el mensaje "No Signal" / "Sin señal"?',
    options: YES_NO('screen_no_signal', 'screen_black'),
  },
  screen_no_signal: {
    message:
      'Revisa que el cable de video (HDMI/VGA/DisplayPort) esté firme en ambos extremos y prueba otro puerto. ¿Vuelve la imagen?',
    options: YES_NO('resolved_cable', 'tech_screen'),
  },
  resolved_cable: {
    message: '¡Perfecto! Era un problema de conexión del cable. No hace falta abrir un ticket.',
    outcome: 'resolved',
  },
  tech_screen: {
    message:
      'El monitor sigue sin recibir señal tras revisar el cableado. Necesitas la revisión de un técnico.',
    outcome: 'technician',
    ticket: {
      title: 'El monitor no recibe señal de video (No Signal)',
      description:
        'El monitor muestra "No Signal". Ya se comprobó la conexión del cable de video en ambos extremos y se probó otro puerto sin éxito. Se requiere diagnóstico de la tarjeta gráfica o del monitor.',
    },
  },
  screen_black: {
    message: '¿El equipo emite sonidos (ventiladores, pitidos) al encenderlo?',
    options: YES_NO('tech_gpu', 'power'),
  },
  tech_gpu: {
    message: 'El equipo arranca pero la pantalla queda en negro. Un técnico debe revisarlo.',
    outcome: 'technician',
    ticket: {
      title: 'Pantalla en negro con el equipo encendido',
      description:
        'El equipo enciende y emite sonidos de arranque, pero el monitor permanece en negro y no muestra imagen. Se requiere diagnóstico de hardware de video.',
    },
  },

  power: {
    message: '¿El equipo emite alguna luz, sonido o pitido al pulsar el botón de encendido?',
    options: YES_NO('power_partial', 'power_dead'),
  },
  power_dead: {
    message:
      'Comprueba que el cable de corriente esté conectado y que la regleta o el enchufe tengan energía. ¿Enciende ahora?',
    options: YES_NO('resolved_power', 'tech_power'),
  },
  resolved_power: {
    message: '¡Listo! Era un problema de alimentación eléctrica.',
    outcome: 'resolved',
  },
  tech_power: {
    message:
      'El equipo no da ninguna señal de vida pese a tener corriente. Se necesita un técnico.',
    outcome: 'technician',
    ticket: {
      title: 'El equipo no enciende',
      description:
        'Al pulsar el botón de encendido el equipo no muestra ninguna señal de vida (sin luces, ventiladores ni pitidos). Ya se verificó la alimentación eléctrica (cable y toma de corriente). Posible fallo de la fuente de poder.',
    },
  },
  power_partial: {
    message:
      'El equipo recibe energía pero no completa el arranque. Suele ser un fallo de memoria RAM o de la placa base.',
    outcome: 'technician',
    ticket: {
      title: 'El equipo enciende pero no completa el arranque',
      description:
        'El equipo emite luces/sonidos/pitidos al encender pero no llega a cargar el sistema operativo. Posible fallo de memoria RAM o placa base. Se requiere atención de un técnico.',
    },
  },

  slow: {
    message: '¿La lentitud comenzó tras una actualización o la instalación de un programa reciente?',
    options: YES_NO('slow_recent', 'slow_always'),
  },
  slow_recent: {
    message:
      'Reinicia el equipo y cierra los programas que no estés usando. Si tras el reinicio sigue igual, necesitaremos revisarlo. ¿Mejoró?',
    options: YES_NO('resolved_slow', 'tech_slow'),
  },
  resolved_slow: {
    message: 'Genial, un reinicio y liberar recursos fue suficiente.',
    outcome: 'resolved',
  },
  slow_always: {
    message: 'Una lentitud constante y prolongada requiere una revisión más a fondo del equipo.',
    outcome: 'technician',
    ticket: {
      title: 'Rendimiento degradado del equipo',
      description:
        'El equipo presenta lentitud generalizada de forma constante. No está asociada a una actualización o instalación reciente. Se requiere revisión de disco, memoria y software.',
    },
  },
  tech_slow: {
    message: 'La lentitud persiste tras reiniciar y liberar recursos. Un técnico debe revisarlo.',
    outcome: 'technician',
    ticket: {
      title: 'Rendimiento degradado del equipo',
      description:
        'El equipo presenta lentitud que no mejora tras reiniciar ni cerrar aplicaciones. La incidencia empezó tras una actualización/instalación reciente. Se requiere revisión de software y hardware.',
    },
  },
};

const ROOT_NODE = 'start';

@Injectable({ providedIn: 'root' })
export class AiChatService {
  private readonly _messages = signal<ChatMessage[]>([]);
  private readonly _options = signal<ChatOption[]>([]);
  private readonly _outcome = signal<DiagnosisOutcome | null>(null);
  private readonly _suggestedTicket = signal<SuggestedTicket | null>(null);

  readonly messages = this._messages.asReadonly();
  readonly options = this._options.asReadonly();
  readonly outcome = this._outcome.asReadonly();
  readonly suggestedTicket = this._suggestedTicket.asReadonly();

  /** True when the diagnosis concluded that a technician is required. */
  readonly needsTechnician = computed(() => this._outcome() === 'technician');
  /** True while the conversation is still asking diagnostic questions. */
  readonly inProgress = computed(() => this._outcome() === null);

  constructor() {
    this.reset();
  }

  /** Clears the conversation and starts the pre-diagnosis from the top. */
  reset(): void {
    this._messages.set([]);
    this._options.set([]);
    this._outcome.set(null);
    this._suggestedTicket.set(null);
    this.visit(ROOT_NODE);
  }

  /** Records the user's answer and advances the conversation. */
  choose(option: ChatOption): void {
    if (!this.inProgress()) {
      return;
    }
    this._messages.update((messages) => [...messages, { from: 'user', text: option.label }]);
    this._options.set([]);
    this.visit(option.next);
  }

  private visit(nodeId: string): void {
    const node = DIAGNOSIS[nodeId];
    if (!node) {
      return;
    }

    this._messages.update((messages) => [...messages, { from: 'bot', text: node.message }]);
    this._options.set(node.options ?? []);

    if (node.outcome) {
      this._outcome.set(node.outcome);
      this._suggestedTicket.set(node.ticket ?? null);
    }
  }
}

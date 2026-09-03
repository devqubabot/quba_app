export type Locale = "id" | "en";

export interface EmptyStateMessage {
  readonly action: string;
  readonly description: string;
  readonly title: string;
}

export interface Messages {
  readonly common: {
    readonly back: string;
    readonly cancel: string;
    readonly close: string;
  };
  readonly shell: {
    readonly activeActivity: string;
    readonly createActivity: string;
    readonly tabs: {
      readonly habits: string;
      readonly home: string;
      readonly profile: string;
      readonly quba: string;
      readonly statistics: string;
    };
  };
  readonly onboarding: {
    readonly signIn: string;
    readonly eyebrow: string;
    readonly mascotLabel: string;
    readonly stepLabel: string;
    readonly action: string;
    readonly description: string;
    readonly title: string;
  };
  readonly empty: {
    readonly activeActivity: EmptyStateMessage;
    readonly createActivity: EmptyStateMessage;
    readonly habitDetail: EmptyStateMessage;
    readonly habits: EmptyStateMessage;
    readonly home: EmptyStateMessage;
    readonly profile: EmptyStateMessage;
    readonly quba: EmptyStateMessage;
    readonly statistics: EmptyStateMessage;
  };
  readonly controls: {
    readonly fieldError: string;
    readonly progressLabel: string;
  };
}

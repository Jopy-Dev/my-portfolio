import type { ContactEnvironment, DeliveryMode } from "@jopy-dev/contact-contract";

export interface ContactWorkerScaffold {
  readonly environment: ContactEnvironment;
  readonly deliveryMode: DeliveryMode;
}

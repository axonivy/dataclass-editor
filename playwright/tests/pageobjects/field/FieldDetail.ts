import type { Locator, Page } from '@playwright/test';
import { FieldGeneral } from './FieldGeneral';
import { FieldEntity } from './entity/FieldEntity';

export class FieldDetail {
  readonly general: FieldGeneral;
  readonly entity: FieldEntity;

  constructor(page: Page, parentLocator: Locator) {
    this.general = new FieldGeneral(page, parentLocator);
    this.entity = new FieldEntity(page, parentLocator);
  }
}

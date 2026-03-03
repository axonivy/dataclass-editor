import { type Locator, type Page } from '@playwright/test';
import { DataClassGeneral } from './DataClassGeneral';
import { DataClassEntity } from './entity/DataClassEntity';

export class DataClassDetail {
  readonly general: DataClassGeneral;
  readonly entity: DataClassEntity;

  constructor(page: Page, parentLocator: Locator) {
    this.general = new DataClassGeneral(page, parentLocator);
    this.entity = new DataClassEntity(page, parentLocator);
  }
}

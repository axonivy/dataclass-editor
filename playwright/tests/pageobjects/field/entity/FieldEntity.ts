import type { Locator, Page } from '@playwright/test';
import { InscriptionTab } from '../../abstract/InscriptionTab';
import { FieldAssociation } from './FieldAssociation';
import { FieldDatabaseField } from './FieldDatabaseField';

export class FieldEntity {
  readonly inscriptionTab: InscriptionTab;
  readonly databaseField: FieldDatabaseField;
  readonly association: FieldAssociation;

  constructor(page: Page, parentLocator: Locator) {
    this.inscriptionTab = new InscriptionTab(page, parentLocator, { label: 'Entity' });
    this.databaseField = new FieldDatabaseField(page, this.inscriptionTab.locator);
    this.association = new FieldAssociation(page, this.inscriptionTab.locator);
  }
}

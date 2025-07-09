import type { Locator, Page } from '@playwright/test';
import { InscriptionTab } from '../../abstract/InscriptionTab';
import { EntityClassDatabaseTable } from './EntityClassDatabaseTable';
import { EntityClassRepository } from './EntityClassRepository';

export class DataClassEntity {
  readonly inscriptionTab: InscriptionTab;
  readonly databaseTable: EntityClassDatabaseTable;
  readonly dataRepository: EntityClassRepository;

  constructor(page: Page, parentLocator: Locator) {
    this.inscriptionTab = new InscriptionTab(page, parentLocator, { label: 'Entity' });
    this.databaseTable = new EntityClassDatabaseTable(page, this.inscriptionTab.locator);
    this.dataRepository = new EntityClassRepository(page, this.inscriptionTab.locator);
  }

  async expectToHaveValues(databaseTableName: string, generateRepository: boolean) {
    await this.inscriptionTab.toggle();
    await this.databaseTable.expectToHaveValues(databaseTableName);
    if (generateRepository) {
      await this.dataRepository.expectChecked();
    } else {
      await this.dataRepository.expectUnchecked();
    }
  }

  async fillValues(databaseTableName: string) {
    await this.inscriptionTab.toggle();
    await this.databaseTable.fillValues(databaseTableName);
  }
}

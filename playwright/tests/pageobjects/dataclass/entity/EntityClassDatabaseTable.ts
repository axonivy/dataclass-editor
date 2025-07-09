import { expect, type Locator, type Page } from '@playwright/test';
import { Collapsible } from '../../abstract/Collapsible';
import { TextArea } from '../../abstract/TextArea';

export class EntityClassDatabaseTable {
  readonly collapsible: Collapsible;
  readonly name: TextArea;

  constructor(page: Page, parentLocator: Locator) {
    this.collapsible = new Collapsible(page, parentLocator, { label: 'Database Table' });
    this.name = new TextArea(this.collapsible.locator, { label: 'Name' });
  }

  async expectToHaveValues(name: string) {
    await this.collapsible.open();
    await expect(this.name.locator).toHaveValue(name);
  }

  async fillValues(name: string) {
    await this.collapsible.open();
    await this.name.locator.fill(name);
  }
}

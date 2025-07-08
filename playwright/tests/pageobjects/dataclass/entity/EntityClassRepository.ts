import { type Locator, type Page } from '@playwright/test';
import { Collapsible } from '../../abstract/Collapsible';
import { Checkbox } from '../../abstract/Checkbox';

export class EntityClassRepository {
  readonly collapsible: Collapsible;
  readonly generate: Checkbox;

  constructor(page: Page, parentLocator: Locator) {
    this.collapsible = new Collapsible(page, parentLocator, { label: 'Data Repository' });
    this.generate = new Checkbox(this.collapsible.locator, 'Generate');
  }

  async expectChecked() {
    await this.collapsible.open();
    await this.generate.expectChecked();
  }

  async expectUnchecked() {
    await this.collapsible.open();
    await this.generate.expectUnchecked();
  }

  async click() {
    await this.collapsible.open();
    await this.generate.locator.click();
  }
}

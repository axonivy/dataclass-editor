import { expect, type Locator, type Page } from '@playwright/test';

export class Toolbar {
  readonly page: Page;
  readonly locator: Locator;
  readonly undo: Locator;
  readonly redo: Locator;
  readonly processBtn: Locator;
  readonly formBtn: Locator;
  readonly detailsToggle: Locator;

  constructor(page: Page, parent: Locator) {
    this.page = page;
    this.locator = parent.locator('.ui-toolbar');
    this.undo = this.locator.getByRole('button', { name: 'Undo' });
    this.redo = this.locator.getByRole('button', { name: 'Redo' });
    this.processBtn = this.locator.getByRole('button', { name: 'Open Process' });
    this.formBtn = this.locator.getByRole('button', { name: 'Open Form' });
    this.detailsToggle = this.locator.getByRole('button', { name: 'Details' });
  }

  async expectTitle(title: string) {
    await expect(this.page).toHaveTitle(title);
  }
}

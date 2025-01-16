import { expect, type Locator, type Page } from '@playwright/test';
import { Message } from './Message';

export class Select {
  readonly page: Page;
  readonly parent: Locator;
  readonly locator: Locator;

  constructor(page: Page, parent: Locator, options?: { label?: string; nth?: number }) {
    this.page = page;
    this.parent = parent;
    if (options?.label) {
      this.locator = parent.getByRole('combobox', { name: options.label }).first();
    } else {
      this.locator = parent.getByRole('combobox').nth(options?.nth ?? 0);
    }
  }

  async choose(value: string) {
    await this.locator.click();
    await this.page.getByRole('option', { name: value, exact: true }).first().click();
  }

  async expectToHaveOptions(...options: Array<string>) {
    await this.locator.click();
    await expect(this.page.getByRole('option')).toHaveText(options);
    await this.page.keyboard.press('Escape');
  }

  async message() {
    const describedBy = await this.locator.getAttribute('aria-describedby');
    if (!describedBy) {
      throw new Error('aria-describedby attribute is missing');
    }
    return new Message(this.parent, describedBy);
  }
}

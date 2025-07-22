import { expect, type Locator, type Page } from '@playwright/test';
import { Button } from './abstract/Button';
import { TextArea } from './abstract/TextArea';

export class AddFieldDialog {
  readonly locator: Locator;
  readonly open: Button;
  readonly name: TextArea;
  readonly type: TextArea;
  readonly create: Button;

  constructor(page: Page) {
    this.locator = page.getByRole('dialog', { name: 'Add Attribute' });
    this.open = new Button(page.locator('.dataclass-editor-main-content'), { name: 'Add Attribute' });
    this.name = new TextArea(this.locator, { label: 'Name' });
    this.type = new TextArea(this.locator, { label: 'Type' });
    this.create = new Button(this.locator, { name: 'Create Attribute' });
  }

  async expectToHaveValues(name: string, type: string) {
    await expect(this.name.locator).toHaveValue(name);
    await expect(this.type.locator).toHaveValue(type);
  }
}

import type { Locator, Page } from '@playwright/test';
import { Button } from './abstract/Button';
import { Collapsible } from './abstract/Collapsible';
import { Message } from './abstract/Message';
import { Table } from './abstract/Table';

export class Annotations {
  readonly collapsible: Collapsible;
  readonly table: Table;
  readonly add: Button;
  readonly delete: Button;
  readonly message: Message;

  constructor(page: Page, parent: Locator) {
    this.collapsible = new Collapsible(page, parent, { label: 'Annotations' });
    this.table = new Table(this.collapsible.locator);
    this.add = new Button(this.collapsible.locator, { name: 'Add row' });
    this.delete = new Button(this.collapsible.locator, { name: 'Delete annotation' });
    this.message = new Message(this.collapsible.locator);
  }

  async expectToHaveValues(annotations: Array<string>) {
    await this.collapsible.open();
    await this.table.expectToHaveValues(...annotations.map(anno => [anno]));
  }

  async fillValues(...annotations: Array<string>) {
    await this.collapsible.open();

    const rowCount = await this.table.rows.count();
    if (rowCount < annotations.length) {
      for (let i = 0; i < annotations.length - rowCount; i++) {
        await this.add.locator.click();
      }
    } else if (rowCount > annotations.length) {
      await this.table.row(annotations.length).locator.click();
      for (let i = 0; i < rowCount - annotations.length; i++) {
        await this.delete.locator.click();
      }
    }

    for (let i = 0; i < annotations.length; i++) {
      const input = this.table.row(i).locator.locator('input');
      await input.click();
      await input.fill(annotations[i]!);
      await input.blur();
    }
  }
}

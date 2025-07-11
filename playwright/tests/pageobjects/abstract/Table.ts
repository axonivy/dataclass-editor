import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { Badge } from './Badge';
import { Button } from './Button';
import { Message } from './Message';

export class Table {
  readonly locator: Locator;
  readonly rows: Locator;
  readonly headers: Locator;
  readonly messages: Locator;

  constructor(parent: Locator) {
    this.locator = parent.locator('table');
    this.rows = this.locator.locator('tbody tr:not(.ui-message-row)');
    this.headers = this.locator.locator('.ui-table-head');
    this.messages = this.locator.locator('tbody tr.ui-message-row');
  }

  row(index: number) {
    return new Row(this.rows, index);
  }

  async expectToHaveValues(...values: Array<Array<string>>) {
    await expect(this.rows).toHaveCount(values.length);
    for (let i = 0; i < values.length; i++) {
      await this.row(i).expectToHaveValues(...values[i]);
    }
  }

  async expectToBeSelected(...indexes: Array<number>) {
    for (let i = 0; i < indexes.length; i++) {
      await this.row(indexes[i]).expectToBeSelected();
    }
  }

  async expectToHaveNothingSelected() {
    for (let i = 0; i < (await this.rows.count()); i++) {
      await this.row(i).expectToBeUnselected();
    }
  }

  header(index: number) {
    return new TableHeader(this.headers, index);
  }

  async unselect() {
    await this.header(0).locator.click();
  }

  async expectToBeReorderable() {
    for (let i = 0; i < (await this.rows.count()); i++) {
      await expect(this.row(i).locator).toHaveAttribute('draggable', 'true');
    }
  }

  async expectToNotBeReorderable() {
    for (let i = 0; i < (await this.rows.count()); i++) {
      await expect(this.row(i).locator).not.toHaveAttribute('draggable', 'true');
    }
  }

  message(nth: number) {
    return new Message(this.messages, { nth });
  }
}

export class TableHeader {
  readonly locator: Locator;
  readonly sort: Button;

  constructor(headersLocator: Locator, index: number) {
    this.locator = headersLocator.nth(index);
    this.sort = new Button(this.locator);
  }
}

export class Row {
  readonly locator: Locator;
  readonly badges: Locator;

  constructor(rowsLocator: Locator, index: number) {
    this.locator = rowsLocator.nth(index);
    this.badges = this.locator.locator('.dataclass-editor-badge');
  }

  column(column: number) {
    return new Cell(this.locator, column);
  }

  async expectToHaveValues(...values: Array<string>) {
    for (let i = 0; i < values.length; i++) {
      const column = this.column(i);
      switch (await column.locator.evaluate(element => element.firstElementChild?.tagName)) {
        case 'INPUT':
          await expect(column.locator.locator('input')).toHaveValue(values[i]);
          break;
        default:
          await expect(column.text).toHaveText(values[i]);
          break;
      }
    }
  }

  async expectToBeSelected() {
    await expect(this.locator).toHaveAttribute('data-state', 'selected');
  }

  async expectToBeUnselected() {
    await expect(this.locator).toHaveAttribute('data-state', 'unselected');
  }

  async expectToHaveNoValidation() {
    await expect(this.locator).not.toHaveClass(/dataclass-editor-row-error/);
    await expect(this.locator).not.toHaveClass(/dataclass-editor-row-warning/);
  }

  async expectToHaveError() {
    await expect(this.locator).toHaveClass(/dataclass-editor-row-error/);
  }

  async expectToHaveWarning() {
    await expect(this.locator).toHaveClass(/dataclass-editor-row-warning/);
  }

  badge(text: string) {
    return new Badge(this.locator, { text });
  }
}

export class Cell {
  readonly locator: Locator;
  readonly text: Locator;

  constructor(rowLocator: Locator, index: number) {
    this.locator = rowLocator.getByRole('cell').nth(index);
    this.text = this.locator.locator('span');
  }
}

import { expect, type Locator, type Page } from '@playwright/test';
import { randomUUID } from 'crypto';
import { AddFieldDialog } from './AddFieldDialog';
import { Detail } from './Detail';
import { Settings } from './Settings';
import { Toolbar } from './Toolbar';
import { Button } from './abstract/Button';
import { Message } from './abstract/Message';
import { Table } from './abstract/Table';

export const server = process.env.BASE_URL ?? 'http://localhost:8081';
export const user = 'Developer';
const ws = process.env.TEST_WS ?? '';
const app = process.env.TEST_APP ?? 'designer';
const pmv = 'dataclass-test-project';

export class DataClassEditor {
  readonly page: Page;
  readonly title: Locator;
  readonly toolbar: Toolbar;
  readonly detail: Detail;
  readonly settings: Settings;
  readonly main: Locator;
  readonly table: Table;
  readonly add: AddFieldDialog;
  readonly delete: Button;
  readonly messagesContainer: Locator;
  readonly messages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = this.page.locator('.dataclass-editor-main-toolbar-title');
    this.toolbar = new Toolbar(this.page, page.locator('.dataclass-editor-main-panel'));
    this.detail = new Detail(this.page);
    this.settings = new Settings(this.page);
    this.main = this.page.locator('.dataclass-editor-table-field');
    this.table = new Table(this.main);
    this.add = new AddFieldDialog(this.page);
    this.delete = new Button(this.main, { name: 'Delete Attribute' });
    this.messagesContainer = this.page.locator('.dataclass-editor-main-messages');
    this.messages = this.messagesContainer.locator('.ui-message');
  }

  static async openDataClass(page: Page, file: string, options?: { readonly?: boolean }) {
    const serverUrl = server.replace(/^https?:\/\//, '');
    let url = `?server=${serverUrl}${ws}&app=${app}&pmv=${pmv}&file=${file}`;
    if (options) {
      url += `${this.params(options)}`;
    }
    return this.openUrl(page, url);
  }

  static async openNewDataClass(page: Page) {
    const name = 'DataClass' + randomUUID().replaceAll('-', '');
    const namespace = 'temp';
    const result = await fetch(`${server}${ws}/api/web-ide/dataclass`, {
      method: 'POST',
      headers: {
        'X-Requested-By': 'dataclass-editor-tests',
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(user + ':' + user).toString('base64')
      },
      body: JSON.stringify({ name: namespace + '.' + name, project: { app, pmv } })
    });
    if (!result.ok) {
      throw Error(`Failed to create data class: ${result.status}`);
    }
    const editor = await this.openDataClass(page, `dataclasses/${namespace}/${name}.d.json`);
    return editor;
  }

  static async openMock(page: Page, options?: { readonly?: boolean; app?: string; file?: string; lng?: string }) {
    let params = '';
    if (options) {
      params = '?';
      params += this.params(options);
    }
    return this.openUrl(page, `/mock.html${params}`);
  }

  private static params(options: Record<string, string | boolean>) {
    let params = '';
    params += Object.entries(options)
      .map(([key, value]) => `&${key}=${value}`)
      .join('');
    return params;
  }

  private static async openUrl(page: Page, url: string) {
    const editor = new DataClassEditor(page);
    await page.goto(url);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    return editor;
  }

  async takeScreenshot(fileName: string) {
    await this.hideQuery();
    const dir = process.env.SCREENSHOT_DIR ?? 'tests/screenshots/target';
    const buffer = await this.page.screenshot({ path: `${dir}/screenshots/${fileName}`, animations: 'disabled' });
    expect(buffer.byteLength).toBeGreaterThan(3000);
  }

  async hideQuery() {
    await this.page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
  }

  async addField(name?: string, type?: string) {
    await this.add.open.locator.click();
    if (name) {
      await this.add.name.locator.fill(name);
    }
    if (type) {
      await this.add.type.locator.fill(type);
    }
    await this.add.create.locator.click();
  }

  async deleteField(index: number) {
    await this.table.row(index).locator.click();
    await this.delete.locator.click();
  }

  message(nth: number) {
    return new Message(this.messagesContainer, { nth });
  }
}

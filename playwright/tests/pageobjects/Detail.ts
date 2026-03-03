import { expect, type Locator, type Page } from '@playwright/test';
import { DataClassDetail } from './dataclass/DataClassDetail';
import { FieldDetail } from './field/FieldDetail';

export class Detail {
  readonly locator: Locator;
  readonly title: Locator;
  readonly dataClass: DataClassDetail;
  readonly field: FieldDetail;

  constructor(page: Page) {
    this.locator = page.locator('#dataclass-editor-detail');
    this.title = this.locator.locator('.ui-sidebar-header');
    this.dataClass = new DataClassDetail(page, this.locator);
    this.field = new FieldDetail(page, this.locator);
  }

  async expectToBeDataClass(isEntity = false) {
    await expect(this.title).toContainText('Class');
    if (isEntity) {
      await expect(this.dataClass.entity.inscriptionTab.trigger).toBeVisible();
    } else {
      await expect(this.dataClass.entity.inscriptionTab.trigger).toBeHidden();
    }
  }

  async expectToBeField(isEntity = false) {
    await expect(this.title).toContainText('Attribute');
    if (isEntity) {
      await expect(this.field.entity.inscriptionTab.trigger).toBeVisible();
    } else {
      await expect(this.field.entity.inscriptionTab.trigger).toBeHidden();
    }
  }
}

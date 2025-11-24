import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

test('normal data class', async ({ page }) => {
  const editor = await DataClassEditor.openDataClass(page, 'dataclasses/dataclass/Data.d.json');
  await expect(editor.title).toHaveText('Data Class - Data');
  await expect(editor.toolbar.locator.getByRole('button', { name: 'Open Process' })).toBeHidden();
  await expect(editor.toolbar.formBtn).toBeHidden();
});

test('hd data class', async ({ page }) => {
  const editor = await DataClassEditor.openDataClass(page, 'src_hd/dataclass/form/formData.d.json');
  await expect(editor.title).toHaveText('Data Class - formData');
  await expect(editor.toolbar.processBtn).toBeVisible();
  await expect(editor.toolbar.formBtn).toBeVisible();

  await editor.toolbar.detailsToggle.click();
  await expect(editor.detail.dataClass.general.classType.collapsible.locator).toBeHidden();
});

test('readonly', async ({ page }) => {
  const editor = await DataClassEditor.openDataClass(page, 'dataclasses/dataclass/DataClass.d.json', { readonly: true });
  await expect(editor.add.locator).toBeHidden();
  await page.keyboard.press('a');
  await expect(page.getByRole('dialog')).toBeHidden();

  await expect(editor.delete.locator).toBeHidden();
  await editor.table.row(0).locator.click();
  await editor.table.expectToBeSelected(0);
  await expect(editor.table.rows).toHaveCount(3);
  await page.keyboard.press('Delete');
  await expect(editor.table.rows).toHaveCount(3);

  await editor.table.expectToNotBeReorderable();
  await expect(editor.detail.field.general.nameTypeComment.name.locator).toBeDisabled();

  await expect(editor.toolbar.undo).toBeHidden();
  await expect(editor.toolbar.redo).toBeHidden();
});

import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../../pageobjects/DataClassEditor';
import { consoleLog } from '../../pageobjects/console-log';

test('title', async ({ page }) => {
  await DataClassEditor.openMock(page);
  await expect(page).toHaveTitle('Data Class Editor Mock');
});

test('headers', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page);
  await expect(editor.title).toHaveText('Data Class - Interview');
  await expect(editor.detail.title).toHaveText('Data Class - Interview');

  await editor.detail.dataClass.general.classType.fillValues('Business Data');
  await expect(editor.title).toHaveText('Business Data Class - Interview');
  await expect(editor.detail.title).toHaveText('Business Data Class - Interview');

  await editor.detail.dataClass.general.classType.fillValues('Entity');
  await expect(editor.title).toHaveText('Entity Class - Interview');
  await expect(editor.detail.title).toHaveText('Entity Class - Interview');

  await editor.table.row(1).locator.click();
  await expect(editor.detail.title).toHaveText('Attribute - firstName');
});

test('detail', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page);
  await editor.detail.expectToBeDataClass();
  await editor.table.row(0).locator.click();
  await editor.detail.expectToBeField();
  await editor.table.unselect();
  await editor.detail.expectToBeDataClass();

  await editor.detail.dataClass.general.classType.fillValues('Entity');
  await editor.detail.expectToBeDataClass(true);
  await editor.table.row(0).locator.click();
  await editor.detail.expectToBeField(true);
  await editor.table.unselect();
  await editor.detail.expectToBeDataClass(true);
});

test('toggle detail', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page);
  await expect(editor.detail.locator).toBeVisible();
  await editor.toolbar.detailsToggle.click();
  await expect(editor.detail.locator).toBeHidden();
  await editor.toolbar.detailsToggle.click();
  await expect(editor.detail.locator).toBeVisible();
});

test('type', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page);
  await expect(editor.table.row(3).column(1).text).toHaveText('Conversation');
  await editor.table.row(3).locator.click();
  await editor.detail.field.general.nameTypeComment.collapsible.open();
  await expect(editor.detail.field.general.nameTypeComment.type.locator).toHaveValue('mock.Conversation');
});

test('open process', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page, { file: '/src_hd/Data.d.json' });
  const msg1 = consoleLog(page);
  await editor.toolbar.processBtn.click();
  expect(await msg1).toContain('openProcess');

  const msg2 = consoleLog(page);
  await page.keyboard.press('p');
  expect(await msg2).toContain('openProcess');
});

test('open form', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page, { file: '/src_hd/Data.d.json' });
  const msg1 = consoleLog(page);
  await editor.toolbar.formBtn.click();
  expect(await msg1).toContain('openForm');

  const msg2 = consoleLog(page);
  await page.keyboard.press('f');
  expect(await msg2).toContain('openForm');
});

test('help', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page);
  const msg1 = consoleLog(page);
  await editor.detail.title.getByRole('button', { name: 'Open Help' }).click();
  expect(await msg1).toContain('openUrl');

  const msg2 = consoleLog(page);
  await page.keyboard.press('F1');
  expect(await msg2).toContain('openUrl');
  expect(await msg2).toContain('https://dev.axonivy.com');
});

test('focus jumps', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page);
  await page.keyboard.press('1');
  await expect(editor.toolbar.locator).toBeFocused();
  await page.keyboard.press('2');
  await expect(editor.main).toBeFocused();
  await page.keyboard.press('3');
  await expect(editor.detail.dataClass.general.inscriptionTab.trigger).toBeFocused();
  await editor.table.row(0).locator.click();
  await page.keyboard.press('3');
  await expect(editor.detail.field.general.inscriptionTab.trigger).toBeFocused();
});

test('undo / redo', async ({ page, browserName }) => {
  const editor = await DataClassEditor.openMock(page);
  await expect(editor.toolbar.undo).toBeDisabled();
  await expect(editor.toolbar.redo).toBeDisabled();
  await editor.table.row(2).locator.click();
  await expect(editor.table.rows).toHaveCount(6);
  await page.keyboard.press('Delete');
  await expect(editor.table.rows).toHaveCount(5);

  await expect(editor.toolbar.undo).toBeEnabled();
  await editor.toolbar.undo.click();
  await expect(editor.table.rows).toHaveCount(6);
  await expect(editor.toolbar.undo).toBeDisabled();

  await expect(editor.toolbar.redo).toBeEnabled();
  await editor.toolbar.redo.click();
  await expect(editor.table.rows).toHaveCount(5);
  await expect(editor.toolbar.redo).toBeDisabled();

  await page.keyboard.press('ControlOrMeta+Z');
  await expect(editor.table.rows).toHaveCount(6);

  await page.keyboard.press(browserName === 'webkit' ? 'ControlOrMeta+Shift+Z' : 'ControlOrMeta+Y');
  await expect(editor.table.rows).toHaveCount(5);
});

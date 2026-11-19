import test, { expect } from '@playwright/test';
import { DataClassEditor } from '../../pageobjects/DataClassEditor';
import { consoleLog } from '../../pageobjects/console-log';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openMock(page);
});

test('validation reference link', async () => {
  const url = 'https://example.com/invalidField0-name';
  await editor.addField('invalidField0');

  const warning = editor.table.message(0);
  await warning.expectToBeWarning('invalidField0 name warning');
  await expect(warning.locator.getByRole('button')).toHaveCount(0);

  const reference = editor.table.message(1).locator.getByRole('button', { name: 'INVALID_FIELD0_NAME' });
  await expect(reference).toBeVisible();

  const action = consoleLog(editor.page);
  await reference.click();
  const actionLog = await action;
  expect(actionLog).toContain('openUrl');
  expect(actionLog).toContain(url);
});

test('main', async () => {
  await expect(editor.messages).toHaveCount(0);

  await editor.detail.dataClass.general.annotations.fillValues('invalidAnnotation');
  await expect(editor.messages).toHaveCount(1);
  await editor.message(0).expectToBeError('class annotation');

  await expect(editor.table.messages).toHaveCount(0);

  await editor.addField('invalidField0');
  await expect(editor.table.messages).toHaveCount(8);
  await editor.table.row(6).expectToHaveError();
  await editor.table.message(0).expectToBeWarning('invalidField0 name warning');
  await editor.table.message(1).expectToBeError('invalidField0 name error');
  await editor.table.message(2).expectToBeWarning('invalidField0 type warning');
  await editor.table.message(3).expectToBeWarning('invalidField0 properties general');
  await editor.table.message(4).expectToBeWarning('invalidField0 annotation');
  await editor.table.message(5).expectToBeWarning('invalidField0 db field name');
  await editor.table.message(6).expectToBeWarning('invalidField0 cardinality');
  await editor.table.message(7).expectToBeError('invalidField0 mapped by');

  await editor.addField('invalidField1');
  await expect(editor.table.messages).toHaveCount(9);
  await editor.table.row(7).expectToHaveWarning();
  await editor.table.message(8).expectToBeWarning('invalidField1 warning');

  await editor.addField('invalidField2');
  await expect(editor.table.messages).toHaveCount(9);
  await editor.table.row(8).expectToHaveNoValidation();
});

test('tabs and collapsibles', async () => {
  await editor.detail.dataClass.general.annotations.fillValues('invalidAnnotation');

  await editor.detail.dataClass.general.inscriptionTab.expectToHaveError();
  await editor.detail.dataClass.general.annotations.collapsible.expectToHaveError();

  await editor.detail.dataClass.general.classType.fillValues('Entity');
  await editor.addField('invalidField0');

  await editor.detail.field.general.inscriptionTab.expectToHaveError();
  await editor.detail.field.general.nameTypeComment.collapsible.expectToHaveError();
  await editor.detail.field.general.properties.collapsible.expectToHaveWarning();
  await editor.detail.field.general.annotations.collapsible.expectToHaveWarning();

  await editor.detail.field.entity.inscriptionTab.toggle();
  await editor.detail.field.entity.inscriptionTab.expectToHaveError();
  await editor.detail.field.entity.databaseField.collapsible.expectToHaveWarning();
  await editor.detail.field.entity.association.collapsible.expectToHaveError();
});

test('detail', async () => {
  await editor.detail.dataClass.general.annotations.fillValues('invalidAnnotation');

  await editor.detail.dataClass.general.annotations.message.expectToBeError('class annotation');

  await editor.detail.dataClass.general.classType.fillValues('Entity');
  await editor.addField('invalidField0');

  await editor.detail.field.general.annotations.collapsible.open();
  await (await editor.detail.field.general.nameTypeComment.name.message()).expectToBeError('invalidField0 name error');
  await (await editor.detail.field.general.nameTypeComment.type.message()).expectToBeWarning('invalidField0 type warning');
  await editor.detail.field.general.properties.message.expectToBeWarning('invalidField0 properties general');
  await editor.detail.field.general.annotations.message.expectToBeWarning('invalidField0 annotation');

  await editor.detail.field.entity.inscriptionTab.toggle();
  await editor.detail.field.entity.databaseField.collapsible.open();
  await (await editor.detail.field.entity.databaseField.name.message()).expectToBeWarning('invalidField0 db field name');
  await (await editor.detail.field.entity.databaseField.length.message()).expectToBeInfo('invalidField0 db field length');
  await editor.detail.field.entity.databaseField.properties.message.expectToBeInfo('invalidField0 properties entity');
  await (await editor.detail.field.entity.association.cardinality.message()).expectToBeWarning('invalidField0 cardinality');
  await (await editor.detail.field.entity.association.mappedBy.message()).expectToBeError('invalidField0 mapped by');
});

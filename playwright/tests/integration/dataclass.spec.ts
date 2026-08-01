import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openDataClass(page, 'dataclass/dataclass/DataClass.d.json');
});

test('load data', async () => {
  await editor.detail.dataClass.general.expectToHaveValues('dataclass.DataClass', 'DataClass comment', ['@jakarta.persistence.Table(name="tableName")'], 'Data');

  await expect(editor.table.rows).toHaveCount(3);

  await editor.table.row(0).expectToHaveValues('dataClassField0', 'String', 'DataClassField0 comment');
  await editor.table.row(0).locator.click();
  await editor.detail.field.general.expectToHaveValues('dataClassField0', 'String', 'DataClassField0 comment', true, []);

  await editor.table.row(1).expectToHaveValues('dataClassField1', 'Integer', '');
  await editor.table.row(1).locator.click();
  await editor.detail.field.general.expectToHaveValues('dataClassField1', 'Integer', '', true, [
    '@jakarta.persistence.ManyToMany',
    '@jakarta.persistence.JoinTable(name = "tableName", joinColumns = { @jakarta.persistence.JoinColumn(name = "name1Id", referencedColumnName = "id") }, inverseJoinColumns = { @jakarta.persistence.JoinColumn(name = "tableNameId", referencedColumnName = "id") })'
  ]);

  await editor.table.row(2).expectToHaveValues('dataClassField2', 'Date', 'DataClassField2 comment');
  await editor.table.row(2).locator.click();
  await editor.detail.field.general.expectToHaveValues('dataClassField2', 'Date', 'DataClassField2 comment', false, []);
});

test('save data', async ({ page }) => {
  const editor = await DataClassEditor.openNewDataClass(page);

  await editor.detail.dataClass.general.fillValues('NewDescription', ['NewDataClassAnnotation'], 'Business Data');

  await editor.addField('newDataClassField', 'Integer');

  await page.reload();

  await expect(editor.detail.dataClass.general.nameDescription.description.locator).toHaveValue('NewDescription');
  await editor.detail.dataClass.general.annotations.expectToHaveValues(['NewDataClassAnnotation']);
  await editor.detail.dataClass.general.classType.expectToHaveValues('Business Data');

  await expect(editor.table.rows).toHaveCount(1);

  await editor.table.row(0).expectToHaveValues('newDataClassField', 'Integer');

  await editor.table.row(0).locator.click();
  await editor.detail.field.general.fillValues('newName', 'String', 'NewComment', true, ['NewFieldAnnotation']);

  await page.reload();

  await editor.table.row(0).locator.click();
  await editor.detail.field.general.expectToHaveValues('newName', 'String', 'NewComment', true, ['NewFieldAnnotation']);

  await editor.delete.locator.click();

  await page.reload();

  await expect(editor.table.rows).toHaveCount(0);
});

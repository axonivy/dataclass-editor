import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openMock(page);
});

test('name', async () => {
  const databaseFieldName = editor.detail.field.entity.databaseField.name;

  await editor.detail.dataClass.general.classType.fillValues('Entity');
  await editor.table.row(5).locator.click();
  await editor.detail.field.entity.inscriptionTab.toggle();
  await editor.detail.field.entity.databaseField.collapsible.open();

  await expect(databaseFieldName.locator).toHaveValue('');
  await databaseFieldName.expectToHavePlaceholder('entity');
  await expect(databaseFieldName.locator).toBeEnabled();

  await databaseFieldName.locator.fill('DatabaseFieldName');
  await editor.detail.field.entity.association.collapsible.open();
  await editor.detail.field.entity.association.cardinality.choose('One-to-One');
  await editor.detail.field.entity.association.mappedBy.choose('MappedByFieldName');

  await expect(databaseFieldName.locator).toHaveValue('');
  await databaseFieldName.expectToHavePlaceholder('');
  await expect(databaseFieldName.locator).toBeDisabled();

  await editor.detail.field.entity.association.mappedBy.choose('');

  await expect(databaseFieldName.locator).toHaveValue('DatabaseFieldName');
});

test('length', async () => {
  const changeTypeTo = async (type: string) => {
    await editor.detail.field.general.inscriptionTab.toggle();
    await editor.detail.field.general.nameTypeComment.collapsible.open();
    await editor.detail.field.general.nameTypeComment.type.locator.fill(type);
    await editor.detail.field.entity.inscriptionTab.toggle();
    await editor.detail.field.entity.databaseField.collapsible.open();
  };

  const databaseFieldLength = editor.detail.field.entity.databaseField.length;

  await editor.detail.dataClass.general.classType.fillValues('Entity');
  await editor.table.row(1).locator.click();
  await editor.detail.field.entity.inscriptionTab.toggle();
  await editor.detail.field.entity.databaseField.collapsible.open();

  await expect(databaseFieldLength.locator).toHaveValue('');
  await databaseFieldLength.expectToHavePlaceholder('255');
  await expect(databaseFieldLength.locator).toBeEnabled();

  await databaseFieldLength.locator.fill('128');
  await changeTypeTo('Integer');

  await expect(databaseFieldLength.locator).toHaveValue('');
  await databaseFieldLength.expectToHavePlaceholder('');
  await expect(databaseFieldLength.locator).toBeDisabled();

  await changeTypeTo('String');

  await expect(databaseFieldLength.locator).toHaveValue('128');
});

test('properties', async () => {
  const databaseField = editor.detail.field.entity.databaseField;

  await editor.detail.dataClass.general.classType.fillValues('Entity');
  await editor.table.row(5).locator.click();
  await editor.detail.field.entity.inscriptionTab.toggle();
  await databaseField.collapsible.open();

  // not a type that can be an ID or Version
  await databaseField.properties.expectToBeEnabled({
    id: false,
    generated: false,
    notNullable: true,
    unique: true,
    notUpdateable: true,
    notInsertable: true,
    version: false
  });

  await editor.detail.field.general.inscriptionTab.toggle();
  await editor.detail.field.general.nameTypeComment.collapsible.open();
  await editor.detail.field.general.nameTypeComment.type.locator.fill('Integer');
  await editor.detail.field.entity.inscriptionTab.toggle();
  await editor.detail.field.entity.databaseField.collapsible.open();

  // a type that can be an ID or Version
  await databaseField.properties.expectToBeEnabled({
    id: true,
    generated: false,
    notNullable: true,
    unique: true,
    notUpdateable: true,
    notInsertable: true,
    version: true
  });

  await databaseField.properties.checkboxes.id.click();

  // ID is selected
  await databaseField.properties.expectToBeEnabled({
    id: true,
    generated: true,
    notNullable: false,
    unique: false,
    notUpdateable: false,
    notInsertable: false,
    version: false
  });

  await databaseField.properties.checkboxes.id.click();
  await databaseField.properties.checkboxes.version.click();

  // Version is selected
  await databaseField.properties.expectToBeEnabled({
    id: false,
    generated: false,
    notNullable: false,
    unique: false,
    notUpdateable: false,
    notInsertable: false,
    version: true
  });

  await databaseField.properties.checkboxes.version.click();
  await editor.detail.field.entity.association.collapsible.open();
  await editor.detail.field.entity.association.cardinality.choose('One-to-One');
  await editor.detail.field.entity.association.mappedBy.choose('MappedByFieldName');

  // mappedByFieldName is set
  await databaseField.properties.expectToBeEnabled({
    id: false,
    generated: false,
    notNullable: false,
    unique: false,
    notUpdateable: false,
    notInsertable: false,
    version: false
  });
});

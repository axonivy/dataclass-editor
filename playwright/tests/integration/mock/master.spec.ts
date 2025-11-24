import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../../pageobjects/DataClassEditor';
import { consoleLog } from '../../pageobjects/console-log';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openMock(page);
});

test.describe('add field', () => {
  test.describe('add', () => {
    test('data class', async () => {
      await editor.addField('newAttribute', 'String');
      await expect(editor.table.rows).toHaveCount(7);
      await editor.table.row(6).expectToBeSelected();
      await editor.table.row(6).expectToHaveValues('newAttribute', 'String', '');
      await editor.detail.field.general.properties.expectToHaveValues(true);
    });

    test('entity class', async () => {
      await editor.detail.dataClass.general.classType.fillValues('Entity');
      await editor.addField('entityNew', 'String');
      await editor.detail.field.general.properties.fillValues(true);
      await editor.detail.field.entity.inscriptionTab.toggle();
      await editor.detail.field.entity.association.collapsible.open();
      await editor.detail.field.entity.association.expectCascadeTypesToHaveCheckedState({
        all: false,
        persist: true,
        merge: true,
        remove: false,
        refresh: false
      });
    });

    test('is not persistable', async ({ page }) => {
      editor = await DataClassEditor.openMock(page, { file: '/src_hd/Data.d.json' });
      await editor.addField('newAttribute', 'String');
      await expect(editor.table.row(6).badge('P').locator).toBeHidden();
    });

    test('keyboard', async () => {
      await editor.page.keyboard.press('a');
      await expect(editor.add.locator).toBeVisible();
      await editor.add.name.locator.fill('testAttribute');
      await editor.add.expectToHaveValues('testAttribute', 'String');
      await editor.page.keyboard.press('ControlOrMeta+Enter');
      await expect(editor.add.locator).toBeVisible();
      await editor.add.expectToHaveValues('', 'String');
      await editor.page.keyboard.press('Escape');
      await expect(editor.add.locator).toBeHidden();
      await editor.table.row(6).expectToBeSelected();
      await editor.table.row(6).expectToHaveValues('testAttribute', 'String', '');
    });
  });

  test('default values', async () => {
    await editor.add.open.locator.click();
    await editor.add.expectToHaveValues('newAttribute', 'String');
  });

  test.describe('validation', () => {
    test.describe('name', () => {
      test('empty', async () => {
        await editor.add.open.locator.click();
        const nameMessage = await editor.add.name.message();
        await expect(nameMessage.locator).toBeHidden();
        await editor.add.name.locator.clear();
        await nameMessage.expectToBeError('Name cannot be empty.');
      });

      test('taken', async () => {
        await editor.add.open.locator.click();
        const nameMessage = await editor.add.name.message();
        await expect(nameMessage.locator).toBeHidden();
        await editor.add.name.locator.fill('firstName');
        await nameMessage.expectToBeError('Name is already taken.');
      });
    });

    test.describe('type', () => {
      test('empty', async () => {
        await editor.add.open.locator.click();
        const typeMessage = await editor.add.type.message();
        await expect(typeMessage.locator).toBeHidden();
        await editor.add.type.locator.clear();
        await typeMessage.expectToBeError('Type cannot be empty.');
      });
    });
  });
});

test.describe('delete field', () => {
  test('delete', async () => {
    await editor.deleteField(1);
    await expect(editor.table.rows).toHaveCount(5);

    await editor.table.row(1).expectToBeSelected();
    await editor.detail.field.general.expectToHaveValues('date', 'Date', '', true, []);
  });

  test('delete last field', async () => {
    await editor.deleteField(5);
    await expect(editor.table.rows).toHaveCount(5);

    await editor.table.row(4).expectToBeSelected();
    await editor.detail.field.general.expectToHaveValues('entity', 'mock.Entity', 'An entity.', true, []);
  });

  test('delete last remaining field', async () => {
    const rowCount = await editor.table.rows.count();

    await editor.table.row(0).locator.click();
    for (let i = 0; i < rowCount; i++) {
      await editor.delete.locator.click();
    }

    await expect(editor.table.rows).toHaveCount(0);
    await editor.detail.expectToBeDataClass();
  });

  test('keyboard', async () => {
    await editor.table.expectToHaveNothingSelected();
    await editor.table.locator.focus();
    await expect(editor.table.rows).toHaveCount(6);
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.press('Delete');
    await expect(editor.table.rows).toHaveCount(5);
  });
});

test('disable reorder', async () => {
  await editor.table.expectToBeReorderable();
  await editor.table.header(0).sort.locator.click();
  await editor.table.expectToNotBeReorderable();
  await editor.table.header(0).sort.locator.click();
  await editor.table.expectToNotBeReorderable();
  await editor.table.header(0).sort.locator.click();
  await editor.table.expectToBeReorderable();
});

test('combine', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page, { app: 'designer' });
  const combineBtn = page.getByRole('button', { name: 'Combine Attributes' });
  await expect(combineBtn).toBeDisabled();
  await editor.table.row(0).locator.click();
  await expect(combineBtn).toBeEnabled();
  const msg1 = consoleLog(page);
  await combineBtn.click();
  expect(await msg1).toContain('combineFields');
  expect(await msg1).toContain('firstName');

  await editor.table.row(4).locator.click();
  const msg2 = consoleLog(page);
  await page.keyboard.press('c');
  expect(await msg2).toContain('combineFields');
  expect(await msg2).toContain('entity');
});

test.describe('table keyboard support', () => {
  test('move single selection via arrowKey', async () => {
    await editor.table.expectToHaveNothingSelected();
    await editor.table.locator.focus();
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.press('ArrowDown');
    await editor.table.expectToBeSelected(1);

    await editor.page.keyboard.press('ArrowUp');
    await editor.page.keyboard.press('ArrowUp');
    await editor.page.keyboard.press('ArrowUp');
    await editor.table.expectToBeSelected(4);
  });

  test('move multi selection via arrowKey', async () => {
    await editor.table.expectToHaveNothingSelected();
    await editor.table.locator.focus();
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.down('Shift');
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.press('ArrowDown');
    await editor.table.expectToBeSelected(0, 1, 2);

    await editor.page.keyboard.up('Shift');
    await editor.page.keyboard.press('ArrowDown');
    await editor.table.expectToBeSelected(3);

    await editor.page.keyboard.down('Shift');
    await editor.page.keyboard.press('ArrowUp');
    await editor.page.keyboard.press('ArrowUp');
    await editor.table.expectToBeSelected(1, 2, 3);
  });

  test('reorder single row via arrowKey', async () => {
    await editor.table.expectToHaveNothingSelected();
    await editor.table.locator.focus();
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.down('Alt');
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.press('ArrowDown');
    await expect(editor.table.row(2).column(0).text).toHaveText('firstName');
  });

  test('reorder multiple rows via arrowKey', async () => {
    await editor.table.expectToHaveNothingSelected();
    await editor.table.locator.focus();
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.down('Shift');
    await editor.page.keyboard.press('ArrowDown');

    await editor.page.keyboard.down('Alt');
    await editor.page.keyboard.press('ArrowUp');
    await editor.page.keyboard.press('ArrowUp');
    await expect(editor.table.row(3).column(0).text).toHaveText('firstName');
    await expect(editor.table.row(4).column(0).text).toHaveText('lastName');
  });

  test('open/close detail via enter', async () => {
    await editor.table.expectToHaveNothingSelected();
    await expect(editor.detail.locator).toBeVisible();
    await editor.table.locator.focus();
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.press('Enter');
    await expect(editor.detail.locator).toBeHidden();
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.press('Enter');
    await expect(editor.detail.locator).toBeVisible();
    await editor.detail.field.general.nameTypeComment.expectToHaveValues('date', 'Date', '');
  });
});

test.describe('badges', () => {
  test('general', async () => {
    const row = editor.table.row(3);
    await row.locator.click();

    await expect(row.badges).toHaveCount(0);

    await editor.detail.field.general.properties.fillValues(true);
    await expect(row.badges).toHaveCount(1);
    await row.badge('P').expectToHaveTooltip('Properties', 'Persistent');

    await editor.detail.field.general.annotations.fillValues('annotationOne', 'annotationTwo');
    await expect(row.badges).toHaveCount(2);
    await row.badge('A').expectToHaveTooltip('Annotations', 'annotationOne', 'annotationTwo');
  });

  test.describe('entity', () => {
    test('properties', async () => {
      await editor.detail.dataClass.general.classType.fillValues('Entity');
      await editor.addField('field', 'Integer');
      const row = editor.table.row(7);
      await row.locator.click();

      await expect(row.badges).toHaveCount(1);

      await editor.detail.field.entity.inscriptionTab.toggle();
      await editor.detail.field.entity.databaseField.collapsible.open();
      const properties = editor.detail.field.entity.databaseField.properties;
      await properties.fill({ id: true, generated: true, notNullable: false, unique: false, notUpdateable: false, notInsertable: false, version: false });
      await expect(row.badges).toHaveCount(2);
      await row.badge('E').expectToHaveTooltip('Entity Properties', 'ID', 'Generated');

      await properties.fill({ id: false, generated: false, notNullable: true, unique: true, notUpdateable: true, notInsertable: true, version: false });
      await row.badge('E').expectToHaveTooltip('Entity Properties', 'Not nullable', 'Unique', 'Not updateable', 'Not insertable');

      await properties.fill({ id: false, generated: false, notNullable: false, unique: false, notUpdateable: false, notInsertable: false, version: true });
      await row.badge('E').expectToHaveTooltip('Entity Properties', 'Version');
    });

    test('cardinality', async () => {
      await editor.detail.dataClass.general.classType.fillValues('Entity');
      const row = editor.table.row(5);
      await row.locator.click();

      await expect(row.badges).toHaveCount(1);

      await editor.detail.field.entity.inscriptionTab.toggle();
      const association = editor.detail.field.entity.association;
      await association.fillValues('One-to-One', { all: false, persist: false, merge: false, remove: false, refresh: false }, undefined, true);
      await expect(row.badges).toHaveCount(2);
      await row.badge('C').expectToHaveTooltip('Cardinality', 'One-to-One');

      await association.fillCascadeTypes({ all: true, persist: true, merge: true, remove: true, refresh: true });
      await row.badge('C').expectToHaveTooltip('Cardinality', 'One-to-One', 'Cascade', 'All');

      await association.fillCascadeTypes({ all: false, persist: true, merge: false, remove: false, refresh: true });
      await row.badge('C').expectToHaveTooltip('Cardinality', 'One-to-One', 'Cascade', 'Persist', 'Refresh');

      await association.fillCascadeTypes({ all: false, persist: false, merge: true, remove: true, refresh: false });
      await association.mappedBy.choose('MappedByFieldName');
      await row.badge('C').expectToHaveTooltip('Cardinality', 'One-to-One', 'Cascade', 'Merge', 'Remove', 'Mapped by', 'MappedByFieldName', 'Remove orphans');

      await association.removeOrphans.click();
      await row.badge('C').expectToHaveTooltip('Cardinality', 'One-to-One', 'Cascade', 'Merge', 'Remove', 'Mapped by', 'MappedByFieldName');
    });
  });
});

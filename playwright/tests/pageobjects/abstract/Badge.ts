import { expect, type Locator } from '@playwright/test';

export class Badge {
  readonly parent: Locator;
  readonly locator: Locator;

  constructor(parent: Locator, options?: { text?: string; nth?: number }) {
    this.parent = parent;
    if (options?.text) {
      this.locator = this.parent.getByText(options.text, { exact: true });
    } else {
      this.locator = this.parent.locator('.dataclass-editor-badge').nth(options?.nth ?? 0);
    }
  }

  async expectToHaveTooltip(...lines: Array<string>) {
    await this.locator.hover();
    await expect(this.parent.page().getByRole('tooltip')).toHaveText(lines.join(''));
  }
}

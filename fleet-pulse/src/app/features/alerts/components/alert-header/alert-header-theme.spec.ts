/**
 * Bug Condition Exploration Test - Property 1: Themed CSS Properties Use Custom Properties
 *
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4
 *
 * Parses alert-header.component.scss and asserts that each of the 8 selector-property
 * pairs uses var(--color-*) syntax instead of hardcoded hex literals.
 *
 * EXPECTED on UNFIXED code: Test FAILS for all 8 pairs (hex literals found).
 */

/**
 * Minimal SCSS block parser: extracts top-level selector blocks and their declarations.
 * Handles nested blocks (e.g. &:hover) by tracking brace depth.
 */
function parseScssSelectorBlocks(scss: string): Map<string, Map<string, string>> {
  const result = new Map<string, Map<string, string>>();
  const lines = scss.split('\n');
  let currentSelector = '';
  let depth = 0;
  let insideNested = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;

    if (depth === 0 && trimmed.match(/^\.[a-zA-Z][\w-]*\s*\{/)) {
      currentSelector = trimmed.replace(/\s*\{.*/, '');
      if (!result.has(currentSelector)) {
        result.set(currentSelector, new Map());
      }
      depth = 1;
      continue;
    }

    if (depth >= 1) {
      // Detect nested block opening (e.g. &:hover {)
      if (trimmed.includes('{')) {
        if (trimmed.match(/^&/)) {
          insideNested = true;
        }
        depth++;
      }

      // Parse declarations only at the top level of the selector block
      if (
        !insideNested &&
        !trimmed.includes('{') &&
        !trimmed.includes('}') &&
        trimmed.includes(':')
      ) {
        const colonIdx = trimmed.indexOf(':');
        const prop = trimmed.substring(0, colonIdx).trim();
        let value = trimmed.substring(colonIdx + 1).trim();
        if (value.endsWith(';')) {
          value = value.slice(0, -1).trim();
        }
        if (currentSelector && prop) {
          result.get(currentSelector)!.set(prop, value);
        }
      }

      if (trimmed.includes('}')) {
        depth--;
        if (depth === 1) {
          insideNested = false;
        }
        if (depth <= 0) {
          depth = 0;
          currentSelector = '';
          insideNested = false;
        }
      }
    }
  }

  return result;
}

/** The 8 selector-property pairs that must use CSS custom properties */
const EXPECTED_PAIRS: Array<{
  selector: string;
  property: string;
  expectedVar: string;
  hexLiteral: string;
}> = [
  { selector: '.header-title', property: 'color', expectedVar: 'var(--color-text-primary)', hexLiteral: '#e0e0e0' },
  { selector: '.sort-label', property: 'color', expectedVar: 'var(--color-text-secondary)', hexLiteral: '#999' },
  { selector: '.sort-select', property: 'background', expectedVar: 'var(--color-bg-card)', hexLiteral: '#2a2a2a' },
  { selector: '.sort-select', property: 'color', expectedVar: 'var(--color-text-primary)', hexLiteral: '#e0e0e0' },
  { selector: '.sort-select', property: 'border', expectedVar: '1px solid var(--color-border)', hexLiteral: '#444' },
  { selector: '.filter-toggle-btn', property: 'background', expectedVar: 'var(--color-bg-card)', hexLiteral: '#2a2a2a' },
  { selector: '.filter-toggle-btn', property: 'border', expectedVar: '1px solid var(--color-border)', hexLiteral: '#444' },
  { selector: '.filter-toggle-btn', property: 'color', expectedVar: 'var(--color-text-primary)', hexLiteral: '#e0e0e0' },
];

describe('Alert Header Theme - Bug Condition Exploration (Property 1)', () => {
  let blocks: Map<string, Map<string, string>>;

  beforeAll(async () => {
    const response = await fetch(
      '/base/src/app/features/alerts/components/alert-header/alert-header.component.scss'
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch SCSS file: ${response.status} ${response.statusText}`);
    }
    const scssContent = await response.text();
    blocks = parseScssSelectorBlocks(scssContent);
  });

  for (const pair of EXPECTED_PAIRS) {
    it(`${pair.selector} "${pair.property}" should use var(--color-*) syntax, not hex literal ${pair.hexLiteral}`, () => {
      const selectorBlock = blocks.get(pair.selector);
      expect(selectorBlock).withContext(
        `Selector ${pair.selector} not found in SCSS`
      ).toBeTruthy();

      const declaredValue = selectorBlock!.get(pair.property);
      expect(declaredValue).withContext(
        `Property "${pair.property}" not found in ${pair.selector}`
      ).toBeTruthy();

      // Assert the value uses var(--color-*) syntax
      expect(declaredValue!).withContext(
        `${pair.selector} ${pair.property} is "${declaredValue}" — expected var(--color-*) but found hex literal`
      ).toMatch(/var\(--color-[\w-]+\)/);
    });
  }
});

type TextExtractorNode = SceneNode & {
  type: string;
  characters?: string;
  children?: readonly SceneNode[];
};

const PLUGIN_DATA = {
  STORAGE_KEY: 'clipClap:copiedText',
  DEFAULT_FONT: { family: "Inter", style: "Regular" } as const,
  MESSAGES: {
    NO_SELECTION: 'Please select at least one layer',
    NO_TEXT_FOUND: 'No text found in selection',
    NO_CLIPBOARD: 'No text in clipboard',
    COPIED: (count: number) => `Copied ${count} characters`,
    CREATED: 'Created new text layer',
    UPDATED: (count: number) => `Updated ${count} text ${count === 1 ? 'layer' : 'layers'}`
  }
} as const;

/**
 * Extracts text content from a node and its children
 * @param node The node to extract text from
 * @returns The extracted text content
 */
function extractText(node: TextExtractorNode): string {
  if (node.type === 'TEXT') {
    return node.characters ?? '';
  }
  
  if ('children' in node && node.children?.length) {
    return node.children
      .map(child => extractText(child as TextExtractorNode))
      .filter(Boolean)
      .join('\n');
  }
  
  return '';
}

/**
 * Updates an existing text node with new content while preserving styles
 * @param node The text node to update
 * @param text The new text content
 */
async function updateTextNode(node: TextNode, text: string): Promise<void> {
  // Load all fonts used in the text node
  const fonts = node.getRangeAllFontNames(0, node.characters.length);
  await Promise.all(fonts.map(font => figma.loadFontAsync(font)));
  
  // Store original styles for first character
  const fontSize = node.getRangeFontSize(0, 1);
  const fills = node.getRangeFills(0, 1);
  
  // Update text
  node.characters = text;
  
  // Restore styles if they're not mixed
  if (typeof fontSize === 'number') {
    node.setRangeFontSize(0, text.length, fontSize);
  }
  if (Array.isArray(fills)) {
    node.setRangeFills(0, text.length, fills);
  }
}

/**
 * Creates a new text node with the specified content
 * @param text The text content for the new node
 * @param referenceNode Optional node to position relative to
 * @returns The created text node
 */
async function createTextNode(text: string, referenceNode: SceneNode | null): Promise<TextNode> {
  const newNode = figma.createText();
  await figma.loadFontAsync(PLUGIN_DATA.DEFAULT_FONT);
  
  // Set basic properties
  newNode.fontName = PLUGIN_DATA.DEFAULT_FONT;
  newNode.characters = text;

  // Position the node
  const nodeCenter = {
    x: newNode.width / 2,
    y: newNode.height / 2
  };

  if (referenceNode) {
    const referenceCenter = {
      x: referenceNode.x + (referenceNode.width / 2),
      y: referenceNode.y + (referenceNode.height / 2)
    };
    newNode.x = referenceCenter.x - nodeCenter.x;
    newNode.y = referenceCenter.y - nodeCenter.y;
  } else {
    newNode.x = figma.viewport.center.x - nodeCenter.x;
    newNode.y = figma.viewport.center.y - nodeCenter.y;
  }

  figma.currentPage.appendChild(newNode);
  return newNode;
}

/**
 * Handles the copy text command
 */
async function handleCopyText(): Promise<void> {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.closePlugin(PLUGIN_DATA.MESSAGES.NO_SELECTION);
    return;
  }
  
  // Extract and store text
  const text = selection
    .map(node => extractText(node as TextExtractorNode))
    .filter(Boolean)
    .join('\n');
  
  if (!text) {
    figma.closePlugin(PLUGIN_DATA.MESSAGES.NO_TEXT_FOUND);
    return;
  }
  
  await figma.clientStorage.setAsync(PLUGIN_DATA.STORAGE_KEY, text);
  figma.closePlugin(PLUGIN_DATA.MESSAGES.COPIED(text.length));
}

/**
 * Handles the paste text command
 */
async function handlePasteText(): Promise<void> {
  const text = await figma.clientStorage.getAsync(PLUGIN_DATA.STORAGE_KEY);
  
  if (!text) {
    figma.closePlugin(PLUGIN_DATA.MESSAGES.NO_CLIPBOARD);
    return;
  }
  
  // Get selected text nodes
  const textNodes = figma.currentPage.selection
    .filter(node => node.type === 'TEXT') as TextNode[];
  
  if (textNodes.length === 0) {
    // Create new text node centered on the selected object or viewport
    const referenceNode = figma.currentPage.selection[0] || null;
    await createTextNode(text, referenceNode);
    figma.closePlugin(PLUGIN_DATA.MESSAGES.CREATED);
  } else {
    // Update existing text nodes
    await Promise.all(textNodes.map(node => updateTextNode(node, text)));
    figma.closePlugin(PLUGIN_DATA.MESSAGES.UPDATED(textNodes.length));
  }
}

/**
 * Main plugin entry point
 */
async function main(): Promise<void> {
  switch (figma.command) {
    case 'copyText':
      await handleCopyText();
      break;
    case 'pasteText':
      await handlePasteText();
      break;
    default:
      figma.closePlugin();
  }
}

main();

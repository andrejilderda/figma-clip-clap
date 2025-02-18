# Clip Clap: Figma Plugin for Copying and Pasting Text

Clip Clap is a Figma plugin created to quickly copy and paste text within your designs. It is a drop-in replacement for [figma-copy-and-paste-text](https://github.com/kudakurage/figma-copy-and-paste-text) which is a great plugin, but is broken.

## Features
- Copy Text: Select text layers and copy their content to Figma's clipboard.
- Paste Text: Paste copied text into selected text layers, preserving formatting and styles.

## Installation
1.	Download the Clip Clap plugin from the Figma Community.
2.	In Figma, go to Plugins › Manage Plugins > Import Plugin from Manifest....
3.	Select the manifest.json file from the downloaded plugin folder.

## Usage

1. Copying Text:
  - Select the text layers you wish to copy.
  - Run the Copy Text command from the Clip Clap plugin.
  - The text content is now copied to your clipboard.
2. Pasting Text:
  - Select the text layers where you want to paste the copied content.
  - Run the Paste Text command from the Clip Clap plugin.
  - The copied text will be pasted into the selected layers, maintaining the original formatting.

## Recommended Keyboard Shortcuts

For a more efficient workflow, consider setting up custom keyboard shortcuts for copying (⌥⇧⌘C) and pasting (⌥⇧⌘V):

### On macOS:
- Go to System Preferences › Keyboard › Shortcuts › App Shortcuts.
- Click the + button to add a new shortcut.
- For Copy Text:
  - Application: Figma
  - Menu Title: Plugins › Clip Clap › Copy Text
  - Shortcut: ⌥⇧⌘C (Option + Shift + Command + C)
- For Paste Text:
  - Application: Figma
  - Menu Title: Plugins › Clip Clap › Paste Text
  - Shortcut: ⌥⇧⌘V (Option + Shift + Command + V)

### On Windows:
- Go to Settings › Devices › Keyboard › Advanced keyboard settings.
- Add new shortcuts for the Clip Clap plugin commands as desired.

## Issues?

If you encounter any issues, please open an issue on this GitHub repository.

## License

This project is licensed under the MIT License.

Note: Clip Clap was developed as a fixed version of [figma-copy-and-paste-text](https://github.com/kudakurage/figma-copy-and-paste-text)-plugin. Big thanks to [@kudakurage](https://github.com/kudakurage) for the original plugin!
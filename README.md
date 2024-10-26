# RoGB - GNOME Asus Keyboard RGB Control Extension

RoGB is a GNOME Shell extension that lets you control ASUS device RGB lighting directly from the top bar. It provides a convenient way to change RGB color, adjust brightness, and pick random colors.

## Features

- **Color Picker**: Choose a color for your RGB lighting via a color selection dialog.
- **Random Color**: Set a random RGB color with a right-click.
- **Brightness Adjustment**: Increase or decrease brightness via scroll up/down gestures.

## Installation

### From the GNOME Shell Extensions Website

1. Visit the [GNOME Shell Extensions website](https://extensions.gnome.org).
2. Search for "RoGB" or navigate to the extension's page.
3. Install the extension.

### Manual Installation

1. Download the latest release from the repository.
2. Extract the files and move the folder to `~/.local/share/gnome-shell/extensions/`.
3. Restart GNOME Shell by pressing `Alt` + `F2`, typing `r`, and pressing `Enter`.
4. Enable the extension using GNOME Tweaks or the Extensions app.

## Usage

1. **Left-Click** on the icon to open the color picker and choose a color.
2. **Right-Click** to set a random color.
3. **Scroll Up/Down** over the icon to increase or decrease the brightness of the RGB lighting.

## Requirements

- [`asusctl`](https://gitlab.com/asus-linux/asusctl): Needed for brightness adjustments and color setting on ASUS devices.
- `zenity`: Provides a color selection dialog.

## License

This project is licensed under the GNU General Public License v3.0. See the `LICENSE.txt` file for more details.
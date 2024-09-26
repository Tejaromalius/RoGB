# RoGB GNOME Extension

## Overview

RoGB is a GNOME Shell extension that allows users to pick colors and set LED colors on supported ASUS devices. Users can interact with the extension through a top bar icon, which opens a color picker or sets a random color upon right-clicking.

## Requirements

- GNOME Shell
- Zenity
- [asusctl](https://gitlab.com/asus-linux/asusctl) (for setting LED colors)

## Installation

### From the GNOME Shell Extensions Website

1. Visit the [GNOME Shell Extensions website](https://extensions.gnome.org).
2. Search for "RoGB" or navigate to the extension's page.
3. Click on the toggle switch to install the extension.

### Manual Installation

1. Download the latest release from the repository.
2. Extract the files and move the folder to `~/.local/share/gnome-shell/extensions/`.
3. Restart GNOME Shell by pressing `Alt` + `F2`, typing `r`, and pressing `Enter`.
4. Enable the extension using GNOME Tweaks or the Extensions app.

## Usage

1. **Left-click** on the extension icon to open the Zenity color picker.
2. **Right-click** on the icon to set a random LED color.

## License

This project is licensed under the GNU General Public License v3.0. See the `LICENSE` file for more details.

## Contributing

If you would like to contribute to the RoGB extension, feel free to fork the repository and submit pull requests. Please ensure that your contributions align with the project's coding standards.

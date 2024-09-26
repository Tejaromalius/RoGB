const GETTEXT_DOMAIN = 'rogb@tayefi.ilia.protonmail.com';
const { GObject, St, GLib, Gio } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const _ = ExtensionUtils.gettext;

var Indicator = GObject.registerClass(
  class Indicator extends PanelMenu.Button {
    _init() {
      super._init(0.0, _('RoGB'));

      // Add custom icon
      let iconPath = GLib.build_filenamev([ExtensionUtils.getCurrentExtension().path, 'icons', 'top-bar-icon.png']);
      let gicon = new Gio.FileIcon({ file: Gio.File.new_for_path(iconPath) });

      let icon = new St.Icon({
        gicon: gicon,
        style_class: 'system-status-icon',
      });
      this.add_child(icon);

      this.connect('button-press-event', (actor, event) => {
        if (event.get_button() === 1) { // Left-click
          this._showColorPicker();
        }
      });

      this.connect('button-press-event', (actor, event) => {
        if (event.get_button() === 3) { // Right-click
          this.setRandomColor();
        }
      });
    }

    _showColorPicker() {
      let [success, pid, stdin, stdout, stderr] = GLib.spawn_async_with_pipes(
        null,
        ['zenity', '--color-selection'],
        null,
        GLib.SpawnFlags.SEARCH_PATH,
        null
      );

      let outStream = new Gio.DataInputStream({
        base_stream: new Gio.UnixInputStream({ fd: stdout, close_fd: true })
      });

      outStream.read_line_async(GLib.PRIORITY_DEFAULT, null, (stream, res) => {
        let [line] = stream.read_line_finish(res);
        let color = new TextDecoder().decode(line).trim();

        if (color.startsWith('rgb')) {
          color = this.rgbToHex(color);
        }

        log(`Selected Color (Hex): ${color}`);
        this.setAsusLedColor(color);
      });
    }


    setRandomColor() {
      const randomColor = this.getRandomColor();
      log(`Random Color (Hex): ${randomColor}`);
      this.setAsusLedColor(randomColor);
    }

    getRandomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return this.rgbToHex(`rgb(${r}, ${g}, ${b})`);
    }

    rgbToHex(rgbString) {
      let rgb = rgbString.match(/\d+/g);
      let [r, g, b] = rgb.map(Number);
      return ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
    }

    setAsusLedColor(color) {
      let command = `asusctl led-mode static -c ${color}`;

      try {
        GLib.spawn_async(
          null,
          ['bash', '-c', command],
          null,
          GLib.SpawnFlags.SEARCH_PATH,
          null
        );
        log(`Executed command: ${command}`);
      } catch (e) {
        logError(e);
      }
    }
  });

class Extension {
  constructor(uuid) {
    this._uuid = uuid;
    ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
  }

  enable() {
    this._indicator = new Indicator();
    Main.panel.addToStatusArea(this._uuid, this._indicator);
  }

  disable() {
    this._indicator.destroy();
    this._indicator = null;
  }
}

function init(meta) {
  return new Extension(meta.uuid);
}

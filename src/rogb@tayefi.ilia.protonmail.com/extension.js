import GObject from "gi://GObject";
import St from "gi://St";
import GLib from "gi://GLib";
import Gio from "gi://Gio";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";

import {
  Extension,
  gettext,
} from "resource:///org/gnome/shell/extensions/extension.js";

const Clutter = imports.gi.Clutter;
const Indicator = GObject.registerClass(
  class Indicator extends PanelMenu.Button {
    _init(extension) {
      super._init(0.0, gettext("RoGB"));

      this._scrollTimeoutId = null;
      this._lastScrollDirection = null;
      this._extension = extension;

      this._setupIcon();
      this._connectEvents();
    }

    showColorPicker() {
      const [success, pid, stdin, stdout, stderr] = GLib.spawn_async_with_pipes(
        null,
        ["zenity", "--color-selection"],
        null,
        GLib.SpawnFlags.SEARCH_PATH,
        null
      );

      const outStream = new Gio.DataInputStream({
        base_stream: new Gio.UnixInputStream({ fd: stdout, close_fd: true }),
      });

      outStream.read_line_async(GLib.PRIORITY_DEFAULT, null, (stream, res) => {
        const [line] = stream.read_line_finish(res);
        let color = new TextDecoder().decode(line).trim();
        color = color.startsWith("rgb") ? this._rgbToHex(color) : color;
        this._applyColor(color);
      });
    }

    setRandomColor() {
      const randomColor = this._generateRandomColor();
      this._applyColor(randomColor);
    }

    increaseColorBrightness() {
      this._executeCommand("asusctl -n");
    }

    decreaseColorBrightness() {
      this._executeCommand("asusctl -p");
    }

    _setupIcon() {
      const iconPath = GLib.build_filenamev([
        this._extension.path,
        "icons",
        "top-bar-icon.png",
      ]);
      const gicon = new Gio.FileIcon({ file: Gio.File.new_for_path(iconPath) });

      this._icon = new St.Icon({
        gicon: gicon,
        style_class: "system-status-icon",
      });
      this.add_child(this._icon);
    }

    _connectEvents() {
      this.connect("button-press-event", (actor, event) => {
        if (event.get_button() === 1) this.showColorPicker();
        else if (event.get_button() === 3) this.setRandomColor();
      });

      this.connect("scroll-event", (actor, event) => {
        if (this._scrollTimeoutId) GLib.Source.remove(this._scrollTimeoutId);
        this._lastScrollDirection = event.get_scroll_direction();
        this._scrollTimeoutId = GLib.timeout_add(
          GLib.PRIORITY_DEFAULT,
          200,
          () => {
            this._lastScrollDirection === Clutter.ScrollDirection.UP
              ? this.increaseColorBrightness()
              : this.decreaseColorBrightness();
            this._scrollTimeoutId = null;
            return GLib.SOURCE_REMOVE;
          }
        );
      });
    }

    _applyColor(color) {
      this._setAsusLedColor(color);
      this.setIconColor(color);
    }

    _generateRandomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return this._rgbToHex(`rgb(${r}, ${g}, ${b})`);
    }

    _rgbToHex(rgbString) {
      const [r, g, b] = rgbString.match(/\d+/g).map(Number);
      return ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
    }

    _setAsusLedColor(color) {
      this._executeCommand(`asusctl aura static -c ${color}`);
    }

    _executeCommand(command) {
      try {
        GLib.spawn_async(
          null,
          ["bash", "-c", command],
          null,
          GLib.SpawnFlags.SEARCH_PATH,
          null
        );
      } catch (e) {
        console.error(`Failed to execute command: ${command}`, e);
      }
    }

    destroy() {
      if (this._scrollTimeoutId) {
        GLib.Source.remove(this._scrollTimeoutId);
        this._scrollTimeoutId = null;
      }
      super.destroy();
    }
  }
);

export default class RoGB extends Extension {
  enable() {
    this._indicator = new Indicator(this);
    Main.panel.addToStatusArea(this.uuid, this._indicator);
  }

  disable() {
    if (this._indicator) {
      this._indicator.destroy();
      this._indicator = null;
    }
  }
}

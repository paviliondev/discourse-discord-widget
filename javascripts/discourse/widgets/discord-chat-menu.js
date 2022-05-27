import { createWidget } from "discourse/widgets/widget";
import { h } from "virtual-dom";
import panelMessage from "../lib/panel-message";
import getTheme from "../lib/theme";
import DiscourseURL from "discourse/lib/url";

createWidget("discord-chat-menu", {
  tagName: "div.discord-panel",

  html() {
    const serverId = settings.discord_server_id;

    if (!serverId) {
      return this.attach("menu-panel", {
        contents: () =>
          panelMessage(
            "warning",
            "discord_widget.no_server_id",
            "exclamation-triangle"
          ),
      });
    }

    if (this.site.mobileView) {
      if (!settings.discord_invite_url) {
        return this.attach("menu-panel", {
          contents: () =>
            panelMessage(
              "warning",
              "discord_widget.no_invite_url",
              "exclamation-triangle"
            ),
        });
      }
      return DiscourseURL.routeTo(settings.discord_invite_url);
    }

    return this.attach("menu-panel", {
      contents: () =>
        h("iframe", {
          src: `https://discordapp.com/widget?id=${serverId}&theme=${getTheme()}`,
          sandbox:
            "allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts",
          width: "350",
          height: "500",
          allowtransparency: "true",
          frameborder: "0",
          id: "chatwidget",
          name: "chatwidget",
        }),
    });
  },

  clickOutside() {
    this.sendWidgetAction("toggleDiscordChat");
  },
});

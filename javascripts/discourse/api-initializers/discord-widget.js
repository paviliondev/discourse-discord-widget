import { apiInitializer } from "discourse/lib/api";
import User from "discourse/models/user";

export default apiInitializer("0.11.1", (api) => {
  // If login is required
  if (settings.require_login && !api.getCurrentUser()) {
    return;
  }

  // If a trust level is required
  if (User.currentProp("trust_level") < settings.minimum_trust_level) {
    return;
  }

  // If user must be staff
  if (settings.require_staff && !api.getCurrentUser().staff) {
    return;
  }

  // If user must be a group member
  if (settings.required_groups.length > 0) {
    const requiredGroups = settings.required_groups
      .split("|")
      .map((g) => Number(g));

    const currentUserGroups = api.getCurrentUser().groups.map((g) => g.id);

    if (!currentUserGroups.some((g) => requiredGroups.includes(g))) {
      return;
    }
  }

  api.decorateWidget("header-icons:before", (helper) => {
    const headerState = helper.widget.parentWidget.state;
    return helper.attach("header-dropdown", {
      title: themePrefix("discord_widget.title"),
      icon: "fab-discord",
      active: headerState.discordChatVisible,
      action: "toggleDiscordChat",
    });
  });

  api.decorateWidget("header-icons:after", (helper) => {
    const headerState = helper.widget.parentWidget.state;
    if (headerState.discordChatVisible) {
      return [helper.attach("discord-chat-menu")];
    }
  });

  api.attachWidgetAction("header", "toggleDiscordChat", function () {
    this.state.discordChatVisible = !this.state.discordChatVisible;
  });
});

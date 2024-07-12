import Component from "@ember/component";
import { action } from "@ember/object";
import { bool } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { and, not } from "truth-helpers";
import DButton from "discourse/components/d-button";
import DMenu from "discourse/components/d-menu";
import MenuPanel from "discourse/components/menu-panel";
import DiscourseURL from "discourse/lib/url";
import i18n from "discourse-common/helpers/i18n";
import PanelMessage from "./panel-message";

export default class DiscordHeaderMenu extends Component {
  @service site;

  @bool("serverId") hasServerId;
  @bool("serverInviteUrl") hasInviteUrl;

  get serverId() {
    return settings.discord_server_id.trim();
  }

  get serverInviteUrl() {
    return settings.discord_invite_url.trim();
  }

  get theme() {
    let theme = settings.theme;

    if (theme === "auto") {
      theme = getComputedStyle(document.body)
        .getPropertyValue("--scheme-type")
        .trim();
    }

    return theme;
  }

  @action
  redirectToUrl() {
    DiscourseURL.routeTo(this.serverInviteUrl);
  }

  <template>
    <li>
      {{#if (and this.site.mobileView this.hasInviteUrl)}}
        <DButton
          @action={{this.redirectToUrl}}
          @icon="fab-discord"
          @title={{i18n (themePrefix "discord_widget.title")}}
          class="icon btn-flat discord-widget"
        />
      {{else}}
        <DMenu
          @identifier="discord-widget"
          @icon="fab-discord"
          @title={{i18n (themePrefix "discord_widget.title")}}
          @inline="true"
          class="icon btn-flat discord-widget"
        >
          <:content>
            <MenuPanel @panelClass="discord-panel">
              {{#if (not this.hasServerId)}}
                <PanelMessage
                  @type="warning"
                  @icon="exclamation-triangle"
                  @message="discord_widget.no_server_id"
                />
              {{else if (and this.site.mobileView (not this.hasInviteUrl))}}
                <PanelMessage
                  @type="warning"
                  @icon="exclamation-triangle"
                  @message="discord_widget.no_invite_url"
                />
              {{else}}
                <iframe
                  src="https://discordapp.com/widget?id={{this.serverId}}&theme={{this.theme}}"
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  width="350"
                  height="500"
                  allowtransparency="true"
                  frameborder="0"
                  id="chatwidget"
                  name="chatwidget"
                  title={{i18n (themePrefix "discord_widget.title")}}
                ></iframe>
              {{/if}}
            </MenuPanel>
          </:content>
        </DMenu>
      {{/if}}
    </li>
  </template>
}

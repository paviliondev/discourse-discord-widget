import { click, visit } from "@ember/test-helpers";
import { test } from "qunit";
import { acceptance, visible } from "discourse/tests/helpers/qunit-helpers";
import I18n from "discourse-i18n";

acceptance("Discord Widget - Default", function (needs) {
  needs.hooks.beforeEach(() => {
    settings.discord_server_id = "1234567890";
    settings.discord_invite_url = "https://discord.gg/1234567890";
  });

  needs.hooks.afterEach(() => {
    settings.discord_server_id = "";
    settings.discord_invite_url = "";
    settings.require_login = false;
  });

  test("it renders the headers icon and panel", async function (assert) {
    await visit("/");

    assert.ok(
      visible(".d-header-icons button.discord-widget"),
      "The header icon wrapper is present"
    );

    await click(".d-header-icons button.discord-widget");

    assert.ok(visible(".discord-widget-content"), "The panel is visible");
    assert.ok(
      visible(".discord-widget-content iframe"),
      "The iframe is visible"
    );
  });

  test("it renders an error message with empty server id", async function (assert) {
    settings.discord_server_id = "";

    await visit("/");
    await click(".d-header-icons button.discord-widget");

    assert.ok(visible(".panel-message-type-warning"), "The error is visible");
    assert
      .dom(".panel-message-type-warning")
      .hasText(
        I18n.t(themePrefix("discord_widget.no_server_id")),
        "The error message is correct"
      );
  });
});

acceptance("Discord Widget - Anonymous", function (needs) {
  needs.hooks.beforeEach(() => {
    settings.discord_server_id = "1234567890";
    settings.discord_invite_url = "https://discord.gg/1234567890";
    settings.require_login = true;
  });

  needs.hooks.afterEach(() => {
    settings.discord_server_id = "";
    settings.discord_invite_url = "";
    settings.require_login = false;
  });

  test("it doesn't render if the user is not logged in", async function (assert) {
    await visit("/");

    assert.notOk(
      visible(".d-header-icons button.discord-widget"),
      "The header icon is not present"
    );
  });
});

acceptance("Discord Widget - Logged in", function (needs) {
  needs.hooks.beforeEach(() => {
    settings.discord_server_id = "1234567890";
    settings.discord_invite_url = "https://discord.gg/1234567890";
    settings.require_staff = true;
    settings.minimum_trust_level = 3;
    settings.required_groups = "42";
  });

  needs.hooks.afterEach(() => {
    settings.discord_server_id = "";
    settings.discord_invite_url = "";
    settings.require_staff = false;
    settings.minimum_trust_level = 0;
  });

  needs.user({
    trust_level: 3,
    admin: true,
    moderator: true,
    groups: [{ id: 42, name: "custom_group" }],
  });

  test("it renders if the conditions are met", async function (assert) {
    await visit("/");

    assert.ok(
      visible(".d-header-icons button.discord-widget"),
      "The header icon is present"
    );
  });
});

acceptance("Discord Widget - Mobile view", function (needs) {
  needs.hooks.beforeEach(() => {
    settings.discord_server_id = "1234567890";
    settings.discord_invite_url = "https://discord.gg/1234567890";
  });

  needs.hooks.afterEach(() => {
    settings.discord_server_id = "";
  });

  needs.mobileView();

  test("it renders an error message with empty invite url", async function (assert) {
    settings.discord_invite_url = "";

    await visit("/");
    await click(".d-header-icons button.discord-widget");

    assert.ok(visible(".panel-message-type-warning"), "The error is visible");
    assert
      .dom(".panel-message-type-warning")
      .hasText(
        I18n.t(themePrefix("discord_widget.no_invite_url")),
        "The error message is correct"
      );
  });

  test("it redirects to the invite url", async function (assert) {
    await visit("/");
    await click(".d-header-icons button.discord-widget");

    assert.notOk(
      visible(".discord-widget-content"),
      "The panel is not visible"
    );
  });
});

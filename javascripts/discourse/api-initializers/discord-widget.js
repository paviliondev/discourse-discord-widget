import { apiInitializer } from "discourse/lib/api";
import DiscordHeaderMenu from "../components/discord-header-menu";

export default apiInitializer("1.28.0", (api) => {
  const currentUser = api.getCurrentUser();

  if (!currentUser && settings.require_login) {
    return;
  }

  if (currentUser) {
    if (currentUser.trust_level < settings.minimum_trust_level) {
      return;
    }

    if (!currentUser.staff && settings.require_staff) {
      return;
    }

    if (settings.required_groups.length > 0) {
      const requiredGroups = settings.required_groups
        .split("|")
        .map((g) => Number(g));

      const currentUserGroups = currentUser.groups.map((g) => g.id);

      if (!currentUserGroups.some((g) => requiredGroups.includes(g))) {
        return;
      }
    }
  }

  api.headerIcons.add("discord", DiscordHeaderMenu, { before: "search" });
});

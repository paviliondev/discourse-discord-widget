import dIcon from "discourse-common/helpers/d-icon";
import i18n from "discourse-common/helpers/i18n";

const PanelMessage = <template>
  <div class="panel-message">
    <div class="panel-message-type-{{@type}}">
      {{dIcon @icon}}
      {{i18n (themePrefix @message)}}
    </div>
  </div>
</template>;

export default PanelMessage;

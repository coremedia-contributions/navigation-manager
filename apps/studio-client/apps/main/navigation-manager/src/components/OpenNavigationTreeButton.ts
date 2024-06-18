import IconButton from "@coremedia/studio-client.ext.ui-components/components/IconButton";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import OpenNavigationEditorDialogAction from "../actions/OpenNavigationEditorDialogAction";

interface OpenNavigationTreeButtonConfig extends Config<IconButton> {}

class OpenNavigationTreeButton extends IconButton {
  declare Config: OpenNavigationTreeButtonConfig;

  constructor(config: Config<OpenNavigationTreeButton> = null) {
    super(
      ConfigUtils.apply(
        Config(OpenNavigationTreeButton, { baseAction: new OpenNavigationEditorDialogAction({}) }),
        config,
      ),
    );
  }
}

export default OpenNavigationTreeButton;

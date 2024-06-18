import CoreIcons_properties from "@coremedia/studio-client.core-icons/CoreIcons_properties";
import OpenDialogAction from "@coremedia/studio-client.ext.ui-components/actions/OpenDialogAction";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import NavigationTreeLabels_properties from "../NavigationTreeLabels_properties";
import NavigationManager from "../components/NavigationManager";

interface OpenNavigationEditorDialogActionConfig extends Config<OpenDialogAction> {}

class OpenNavigationEditorDialogAction extends OpenDialogAction {
  declare Config: OpenNavigationEditorDialogActionConfig;

  constructor(config: Config<OpenNavigationEditorDialogAction> = null) {
    super(
      ConfigUtils.apply(
        Config(OpenNavigationEditorDialogAction, {
          iconCls: CoreIcons_properties.tree_view,
          text: NavigationTreeLabels_properties.Navigation_window_title,
          tooltip: NavigationTreeLabels_properties.Navigation_window_tooltip,

          dialog: Config(NavigationManager),
        }),
        config,
      ),
    );
  }
}

export default OpenNavigationEditorDialogAction;

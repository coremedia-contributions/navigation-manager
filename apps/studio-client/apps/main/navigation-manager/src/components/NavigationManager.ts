import StudioDialog from "@coremedia/studio-client.ext.base-components/dialogs/StudioDialog";
import ButtonSkin from "@coremedia/studio-client.ext.ui-components/skins/ButtonSkin";
import WindowSkin from "@coremedia/studio-client.ext.ui-components/skins/WindowSkin";
import LocalizationManager_properties from "@coremedia/studio-client.main.editor-components/sdk/sites/LocalizationManager_properties";
import Button from "@jangaroo/ext-ts/button/Button";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import NavigationTreeLabels_properties from "../NavigationTreeLabels_properties";
import NavigationTree from "./NavigationTree";

interface NavigationManagerConfig extends Config<StudioDialog> {
}

class NavigationManager extends StudioDialog {
  declare Config: NavigationManagerConfig;

  static override readonly xtype: string = "com.coremedia.blueprint.studio.navigationtree.config.navigationManager";

  /**
   * The itemId of navigation tree.
   */
  static readonly NAVIGATION_TREE_ITEM_ID: string = "navigationTree";

  constructor(config: Config<NavigationManager> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    super(ConfigUtils.apply(Config(NavigationManager, {
      title: NavigationTreeLabels_properties.Navigation_window_title,
      cls: "navigation-manager",
      stateId: "NavigationManagerState",
      stateful: true,
      width: 800,
      height: 450,
      minWidth: 600,
      minHeight: 350,
      collapsible: false,
      x: 200,
      y: 200,
      resizable: true,
      layout: "fit",
      constrainHeader: true,
      closeAction: "destroy", // Required to update data like title, status or validity date
      ui: WindowSkin.GRID_200.getSkin(),

      items: [
        Config(NavigationTree, {
          rootVisible: false,
          itemId: NavigationManager.NAVIGATION_TREE_ITEM_ID,
        }),
      ],
      buttons: [
        Config(Button, {
          itemId: "closeBtn",
          ui: ButtonSkin.FOOTER_SECONDARY.getSkin(),
          scale: "small",
          text: LocalizationManager_properties.LocalizationManager_close_button,
          handler: bind(this$, this$.close),
        }),
      ],

    }), config));
  }
}

export default NavigationManager;

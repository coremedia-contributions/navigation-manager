import AddItemsPlugin from "@coremedia/studio-client.ext.ui-components/plugins/AddItemsPlugin";
import PreviewContextMenu from "@coremedia/studio-client.main.editor-components/sdk/preview/PreviewContextMenu";
import Item from "@jangaroo/ext-ts/menu/Item";
import Separator from "@jangaroo/ext-ts/menu/Separator";
import { cast } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import PDEOpenNavigationTreeAction from "../actions/PDEOpenNavigationTreeAction";

interface AddNavigationTreeActionsToPreviewContextMenuPluginConfig extends Config<AddItemsPlugin> {}

class AddNavigationTreeActionsToPreviewContextMenuPlugin extends AddItemsPlugin {
  declare Config: AddNavigationTreeActionsToPreviewContextMenuPluginConfig;

  static readonly OPEN_NAVIGATION_TREE_ITEM_ID: string = "openNavigationTree";

  constructor(config: Config<AddNavigationTreeActionsToPreviewContextMenuPlugin> = null) {
    super(
      ConfigUtils.apply(
        Config(AddNavigationTreeActionsToPreviewContextMenuPlugin, {
          items: [
            Config(Separator),
            Config(Item, {
              itemId: AddNavigationTreeActionsToPreviewContextMenuPlugin.OPEN_NAVIGATION_TREE_ITEM_ID,
              baseAction: new PDEOpenNavigationTreeAction({
                metadataValueExpression: cast(PreviewContextMenu, config.cmp.initialConfig).selectedNodeValueExpression,
                hideOnDisable: true,
              }),
            }),
            /* TODO: Implement a show-in-navigation-tree action */
            /*<nav:ShowInNavigationTreeAction metadataValueExpression="{menuConfig.selectedNodeValueExpression}/>*/
          ],
        }),
        config,
      ),
    );
  }
}

export default AddNavigationTreeActionsToPreviewContextMenuPlugin;

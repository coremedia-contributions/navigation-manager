import AddItemsPlugin from "@coremedia/studio-client.ext.ui-components/plugins/AddItemsPlugin";
import NestedRulesPlugin from "@coremedia/studio-client.ext.ui-components/plugins/NestedRulesPlugin";
import DocumentForm from "@coremedia/studio-client.main.editor-components/sdk/premular/DocumentForm";
import LinkListPropertyField from "@coremedia/studio-client.main.editor-components/sdk/premular/fields/LinkListPropertyField";
import Component from "@jangaroo/ext-ts/Component";
import Separator from "@jangaroo/ext-ts/toolbar/Separator";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import OpenNavigationTreeButton from "../components/OpenNavigationTreeButton";

interface AddNavigationTreeButtonToPageFormPluginConfig extends Config<NestedRulesPlugin> {}

class AddNavigationTreeButtonToPageFormPlugin extends NestedRulesPlugin {
  declare Config: AddNavigationTreeButtonToPageFormPluginConfig;

  constructor(config: Config<AddNavigationTreeButtonToPageFormPlugin> = null) {
    super(
      ConfigUtils.apply(
        Config(AddNavigationTreeButtonToPageFormPlugin, {
          rules: [
            Config(DocumentForm, {
              itemId: "navigationTab",
              plugins: [
                Config(AddItemsPlugin, {
                  recursive: true,
                  items: [Config(Separator), Config(OpenNavigationTreeButton)],
                  after: [Config(Component, { itemId: LinkListPropertyField.PASTE_BUTTON_ITEM_ID })],
                }),
              ],
            }),
            Config(DocumentForm, {
              itemId: "navigation",
              plugins: [
                Config(AddItemsPlugin, {
                  recursive: true,
                  items: [Config(Separator), Config(OpenNavigationTreeButton)],
                  after: [Config(Component, { itemId: LinkListPropertyField.PASTE_BUTTON_ITEM_ID })],
                }),
              ],
            }),
          ],
        }),
        config,
      ),
    );
  }
}

export default AddNavigationTreeButtonToPageFormPlugin;

import CMChannelForm from "@coremedia-blueprint/studio-client.main.blueprint-forms/forms/CMChannelForm";
import ECommerceStudioPlugin from "@coremedia-blueprint/studio-client.main.ec-studio/ECommerceStudioPlugin";
import CommerceChildCategoriesForm from "@coremedia-blueprint/studio-client.main.lc-studio/desktop/CommerceChildCategoriesForm";
import CMExternalPageForm from "@coremedia-blueprint/studio-client.main.lc-studio/forms/CMExternalPageForm";
import StudioAppsImpl from "@coremedia/studio-client.app-context-models/apps/StudioAppsImpl";
import studioApps from "@coremedia/studio-client.app-context-models/apps/studioApps";
import OpenDialogAction from "@coremedia/studio-client.ext.ui-components/actions/OpenDialogAction";
import AddItemsPlugin from "@coremedia/studio-client.ext.ui-components/plugins/AddItemsPlugin";
import NestedRulesPlugin from "@coremedia/studio-client.ext.ui-components/plugins/NestedRulesPlugin";
import Editor_properties from "@coremedia/studio-client.main.editor-components/Editor_properties";
import CopyResourceBundleProperties from "@coremedia/studio-client.main.editor-components/configuration/CopyResourceBundleProperties";
import StudioPlugin from "@coremedia/studio-client.main.editor-components/configuration/StudioPlugin";
import IEditorContext from "@coremedia/studio-client.main.editor-components/sdk/IEditorContext";
import PreviewContextMenu from "@coremedia/studio-client.main.editor-components/sdk/preview/PreviewContextMenu";
import Component from "@jangaroo/ext-ts/Component";
import Separator from "@jangaroo/ext-ts/toolbar/Separator";
import { cast } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import resourceManager from "@jangaroo/runtime/l10n/resourceManager";
import NavigationTreeLabels_properties from "./NavigationTreeLabels_properties";
import NavigationManager from "./components/NavigationManager";
import OpenNavigationTreeButton from "./components/OpenNavigationTreeButton";
import AddNavigationTreeActionsToPreviewContextMenuPlugin from "./plugins/AddNavigationTreeActionsToPreviewContextMenuPlugin";
import AddNavigationTreeButtonToPageFormPlugin from "./plugins/AddNavigationTreeButtonToPageFormPlugin";

interface NavigationTreeStudioPluginConfig extends Config<StudioPlugin> {
}

class NavigationTreeStudioPlugin extends StudioPlugin {
  declare Config: NavigationTreeStudioPluginConfig;

  override init(editorContext: IEditorContext): void {
    super.init(editorContext);

    cast(StudioAppsImpl, studioApps._).getSubAppLauncherRegistry().registerSubAppLauncher("cmNavigationEditor", (): void => {
      const openDialogAction = new OpenDialogAction({ dialog: Config(NavigationManager) });
      openDialogAction.addComponent(new Component({}));
      openDialogAction.execute();
    });
  }

  constructor(config: Config<NavigationTreeStudioPlugin> = null) {
    super(ConfigUtils.apply(Config(NavigationTreeStudioPlugin, {

      rules: [

        Config(CMChannelForm, {
          plugins: [
            Config(AddNavigationTreeButtonToPageFormPlugin),
          ],
        }),
        Config(CMExternalPageForm, {
          plugins: [
            Config(AddNavigationTreeButtonToPageFormPlugin),
          ],
        }),

        Config(CommerceChildCategoriesForm, {
          plugins: [
            Config(NestedRulesPlugin, {
              rules: [
                Config(Component, {
                  itemId: CommerceChildCategoriesForm.INHERITED_CATEGORIES_ITEM_ID,
                  plugins: [
                    Config(AddItemsPlugin, {
                      recursive: true,
                      items: [
                        Config(OpenNavigationTreeButton),
                        Config(Separator),
                      ],
                      before: [
                        Config(Component, { itemId: ECommerceStudioPlugin.REMOVE_LINK_BUTTON_ITEM_ID }),
                      ],
                    }),
                  ],
                }),
                Config(Component, {
                  itemId: CommerceChildCategoriesForm.SELECTED_CATEGORIES_ITEM_ID,
                  plugins: [
                    Config(AddItemsPlugin, {
                      recursive: true,
                      items: [
                        Config(OpenNavigationTreeButton),
                        Config(Separator),
                      ],
                      before: [
                        Config(Component, { itemId: ECommerceStudioPlugin.REMOVE_LINK_BUTTON_ITEM_ID }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        Config(PreviewContextMenu, {
          plugins: [
            Config(AddNavigationTreeActionsToPreviewContextMenuPlugin),
          ],
        }),

      ],
      configuration: [
        new CopyResourceBundleProperties({
          destination: resourceManager.getResourceBundle(null, Editor_properties),
          source: resourceManager.getResourceBundle(null, NavigationTreeLabels_properties),
        }),
      ],

    }), config));
  }
}

export default NavigationTreeStudioPlugin;

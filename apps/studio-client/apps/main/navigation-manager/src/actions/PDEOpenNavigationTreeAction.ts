import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import CoreIcons_properties from "@coremedia/studio-client.core-icons/CoreIcons_properties";
import MetadataBeanAction from "@coremedia/studio-client.main.editor-components/sdk/actions/metadata/MetadataBeanAction";
import MetadataTreeNode from "@coremedia/studio-client.main.editor-components/sdk/preview/metadata/MetadataTreeNode";
import { as } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import NavigationTreeLabels_properties from "../NavigationTreeLabels_properties";
import NavigationManager from "../components/NavigationManager";

interface PDEOpenNavigationTreeActionConfig extends Config<MetadataBeanAction> {
}

class PDEOpenNavigationTreeAction extends MetadataBeanAction {
  declare Config: PDEOpenNavigationTreeActionConfig;

  constructor(config: Config<PDEOpenNavigationTreeAction> = null) {
    config.iconCls = CoreIcons_properties.tree_view;
    config.text = NavigationTreeLabels_properties.PDEOpenNavigationTreeAction_text;
    config.tooltip = NavigationTreeLabels_properties.PDEOpenNavigationTreeAction_tooltip;
    super(config);
  }

  protected override isDisabledFor(metadata: MetadataTreeNode): boolean {
    const content = as(this.getBeanForMetadata(metadata), Content);
    if (!content || !content.getType()) {
      return true;
    }
    return !content.getType().isSubtypeOf("CMNavigation");
  }

  protected override handle(): void {
    const navMgrDialog = new NavigationManager();
    navMgrDialog.show();
  }
}

export default PDEOpenNavigationTreeAction;

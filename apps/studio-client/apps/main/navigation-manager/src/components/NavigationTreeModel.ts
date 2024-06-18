import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import NodeChildren from "@coremedia/studio-client.ext.ui-components/models/NodeChildren";
import { as } from "@jangaroo/runtime";
import AbstractTreeModelBase from "./AbstractTreeModelBase";
import NavigationIdHelper from "./NavigationIdHelper";

/**
 * The tree model that is only responsible for displaying the tree in the library.
 */
class NavigationTreeModel extends AbstractTreeModelBase {
  static readonly NAVIGATION_TREE_ID: string = "navigationTree";

  override getChildren(nodeId: string): NodeChildren {
    const nodeModel = this.getNodeModel(NavigationIdHelper.parseContentId(nodeId));
    if (!nodeModel) {
      return undefined;
    }
    const content = as(nodeModel, Content);
    if (!content.isLoaded()) {
      content.load();
      return undefined;
    }

    const children = this.getTreeRelation().getSubFolders(content);
    if (!children) {
      return undefined;
    }

    const childIds = [];
    const iconsByChildId: Record<string, any> = {};
    const textsByChildId: Record<string, any> = {};
    const textsClsByChildId: Record<string, any> = {};
    for (let i = 0; i < children.length; i++) {
      const child = as(children[i], Content);
      const id = child.getId();
      childIds.push(id);
      textsByChildId[id] = AbstractTreeModelBase.computeNodeText(child);
      textsClsByChildId[id] = this.getTextCls(NavigationIdHelper.parseContentId(id));
      //Setting the text class on the icon class as well because of CM-product bug CMS-8654.
      iconsByChildId[id] =
        this.getIconCls(NavigationIdHelper.parseContentId(id)) +
        " " +
        this.getTextCls(NavigationIdHelper.parseContentId(id));
    }
    return new NodeChildren(childIds, textsByChildId, iconsByChildId, textsClsByChildId);
  }

  override toString(): string {
    return NavigationTreeModel.NAVIGATION_TREE_ID;
  }

  override getTreeId(): string {
    return NavigationTreeModel.NAVIGATION_TREE_ID;
  }
}

export default NavigationTreeModel;

import ContentTreeRelation from "@coremedia/studio-client.cap-base-models/content/ContentTreeRelation";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import RemoteBean from "@coremedia/studio-client.client-core/data/RemoteBean";
import CoreIcons_properties from "@coremedia/studio-client.core-icons/CoreIcons_properties";
import ContentTreeModel from "@coremedia/studio-client.main.editor-components/sdk/collectionview/tree/ContentTreeModel";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import { as } from "@jangaroo/runtime";
import NavigationIdHelper from "./NavigationIdHelper";
import NavigationTreeRelation from "./NavigationTreeRelation";

class AbstractTreeModelBase extends ContentTreeModel {
  static readonly #ERROR_CLS: string = "deleted";

  static readonly #HIDDEN_IN_NAVIGATION_CLS: string = "hidden-in-navigation";

  static readonly HIDDEN_IN_NAVIGATION: string = "hidden";

  static readonly VALID_FROM: string = "validFrom";

  static readonly VALID_TO: string = "validTo";

  #treeRelation: NavigationTreeRelation = null;

  override getRootId(): string {
    return this.getNodeId(AbstractTreeModelBase.getNavigationRoot());
  }

  protected getIdPathFromModelInternal(content: Content): Array<any> {
    if (!content) {
      // No path exists.
      return null;
    }
    if (!content.isLoaded()) {
      content.load();
      return undefined;
    }

    switch (content.isDeleted()) {
    case undefined:
      return undefined;
    case true:
      return null;
    }

    const contentTreeRelation: ContentTreeRelation = this.getTreeRelation();
    if (!contentTreeRelation.isFolderNode(content)) {
      content = contentTreeRelation.getParent(content);
    }
    const path = [];
    const visibleRoots = this.getVisibleRootModels();
    while (content) {
      if (content.isDeleted()) {
        // No path exists.
        return null;
      }
      path.push(this.getNodeId(content));
      if (visibleRoots.indexOf(content) !== -1) {
        break;
      }
      content = this.getTreeRelation().getParent(content);
      if (content === undefined) {
        // The path has not yet been loaded.
        return undefined;
      }
      if (!content) {
        return null;
      }
    }
    return path.reverse();
  }

  getTreeRelation(): NavigationTreeRelation {
    if (!this.#treeRelation) {
      this.#treeRelation = new NavigationTreeRelation();
    }
    return this.#treeRelation;
  }

  override getIdPathFromModel(model: any): Array<any> {
    const content = as(model, Content);
    if (!content) {
      // No path exists.
      return null;
    }
    if (!content.isLoaded()) {
      return undefined;
    }

    const site = editorContext._.getSitesService().getPreferredSite();
    if (!site) {
      return null;
    }

    const contentType = content.getType();
    if (contentType) {
      const typeBean = as(contentType, RemoteBean);
      if (typeBean && typeBean.isLoaded() && !contentType.isSubtypeOf(NavigationTreeRelation.CHANNEL_TYPE)) {
        return null;
      }
    }

    return this.getIdPathFromModelInternal(content);
  }

  protected static computeNodeText(content: Content): string {
    return content.getName();
  }

  override getTextCls(nodeId: string): string {
    const node = as(this.getNodeModel(NavigationIdHelper.parseContentId(nodeId)), Content);
    const properties = node.getProperties();
    if (properties == undefined) {
      return undefined;
    }
    const children: Array<any> = properties.get(NavigationTreeRelation.CHILDREN_PROPERTY);
    if (children == undefined) {
      return undefined;
    }
    for (const child of children as Content[]) {
      if (child.isDeleted()) {
        return AbstractTreeModelBase.#ERROR_CLS;
      }
    }

    const hiddenInNavigation: boolean = node.getProperties().get(AbstractTreeModelBase.HIDDEN_IN_NAVIGATION);
    if (hiddenInNavigation) {
      return AbstractTreeModelBase.#HIDDEN_IN_NAVIGATION_CLS;
    }

    if (node.getType().isSubtypeOf(NavigationTreeRelation.CHANNEL_TYPE)) {
      const segment: string = node.getProperties().get(NavigationTreeRelation.SEGMENT_PROPERTY);
      const title: string = node.getProperties().get(NavigationTreeRelation.TITLE_PROPERTY);
      if (!hiddenInNavigation && (!segment || segment.length === 0) && (!title || title.length === 0)) {
        return AbstractTreeModelBase.#ERROR_CLS;
      }
    }

    return super.getTextCls(nodeId);
  }

  override getIconCls(nodeId: string): string {
    const node = as(this.getNodeModel(NavigationIdHelper.parseContentId(nodeId)), Content);
    const properties = node.getProperties();
    if (properties == undefined) {
      return undefined;
    }

    const hiddenInNavigation: boolean = node.getProperties().get(AbstractTreeModelBase.HIDDEN_IN_NAVIGATION);
    if (hiddenInNavigation) {
      return CoreIcons_properties.hidden_channel;
    }
    return super.getIconCls(nodeId);
  }

  override getText(nodeId: string): string {
    return super.getText(nodeId);
  }

  protected override getVisibleRootModels(): Array<any> {
    return [AbstractTreeModelBase.getNavigationRoot()];
  }

  static getNavigationRoot(): Content {
    const site = editorContext._.getSitesService().getPreferredSite();
    if (site) {
      return site.getSiteIndicator();
    }
    return null;
  }
}

export default AbstractTreeModelBase;

import ContentLocalizationUtil from "@coremedia/studio-client.cap-base-models/content/ContentLocalizationUtil";
import ContentTreeRelation from "@coremedia/studio-client.cap-base-models/content/ContentTreeRelation";
import session from "@coremedia/studio-client.cap-rest-client/common/session";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import ContentType from "@coremedia/studio-client.cap-rest-client/content/ContentType";
import PublicationService from "@coremedia/studio-client.cap-rest-client/content/publication/PublicationService";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import StringUtil from "@jangaroo/ext-ts/String";
import MessageBoxWindow from "@jangaroo/ext-ts/window/MessageBox";
import { as, cast, is, mixin } from "@jangaroo/runtime";
import { AnyFunction } from "@jangaroo/runtime/types";
import NavigationTreeLabels_properties from "../NavigationTreeLabels_properties";
import ShowHiddenItemsAction from "../actions/ShowHiddenItemsAction";
import AbstractTreeModelBase from "./AbstractTreeModelBase";
import NavigationTreeModel from "./NavigationTreeModel";

class NavigationTreeRelation implements ContentTreeRelation {

  static readonly CHANNEL_TYPE: string = "CMChannel";

  static readonly COLLECTION_TYPE: string = "CMCollection";

  static readonly SITE_INDICATOR_TYPE: string = "CMSite";

  static readonly CHILDREN_PROPERTY: string = "children";

  static readonly ITEMS_PROPERTY: string = "items";

  static readonly ROOT_PROPERTY: string = "root";

  static readonly SEGMENT_PROPERTY: string = "segment";

  static readonly TITLE_PROPERTY: string = "title";

  static readonly ACTION_ID_SHOW_HIDDEN: string = "showHiddenItems";

  #showHiddenItemsVE: ValueExpression = null;

  #toggleViewCallback: AnyFunction = null;

  constructor() {
    let showHiddenItems: boolean = editorContext._.getPreferences().get(ShowHiddenItemsAction.VIEW_TREE_SETTINGS_HIDDEN);
    if (showHiddenItems === undefined) {
      showHiddenItems = false;
    }
    this.#showHiddenItemsVE = ValueExpressionFactory.createFromValue(showHiddenItems);
  }

  toggleView(): boolean {
    this.#showHiddenItemsVE.setValue(!this.#showHiddenItemsVE.getValue());
    if (this.#toggleViewCallback) {
      this.#toggleViewCallback();
    }
    return this.#showHiddenItemsVE.getValue();
  }

  setToggleViewCallback(value: AnyFunction): void {
    this.#toggleViewCallback = value;
  }

  folderNodeType(): string {
    return "Document_";
  }

  leafNodeType(): string {
    return "Document_";
  }

  isFolderNode(content: Content): boolean {
    return content.getType().isSubtypeOf(NavigationTreeRelation.#getFolderTypeChannel()) || content.getType().isSubtypeOf(NavigationTreeRelation.#getFolderTypeCollection());
  }

  getSubFolders(content: Content): Array<any> {
    const children = this.getChildrenFor(content);
    const items = [];
    for (const child of children as Content[]) {
      //handle deleted children!
      if (child == null) {
        continue;
      }
      if (!child.getProperties()) {
        return undefined;
      }
      if (!this.#showHiddenItemsVE.getValue()) {
        const hiddenInNavigation: boolean = child.getProperties().get(AbstractTreeModelBase.HIDDEN_IN_NAVIGATION);
        if (hiddenInNavigation) {
          continue;
        }
      }
      items.push(child);
    }
    return items;
  }

  getLeafContent(content: Content): Array<any> {
    return this.getChildrenFor(content);
  }

  getParent(content: Content): Content {
    const parents = this.getParents(content);
    if (parents === undefined) {
      return undefined;
    }
    if (parents.length > 0) {
      return parents[0];
    }
    return null;
  }

  getParents(content: Content): Array<any> {
    const refs = content.getReferrersWithNamedDescriptor(NavigationTreeRelation.CHANNEL_TYPE, NavigationTreeRelation.CHILDREN_PROPERTY);
    if (refs === undefined) {
      return undefined;
    }
    const result = [];

    //This can also contain deleted referrers, so we return the first one that is not deleted
    if (refs.length > 0) {
      for (const object of refs) {
        if (is(object, Content)) {
          const parent = as(object, Content);
          //return the first not deleted parent (deleted
          if (!parent.isDeleted()) {
            result.push(parent);
          }
        }
      }
    }
    return result;
  }

  mayCreate(folder: Content, contentType: ContentType): boolean {
    if (folder.isCheckedOutByOther()) {
      return false;
    }
    if (contentType.getName() === NavigationTreeRelation.CHANNEL_TYPE) {

    }

    return false;
  }

  copy(contents: Array<any>, newParent: Content, callback?: AnyFunction): void {
    const contentRepository = session._.getConnection().getContentRepository();
    contentRepository.copyRecursivelyTo(contents, newParent, callback);
  }

  mayCopy(contents: Array<any>, newParent: Content): boolean {
    return true;
  }

  move(contents: Array<any>, newParent: Content, callback?: AnyFunction): void {
  }

  mayMove(contents: Array<any>, newParent: Content): boolean {
    return true;
  }

  deleteContents(contents: Array<any>, callback?: AnyFunction): void {
  }

  undeleteContents(contents: Array<any>, callback?: AnyFunction): void {
  }

  mayDelete(contents: Array<any>): boolean {
    return true;
  }

  showCheckoutError(target: Content): void {
    const docType = ContentLocalizationUtil.localizeDocumentTypeName(target.getType().getName());
    const msg = StringUtil.format(NavigationTreeLabels_properties.navigation_checkout_error_message, docType, target.getName());
    MessageBoxWindow.getInstance().alert(NavigationTreeLabels_properties.navigation_checkout_error_title, msg);
  }

  addChildNodes(treeParent: Content, sources: Array<any>, callback: AnyFunction): void {
    const checkedIn = treeParent.isCheckedIn();
    for (const source of sources as Content[]) {
      this.#addChildNode(treeParent, source);
    }

    if (checkedIn) {
      treeParent.checkIn(callback);
    }
  }

  addChildNeedsFolderCheckout(folder: Content, childType: string): boolean {
    return childType === NavigationTreeRelation.CHANNEL_TYPE;
  }

  provideRepositoryFolderFor(contentType: ContentType, folderNode: Content, childNodeName: string, callback: AnyFunction): void {
    callback(folderNode.getParent());
  }

  rename(content: Content, newName: string, callback: AnyFunction = null): void {
    content.rename(newName, callback);
  }

  withdraw(contents: Array<any>, publicationService: PublicationService, callback: AnyFunction): void {
    const repository = session._.getConnection().getContentRepository();
    repository.getPublicationService().withdrawAllFromTree(contents, NavigationTreeRelation.CHANNEL_TYPE, NavigationTreeRelation.CHILDREN_PROPERTY, callback);
  }

  showInTree(contents: Array<any>, view: string = null, treeModelId: string = null): void {
    contents.forEach((entity: any): void => {
      const hiddenInNavigation: boolean = entity.getProperties().get(AbstractTreeModelBase.HIDDEN_IN_NAVIGATION);
      //don't even try to open it in the navigation tree
      if (hiddenInNavigation) {
        editorContext._.getCollectionViewManager().showInRepository(cast(Content, entity), null, treeModelId);
        return;
      }

      const ve = ValueExpressionFactory.createFromFunction((entity: any): boolean =>
        NavigationTreeRelation.#tryShowInNavigationTree(entity)
      , entity);
      ve.loadValue((): void => {
        const canShowInNavigationTree: boolean = ve.getValue();
        if (canShowInNavigationTree) {
          editorContext._.getCollectionViewManager().showInRepository(cast(Content, entity), null, NavigationTreeModel.NAVIGATION_TREE_ID);
        } else {
          editorContext._.getCollectionViewManager().showInRepository(cast(Content, entity), null, treeModelId);
        }
      });
    });
  }

  static #getFolderTypeChannel(): string {
    return NavigationTreeRelation.CHANNEL_TYPE;
  }

  static #getFolderTypeCollection(): string {
    return NavigationTreeRelation.COLLECTION_TYPE;
  }

  /**
   * Helper method to link a new navigation to a parent
   * @param treeParent the parent to link the content into
   * @param source the child item that should be linked to the parent.
   */
  #addChildNode(treeParent: Content, source: Content): void {
    const children = this.getChildrenFor(treeParent).slice();
    children.push(source);
    treeParent.getProperties().set(NavigationTreeRelation.getChildrenPropertyName(treeParent), children);
  }

  static #tryShowInNavigationTree(entity: any): boolean {
    const tm = new NavigationTreeModel();
    const idPathFromModel = tm.getIdPathFromModel(entity);
    if (idPathFromModel === undefined) {
      return undefined;
    }
    return null !== idPathFromModel;
  }

  getChildrenFor(folder: Content): Array<any> {
    const children: Array<any> = folder.getProperties().get(NavigationTreeRelation.getChildrenPropertyName(folder));
    if (children) {
      return children.filter((item: Content): boolean =>
        !item.isDeleted(),
      );
    }
    return [];
  }

  protected static getChildrenPropertyName(content: Content): string {
    switch (content.getType().getName()) {
    case NavigationTreeRelation.COLLECTION_TYPE:
      return NavigationTreeRelation.ITEMS_PROPERTY;
    case NavigationTreeRelation.SITE_INDICATOR_TYPE:
      return NavigationTreeRelation.ROOT_PROPERTY;
    default:
      return NavigationTreeRelation.CHILDREN_PROPERTY;
    }
  }
}
mixin(NavigationTreeRelation, ContentTreeRelation);

export default NavigationTreeRelation;

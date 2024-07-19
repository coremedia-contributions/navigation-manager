import session from "@coremedia/studio-client.cap-rest-client/common/session";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import Events from "@jangaroo/ext-ts/Events";
import TreeModel from "@jangaroo/ext-ts/data/TreeModel";
import ExtEvent from "@jangaroo/ext-ts/event/Event";
import CellContext from "@jangaroo/ext-ts/grid/CellContext";
import CellEditingPlugin from "@jangaroo/ext-ts/grid/plugin/CellEditing";
import SelectionModel from "@jangaroo/ext-ts/selection/Model";
import TreePanel from "@jangaroo/ext-ts/tree/Panel";
import TreeView from "@jangaroo/ext-ts/tree/View";
import TreeViewDragDropPlugin from "@jangaroo/ext-ts/tree/plugin/TreeViewDragDrop";
import TableView from "@jangaroo/ext-ts/view/Table";
import { as, bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import { AnyFunction } from "@jangaroo/runtime/types";
import AbstractTreeModelBase from "./AbstractTreeModelBase";
import NavigationIdHelper from "./NavigationIdHelper";
import NavigationTree from "./NavigationTree";
import NavigationTreeModel from "./NavigationTreeModel";
import trace from "@jangaroo/runtime/trace";
import Model from "@jangaroo/ext-ts/data/Model";

interface NavigationTreeBaseConfig extends Config<TreePanel> ,
        Partial<Pick<NavigationTreeBase,
                | "selectionVE">> {
  listeners?: Events<TreePanel> & Events<TreeViewDragDropPlugin> & Events<CellEditingPlugin>,
}

class NavigationTreeBase extends TreePanel {
  declare Config: NavigationTreeBaseConfig;

  selectionVE: ValueExpression = null;

  #navigationTreeModel: NavigationTreeModel = null;

  #selectedNavigationValueExpression: ValueExpression = null;

  #treeSelectionModel: SelectionModel = this.getSelectionModel();

  #rootNavigationValueExpression: ValueExpression = null;

  #filterExpression: ValueExpression = null;

  constructor(config: Config<NavigationTree> = null) {
    super(config);
    // this.expandAll();
    //1 bind tree selection plugin or select
    //2 wrong tooltip for button

    this.#treeSelectionModel.addListener("selectionchange", bind(this, this.#treeSelectionChanged));
    //this.#treeSelectionModel.select(,false,false);//store
    if (this.selectionVE) {
      trace('in constructor')
      trace(this.selectionVE.getValue())
      const id = NavigationIdHelper.parseContentId(this.selectionVE.getValue().getId())
      trace("id: ", id)
      const model: Model = this.#navigationTreeModel.getNodeModel(id);
      trace("model: ", model)
      this.#treeSelectionModel.select(model, false, false);
      //this.#treeSelectionModel.selectAll(false);
      //this.#treeSelectionModel.setSelected([model])
    }

    //trace(this.getNavigationTreeModel().getNodeModel(NavigationIdHelper.parseContentId(this.selectionVE.getValue().id)))

    // this.getNavigationTreeModel().getTreeRelation().setToggleViewCallback(bind(this, this.expandAll));
    this.mon(this, "beforecelldblclick", (this_: TableView, td: HTMLElement, cellIndex: number, record: any, tr: HTMLElement, rowIndex: number, e: ExtEvent & { position?: CellContext }): any => {
      editorContext._.getContentTabManager().openDocument(as(this.#navigationTreeModel.getNodeModel(NavigationIdHelper.parseContentId(record.id)), Content));
      return false;
    });

    this.mon(this, "afterrender", function(): void {
      const store: any = this.getStore();
      store.filterer = "bottomup";

      this.collapseAll();

      // Expand nodes below root page
      const root: TreeModel = this.getStore().getRoot();
      root.expand(false, () => {
        root.eachChild((child: TreeModel) => {
          child.expand();
        });
      });

    });

    this.on("drop", bind(this, this.#handleNodeDrop));
    this.on("beforedrop", bind(this, this.#validateDrop));
  }

  #validateDrop(node: HTMLElement,
    data: { copy?: boolean, view?: TreeView, ddel?: HTMLElement, item?: HTMLElement, records?: TreeModel[] },
    overModel: TreeModel,
    dropPosition: string,
    dropHandlers: { wait?: boolean, processDrop?: AnyFunction, cancelDrop?: AnyFunction }): any {
    dropHandlers.wait = true;

    let dropValid: boolean = true;
    if (!overModel) {
      dropValid = false;
    } else {
      data.records.forEach(r => {
        const path = r.getPath("id", "|");
        if (r.isRoot()) {
          dropValid = false;
        }
      });
    }

    if (dropValid) {
      dropHandlers.processDrop();
    } else {
      dropHandlers.cancelDrop();
    }

  }

  #handleNodeDrop(node: HTMLElement,
    data: { copy?: boolean, view?: TreeView, ddel?: HTMLElement, item?: HTMLElement, records?: TreeModel[] },
    overModel: TreeModel,
    dropPosition: string): void {

    const movedRecords: TreeModel[] = data.records;
    const newParentNode: any = overModel.parentNode;

    const newParentId: string = NavigationIdHelper.parseContentId(newParentNode.id);
    let newParent = this.#contentForNodeId(newParentId);

    // special case for homepage (homepage is not the tree root, instead the site indicator is the root of the navigation tree)
    if (overModel.parentNode && overModel.parentNode.isRoot()) {
      newParent = this.#contentForNodeId(overModel.getId());
    }

    movedRecords.forEach((r: any) => {
      const oldParentId = NavigationIdHelper.parseContentId(r.previousValues.parentId);
      const moveContent: Content = this.#contentForNodeId(r.getId());
      const overContent: Content = this.#contentForNodeId(overModel.getId());

      let oldParent: Content = this.#contentForNodeId(oldParentId);
      if (!oldParent) {
        oldParent = newParent;
      }

      let oldParentChildren: Content[] = oldParent.getProperties().get("children");
      let newParentChildren: Content[] = newParent.getProperties().get("children");

      let insertAtIndex: number = newParentChildren.indexOf(overContent) + (dropPosition === "before" ? -1 : 1);
      if (insertAtIndex < 0) {
        insertAtIndex = 0;
      }

      oldParentChildren = oldParentChildren.filter(child => moveContent !== child);
      if (oldParent === newParent) {
        newParentChildren = oldParentChildren;
        insertAtIndex = newParentChildren.indexOf(overContent) + (dropPosition === "before" ? -1 : 1);
        if (insertAtIndex < 0) {
          insertAtIndex = 0;
        }
      }

      oldParentChildren = [].concat(oldParentChildren);
      newParentChildren = [].concat(newParentChildren);

      if (oldParent !== newParent) {
        // remove from old and insert in new parent child list
        oldParent.getProperties().set("children", oldParentChildren);
      }

      // modify the parent child list
      newParentChildren.splice(insertAtIndex, 0, moveContent);
      newParent.getProperties().set("children", newParentChildren);

    });

  };

  protected getSelectionVE(config): ValueExpression {
    return ValueExpressionFactory.createTransformingValueExpression(config.selectionVE || ValueExpressionFactory.createFromValue(undefined),
      (content) => {
        if (content === undefined) {
          return [];
        }
        return [content];
      });
  }

  protected getNavigationTreeModel(): NavigationTreeModel {
    if (!this.#navigationTreeModel) {
      this.#navigationTreeModel = new NavigationTreeModel();
    }
    return this.#navigationTreeModel;
  }

  protected getRootNavigationValueExpression(): ValueExpression {
    if (!this.#rootNavigationValueExpression) {
      this.#rootNavigationValueExpression = ValueExpressionFactory.createFromFunction(AbstractTreeModelBase.getNavigationRoot);
    }
    return this.#rootNavigationValueExpression;
  }

  protected getSelectedNavigationValueExpression(): ValueExpression {
    if (!this.#selectedNavigationValueExpression) {
      this.#selectedNavigationValueExpression = ValueExpressionFactory.createFromValue(undefined);
    }
    return this.#selectedNavigationValueExpression;
  }

  protected getFilterExpression(): ValueExpression {
    if (!this.#filterExpression) {
      this.#filterExpression = ValueExpressionFactory.createFromValue("");
      this.#filterExpression.addChangeListener(bind(this, this.#updateTreeFilter));
    }
    return this.#filterExpression;
  }

  //noinspection JSUnusedLocalSymbols
  #treeSelectionChanged(selectionModel: SelectionModel, selected: Array<any>): void {
    // trace("treeSelectionChanged");
    //  todo remove ALL traces
    if (selected.length > 0) {
      const newNode/*:TreeModel*/ = selected[0];
      trace("treeSelectionChanged", "id", newNode.id, "node", newNode);
      const selectedContent = this.getNavigationTreeModel().getNodeModel(NavigationIdHelper.parseContentId(newNode.id));
      this.#selectedNavigationValueExpression.setValue(selectedContent);
    } else {
      // todo deselect?
      this.#selectedNavigationValueExpression.setValue(undefined);
    }
    trace("treeSelectionChanged", "VE", this.#selectedNavigationValueExpression.getValue());
  }

  #updateTreeFilter(): void {
    this.getStore().clearFilter();

    const filterTerm = this.#filterExpression.getValue();
    if (filterTerm) {
      const filters = this.getStore().getFilters();

      filters.add((item: TreeModel) => {
        const itemText: string = item.get("text");
        return item.isRoot() || itemText && itemText.toLowerCase().indexOf(filterTerm.toLowerCase()) >= 0;
      });

      // make sure filter results are visible
      this.expandAll();
    }
  }

  #contentForNodeId(nodeId: string): Content {
    return session._.getConnection().getContentRepository().getContent(NavigationIdHelper.parseContentId(nodeId));
  }

}

export default NavigationTreeBase;

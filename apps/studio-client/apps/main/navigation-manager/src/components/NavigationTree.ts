import CoreIcons_properties from "@coremedia/studio-client.core-icons/CoreIcons_properties";
import OpenInTabAction from "@coremedia/studio-client.ext.form-services-toolkit/actions/OpenInTabAction";
import ShowInRepositoryAction from "@coremedia/studio-client.ext.library-services-toolkit/actions/ShowInRepositoryAction";
import IconButton from "@coremedia/studio-client.ext.ui-components/components/IconButton";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import BindTreePlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindTreePlugin";
import ContextMenuPlugin from "@coremedia/studio-client.ext.ui-components/plugins/ContextMenuPlugin";
import HideObsoleteSeparatorsPlugin from "@coremedia/studio-client.ext.ui-components/plugins/HideObsoleteSeparatorsPlugin";
import ToolbarSkin from "@coremedia/studio-client.ext.ui-components/skins/ToolbarSkin";
import LinkListPropertyField from "@coremedia/studio-client.main.editor-components/sdk/premular/fields/LinkListPropertyField";
import LocalizationManager_properties from "@coremedia/studio-client.main.editor-components/sdk/sites/LocalizationManager_properties";
import TextField from "@jangaroo/ext-ts/form/field/Text";
import Item from "@jangaroo/ext-ts/menu/Item";
import Menu from "@jangaroo/ext-ts/menu/Menu";
import ext_menu_Separator from "@jangaroo/ext-ts/menu/Separator";
import TbFill from "@jangaroo/ext-ts/toolbar/Fill";
import TbSeparator from "@jangaroo/ext-ts/toolbar/Separator";
import Toolbar from "@jangaroo/ext-ts/toolbar/Toolbar";
import TreeColumn from "@jangaroo/ext-ts/tree/Column";
import TreeView from "@jangaroo/ext-ts/tree/View";
import TreeViewDragDropPlugin from "@jangaroo/ext-ts/tree/plugin/TreeViewDragDrop";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import NavigationTreeLabels_properties from "../NavigationTreeLabels_properties";
import OpenCreateFromTemplateDialogAction from "../actions/OpenCreateFromTemplateDialogAction";
import ShowHiddenItemsAction from "../actions/ShowHiddenItemsAction";
import collapseAllIcon from "../icons/collapse-all_24.svg";
import expandAllIcon from "../icons/expand-all_24.svg";
import NavigationTreeBase from "./NavigationTreeBase";
import StatusColumn from "./StatusColumn";
import TitleColumn from "./TitleColumn";
import ValidityDateColumn from "./ValidityDateColumn";
import SegmentColumn from "./SegmentColumn";

interface NavigationTreeConfig extends Config<NavigationTreeBase> {
}

class NavigationTree extends NavigationTreeBase {
  declare Config: NavigationTreeConfig;

  static readonly OPEN_FOLDER_BUTTON_ITEM_ID: string = "openInRepository";

  /**
   * The itemId of the open document toolbar button.
   */
  static readonly OPEN_DOCUMENT_BUTTON_ITEM_ID: string = "openInTab";

  static readonly COLLAPSE_ALL_BUTTON_ITEM_ID: string = "collapseAll";

  static readonly EXPAND_ALL_BUTTON_ITEM_ID: string = "expandAll";

  static readonly SHOW_HIDDEN_ITEM_ID: string = "showHiddenNavigationItems";

  constructor(config: Config<NavigationTree> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    super(ConfigUtils.apply(Config(NavigationTree, {
      cls: "navigation-tree",
      scrollable: true,
      useArrows: true,
      rootVisible: false,

      plugins: [
        Config(BindTreePlugin, {
          treeModel: this$.getNavigationTreeModel(),
          expandInitially: false,
        }),
        Config(ContextMenuPlugin, {
          contextMenu: Config(Menu, {
            plain: true,
            plugins: [
              Config(HideObsoleteSeparatorsPlugin),
            ],
            items: [
              Config(Item, {
                itemId: LinkListPropertyField.OPEN_IN_TAB_MENU_ITEM_ID,
                baseAction: new OpenInTabAction({ contentValueExpression: this$.getSelectedNavigationValueExpression() }),
              }),
              Config(Item, {
                itemId: LinkListPropertyField.SHOW_IN_LIBRARY_MENU_ITEM_ID,
                baseAction: new ShowInRepositoryAction({ contentValueExpression: this$.getSelectedNavigationValueExpression() }),
              }),
              Config(ext_menu_Separator, { itemId: "createFromTemplateSeparator" }),
              Config(Item, {
                itemId: "createFromTemplate",
                baseAction: new OpenCreateFromTemplateDialogAction({ contentValueExpression: this$.getSelectedNavigationValueExpression() }),
              }),
            ],
          }),
        }),
      ],

      columns: [
        Config(TreeColumn, {
          text: NavigationTreeLabels_properties.navigation_column_header,
          dataIndex: "text",
          flex: 2,
        }),
        Config(TitleColumn),
        Config(SegmentColumn),
        Config(ValidityDateColumn, { mode: "from" }),
        Config(ValidityDateColumn, { mode: "to" }),
        Config(StatusColumn),
      ],

      viewConfig: Config(TreeView, {
        plugins: [
          Config(TreeViewDragDropPlugin, {
            containerScroll: true,
            allowCopy: false,
          }),
        ],
      }),

      tbar: Config(Toolbar, {
        ui: ToolbarSkin.FIELD.getSkin(),
        items: [
          Config(IconButton, {
            itemId: "addPageButton",
            baseAction: new OpenCreateFromTemplateDialogAction({ contentValueExpression: this$.getSelectedNavigationValueExpression() }),
          }),
          Config(TbSeparator),
          Config(IconButton, {
            itemId: NavigationTree.OPEN_DOCUMENT_BUTTON_ITEM_ID,
            tooltip: NavigationTreeLabels_properties.Navigation_action_show_in_tab,
            baseAction: new OpenInTabAction({
              contentValueExpression: this$.getSelectedNavigationValueExpression(),
              actionId: "",
            }),
          }),
          Config(IconButton, {
            itemId: NavigationTree.OPEN_FOLDER_BUTTON_ITEM_ID,
            iconCls: LocalizationManager_properties.Action_openSiteInRepository_icon,
            tooltip: NavigationTreeLabels_properties.Navigation_action_show_in_library,
            baseAction: new ShowInRepositoryAction({ contentValueExpression: this$.getSelectedNavigationValueExpression() }),
          }),
          Config(TbSeparator),
          Config(TextField, {
            emptyText: NavigationTreeLabels_properties.toolbar_filter_field_emptyText,
            width: 150,
            margin: "0 5",
            plugins: [
              Config(BindPropertyPlugin, {
                bindTo: this$.getFilterExpression(),
                bidirectional: true,
              }),
            ],
          }),
          Config(TbFill),
          Config(IconButton, {
            itemId: NavigationTree.SHOW_HIDDEN_ITEM_ID,
            iconCls: CoreIcons_properties.view_menu,
            tooltip: NavigationTreeLabels_properties.Navigation_action_toggle_hidden_items,
            text: NavigationTreeLabels_properties.Navigation_action_hide_items,
            enableToggle: true,
            baseAction: new ShowHiddenItemsAction({
              contentValueExpression: this$.getRootNavigationValueExpression(),
              treeRelation: this$.getNavigationTreeModel().getTreeRelation(),
            }),
          }),
          Config(TbSeparator),
          Config(IconButton, {
            itemId: NavigationTree.EXPAND_ALL_BUTTON_ITEM_ID,
            icon: expandAllIcon,
            tooltip: NavigationTreeLabels_properties.Navigation_action_expand_all,
            handler: bind(this$, this$.#handleExpandAll),
          }),
          Config(IconButton, {
            itemId: NavigationTree.COLLAPSE_ALL_BUTTON_ITEM_ID,
            icon: collapseAllIcon,
            tooltip: NavigationTreeLabels_properties.Navigation_action_collapse_all,
            handler: bind(this$, this$.#handleCollapseAll),
          }),
        ],
      }),
    }), config));
  }

  #handleExpandAll(): void {
    this.expandAll();
  }

  #handleCollapseAll(): void {
    this.collapseAll();
  }

}

export default NavigationTree;

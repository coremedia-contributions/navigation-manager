import ActionConfigUtil from "@coremedia/studio-client.ext.cap-base-components/actions/ActionConfigUtil";
import ContentAction from "@coremedia/studio-client.ext.cap-base-components/actions/ContentAction";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import { bind, cast } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import resourceManager from "@jangaroo/runtime/l10n/resourceManager";
import NavigationTreeLabels_properties from "../NavigationTreeLabels_properties";
import NavigationTreeRelation from "../components/NavigationTreeRelation";

interface ShowHiddenItemsActionConfig
  extends Config<ContentAction>,
    Partial<Pick<ShowHiddenItemsAction, "treeRelation">> {}

/**
 * @public
 */
class ShowHiddenItemsAction extends ContentAction {
  declare Config: ShowHiddenItemsActionConfig;

  static readonly VIEW_TREE_SETTINGS_HIDDEN: string = "showHiddenElementsInNavigationTree";

  constructor(config: Config<ShowHiddenItemsAction> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    this$.treeRelation = config.treeRelation;
    super(
      cast(
        ShowHiddenItemsAction,
        ActionConfigUtil.extendConfiguration(
          resourceManager.getResourceBundle(null, NavigationTreeLabels_properties).content,
          { handler: bind(this$, this$.#showHideItems) },
          NavigationTreeRelation.ACTION_ID_SHOW_HIDDEN,
          config,
        ),
      ),
    );
  }

  #showHideItems(): void {
    const showHiddenItems = this.treeRelation.toggleView();
    editorContext._.getPreferences().getType().removeProperty(ShowHiddenItemsAction.VIEW_TREE_SETTINGS_HIDDEN);
    editorContext._.getPreferences()
      .getType()
      .addBooleanProperty(ShowHiddenItemsAction.VIEW_TREE_SETTINGS_HIDDEN, showHiddenItems);
  }

  protected override isDisabledFor(contents: Array<any>): boolean {
    return this.getContents().length <= 0;
  }

  protected override isHiddenFor(contents: Array<any>): boolean {
    // only the delete button should be shown otherwise
    return this.isDisabledFor(contents);
  }

  #treeRelation: NavigationTreeRelation = null;

  get treeRelation(): NavigationTreeRelation {
    return this.#treeRelation;
  }

  set treeRelation(value: NavigationTreeRelation) {
    this.#treeRelation = value;
  }
}

export default ShowHiddenItemsAction;

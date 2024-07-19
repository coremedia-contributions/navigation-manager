import CoreIcons_properties from "@coremedia/studio-client.core-icons/CoreIcons_properties";
import OpenDialogAction from "@coremedia/studio-client.ext.ui-components/actions/OpenDialogAction";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import NavigationTreeLabels_properties from "../NavigationTreeLabels_properties";
import NavigationManager from "../components/NavigationManager";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import trace from "@jangaroo/runtime/trace";
import {bind} from "@jangaroo/runtime";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";

interface OpenNavigationEditorDialogActionConfig extends Config<OpenDialogAction>,
        Partial<Pick<OpenNavigationEditorDialogAction,
                | "contentValueExpression">> {
}

class OpenNavigationEditorDialogAction extends OpenDialogAction {
  declare Config: OpenNavigationEditorDialogActionConfig;

  contentValueExpression: ValueExpression = null;

  constructor(config: Config<OpenNavigationEditorDialogAction> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    super(ConfigUtils.apply(Config(OpenNavigationEditorDialogAction, {
      iconCls: CoreIcons_properties.tree_view,
      text: NavigationTreeLabels_properties.Navigation_window_title,
      //tooltip: "test NavigationTreeLabels_properties.Navigation_window_tooltip",
      //contentValueExpression: config.contentValueExpression,
      // todo there ris no plugins  plugins: [
       /* ]*/
      dialog: Config(NavigationManager, {selectionVE: config.contentValueExpression}),
    }), config));
    this.contentValueExpression = config.contentValueExpression;
    editorContext._.getSitesService().getPreferredSiteIdExpression().addChangeListener(bind(this$, this$.#onPreferredSiteChange));
  }

  protected override calculateDisabled(): boolean {
    return this.#disableOnNonPreferredSite();
    /*const content = this.getContentVE().getValue();
    trace("content", content)
    if (!content) {
      return true;
    }
    const siteService = editorContext._.getSitesService();
    trace("calc disable pref", siteService.getPreferredSiteId(), " content ", siteService.getSiteIdFor(content))

    const disabled = siteService.getPreferredSiteId() != siteService.getSiteIdFor(content);
    trace("disabled", disabled)
    return disabled;*/
  }

  #onPreferredSiteChange(){
    this.calculateDisabled();
    /*const disabled =  this.#disableOnNonPreferredSite();
    this.tooltip =  disabled ? NavigationTreeLabels_properties.PDEOpenNavigationTreeAction_disabled_tooltip
            : NavigationTreeLabels_properties.PDEOpenNavigationTreeAction_tooltip;*/
    //this.forceDisabledExpression??
  }

  #disableOnNonPreferredSite(): boolean {
    const content = this.getContentVE().getValue();
    if (!content) {
      return true;
    }
    const siteService = editorContext._.getSitesService();

    const disabled = siteService.getPreferredSiteId() != siteService.getSiteIdFor(content);
    return disabled;
  }

  getContentVE(): ValueExpression {
    if (this.contentValueExpression == null) {
      this.contentValueExpression = ValueExpressionFactory.createFromValue(null);
    }
    return this.contentValueExpression;
  }
}

export default OpenNavigationEditorDialogAction;

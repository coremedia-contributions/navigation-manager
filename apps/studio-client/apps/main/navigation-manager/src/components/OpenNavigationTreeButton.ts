import IconButton from "@coremedia/studio-client.ext.ui-components/components/IconButton";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import OpenNavigationEditorDialogAction from "../actions/OpenNavigationEditorDialogAction";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import trace from "@jangaroo/runtime/trace";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import {bind} from "@jangaroo/runtime";
import NavigationTreeLabels_properties from "../NavigationTreeLabels_properties";
import preferredSiteHelper from "./PreferredSiteHelper";

interface OpenNavigationTreeButtonConfig extends Config<IconButton>,
        Partial<Pick<OpenNavigationEditorDialogAction,
                | "contentValueExpression">> {
}

class OpenNavigationTreeButton extends IconButton {
  declare Config: OpenNavigationTreeButtonConfig;
  contentValueExpression: ValueExpression = null;

  constructor(config: Config<OpenNavigationTreeButton> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    super(ConfigUtils.apply(config, {
        baseAction: new OpenNavigationEditorDialogAction({
          contentValueExpression: config.contentValueExpression,
        }),
      //contentValueExpression: config.contentValueExpression
      plugins: [
        Config(BindPropertyPlugin, {
          componentProperty: "tooltip",
         /* bindTo:editorContext._.getSitesService().getPreferredSiteIdExpression(),
          transformer:(id):string=> id? "yes":"no",*/
          /*bindTo: ValueExpressionFactory.createFromFunction(() => {
            const disabled = this$.#disableOnNonPreferredSite();
            trace("disabled", disabled);
            return disabled ? NavigationTreeLabels_properties.PDEOpenNavigationTreeAction_disabled_tooltip
              : NavigationTreeLabels_properties.PDEOpenNavigationTreeAction_tooltip;
          }),*/
          /*bindTo: ValueExpressionFactory.createFromFunction((entity: any): string =>
              OpenNavigationTreeButton.disableOnNonPreferredSite2(entity)
            , config.contentValueExpression),*/
          bindTo: ValueExpressionFactory.createTransformingValueExpression(
            editorContext._.getSitesService().getPreferredSiteIdExpression(),
            (siteID) => {
              const disabled = preferredSiteHelper.contentOnPreferredSite(config.contentValueExpression.getValue());
              trace("disable" ,disabled)
              const tooltip = disabled ? NavigationTreeLabels_properties.PDEOpenNavigationTreeAction_disabled_tooltip
                : NavigationTreeLabels_properties.PDEOpenNavigationTreeAction_tooltip;
              trace("disable" ,tooltip,siteID);
              this$.setTooltip(tooltip);
              return tooltip;
            }),
          ifUndefined: "",
        })]
      })
    );
    //editorContext._.getSitesService().getPreferredSiteIdExpression().addChangeListener(bind(this$, this$.onPreferredSiteChange));
    //this$.onPreferredSiteChange(); // set initial tooltip
  }

  private onPreferredSiteChange() {
    const disabled = preferredSiteHelper.contentOnPreferredSite(this.getContentVE().getValue());
    const tooltip = disabled ? NavigationTreeLabels_properties.PDEOpenNavigationTreeAction_disabled_tooltip
      : NavigationTreeLabels_properties.PDEOpenNavigationTreeAction_tooltip;
    //this.setTooltip(tooltip);
    trace(this.getContentVE().getValue(), tooltip)
  }

  static disableOnNonPreferredSite(cve): boolean {
    const siteService = editorContext._.getSitesService();
    return siteService.getPreferredSiteId() != siteService.getSiteIdFor(cve.getValue());
  }

  static disableOnNonPreferredSite2(cve): string {
    const siteService = editorContext._.getSitesService();
    const disabled= siteService.getPreferredSiteId() != siteService.getSiteIdFor(cve.getValue());
    const tooltip = disabled ? NavigationTreeLabels_properties.PDEOpenNavigationTreeAction_disabled_tooltip
      : NavigationTreeLabels_properties.PDEOpenNavigationTreeAction_tooltip;
    return tooltip;
  }

  #disableOnNonPreferredSite(): boolean {
    const siteService = editorContext._.getSitesService();
    return siteService.getPreferredSiteId() != siteService.getSiteIdFor(this.getContentVE().getValue());
  }

  getContentVE(): ValueExpression {
    if (this.contentValueExpression == null) {
      this.contentValueExpression = ValueExpressionFactory.createFromValue(null);
    }
    return this.contentValueExpression;
  }

}

export default OpenNavigationTreeButton;


/*
*
*
* bindTo: ValueExpressionFactory.createFromFunction(
              () => {
                const disabled = this$.#disableOnNonPreferredSite();
                return disabled ? NavigationTreeLabels_properties.PDEOpenNavigationTreeAction_disabled_tooltip
                  : NavigationTreeLabels_properties.PDEOpenNavigationTreeAction_tooltip;
              }),*/

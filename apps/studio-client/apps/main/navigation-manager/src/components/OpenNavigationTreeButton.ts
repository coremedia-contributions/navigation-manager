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

interface OpenNavigationTreeButtonConfig extends Config<IconButton>,
        Partial<Pick<OpenNavigationEditorDialogAction,
                | "contentValueExpression">> {
}

class OpenNavigationTreeButton extends IconButton {
  declare Config: OpenNavigationTreeButtonConfig;
  #contentValueExpression: ValueExpression = null;

  constructor(config: Config<OpenNavigationTreeButton> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    super(ConfigUtils.apply(Config(OpenNavigationTreeButton, {
      baseAction: new OpenNavigationEditorDialogAction({
        contentValueExpression: config.contentValueExpression,
      }),
      plugins: [
        /*Config(BindPropertyPlugin, {
          componentProperty: "disabled",
          bindTo: ValueExpressionFactory.createFromFunction(//bind(this$,this$.#disableOnNonPreferredSite(config.contentValueExpression))),
                  //() => {return this$.#disableOnNonPreferredSite();}
                  //bind(this$, this$.#disableOnNonPreferredSite)
                  () => {
                    const siteService = editorContext._.getSitesService();
                    const disabled =  siteService?.getPreferredSiteId() != siteService.getSiteIdFor(config.contentValueExpression.getValue());
                    // if (disabled == undefined) {
                    //   return disabled;
                    // }
                    return undefined;
                  }),
          ifUndefined: true,
        }),*/
        Config(BindPropertyPlugin, {
          componentProperty: "tooltip",
          bindTo: ValueExpressionFactory.createFromFunction(
                  () => {
                    const disabled = this$.#disableOnNonPreferredSite();
                    return disabled ? NavigationTreeLabels_properties.PDEOpenNavigationTreeAction_disabled_tooltip
                            : NavigationTreeLabels_properties.PDEOpenNavigationTreeAction_tooltip;
                  }),
          ifUndefined: "",
        }),

      ],
    }), config));
    this$.#contentValueExpression = config.contentValueExpression;
  }

  disableOnNonPreferredSite(cve): boolean {
    const siteService = editorContext._.getSitesService();
    return siteService.getPreferredSiteId() != siteService.getSiteIdFor(cve.getValue());
  }

  #disableOnNonPreferredSite(): boolean {
    const siteService = editorContext._.getSitesService();
    return siteService.getPreferredSiteId() != siteService.getSiteIdFor(this.getContentVE().getValue());
  }

  getContentVE(): ValueExpression {
    if (this.#contentValueExpression == null) {
      this.#contentValueExpression = ValueExpressionFactory.createFromValue(null);
    }
    return this.#contentValueExpression;
  }

}

export default OpenNavigationTreeButton;

import CreateFromTemplateDialog from "@coremedia-blueprint/studio-client.main.create-from-template-studio-plugin/CreateFromTemplateDialog";
import CreateFromTemplateStudioPluginSettings_properties from "@coremedia-blueprint/studio-client.main.create-from-template-studio-plugin/CreateFromTemplateStudioPluginSettings_properties";
import ContentLocalizationUtil from "@coremedia/studio-client.cap-base-models/content/ContentLocalizationUtil";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import { bind } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import NavigationTreeLabels_properties from "../NavigationTreeLabels_properties";
import OpenCreateFromTemplateDialogActionBase from "./OpenCreateFromTemplateDialogActionBase";

interface OpenCreateFromTemplateDialogActionConfig
  extends Config<OpenCreateFromTemplateDialogActionBase>,
    Partial<Pick<OpenCreateFromTemplateDialogAction, "contentValueExpression">> {}

class OpenCreateFromTemplateDialogAction extends OpenCreateFromTemplateDialogActionBase {
  declare Config: OpenCreateFromTemplateDialogActionConfig;

  constructor(config: Config<OpenCreateFromTemplateDialogAction> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    super(
      ConfigUtils.apply(
        Config(OpenCreateFromTemplateDialogAction, {
          iconCls: ContentLocalizationUtil.getIconStyleClassForContentTypeName(
            CreateFromTemplateStudioPluginSettings_properties.doctype,
          ),
          toggleDialog: true,
          text: NavigationTreeLabels_properties.Navigation_action_create_from_template,
          dialog: Config(CreateFromTemplateDialog, {
            listeners: { afterrender: bind(this$, this$.updateProcessingData) },
          }),
        }),
        config,
      ),
    );
  }

  contentValueExpression: ValueExpression = null;
}

export default OpenCreateFromTemplateDialogAction;

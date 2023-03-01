import CreateFromTemplateDialog from "@coremedia-blueprint/studio-client.main.create-from-template-studio-plugin/CreateFromTemplateDialog";
import CreateFromTemplateStudioPluginSettings_properties from "@coremedia-blueprint/studio-client.main.create-from-template-studio-plugin/CreateFromTemplateStudioPluginSettings_properties";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import ContentProxyHelper from "@coremedia/studio-client.cap-rest-client/content/ContentProxyHelper";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ArrayUtils from "@coremedia/studio-client.client-core/util/ArrayUtils";
import OpenDialogAction from "@coremedia/studio-client.ext.ui-components/actions/OpenDialogAction";
import { is } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import trace from "@jangaroo/runtime/trace";
import OpenCreateFromTemplateDialogAction from "./OpenCreateFromTemplateDialogAction";

interface OpenCreateFromTemplateDialogActionBaseConfig extends Config<OpenDialogAction> {
}

class OpenCreateFromTemplateDialogActionBase extends OpenDialogAction {
  declare Config: OpenCreateFromTemplateDialogActionBaseConfig;

  #contentValueExpression: ValueExpression = null;

  constructor(config: Config<OpenCreateFromTemplateDialogAction> = null) {
    super(config);
    this.#contentValueExpression = config.contentValueExpression;
    if (!this.#contentValueExpression) {
      throw new Error("contentValueExpression is not configured.");
    }
  }

  protected updateProcessingData(dialog: CreateFromTemplateDialog): void {
    // Update reference to parent channel in processing data model
    try {
      const parentProperty = CreateFromTemplateStudioPluginSettings_properties.parent_property;
      dialog.getModel().set(parentProperty, this.#contentValueExpression.getValue());
    } catch (e) {
      if (is(e, Error)) {
        trace("[WARN] Unable to update parent channel in processing data. You might need to update the parent manually.");
      } else throw e;
    }
  }

  protected override calculateDisabled(): boolean {
    const contents = this.getContents();
    return !contents || contents.length === 0 || this.isDisabledFor(contents);
  }

  protected isDisabledFor(contents: Array<any>): boolean {
    return contents.some((content: Content): boolean =>
      !content.getState().readable || !content.isDocument() || !content.getType().isSubtypeOf("CMNavigation") || content.isCheckedOutByOther(),
    );
  }

  protected getContents(): Array<any> {
    return ContentProxyHelper.getContents(this.#getEntities());
  }

  #getEntities(): Array<any> {
    return ArrayUtils.asArray(this.#contentValueExpression.getValue());
  }
}

export default OpenCreateFromTemplateDialogActionBase;

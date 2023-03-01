import ContentLifecycleUtil from "@coremedia/studio-client.cap-base-models/content/ContentLifecycleUtil";
import ContentLocalizationUtil from "@coremedia/studio-client.cap-base-models/content/ContentLocalizationUtil";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import GridColumns_properties from "@coremedia/studio-client.ext.cap-base-components/columns/GridColumns_properties";
import IconColumn from "@coremedia/studio-client.ext.ui-components/grid/column/IconColumn";
import Ext from "@jangaroo/ext-ts";
import Model from "@jangaroo/ext-ts/data/Model";
import Store from "@jangaroo/ext-ts/data/Store";
import { as } from "@jangaroo/runtime";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import NavigationIdHelper from "./NavigationIdHelper";

interface StatusColumnConfig extends Config<IconColumn> {
}

class StatusColumn extends IconColumn {

  declare Config: StatusColumnConfig;

  constructor(config: Config<StatusColumn> = null) {
    super(ConfigUtils.apply(Config(StatusColumn, {
      header: GridColumns_properties.status_header,
      align: "center",
      width: 50,
      fixed: true,
      stateId: "status",
      dataIndex: "id",
    }), config));
  }

  /** @private */
  protected override calculateIconCls(value: any, metadata: any, record: Model, rowIndex: number, colIndex: number, store: Store): string {
    const content: Content = NavigationIdHelper.getContentById(value);
    return ContentLocalizationUtil.getIconStyleClassForContentStatus(content);
  }

  /** @private */
  protected override calculateToolTipText(value: any, metadata: any, record: Model, rowIndex: number, colIndex: number, store: Store): string {
    const data: any = Ext.apply({}, record.data, record.getAssociatedData());
    return ContentLifecycleUtil.getLocalizedDetailedLifecycleStatus(as(value, String), data.editor);
  }

  /** @private */
  protected override calculateIconText(value: any, metadata: any, record: Model, rowIndex: number, colIndex: number, store: Store): string {
    const data: any = Ext.apply({}, record.data, record.getAssociatedData());
    return ContentLifecycleUtil.getLocalizedDetailedLifecycleStatus(as(value, String), data.editor);
  }

}

export default StatusColumn;

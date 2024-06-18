import BaseModels_properties from "@coremedia/studio-client.base-models/BaseModels_properties";
import Calendar from "@coremedia/studio-client.client-core/data/Calendar";
import Model from "@jangaroo/ext-ts/data/Model";
import GridColumn from "@jangaroo/ext-ts/grid/column/Column";
import Format from "@jangaroo/ext-ts/util/Format";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import NavigationTreeLabels_properties from "../NavigationTreeLabels_properties";
import AbstractTreeModelBase from "./AbstractTreeModelBase";
import NavigationIdHelper from "./NavigationIdHelper";

interface ValidityDateColumnConfig extends Config<GridColumn> {
  mode: string;
}

class ValidityDateColumn extends GridColumn {
  declare Config: ValidityDateColumnConfig;

  constructor(config: Config<ValidityDateColumn> = null) {
    super(
      ConfigUtils.apply(
        Config(ValidityDateColumn, {
          mode: config.mode,
          header:
            "to" === config.mode
              ? NavigationTreeLabels_properties.validTo_column_header
              : NavigationTreeLabels_properties.validFrom_column_header,
          width: 150,
          stateId: "to" === config.mode ? "validTo" : "validFrom",
          dataIndex: "id",
          renderer:
            "to" === config.mode ? ValidityDateColumn.validToColRenderer : ValidityDateColumn.validFromColRenderer,
        }),
        config,
      ),
    );
  }

  static validFromColRenderer(value: any, metaData: any, record: Model): string {
    return ValidityDateColumn.formatValidityDate(value, "from");
  }

  static validToColRenderer(value: any, metaData: any, record: Model): string {
    return ValidityDateColumn.formatValidityDate(value, "to");
  }

  static formatValidityDate(id: string, mode: string): string {
    const content = NavigationIdHelper.getContentById(id);
    const validFromDate: Calendar =
      mode === "to"
        ? content.getProperties().get(AbstractTreeModelBase.VALID_TO)
        : content.getProperties().get(AbstractTreeModelBase.VALID_FROM);
    if (validFromDate) {
      return Format.date(validFromDate.getDate(), BaseModels_properties.dateFormat);
    }
    return "";
  }
}

export default ValidityDateColumn;

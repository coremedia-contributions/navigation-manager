import Model from "@jangaroo/ext-ts/data/Model";
import GridColumn from "@jangaroo/ext-ts/grid/column/Column";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import NavigationTreeLabels_properties from "../NavigationTreeLabels_properties";
import NavigationIdHelper from "./NavigationIdHelper";

interface TitleColumnConfig extends Config<GridColumn> {}

class TitleColumn extends GridColumn {
  declare Config: TitleColumnConfig;

  constructor(config: Config<TitleColumn> = null) {
    super(
      ConfigUtils.apply(
        Config(TitleColumn, {
          text: NavigationTreeLabels_properties.title_column_header,
          dataIndex: "id",
          flex: 1,
          stateId: "title",
          renderer: TitleColumn.titleColRenderer,
        }),
        config,
      ),
    );
  }

  static titleColRenderer(value: any, metaData: any, record: Model): string {
    const content = NavigationIdHelper.getContentById(value);
    return content.getProperties().get("title");
  }
}

export default TitleColumn;

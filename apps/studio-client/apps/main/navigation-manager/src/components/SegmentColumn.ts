import Model from "@jangaroo/ext-ts/data/Model";
import GridColumn from "@jangaroo/ext-ts/grid/column/Column";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import NavigationTreeLabels_properties from "../NavigationTreeLabels_properties";
import NavigationIdHelper from "./NavigationIdHelper";

interface SegmentColumnConfig extends Config<GridColumn> {}

class SegmentColumn extends GridColumn {
  declare Config: SegmentColumnConfig;

  constructor(config: Config<SegmentColumn> = null) {
    super(
      ConfigUtils.apply(
        Config(SegmentColumn, {
          text: NavigationTreeLabels_properties.segment_column_header,
          dataIndex: "id",
          flex: 1,
          stateId: "segment",
          renderer: SegmentColumn.segmentColRenderer,
        }),
        config,
      ),
    );
  }

  static segmentColRenderer(value: any, metaData: any, record: Model): string {
    const content = NavigationIdHelper.getContentById(value);
    return content.getProperties().get("segment");
  }
}

export default SegmentColumn;

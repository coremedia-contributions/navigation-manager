
/**
 * Interface values for ResourceBundle "NavigationTreeLabels".
 * @see NavigationTreeLabels_properties#INSTANCE
 */
interface NavigationTreeLabels_properties {

/**
 *Tree
 */
  Navigation_root_suffix: string;
  Navigation_window_title: string;
  Navigation_window_tooltip: string;
/**
 *Action
 */
  Navigation_action_show_in_tab: string;
  Navigation_action_show_in_library: string;
  Navigation_action_toggle_hidden_items: string;
  Navigation_action_hide_items: string;
  Navigation_action_create_from_template: string;
  Navigation_action_collapse_all: string;
  Navigation_action_expand_all: string;
  PDEOpenNavigationTreeAction_text: string;
  PDEOpenNavigationTreeAction_tooltip: string;
/**
 * Tree Relation message
 */
  navigation_checkout_error_title: string;
  navigation_checkout_error_message: string;
  navigation_children_property: string;

  /**
   * Columns
   */
  navigation_column_header: string;
  title_column_header: string;
  segment_column_header: string;
  validFrom_column_header: string;
  validTo_column_header: string;

  /**
   * Toolbar
   */
  toolbar_filter_field_emptyText: string;

  /**
   * Preferred site
   */
  navigation_preferred_site_is_selected: string;
  navigation_preferred_site_is_not_selected:  string;
}

/**
 * Singleton for the current user Locale's instance of ResourceBundle "NavigationTreeLabels".
 * @see NavigationTreeLabels_properties
 */ /*todo rename navigation tree bundle to manager*/
const NavigationTreeLabels_properties: NavigationTreeLabels_properties = {
  toolbar_filter_field_emptyText: "Type here to filter",
  navigation_column_header: "Navigation",
  title_column_header: "Title",
  segment_column_header: "Segment",
  validFrom_column_header: "Valid from",
  validTo_column_header: "Valid to",
  Navigation_root_suffix: "Navigation",
  Navigation_window_title: "Navigation Manager",
  Navigation_window_tooltip: "Open Navigation Tree Visualization",
  Navigation_action_show_in_tab: "Open Item in Tab",
  Navigation_action_show_in_library: "Show Item in Library",
  Navigation_action_toggle_hidden_items: "Show Hidden Navigation Items",
  Navigation_action_hide_items: "Show or Hide Invisible Navigation items",
  Navigation_action_create_from_template: "Create Page from Template",
  Navigation_action_collapse_all: "Collapse All",
  Navigation_action_expand_all: "Expand All",
  PDEOpenNavigationTreeAction_text: "Open Navigation Tree",
  PDEOpenNavigationTreeAction_tooltip: "Open Navigation Tree Visualization",
  navigation_checkout_error_title: "Error Editing Navigation Tree",
  navigation_checkout_error_message: "Failed to execute action because {0} '{1}' is checked out by another user",
  navigation_children_property: "",
  navigation_preferred_site_is_selected: "Preferred site is: ",
  navigation_preferred_site_is_not_selected: "Preferred site has to be selected",
};

export default NavigationTreeLabels_properties;

import ResourceBundleUtil from "@jangaroo/runtime/l10n/ResourceBundleUtil";
import NavigationTreeLabels_properties from "./NavigationTreeLabels_properties";

/**
 * Overrides of ResourceBundle "NavigationTreeLabels" for Locale "de".
 * @see NavigationTreeLabels_properties#INSTANCE
 */
ResourceBundleUtil.override(NavigationTreeLabels_properties, {
  Navigation_root_suffix: "Navigation",
  Navigation_window_title: "Navigation",
  Navigation_window_tooltip: "Öffne Navigationsbaumvisualisierung",
  Navigation_action_show_in_tab: "Content in einem Tab öffnen",
  Navigation_action_show_in_library: "Content in der Bibliothek anzeigen",
  Navigation_action_create_from_template: "Seite aus Vorlage erzeugen",
  PDEOpenNavigationTreeAction_text: "Navigationsbaum anzeigen",
  PDEOpenNavigationTreeAction_tooltip: "Navigationsbaumvisualisierung anzeigen",
  navigation_checkout_error_title: "Fehler beim Anzeigen des Navigationsbaumes",
  navigation_checkout_error_message:
    "Aktion konnte nicht ausgeführt werden weil {0} '{1}' von einem anderen User ausgeliehen ist.",
  navigation_children_property: "",
  toolbar_filter_field_emptyText: "Hier tippen zum filtern",
  Navigation_action_toggle_hidden_items: "Zeige versteckte Navigationseinträge",
  Navigation_action_hide_items: "Zeige oder verstecke unsichtbare Navigationseinträge",
  Navigation_action_collapse_all: "Alle einklappen",
  Navigation_action_expand_all: "Alle aufklappen",
  navigation_column_header: "Navigation",
  title_column_header: "Title",
  validFrom_column_header: "Gültig von",
  validTo_column_header: "Gültig bis",
});

const { jangarooConfig } = require("@jangaroo/core");

module.exports = jangarooConfig({
  type: "code",
  sencha: {
    name: "com.coremedia.blueprint__navigation-manager-studio",
    namespace: "com.coremedia.blueprint.studio.navigationtree",
    css: [
      {
        path: "resources/css/NavigationTree.css",
        bundle: false,
        includeInBundle: false,
      },
    ],
    studioPlugins: [
      {
        mainClass: "com.coremedia.blueprint.studio.navigationtree.NavigationTreeStudioPlugin",
        name: "Navigation Manager",
      },
    ],
  },
  appManifests: {
    en: {
      categories: [
        "Content"
      ],
      cmCategoryIcons: {
        Innovation: [
          {
            src: "packages/com.coremedia.blueprint__navigation-manager-studio/appIcons/innovation.svg",
            sizes: "24x24",
            type: "image/svg",
          },
          {
            src: "packages/com.coremedia.blueprint__navigation-manager-studio/appIcons/innovation.svg",
            sizes: "192x192",
            type: "image/svg",
          },
        ],
      },
      cmServiceShortcuts: [
        {
          cmKey: "cmNavigationEditor",
          cmCategory: "Content",
          name: "Navigation Manager",
          url: "",
          cmAdministrative: false,
          icons: [
            {
              src: "packages/com.coremedia.blueprint__navigation-manager-studio/appIcons/navigation.svg",
              sizes: "24x24",
              type: "image/svg",
            },
            {
              src: "packages/com.coremedia.blueprint__navigation-manager-studio/appIcons/navigation.svg",
              sizes: "192x192",
              type: "image/svg",
            },
          ],
          cmService: {
            name: "launchSubAppService",
            method: "launchSubApp",
          },
        },
      ],
    },
  },
});

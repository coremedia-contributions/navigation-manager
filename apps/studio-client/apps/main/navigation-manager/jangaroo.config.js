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
            src: "packages/com.coremedia.blueprint__navigation-manager-studio/appIcons/innovation_24.svg",
            sizes: "24x24",
            type: "image/svg",
          },
          {
            src: "packages/com.coremedia.blueprint__navigation-manager-studio/appIcons/innovation_192.png",
            sizes: "192x192",
            type: "image/png",
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
              src: "packages/com.coremedia.blueprint__navigation-manager-studio/appIcons/navigation_24.svg",
              sizes: "24x24",
              type: "image/svg",
            },
            {
              src: "packages/com.coremedia.blueprint__navigation-manager-studio/appIcons/navigation_192.png",
              sizes: "192x192",
              type: "image/png",
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

import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";

class PreferredSiteHelper {

  static contentOnPreferredSite(content: Content): boolean {
    if (!content) {
      return true;
    }
    const siteService = editorContext._.getSitesService();

    const disabled = siteService.getPreferredSiteId() != siteService.getSiteIdFor(content);
    return disabled;
  }

}

export default PreferredSiteHelper;

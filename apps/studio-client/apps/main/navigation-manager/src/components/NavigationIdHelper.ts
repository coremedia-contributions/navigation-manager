import session from "@coremedia/studio-client.cap-rest-client/common/session";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";

class NavigationIdHelper {

  static parseContentId(id: string): string {
    if (id && id.lastIndexOf("coremedia:///cap/", 0) === 0) {
      //truncate first part
      return id.substr(17);
    }
    return id;
  }

  static getContentById(id: string): Content {
    const contentId: string = NavigationIdHelper.parseContentId(id);
    return session._.getConnection().getContentRepository().getContent(contentId);
  }

}

export default NavigationIdHelper;

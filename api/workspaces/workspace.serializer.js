import BaseSerializer from "../../serializers/base.serializer.js";

class WorkspaceSerializer extends BaseSerializer {
  constructor() {
    super();
    this.properties = [
      "_id",
      "name",
      "description",
      "fileType",
      "fileSize",
      "metadata",
      "isPublic",
      "accountId",
      "userId",
      "teams",
      "lastAccessed",
      "createdAt",
      "updatedAt"
    ];
  }
}

export default new WorkspaceSerializer();


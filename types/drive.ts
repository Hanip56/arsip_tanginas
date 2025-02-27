import { drive_v3 } from "googleapis";

export type DriveFile = {
  id: string;
  name: string;
  webViewLink: string;
  mimeType: string;
  hasThumbnail: boolean;
  thumbnailLink: string;
  webContentLink: string;
  size: string;
  createdTime: string;
  modifiedTime: string;
  originalFilename: string;
  parents?: string[];
};

export type ParentAndGrandParentMapper = {
  parent: {
    map: Map<string | null | undefined, drive_v3.Schema$File>;
    ids: (string | null | undefined)[];
  };
  grandParent: {
    map: Map<string | null | undefined, drive_v3.Schema$File>;
    ids: (string | null | undefined)[];
  };
  prasaranaIds: (string | null | undefined)[];
};

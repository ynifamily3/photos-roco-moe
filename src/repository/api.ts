import axios, { isAxiosError } from "axios";
import { toJson } from "xml2json";

type S3ContentRaw = {
  Key: string;
  LastModified: string;
  ETag: string;
  Size: string;
  Owner: { ID: string };
  StorageClass: string;
};

type S3ListRaw = {
  ListBucketResult: {
    xmlns: string;
    Name: string;
    Prefix: {};
    Marker: {};
    MaxKeys: string;
    IsTruncated: string;
    Contents: Array<S3ContentRaw> | S3ContentRaw;
  };
};

const api = axios.create({
  baseURL: import.meta.env.PUBLIC_CDN,
  headers: {
    "User-Agent": import.meta.env.USER_AGENT,
  },
});

export async function getPhotos(page = 0) {
  try {
    const { data } = await api.get("/", {});
    const v = (toJson(data, { object: true }) as S3ListRaw).ListBucketResult
      .Contents;
    if (Array.isArray(v)) {
      return v;
    }
    return [v];
  } catch (e) {
    if (isAxiosError(e)) {
      console.log(
        `[${e.code}]: ${e.message} -- ${e.request.method} ${e.request.protocol}//${e.request.host}${e.request.path}`
      );
    }
    return [];
  }
}

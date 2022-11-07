const baseAPIEndpoint = "https://content.guardianapis.com/search?";
const apiKey = "ea44bea0-08c0-440d-b6b4-744ad892485d";
const fields = "&show-fields=headline,thumbnail,short-url";

export async function getNewsData(query, lang, pageSize) {
  query = query?.trim() ? "q=" + query : "";
  lang = lang?.trim() ? "&lang=" + lang : "";
  pageSize = pageSize?.trim() ? "&page-size=" + pageSize : "";
  const finalEndpoint =
    baseAPIEndpoint + query + lang + pageSize + fields + "&api-key=" + apiKey;

  try {
    const res = await fetch(finalEndpoint);
    const data = await res.json();

    return data.response;
  } catch (ex) {
    console.error(ex);
  }
}

export function formatNewsData(dataArr) {
  return dataArr.map((item) => ({
    pillar: item.pillarName,
    headline: item.fields.headline,
    url: item.fields.shortUrl,
    thumbnail: item.fields.thumbnail,
    date: new Date(item.webPublicationDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }));
}

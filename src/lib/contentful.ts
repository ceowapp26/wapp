import * as contentful from 'contentful';

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export async function fetchEntries(id: string) {
  const entry = await client.getEntry(id);
  return entry.fields;
}

import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "et01yfkf", // do sanity.json ou do site manage.sanity.io
  dataset: "production",
  apiVersion: "2025-09-23", // sempre use a data de hoje
  useCdn: true,
});

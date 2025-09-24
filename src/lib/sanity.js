import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "et01yfkf", 
  dataset: "production",
  apiVersion: "2025-09-23", 
  useCdn: true,
});

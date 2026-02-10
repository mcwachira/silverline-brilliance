import { type SchemaTypeDefinition } from "sanity";

import blockContent from "./schemas/blockContent";
import { category } from "./schemas/category";
import { blogPost } from "./schemas/blogPost";
import { author } from "./schemas/author";
import { gallery } from "./schemas/gallery";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blogPost, author, category, blockContent, gallery],
};

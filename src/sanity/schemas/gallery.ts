import { defineField, defineType } from "sanity";

export const gallery = defineType({
  name: "gallery",
  title: "Gallery",
  type: "object",
  fields: [
    defineField({
      name: "images",
      type: "array",
      title: "Images",
      of: [
        {
          name: "image",
          type: "image",
          title: "Image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "What's on this picture?",
              validation: (Rule) =>
                Rule.error("You forgot to describe this image").required(),
              options: {
                isHighlighted: true,
              },
            },
          ],
        },
      ],
      options: {
        layout: "grid",
      },
    }),
  ],

  preview: {
    select: {
      images: "images",
      image: "images.0",
    },
    prepare(selection) {
      const { images, image } = selection;

      return {
        title: `Gallery block of ${images.length} image${images.length !== 1 ? "s" : ""}`,
        subtitle: image?.alt ? `Alt text: ${image.alt}` : "No alt text",
        media: image,
      };
    },
  },
});

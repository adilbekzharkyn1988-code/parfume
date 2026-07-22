import { defineField, defineType } from "sanity";

export default defineType({
  name: "article",
  title: "Статья",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Заголовок", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug (для URL)", type: "slug", options: { source: "title", maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: "excerpt", title: "Короткое описание", type: "text" }),
    defineField({ name: "category", title: "Категория", type: "string" }),
    defineField({ name: "readTime", title: "Время чтения", type: "string" }),
    defineField({ name: "date", title: "Дата публикации", type: "date" }),
    defineField({ name: "cover", title: "Обложка", type: "string", options: { list: ["woody", "fresh", "oriental", "citrus", "floral", "gourmand", "musky", "spicy"] } }),
    defineField({ name: "content", title: "Текст статьи", type: "array", of: [{ type: "block" }] }),
  ],
  preview: { select: { title: "title", subtitle: "category" } },
});

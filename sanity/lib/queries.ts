import { groq } from "next-sanity";

export const productsQuery = groq`*[_type == "product"] | order(_createdAt desc){
  "slug": slug.current, name, brand, gender, family, familyLabel, concentration, description, story,
  "notes": { "top": notesTop, "heart": notesHeart, "base": notesBase },
  price5, price10, rating, reviews, badge, sillage, longevity, image
}`;

export const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug][0]{
  "slug": slug.current, name, brand, gender, family, familyLabel, concentration, description, story,
  "notes": { "top": notesTop, "heart": notesHeart, "base": notesBase },
  price5, price10, rating, reviews, badge, sillage, longevity, image
}`;

export const articlesQuery = groq`*[_type == "article"] | order(date desc){
  "slug": slug.current, title, excerpt, category, readTime, date, cover
}`;

export const articleBySlugQuery = groq`*[_type == "article" && slug.current == $slug][0]{
  "slug": slug.current, title, excerpt, category, readTime, date, cover, content
}`;

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";

interface RichTextProps {
  content: any;
  className?: string;
}

const options = {
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => <strong className="font-semibold text-ink">{text}</strong>,
    [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text: React.ReactNode) => <span className="underline">{text}</span>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node: any, children: React.ReactNode) => (
      <p className="text-ink/70 leading-relaxed mb-4 last:mb-0">{children}</p>
    ),
    [BLOCKS.HEADING_3]: (_node: any, children: React.ReactNode) => (
      <h3 className="font-display text-xl mb-3 mt-6 first:mt-0 text-ink">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (_node: any, children: React.ReactNode) => (
      <ul className="list-disc list-inside text-ink/70 leading-relaxed mb-4 space-y-1">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node: any, children: React.ReactNode) => (
      <ol className="list-decimal list-inside text-ink/70 leading-relaxed mb-4 space-y-1">{children}</ol>
    ),
    [BLOCKS.QUOTE]: (_node: any, children: React.ReactNode) => (
      <blockquote className="border-l-2 border-wine/40 pl-4 italic text-ink/60 my-4">{children}</blockquote>
    ),
  },
};

export default function RichText({ content, className }: RichTextProps) {
  if (!content) return null;

  // Fallback: обычная строка (мок-данные без Contentful)
  if (typeof content === "string") {
    return <p className={className || "text-ink/70 leading-relaxed"}>{content}</p>;
  }

  // Contentful Rich Text (объект document)
  return <div className={className}>{documentToReactComponents(content, options)}</div>;
}

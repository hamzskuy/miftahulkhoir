"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Image as ImageIcon, Undo, Redo,
} from "lucide-react";

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[240px] px-4 py-3 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return <div className="min-h-[240px] rounded-xl border border-masjid-800/20 p-4 text-sm text-masjid-800/60">Memuat editor...</div>;

  const addLink = () => {
    const url = window.prompt("URL tautan:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("URL gambar:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const btn = (active: boolean, onClick: () => void, icon: React.ReactNode, title: string) => (
    <button type="button" onClick={onClick} title={title} aria-pressed={active} className={`grid h-9 w-9 place-items-center rounded-lg border transition-colors ${active ? "border-masjid-800 bg-masjid-800 text-white shadow-sm" : "border-transparent text-masjid-800 hover:bg-masjid-50"}`}>
      {icon}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-masjid-800/20 bg-white">
      <div className="flex flex-wrap gap-1 border-b border-masjid-800/10 bg-masjid-50 p-2">
        {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <Bold className="h-4 w-4" />, "Bold")}
        {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <Italic className="h-4 w-4" />, "Italic")}
        {btn(editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon className="h-4 w-4" />, "Underline")}
        {btn(editor.isActive("heading", { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 className="h-4 w-4" />, "Heading 1")}
        {btn(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="h-4 w-4" />, "Heading 2")}
        {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), <List className="h-4 w-4" />, "Bullet List")}
        {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="h-4 w-4" />, "Numbered List")}
        {btn(editor.isActive({ textAlign: "left" }), () => editor.chain().focus().setTextAlign("left").run(), <AlignLeft className="h-4 w-4" />, "Align Left")}
        {btn(editor.isActive({ textAlign: "center" }), () => editor.chain().focus().setTextAlign("center").run(), <AlignCenter className="h-4 w-4" />, "Align Center")}
        {btn(editor.isActive({ textAlign: "right" }), () => editor.chain().focus().setTextAlign("right").run(), <AlignRight className="h-4 w-4" />, "Align Right")}
        {btn(editor.isActive("link"), addLink, <LinkIcon className="h-4 w-4" />, "Insert Link")}
        {btn(false, addImage, <ImageIcon className="h-4 w-4" />, "Insert Image (URL)")}
        {btn(false, () => editor.chain().focus().undo().run(), <Undo className="h-4 w-4" />, "Undo")}
        {btn(false, () => editor.chain().focus().redo().run(), <Redo className="h-4 w-4" />, "Redo")}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

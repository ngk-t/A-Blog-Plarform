'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Toolbar } from './Toolbar'
import Heading from '@tiptap/extension-heading'

export default function Tiptap({
    content,
    onChange,
}: {
    content: string | null
    onChange: (richText: string) => void
}) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({}), 
            // Heading.configure({
            //     levels: [2],
            //     HTMLAttributes: {
            //       class: "text-xl font-bold",
            //     },
            // }),
              
        ],
        content: content,
        editorProps: {
            attributes: {
                class:
                    "rounded-md border min-h-[200px] border-input px-2 py-2 text-justify" 
            },
        },
        onUpdate({editor}) {
            onChange(editor.getHTML())
            console.log(editor.getHTML())
        },
    })

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            editor?.commands.insertContent('\n');
        }
    };

    return (
        <div className='flex flex-col justify-stretch min-h-[300px]'>
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}
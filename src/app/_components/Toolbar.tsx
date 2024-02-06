"use client"

import { type Editor } from "@tiptap/react"
import {
    Bold,
    Strikethrough,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Underline as UnderlineIcon,
    Superscript,
    Subscript,
} from "lucide-react"

import { Toggle } from "~/components/ui/toggle"
// import Underline from "@tiptap/extension-underline"

type Props = {
    editor: Editor | null
}

export function Toolbar({ editor }: Props) {
    if(!editor) {
        return null
    }

    return (
        <div>
            {/* <Toggle
                size="sm"
                pressed={editor.isActive("heading")}
                onPressedChange={() => 
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
            >
                <Heading2 className="h-4 w-4" />
            </Toggle> */}

            <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() => 
                    editor.chain().focus().toggleBold().run()
                }
            >
                <Bold className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() => 
                    editor.chain().focus().toggleItalic().run()
                }
            >
                <Italic className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("underline")}
                onPressedChange={() => 
                    editor.chain().focus().toggleUnderline().run()
                }
            >
                <UnderlineIcon className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() => 
                    editor.chain().focus().toggleStrike().run()
                }
            >
                <Strikethrough className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("subscript")}
                onPressedChange={() => 
                    editor.chain().focus().toggleSubscript().run()
                }
            >
                <Subscript className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("superscript")}
                onPressedChange={() => 
                    editor.chain().focus().toggleSuperscript().run()
                }
            >
                <Superscript className="h-4 w-4" />
            </Toggle>

            {/* <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => 
                    editor.chain().focus().toggleBulletList().run()
                }
            >
                <List className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("oderedList")}
                onPressedChange={() => 
                    editor.chain().focus().toggleOrderedList().run()
                }
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle> */}

        </div>
    )
}
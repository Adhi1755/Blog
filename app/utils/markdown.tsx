import React from 'react'
import type { ContentBlock } from '../data/posts'

// Parses full string content into structured ContentBlock[]
export function parseMarkdownToBlocks(markdown: string): ContentBlock[] {
  if (!markdown) return []

  const blocks: ContentBlock[] = []
  
  // Normalize newlines
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  
  let inCodeBlock = false
  let codeBuffer: string[] = []
  let codeLang = 'text'

  let currentParagraph: string[] = []

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      blocks.push({ type: 'paragraph', text: currentParagraph.join('\n') })
      currentParagraph = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (inCodeBlock) {
      if (line.trim().startsWith('```')) {
        blocks.push({ type: 'code', language: codeLang, code: codeBuffer.join('\n') })
        inCodeBlock = false
        codeBuffer = []
      } else {
        codeBuffer.push(line)
      }
      continue
    }

    if (line.trim().startsWith('```')) {
      flushParagraph()
      inCodeBlock = true
      codeLang = line.trim().slice(3).trim() || 'text'
      continue
    }

    if (line.trim() === '') {
      flushParagraph()
      continue
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)/)
    if (headingMatch) {
      flushParagraph()
      blocks.push({ type: 'heading', text: headingMatch[2].trim() })
      continue
    }

    const tipMatch = line.match(/^>\s*tip:\s*(.*)/i)
    if (tipMatch) {
      flushParagraph()
      blocks.push({ type: 'tip', text: tipMatch[1].trim() })
      continue
    }

    // Is List item?
    if (/^\s*[-*]\s+/.test(line)) {
      // Lookahead to consume all subsequent list lines
      flushParagraph()
      const items = [line.replace(/^\s*[-*]\s+/, '').trim()]
      while (i + 1 < lines.length && /^\s*[-*]\s+/.test(lines[i + 1])) {
        items.push(lines[i + 1].replace(/^\s*[-*]\s+/, '').trim())
        i++
      }
      blocks.push({ type: 'list', items })
      continue
    }

    // Otherwise, push line to current paragraph
    currentParagraph.push(line)
  }

  flushParagraph()

  // Handle unclosed code block
  if (inCodeBlock) {
    blocks.push({ type: 'code', language: codeLang, code: codeBuffer.join('\n') })
  }

  return blocks
}

// Parses inline markdown inside a string into React nodes
export function renderInline(text: string | undefined): React.ReactNode {
  if (!text) return null

  // We convert basic inline rules into tokens: **bold**, _italic_, `code`, [link](url)
  // Split by regex capturing groups to keep the matches
  const regex = /(\*\*.*?\*\*|_.*?_|`.*?`|\[.*?\]\(.*?\))/g
  const parts = text.split(regex)

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-extrabold text-black">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('_') && part.endsWith('_')) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-neutral-100 border border-neutral-200 px-1 py-0.5 rounded-sm text-xs font-mono text-black font-semibold">
          {part.slice(1, -1)}
        </code>
      )
    }
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const closingBracket = part.indexOf('](')
      const label = part.slice(1, closingBracket)
      const url = part.slice(closingBracket + 2, -1)
      return (
        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-black underline underline-offset-4 decoration-neutral-300 hover:decoration-black transition-colors font-medium">
          {label}
        </a>
      )
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}

'use client';

import React, { useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rtl?: boolean;
}

export default function MarkdownEditor({ value, onChange, placeholder, rtl }: MarkdownEditorProps) {
  const options = useMemo(() => ({
    autofocus: false,
    spellChecker: false,
    placeholder: placeholder || 'Write your content here... (#, ##, ### for headings, lists, etc.)',
    status: false,
    toolbar: [
      'bold', 'italic', 'heading-2', 'heading-3', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image', '|', 'preview', 'guide'
    ],
  }), [placeholder]);

  const handleChange = useCallback((v: string) => {
    onChange(v);
  }, [onChange]);

  return (
    <div dir={rtl ? 'rtl' : 'ltr'}>
      <SimpleMDE
        value={value}
        onChange={handleChange}
        options={options}
      />
    </div>
  );
}



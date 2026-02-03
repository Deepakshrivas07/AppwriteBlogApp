import React from 'react'
import { Editor } from '@tinymce/tinymce-react'; //editor
import { Controller } from 'react-hook-form';

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className='w-full'> 
      {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Editor
            apiKey='xygn4wk85c60ia60da78ppdg8uybpimc0zi9mxqxtmv0e2cm'
            initialValue={defaultValue}
            value={value}
            onEditorChange={onChange}
            init={{
              height: 400,
              menubar: true,
              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount"
              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",

              // ✅ Disable TinyMCE analytics / telemetry to prevent ERR_BLOCKED_BY_CLIENT
              consent: false,
              branding: false, 
            }}
          />  
        )}
      />
    </div>
  );
}

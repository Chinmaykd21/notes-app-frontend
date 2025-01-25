import { ChangeEvent, useState } from "react";

export const TextEditor = () => {
  const [content, setContent] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto mt-10 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">Text Editor</h2>
      <textarea
        className="w-full h-40 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={content}
        onChange={handleChange}
        placeholder="Start typing here..."
      />
      <div className="mt-4 flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => alert("bold clicked")}
        >
          Bold
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => alert("italic clicked")}
        >
          Italic
        </button>
      </div>
    </div>
  );
};

import { useState } from "react";

interface ShortenTextProps {
  text: string;
  maxLength: number;
}

const ShortenText: React.FC<ShortenTextProps> = ({ text, maxLength }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortenedText =
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span title={text}>{shortenedText}</span>
      <button onClick={handleCopy} style={{ cursor: "pointer" }}>
        {copied ? "✅" : "📋"}
      </button>
    </div>
  );
};

export default ShortenText;

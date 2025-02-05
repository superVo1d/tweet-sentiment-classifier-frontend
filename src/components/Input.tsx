import { useEffect, useRef } from "react";
import './Input.scss';

const Input = ({
  value,
  onChange,
  onSubmit,
  isSubmitting,
}: {
  value: string;
  onChange: (e: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean
}) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  useEffect(() => {
    // Autofocus on mount
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!inputRef.current) return;

      const rect = inputRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;

      let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
      angle = (angle + 360) % 360;

      inputRef.current.style.setProperty("--start", (angle + 60).toString());
    };

    inputRef.current?.addEventListener("mousemove", handleMouseMove);

    return () => {
      inputRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key == 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="input" ref={inputRef}>
      <div className="glow"></div>
      <textarea
        ref={textareaRef}
        className="input-textarea"
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        rows={1}
        style={{ overflow: "hidden", resize: "none" }}
      />
      <button className="button" onClick={onSubmit}>
        {!isSubmitting && <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z" fill="currentColor"></path></svg>}
        {isSubmitting && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="7" width="10" height="10" rx="1.25" fill="currentColor"></rect></svg>}
      </button>
    </div>
  );
};

export default Input;

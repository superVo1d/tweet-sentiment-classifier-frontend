import { CSSProperties } from "react";
import './HighlightedText.scss';
import classNames from "classnames";

const HighlightedText = ({
  text,
  importance,
  sentiment
}: {
  text: string;
  importance: [string, number][];
  sentiment: string;
}) => {
  const importanceMap = new Map(importance);

  const highlightedText = text.split(/\s+/).map((word, index) => {
    const importanceScore = importanceMap.get(word.toLowerCase());
    return (
      <span key={index} className={importanceScore ? "highlight" : ""} style={importanceScore ? { "--weight": importanceScore } as CSSProperties : {}}>
        {word}
        {importanceScore && <sup className="importance-score">{importanceScore.toFixed(1)}</sup>}
      </span>
    );
  });

  return <p className={classNames('hightlight-text', `hightlight-text_${sentiment.toLowerCase()}`)}>{highlightedText.map((el, i) => (i > 0 ? [" ", el] : el))}</p>;
};

export default HighlightedText;
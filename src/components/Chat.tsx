import { motion, AnimatePresence } from "framer-motion";
import './Chat.scss';
import Input from "./Input";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import HighlightedText from "./HighlightedText";

type IListItems = {
    text: string;
    sentiment: string;
    importance: [string, number][];
}[];

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const apiBase = isDev ? 'http://localhost:8000' : 'https://tweet-sentiment-classifier.y3k.solutions'

const Chat = ({
  setSentiment,
  isLoading,
  setIsLoading
}: {
  sentiment?: string;
  setSentiment: (text: string) => void;
  isLoading?: boolean;
  setIsLoading: (isLoading: boolean) => void;
}) => {
  const [input, setInput] = useState('');
  const [items, setItems] = useState<IListItems>([]);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const chatListRef = useRef<HTMLDivElement>(null);

  const fetchApi = async () => {
    setIsLoading(true);

    const newAbortController = new AbortController();
    setAbortController(newAbortController);

    try {
      const res = await fetch(`${apiBase}/api/v1/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: input
        }),
        signal: newAbortController.signal
      });
  
      const data = await res.json();
  
      if (data.sentiment) {
        setSentiment(data.sentiment);
        setItems((prev) => [...prev, {
          text: input,
          importance: data.importance,
          sentiment: data.sentiment
        }]);
        setInput('');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return;
      }
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = () => {
    if (isLoading) {
      abortController?.abort();
    } else if (input.length) {
      fetchApi();
    }
  }

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [items]);

  useEffect(() => {
    return () => {
      abortController?.abort();
    };
  }, [abortController]);
  
  return (
    <div className="chat">
        {items.length > 0 && (
            <div className="list" ref={chatListRef}>
                <AnimatePresence>
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className={classNames("message", `message_${item.sentiment}`)}
                            >
                            <div className="message-question">
                              <div className="message-label">Text</div>
                              <div className="message-text">
                                <HighlightedText text={item.text} importance={item.importance} sentiment={item.sentiment} />
                              </div>
                            </div>
                            <div className="message-answer">
                              <div className="message-label">Sentiment</div>
                              <div
                                className="message-text"
                                dangerouslySetInnerHTML={{__html: item.sentiment}}
                              />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        )}
        <Input value={input} onChange={setInput} onSubmit={handleSubmit} isSubmitting={isLoading} />
    </div>
    );
}


export default Chat;

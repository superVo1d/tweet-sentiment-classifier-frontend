import { useState } from 'react';
import './App.scss';
import Chat from './components/Chat';
import BlobScene from './scenes/BlobScene';

const App = () => {
  const [sentiment, setSentiment] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
      <BlobScene sentiment={sentiment} />
      <Chat sentiment={sentiment} setSentiment={setSentiment} isLoading={isLoading} setIsLoading={setIsLoading} />
    </>
  );
}

export default App;

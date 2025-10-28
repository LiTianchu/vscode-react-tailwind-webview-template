import * as React from 'react';
import { messageHandler } from '@estruyf/vscode/dist/client';
import "./styles.css";


export const App: React.FC = () => {
  const [message, setMessage] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const sendMessage = () => {
    messageHandler.send('POST_DATA', { msg: 'Hello from the webview' });
  };

  const requestData = () => {
    messageHandler.request<string>('GET_DATA').then((msg) => {
      setMessage(msg);
    });
  };

  const requestWithErrorData = () => {
    messageHandler.request<string>('GET_DATA_ERROR')
    .then((msg) => {
      setMessage(msg);
    })
    .catch((err) => {
      setError(err);
    });
  };

  return (
    <div className='app h-full w-full bg-gray-800'>
      <h1 className='text-center py-4 font-bold '>Hello from the React Webview Starter</h1>

      <div className='flex gap-2 flex-col mb-4'>
        <button onClick={sendMessage} className='border border-sky-300 rounded-sm mx-2'>
          Send message to extension
        </button>

        <button onClick={requestData} className='border border-teal-300 rounded-sm mx-2'>
          Get data from extension
        </button>

        <button onClick={requestWithErrorData} className='border border-rose-300 rounded-sm mx-2'>
          Get data with error
        </button>
      </div>

      {message && <p className='text-white text-center mb-2'><strong>Message from the extension</strong>: {message}</p>}

      {error && <p className='text-red-200 text-center mb-w'><strong>ERROR</strong>: {error}</p>}
    </div>
  );
};

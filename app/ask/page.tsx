'use client';

import { useState, useRef, useEffect } from 'react';

export default function AskPage() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition and media recording are supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition && 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        setSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuestion(prev => prev + (prev ? ' ' : '') + transcript);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          model: 'mistral',
          prompt: question,
          stream: false
        }),
      });

      const data = await res.json();
      setResponse(data.response || 'No response received');
    } catch (error) {
      setResponse('Error: Failed to get response');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    if (!speechSupported) {
      alert('Audio recording is not supported in your browser');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Also start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const clearRecording = () => {
    setAudioBlob(null);
  };

  const handleAudioSubmit = async () => {
    if (!audioBlob) {
      alert('No audio recording available');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('model', 'mistral');
      formData.append('options', JSON.stringify({ 
        temperature: 0.7,
        transcribe_only: false
      }));

      const res = await fetch('/api/generate-audio', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (data.error) {
        setResponse(`Audio upload error: ${data.error}`);
      } else {
        setResponse(`Audio uploaded successfully! File ID: ${data.fileId}\nStatus: ${data.status}\nFile stored at: ${data.filePath}\n\nNote: Audio transcription and AI response generation will be implemented in future updates.`);
      }
    } catch (error) {
      setResponse('Error: Failed to upload audio');
      console.error('Audio upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Ask a Question
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Get answers to your questions using our AI assistant
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Split Layout: 80% Question Input, 20% Audio Recording */}
          <div className="flex gap-4">
            {/* 80% - Question Input Area */}
            <div className="w-4/5">
              <label htmlFor="question" className="sr-only">
                Your Question
              </label>
              <textarea
                id="question"
                name="question"
                rows={4}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm resize-none"
                placeholder="What would you like to ask? You can type or use voice recording..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading || isRecording}
              />
            </div>

            {/* 20% - Audio Recording Area */}
            <div className="w-1/5 flex flex-col justify-center space-y-2">
              {speechSupported ? (
                <>
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={loading}
                    className={`flex items-center justify-center p-3 rounded-md transition-all duration-200 ${
                      isRecording
                        ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    } disabled:bg-gray-200 disabled:cursor-not-allowed`}
                    title={isRecording ? 'Stop recording' : 'Start voice recording'}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {isRecording ? (
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a2 2 0 114 0v4a2 2 0 11-4 0V7z"
                          clipRule="evenodd"
                        />
                      ) : (
                        <path
                          fillRule="evenodd"
                          d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                          clipRule="evenodd"
                        />
                      )}
                    </svg>
                  </button>

                  {audioBlob && (
                    <button
                      type="button"
                      onClick={clearRecording}
                      disabled={loading || isRecording}
                      className="flex items-center justify-center p-2 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-md transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
                      title="Clear recording"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}

                  {isRecording && (
                    <div className="text-xs text-red-600 text-center animate-pulse">
                      🎤 Recording...
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs text-gray-400 text-center p-2">
                  Voice not supported
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading || !question.trim() || isRecording}
              className="flex-1 group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Ask Question'
              )}
            </button>

            {audioBlob && (
              <button
                type="button"
                onClick={handleAudioSubmit}
                disabled={loading || isRecording}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Submit Audio
              </button>
            )}

            {question && (
              <button
                type="button"
                onClick={() => setQuestion('')}
                disabled={loading || isRecording}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {response && (
          <div className="mt-6 p-4 bg-white rounded-md shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Response:</h3>
            <p className="text-gray-700">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
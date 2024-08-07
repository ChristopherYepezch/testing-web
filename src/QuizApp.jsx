import React, { useState, useEffect } from 'react';
import TestMode from './TestMode';
import PracticeMode from './PracticeMode';

const parseQuestions = (content) => {
  const questionBlocks = content.split('-').filter(block => block && block.trim() !== '');
  return questionBlocks.map(block => {
    const lines = block.trim().split('\n').filter(line => line.trim() !== '');
    if (lines.length < 3) {
      console.error('Invalid question block:', block);
      return null;
    }
    const question = lines[0];
    const options = lines.slice(1, -1);
    const answerLine = lines[lines.length - 1];
    const answerParts = answerLine.split(':');
    if (answerParts.length !== 2) {
      console.error('Invalid answer format:', answerLine);
      return null;
    }
    const answer = answerParts[1].trim();
    return { question, options, answer };
  }).filter(q => q !== null);
};

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [mode, setMode] = useState('test'); // 'test' or 'practice'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/questions.txt')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(content => {
        const parsedQuestions = parseQuestions(content);
        if (parsedQuestions.length === 0) {
          throw new Error('No valid questions found in the file');
        }
        setQuestions(parsedQuestions);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading questions:', error);
        setError('Error al cargar las preguntas. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Cargando preguntas...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => setMode('test')}
          className={`px-4 py-2 rounded ${mode === 'test' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Modo Test
        </button>
        <button
          onClick={() => setMode('practice')}
          className={`px-4 py-2 rounded ${mode === 'practice' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Modo Práctica
        </button>
      </div>
      {mode === 'test' ? (
        <TestMode questions={questions} />
      ) : (
        <PracticeMode questions={questions} />
      )}
    </div>
  );
};

export default QuizApp;
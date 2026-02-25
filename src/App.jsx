import { useState } from "react";
import Question from "./components/Question";
import Results from "./components/Results";
import { quizData, getRecommendation } from "./data";
import "./App.css";

// Главный компонент приложения
// Управляет состоянием квиза: текущий вопрос, ответы пользователя, результаты
export default function App() {
  // Состояния:
  // currentQuestionIndex - индекс текущего вопроса (0, 1, 2...)
  // answers - массив ответов пользователя {questionId: index_ответа}
  // isFinished - завершен ли квиз
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  // Обработчик выбора ответа
  const handleAnswerSelect = (answerIndex) => {
    const currentQuestion = quizData[currentQuestionIndex];

    // Сохраняем ответ пользователя
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: answerIndex
    };
    setAnswers(newAnswers);

    // Переходим на следующий вопрос или завершаем квиз
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Обработчик перезапуска квиза
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsFinished(false);
  };

  // Подсчет правильных ответов
  const calculateScore = () => {
    let score = 0;
    quizData.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  // Если квиз завершен - показываем результаты
  if (isFinished) {
    const score = calculateScore();
    const recommendation = getRecommendation(score, quizData.length);

    return (
      <div className="app">
        <Results
          score={score}
          totalQuestions={quizData.length}
          recommendation={recommendation}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  // Во время прохождения - показываем текущий вопрос
  const currentQuestion = quizData[currentQuestionIndex];

  return (
    <div className="app">
      <div className="container">
        <Question
          question={currentQuestion}
          currentNumber={currentQuestionIndex + 1}
          totalQuestions={quizData.length}
          onAnswerSelect={handleAnswerSelect}
        />
      </div>
    </div>
  );
}

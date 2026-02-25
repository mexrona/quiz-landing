// Компонент для отображения одного вопроса
// Props:
//   - question: объект вопроса
//   - currentNumber: текущий номер вопроса (1, 2, 3...)
//   - totalQuestions: общее количество вопросов
//   - onAnswerSelect: функция для обработки выбора ответа

export default function Question({
  question,
  currentNumber,
  totalQuestions,
  onAnswerSelect
}) {
  return (
    <div className="question-container">
      {/* Индикатор прогресса */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${(currentNumber / totalQuestions) * 100}%`
          }}
        ></div>
      </div>

      {/* Текст прогресса */}
      <div className="progress-text">
        Шаг {currentNumber} из {totalQuestions}
      </div>

      {/* Сам вопрос */}
      <h2 className="question-title">{question.question}</h2>

      {/* Варианты ответов - кнопки */}
      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            className="option-button"
            onClick={() => onAnswerSelect(index)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

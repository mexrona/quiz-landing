// Компонент для отображения одного вопроса
// Props:
//   - question: объект вопроса
//   - currentNumber: текущий номер вопроса (1, 2, 3...)
//   - totalQuestions: общее количество вопросов
//   - onAnswerSelect: функция для обработки выбора ответа
//   - timeLeft: оставшееся время в секундах

export default function Question({
  question,
  currentNumber,
  totalQuestions,
  onAnswerSelect,
  timeLeft
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

      {/* Текст прогресса и таймер */}
      <div className="progress-text">
        Шаг {currentNumber} из {totalQuestions} · Время: <span style={{ fontWeight: 'bold', color: timeLeft <= 3 ? '#e74c3c' : '#27ae60' }}>{timeLeft}с</span>
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

      {/* Кнопка "Назад" для возврата к предыдущему вопросу */}
      {/* Показывается только если не на первом вопросе */}
      {canGoBack && (
        <button
          className="back-button"
          onClick={onPreviousQuestion}
        >
          ← Назад
        </button>
      )}
    </div>
  );
}

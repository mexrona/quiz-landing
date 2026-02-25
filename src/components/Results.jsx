// Компонент для отображения результатов квиза
// Props:
//   - score: количество правильных ответов
//   - totalQuestions: общее количество вопросов
//   - recommendation: объект с рекомендацией
//   - onRestart: функция для перезапуска квиза

export default function Results({
  score,
  totalQuestions,
  recommendation,
  onRestart
}) {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="results-container">
      {/* Заголовок результата */}
      <h1 className={`results-title ${recommendation.color}`}>
        {recommendation.title}
      </h1>

      {/* Основной результат */}
      <div className="results-score">
        <div className="score-number">{score}</div>
        <div className="score-text">из {totalQuestions} вопросов</div>
      </div>

      {/* Процен правильных ответов */}
      <div className="results-percentage">
        <div className="percentage-circle">
          <span>{percentage}%</span>
        </div>
      </div>

      {/* Сообщение с рекомендацией */}
      <p className="results-message">{recommendation.message}</p>

      {/* Кнопка для перезапуска */}
      <button className="restart-button" onClick={onRestart}>
        Начать сначала
      </button>
    </div>
  );
}

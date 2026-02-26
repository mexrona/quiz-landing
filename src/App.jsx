import {useState, useEffect} from "react";
import Question from "./components/Question";
import Results from "./components/Results";
import {quizData, getRecommendation, getShuffledQuizData} from "./data";
import "./App.css";

// Главный компонент приложения
// Управляет состоянием квиза: текущий вопрос, ответы пользователя, результаты
export default function App() {
    // Состояния:
    // currentQuiz - перемешанный набор вопросов для текущей попытки
    // currentQuestionIndex - индекс текущего вопроса (0, 1, 2...) в currentQuiz
    // answers - объект с ответами пользователя {questionId: index_ответа}
    // isFinished - завершен ли квиз
    const [currentQuiz, setCurrentQuiz] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isFinished, setIsFinished] = useState(false);

    // useEffect: инициализируем новый перемешанный квиз при первой загрузке компонента
    useEffect(() => {
        const shuffledQuiz = getShuffledQuizData();
        setCurrentQuiz(shuffledQuiz);
    }, []);

    // Обработчик выбора ответа
    const handleAnswerSelect = (answerIndex) => {
        // Если по какой-то причине currentQuiz еще не загрузился - ничего не делаем
        if (currentQuiz.length === 0) return;

        const currentQuestion = currentQuiz[currentQuestionIndex];

        // Защита от undefined
        if (!currentQuestion) return;

        // Сохраняем ответ пользователя, используя id вопроса как ключ
        const newAnswers = {
            ...answers,
            [currentQuestion.id]: answerIndex,
        };
        setAnswers(newAnswers);

        // Логика навигации: проверяем, есть ли ещё вопросы
        const isLastQuestion = currentQuestionIndex >= currentQuiz.length - 1;

        if (isLastQuestion) {
            setIsFinished(true);
            return;
        }

        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    // Обработчик перезапуска квиза
    // Создает НОВЫЙ перемешанный набор вопросов и вариантов ответов
    const handleRestart = () => {
        const shuffledQuiz = getShuffledQuizData();
        setCurrentQuiz(shuffledQuiz);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setIsFinished(false);
    };

    // Подсчет правильных ответов на основе текущего набора вопросов
    const calculateScore = () => {
        let score = 0;
        currentQuiz.forEach((question) => {
            // Проверяем: если пользователь выбрал индекс, совпадающий с correctAnswer,
            // то это правильный ответ
            if (answers[question.id] === question.correctAnswer) {
                score++;
            }
        });
        return score;
    };

    // Если quizData еще загружается - показываем пустой экран
    if (currentQuiz.length === 0) {
        return <div className="app"></div>;
    }

    // Если квиз завершен - показываем результаты
    if (isFinished) {
        const score = calculateScore();
        const recommendation = getRecommendation(score, currentQuiz.length);

        return (
            <div className="app">
                <Results
                    score={score}
                    totalQuestions={currentQuiz.length}
                    recommendation={recommendation}
                    onRestart={handleRestart}
                />
            </div>
        );
    }

    // Во время прохождения - показываем текущий вопрос из перемешанного набора
    const currentQuestion = currentQuiz[currentQuestionIndex];

    return (
        <div className="app">
            <div className="container">
                <Question
                    question={currentQuestion}
                    currentNumber={currentQuestionIndex + 1}
                    totalQuestions={currentQuiz.length}
                    onAnswerSelect={handleAnswerSelect}
                />
            </div>
        </div>
    );
}

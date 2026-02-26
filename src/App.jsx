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
    // timeLeft - оставшееся время в секундах на текущий вопрос
    const [currentQuiz, setCurrentQuiz] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);

    // useEffect: инициализируем новый перемешанный квиз при первой загрузке компонента
    useEffect(() => {
        const shuffledQuiz = getShuffledQuizData();
        setCurrentQuiz(shuffledQuiz);
    }, []);

    // useEffect: управляем таймером для текущего вопроса
    useEffect(() => {
        // Сбрасываем таймер при смене вопроса
        setTimeLeft(10);

        // Если квиз уже завершен - таймер не нужен
        if (isFinished || currentQuiz.length === 0) return;

        // Таймер: отсчитываем каждую секунду
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                // Если время закончилось - переходим на следующий вопрос (пропускаем)
                if (prev <= 1) {
                    // Логика автоматического перехода (вопрос пропускается)
                    const isLastQuestion = currentQuestionIndex >= currentQuiz.length - 1;
                    if (isLastQuestion) {
                        setIsFinished(true);
                    } else {
                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestionIndex, isFinished, currentQuiz.length]);

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
        setTimeLeft(10);
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
                    timeLeft={timeLeft}
                />
            </div>
        </div>
    );
}

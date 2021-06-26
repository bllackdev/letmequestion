import { FormEvent, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import logoImg from "../assets/img/logo.svg";
import deleteImg from "../assets/img/delete.svg";

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

import "../styles/room.scss";
import "../styles/question.scss";
import { useRoom } from "../hooks/useRoom";

type RoomParams = {
    id: string;
};

export function AdminRoom() {
    const params = useParams<RoomParams>();
    const history = useHistory();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        });

        history.push("/");
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm("Tem certeza que você deseja excluir esta pergunta")) {
           await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmequestion" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map( questions => {
                        return (
                            <Question
                                key= {questions.id}
                                content = {questions.content}
                                author = {questions.author}
                            >
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(questions.id)}
                                >
                                    <img src={deleteImg} alt="Deletar pergunta" />
                                </button>
                            </Question>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
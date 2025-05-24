import { useState, useEffect } from "react";
import './App.css';
import Card from "../card/card.jsx";
import Button from "../components/button.jsx";
import React from 'react';

const CardVerso = [
    { id: 1, img: "/card_verso/kraken.png", value: 10 },
    { id: 2, img: "/card_verso/Sirene.png", value: 20 },
    { id: 3, img: "/card_verso/leviathan.png", value: 30 },
    { id: 4, img: "/card_verso/lockhness.png", value: 40 },
    { id: 5, img: "/card_verso/jormungand.png", value: 50 },
    { id: 6, img: "/card_verso/dragon.png", value: 60 },
    { id: 7, img: "/card_verso/hydre.png", value: 70 },
    { id: 8, img: "/card_verso/Hippocampe.png", value: 80 }
];


const CardRecto = "../public/card_recto/card_recto.png";

function App() {
    const [gameCards, setGameCards] = useState([]);
    const [firstSelection, setFirstSelection] = useState(null);
    const [secondSelection, setSecondSelection] = useState(null);
    const [locked, setLocked] = useState(false);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [moveCount, setMoveCount] = useState(0);
    const [isSoundOn, setIsSoundOn] = useState(true);
    
    // Initialiser ou réinitialiser le jeu
    const initializeGame = () => {
        const createPairs = () => {
            let pairs = [];
            CardVerso.forEach(card => {
                pairs.push({...card, matched: false, id: `${card.id}-1`});
                pairs.push({...card, matched: false, id: `${card.id}-2`});
            });
            return pairs;
        };
        
        // Mélanger les cartes (algorithme Fisher-Yates)
        const shuffleCards = (cards) => {
            const shuffled = [...cards];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        };
        
        // Générer et mélanger le jeu
        const pairs = createPairs();
        const shuffled = shuffleCards(pairs);
        
        // Réinitialiser l'état du jeu
        setGameCards(shuffled);
        setFirstSelection(null);
        setSecondSelection(null);
        setLocked(false);
        setMatchedPairs(0);
        setMoveCount(0);
    };
    
    // Initialiser le jeu au premier chargement
    useEffect(() => {
        initializeGame();
    }, []);
    
    // Vérifier les correspondances quand deux cartes sont sélectionnées
    useEffect(() => {
        if (firstSelection !== null && secondSelection !== null) {
            setLocked(true);
            setMoveCount(prev => prev + 1);
            
            const firstCard = gameCards[firstSelection];
            const secondCard = gameCards[secondSelection];
            
            // Vérifier si les valeurs correspondent
            if (firstCard.value === secondCard.value) {
                // Les cartes correspondent
                setGameCards(prevCards => {
                    const updatedCards = [...prevCards];
                    updatedCards[firstSelection] = {...firstCard, matched: true};
                    updatedCards[secondSelection] = {...secondCard, matched: true};
                    return updatedCards;
                });
                
                setMatchedPairs(prev => prev + 1);
                resetSelections();
                
            } else {
                setTimeout(() => resetSelections(), 1000);
            }
        }
    }, [firstSelection, secondSelection, gameCards]);


    useEffect(() => {
        if (matchedPairs === CardVerso.length) {
            alert("Vous avez gagné !");
        }
    })
    
    // Réinitialiser les sélections
    const resetSelections = () => {
        setFirstSelection(null);
        setSecondSelection(null);
        setLocked(false);
    };
    
    // Gérer le retournement d'une carte
    const handleCardFlip = (cardIndex) => {
        if (locked || 
            cardIndex === firstSelection || 
            gameCards[cardIndex].matched) {
            return;
        }
        
        // Première ou seconde sélection
        if (firstSelection === null) {
            setFirstSelection(cardIndex);
        } else if (secondSelection === null) {
            setSecondSelection(cardIndex);
        }
    };
    
    // Activer/désactiver le son
    const toggleSound = () => {
        setIsSoundOn(!isSoundOn);
    };
    
    return (
        <div className="game-container h-auto">
            <div className="game-header">
                <h1 className="game-title">Memory</h1>
                <button className="sound-button" onClick={toggleSound}>
                    {isSoundOn ? "🔊" : "🔇"}
                </button>
            </div>
            
            <div className="game-stats">
                <div></div>
                <div></div> 
                <div className="move-counter">
                    Nombre de Coups : <br />
                    {moveCount}
                </div>
            </div>
            
            <div className="game-board-container flex justify-end items-start w-full pr-10">
                <div className="game-board">
                {gameCards.map((card, index) => (
                    <Card 
                        key={card.id}
                        index={index} 
                        cardData={card}
                        cardRecto={CardRecto}
                        isFlipped={index === firstSelection || index === secondSelection || card.matched}
                        onCardFlip={() => handleCardFlip(index)}
                        />
                    ))}
                </div>

                <div className="restart-button">
                    <Button onClick={initializeGame}>Recommencer</Button>
                </div>
            </div>
        </div>
    );
}

export default App;

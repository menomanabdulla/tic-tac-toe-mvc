
// Game-Controller
const gameController = (() => {
    const data = {
        gameScore:  ["","","","","","","","",""],
        winigConditions: [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ],
        currentPlayer: 'X',
        winigPlayer: null,
        isWin: false,
        isDrawn: false
    }

    return {
        setPlayer: _ => {
            data.currentPlayer = data.currentPlayer === 'X' ? 'O' : 'X';
        },
        getPlayer: _ => data.currentPlayer,
        gameLogic: curentScore => {
            //set currentscore in to gameScore
            data.gameScore[curentScore] = data.currentPlayer;

            //Check gamescore satisfied any winigCondition

            for(let i = 0; i <= data.winigConditions.length -1; i++){

                let winigCondition = data.winigConditions[i];

                let a = data.gameScore[winigCondition[0]];
                let b = data.gameScore[winigCondition[1]];
                let c = data.gameScore[winigCondition[2]];

                if(a === "" || b === "" || c === ""){
                    continue;
                }

                //Check result is win or not
                if (a === b && b === c) {
                    data.winigPlayer = a;
                    data.isWin = true;
                    break;
                }
               
            }

            // Check result is drawn or not
            if(!data.gameScore.includes("")){
                data.isDrawn = true
            }

            return{
                isWin: data.isWin,
                isDrawn: data.isDrawn,
                winigPlayer: data.winigPlayer
            }

        },
        resetGame: _ => {
            data.gameScore = ["","","","","","","","",""];
            data.currentPlayer= 'X';
            data.winigPlayer= null;
            data.isWin= false;
            data.isDrawn= false;
        }
    }
})()

//UI-Controller
const UIController = (() => {

    const domSelectors ={
        cell: '.cell',
        gameStatus: '.game--status',
        gameRestart: '.game--restart'
    }

    const elementSelectAll = (selector) => {
        return document.querySelectorAll(selector);
    }

    const elementSelect = (selector) => {
        return document.querySelector(selector);
    }


    return {
        domSelectors,
        elementSelectAll,
        elementSelect,
        displayGameStatus: gameStatus => {
            elementSelect(domSelectors.gameStatus).textContent = gameStatus;
        },
        disPlayCellValue: (cell, currentPlayer) => {
            cell.target.textContent = currentPlayer;
            if ( currentPlayer == "X" ) { 
                cell.target.style.color = "blue";
            }else{
                cell.target.style.color = "red";
            }
        }
    }
})()


//App-Controller
const appController = (( gameCtrl, UICtrl ) => {

    const handleCellClick = e => {

        //Get data-attribute and parse it into integer
        let cell = parseInt(e.target.getAttribute('data-cell-index'));

        //Display curent score in UI
        UICtrl.disPlayCellValue(e, gameCtrl.getPlayer());

        //Set game score in dataStructure
        let result = gameCtrl.gameLogic(cell);

         // Change Player Turn
         gameCtrl.setPlayer();

         //Display Plyer Turn
         UICtrl.displayGameStatus('Player ' + gameCtrl.getPlayer()+ ' \'s turn');

        //Check match win or drawn
        if(result.isWin){
            UICtrl.displayGameStatus('Player ' + result.winigPlayer + ' is win');
        }else if(result.isDrawn){
            UICtrl.displayGameStatus('Game is Drawn');
        }
    }

    const handleReset = () => {

        //Reset gameController
        gameCtrl.resetGame();
        //Update UI
        UICtrl.displayGameStatus('Player ' + gameCtrl.getPlayer()+ ' \'s turn');
        UICtrl.elementSelectAll(UICtrl.domSelectors.cell).forEach( item => {
            item.textContent = "";
        })


    }

    const events = _ => {
        UICtrl.elementSelectAll(UICtrl.domSelectors.cell).forEach( item => {
            item.addEventListener('click', handleCellClick)
        })

        UICtrl.elementSelect(UICtrl.domSelectors.gameRestart).addEventListener('click', handleReset);
    }

    return{
        inte: () => {
            console.log('Application initilize')
            events();
            UICtrl.displayGameStatus('Player ' + gameCtrl.getPlayer() + ' \'s turn');
        }
    }
})(gameController, UIController)

appController.inte();
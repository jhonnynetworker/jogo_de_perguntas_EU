 const questionElement = document.getElementById('question');
 const choicesElement = document.getElementById('choices');
 const resultElement = document.getElementById('result');
 const nextButton = document.getElementById('next-button');

 let currentQuestion = null;

 // Função para buscar uma pergunta da API
 function fetchQuestion() {
     const url = 'https://opentdb.com/api.php?amount=15&category=23&type=multiple'; // Perguntas de Geografia (Categoria 22) relacionadas à Europa em português

     fetch(url)
         .then(response => response.json())
         .then(data => {
             if (data.results.length > 0) {
                 currentQuestion = data.results[0];
                 displayQuestion(currentQuestion);
             } else {
                 throw new Error('Nenhuma pergunta encontrada.');
             }
         })
         .catch(error => {
             console.error('Erro ao buscar a pergunta:', error);
         });
 }

 // Função para exibir a pergunta e as opções de escolha
 function displayQuestion(question) {
     questionElement.textContent = decodeHtmlEntities(question.question);

     const choices = question.incorrect_answers.concat(question.correct_answer);
     choices.sort(); // Ordena as opções em ordem alfabética

     // Limpa as opções de escolha anteriores
     choicesElement.innerHTML = '';

     // Cria um botão para cada opção de escolha
     choices.forEach(choice => {
         const button = document.createElement('button');
         button.textContent = decodeHtmlEntities(choice);
         button.addEventListener('click', () => checkAnswer(choice));
         choicesElement.appendChild(button);
     });
 }

 // Função para verificar se a resposta está correta
 function checkAnswer(choice) {
     const isCorrect = choice === currentQuestion.correct_answer;
     displayResult(isCorrect);
 }

 // Função para exibir o resultado da resposta
 function displayResult(correct) {
     if (correct) {
         resultElement.textContent = 'Resposta correta!';
     } else {
         resultElement.textContent = 'Resposta incorreta.';
     }

     // Exibe o botão "Próxima pergunta"
     nextButton.style.display = 'block';
 }

 // Função para decodificar entidades HTML especiais
 function decodeHtmlEntities(text) {
     const entities = {
         '&amp;': '&',
         '&lt;': '<',
         '&gt;': '>',
         '&quot;': '"',
         '&#039;': "'",
         '&eacute;': 'é',
         '&Auml;': 'Ä',
         // Adicione mais entidades HTML para caracteres especiais em português, se necessário
     };

     return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;|&eacute;|&Auml;/g, entity => {
         return entities[entity] || entity;
     });
 }

 // Evento de clique para o botão "Próxima pergunta"
 nextButton.addEventListener('click', () => {
     // Oculta o botão "Próxima pergunta"
     nextButton.style.display = 'none';

     // Limpa o resultado
     resultElement.textContent = '';

     // Busca a próxima pergunta
     fetchQuestion();
 });

 // Inicia o jogo buscando a primeira pergunta
 fetchQuestion();
// wait for page to load
window.addEventListener('DOMContentLoaded', function() {
    // get all elements from html
    var textArea = document.getElementById('text-input');
    var checkBox = document.getElementById('exclude-spaces');
    var setLimitCheckBox = document.getElementById('set-limit');
    var limitInput = document.getElementById('char-limit');
    var limitContainer = document.getElementById('limit-container');
    var warningBox = document.getElementById('warning-message');
    
    // get char counter element
    var charCounterBox = document.getElementById('char-counter');
    var charCounter = charCounterBox.querySelector('.count');
    
    // get word counter element
    var wordCounterBox = document.getElementById('word-counter');
    var wordCounter = wordCounterBox.querySelector('.count');
    
    // get sentence counter element
    var sentenceCounterBox = document.getElementById('sentence-counter');
    var sentenceCounter = sentenceCounterBox.querySelector('.count');
    var readingTime = document.getElementById('reading-time');
    var graphContainer = document.getElementById('letter-density-graph');
    var emptyMessage = document.getElementById('letter-density-message');
    var moreButton = document.getElementById('see-more-btn');
    var themeButton = document.getElementById('theme-toggle');
    
    // variables to remember things
    var showAll = false; 
    var darkMode = true;
    
    // run update function when page loads
    updateEverything();
    
    // add event listeners
    textArea.addEventListener('input', updateEverything);
    checkBox.addEventListener('change', updateEverything);
    
    setLimitCheckBox.addEventListener('change', function() {
        if (this.checked) {
            limitContainer.style.display = 'flex';
        } else {
            limitContainer.style.display = 'none';
        }
        updateEverything();
    });
    
    limitInput.addEventListener('input', updateEverything);
    moreButton.addEventListener('click', toggleShowMore);
    themeButton.addEventListener('click', toggleTheme);
    
    // function to update all counters
    function updateEverything() {
        var text = textArea.value;
        
        // count characters
        var chars = text.length;
        if (checkBox.checked) {
            chars = text.replace(/\s/g, '').length;
        }
        charCounter.textContent = chars;
        
        // check if limit is exceeded
        if (setLimitCheckBox.checked) {
            var limitValue = parseInt(limitInput.value);
            if (chars > limitValue) {
                warningBox.style.display = 'flex';
            } else {
                warningBox.style.display = 'none';
            }
        }
        
        // count words
        var trimmedText = text.trim();
        var wordCount = 0;
        if (trimmedText === '') {
            wordCount = 0;
        } else {
            var wordsArray = trimmedText.split(/\s+/);
            wordCount = wordsArray.length;
        }
        wordCounter.textContent = wordCount;
        
        // count sentences
        var sentencesArray = text.split(/[.!?]+/);
        var actualSentences = 0;
        for (var i = 0; i < sentencesArray.length; i++) {
            if (sentencesArray[i].trim() !== '') {
                actualSentences++;
            }
        }
        var sentenceText = actualSentences.toString();
        if (actualSentences < 10) {
            sentenceText = '0' + sentenceText;
        }
        sentenceCounter.textContent = sentenceText;
        
        // calculate reading time
        var readingMinutes = Math.ceil(wordCount / 200);
        if (readingMinutes === 1) {
            readingTime.textContent = readingMinutes + ' minute';
        } else {
            readingTime.textContent = readingMinutes + ' minutes';
        }
        
        // update letter graph
        updateLetterGraph(text);
    }
    
    // function to make letter frequency graph
    function updateLetterGraph(text) {
        if (text.trim() === '') {
            emptyMessage.style.display = 'block';
            graphContainer.innerHTML = '';
            return;
        }
        
        emptyMessage.style.display = 'none';
        
        // count how many times each letter appears
        var lettersLower = text.toLowerCase();
        var cleanText = '';
        for (var i = 0; i < lettersLower.length; i++) {
            var char = lettersLower[i];
            if ((char >= 'a' && char <= 'z')) {
                cleanText += char;
            }
        }
        
        var letterCount = {};
        for (var j = 0; j < cleanText.length; j++) {
            var currentLetter = cleanText[j];
            if (letterCount[currentLetter] === undefined) {
                letterCount[currentLetter] = 1;
            } else {
                letterCount[currentLetter]++;
            }
        }
        
        // convert to array
        var letterList = [];
        for (var letter in letterCount) {
            var count = letterCount[letter];
            var percent = ((count / cleanText.length) * 100).toFixed(2);
            letterList.push({
                letter: letter,
                count: count,
                percent: percent
            });
        }
        
        // sort by count
        for (var x = 0; x < letterList.length; x++) {
            for (var y = 0; y < letterList.length - 1; y++) {
                if (letterList[y].count < letterList[y + 1].count) {
                    var temp = letterList[y];
                    letterList[y] = letterList[y + 1];
                    letterList[y + 1] = temp;
                }
            }
        }
        
        // show letters
        var lettersToShow = [];
        if (showAll) {
            lettersToShow = letterList;
        } else {
            for (var k = 0; k < letterList.length && k < 5; k++) {
                lettersToShow.push(letterList[k]);
            }
        }
        
        // create elements
        graphContainer.innerHTML = '';
        
        for (var m = 0; m < lettersToShow.length; m++) {
            var item = lettersToShow[m];
            
            // container div
            var container = document.createElement('div');
            container.className = 'letter-bar-container';
            
            // letter text
            var letterDiv = document.createElement('div');
            letterDiv.className = 'letter';
            letterDiv.textContent = item.letter.toUpperCase();
            
            // bar wrapper
            var barWrapper = document.createElement('div');
            barWrapper.className = 'bar-container';
            
            // bar element
            var bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.width = item.percent + '%';
            
            // frequency text
            var freqDiv = document.createElement('div');
            freqDiv.className = 'frequency';
            freqDiv.textContent = item.count + ' (' + item.percent + '%)';
            
            // add elements together
            barWrapper.appendChild(bar);
            container.appendChild(letterDiv);
            container.appendChild(barWrapper);
            container.appendChild(freqDiv);
            
            graphContainer.appendChild(container);
        }
        
        // update button text
        if (showAll) {
            moreButton.textContent = 'Voir moins ';
            moreButton.classList.add('expanded');
        } else {
            moreButton.textContent = 'Voir plus ';
            moreButton.classList.remove('expanded');
        }
        
        // add icon again
        var icon = document.createElement('img');
        icon.src = 'assets/downarrow.png';
        icon.alt = 'Down arrow';
        icon.className = 'icon-down';
        moreButton.appendChild(icon);
        
        // show or hide button
        if (letterList.length > 5) {
            moreButton.style.display = 'flex';
        } else {
            moreButton.style.display = 'none';
        }
    }
    
    // function to toggle show all letters
    function toggleShowMore() {
        showAll = !showAll;
        updateEverything();
    }
    
    // function to toggle theme
    function toggleTheme() {
        darkMode = !darkMode;
        
        if (darkMode) {
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
        }
    }
});

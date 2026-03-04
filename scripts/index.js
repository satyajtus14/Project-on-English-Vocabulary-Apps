/* Find the Synonym word to word details */
const createElement = (arr) => {
const htmlElement = arr.map((el) => `<span class="btn bg-sky-100">${el}</span>`);
return(htmlElement.join(''));
}

/* Help to speak the word */
function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
  }


/* manage spinner while data take time to load*/
const manageSpinner = (status)  => {
    
    if(status === true){
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');

    }
    else{
        document.getElementById('word-container').classList.remove('hidden');
        document.getElementById('spinner').classList.add('hidden');
    }
}


/* Lesson loading Section */
const loadLessons = () => {
fetch('https://openapi.programming-hero.com/api/levels/all') // Promise of response
.then((res) => res.json()) // promise of json data
.then((data) => displayLessons(data.data)) // log the data
}

/* Remove Active status to All lessons buttons */
 const removeActive =() => {
 const lessonBtn = document.querySelectorAll('.lesson-btn');
lessonBtn.forEach(btn => {
 btn.classList.remove('btn-active');
    })
}

/* Word loading Section */
const loadLevelWord = (id) => {
    /* Send spinning status */
    manageSpinner(true);

    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then(res => res.json())
    .then((data) => {
       
        /* Calling function for remove active status */
        removeActive();

       const clickBtn = document.getElementById(`lesson-btn-${id}`);
         clickBtn.classList.add('btn-active');
        displayLevelWord(data.data)
    })
        
    
}

/* Load Specific word details */
const loadWordDetails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
   const res = await fetch(url);
   const details = await res.json();
   displayWordDetails(details.data);
    
}

/* Modal Section and displaying details of specific word */
const displayWordDetails = (word) => {
      
    const detailsBox = document.getElementById('details-container');
    detailsBox.innerHTML = `
    <div class="">
        <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
     </div>
     <div class="">
        <h2 class="font-bold">Meaning</h2>
        <p>${word.meaning}</p>
     </div>
     <div class="">
        <h2 class="font-bold">Example</h2>
        <p>${word.sentence}</p>
        
     </div>
     <div class="">
        <h2 class="font-bold">সমার্থক শব্দ গুলো</h2>
     
         <div class="gap-3">${createElement(word.synonyms)}</div>
        <br> <br>
        <button class="btn btn-primary w-50 ">Complete Learning</button>
     </div>
    
    
    `;
    document.getElementById('word_modal').showModal();  
};

const displayLevelWord = (words) => {
    /* step-1 Get the container and empty it */
const wordContainer = document.getElementById('word-container');
wordContainer.innerHTML = '';

/* If any lesson-level has no lesson */
if(words.length === 0){
    wordContainer.innerHTML = `
        <div 
        class="text-center col-span-full font-bangla  rounded-xl py-10 space-y-6">
        <img src="./assets/alert-error.png" alt="" class="mx-auto">
        <p class="text-xl font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান ।</h2>
       </div>
    `;
    manageSpinner(false);
    return;
}

/* step-2 Get into the every lessons */
    words.forEach((word) => {
        
        console.log(word);
     /* step-3 Create elements for all lessons */
    const wordDiv = document.createElement('div');
    wordDiv.innerHTML = `
          <div 
          class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-5">
        <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
        <p class="font-semibold">Meaning /Pronunciation</p>
        <div class="font-semibold text-2xl font-bangla ">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি "} / ${word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায়নি " }"</div>
        <div class="image flex justify-between items-center">
         <button onclick="loadWordDetails(${word.id})" class="btn bg-[#1A91EE10] hover:bg-[#1A91EE80]"><i class="fa-solid fa-circle-info"></i></button>
         <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91EE10] hover:bg-[#1A91EE80]"><i class="fa-solid fa-volume-high"></i></button>
        </div>
      </div>
        
    `;

      /* step-4 append into the parent(container) */
    wordContainer.append(wordDiv);
});
manageSpinner(false);
};


const displayLessons = (lessons) => {
    console.log(lessons);
    /* step-1 Get the container and empty it */
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = '';

    /* step-2 Get into the every lessons */
  for (const lesson of lessons) {
    console.log(lesson);

  
    /* step-3 Create elements for all lessons */
    const btnDiv = document.createElement('div');
    btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open "></i> Lesson - ${lesson.level_no} </button> 
    `;
    /* step-4 append into the parent(container) */
    levelContainer.append(btnDiv);
};
};

/* Calling function for loading lesson no */
loadLessons();

/* Add Searching feature */
document.getElementById('btn-search').addEventListener('click', () => {
    removeActive();
    const searchInput = document.getElementById('input-search');
    const searchValue = searchInput.value.trim().toLowerCase();

    fetch('https://openapi.programming-hero.com/api/words/all')
    .then((res)=> res.json())
    .then((data) =>{
        const allWords = data.data;
       
        const filterWord = allWords.filter((word) => word.word.toLowerCase().includes(searchValue));
        console.log(filterWord);
 
        displayLevelWord(filterWord);

         /* Clear the search input */
         searchInput.value = '';
    }
);

    
    })
 

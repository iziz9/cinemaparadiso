import {modalControl} from './modal.js'
import API_KEY from './apikey.js';


// 초기화 코드
const moviesEl = document.querySelector('.movies');
const searchFormEl = document.querySelector('.search-form');
const searchInputEl = document.querySelector('.search-input');
const moreBtnEl = document.querySelector('.more-btn');
const totalEl = document.querySelector('.total');
const loadEl = document.querySelector('.loading');
const modalEl = document.querySelector('.modal-inner');
const message = document.createElement('span')

let page = 1;
let maxPage = -1;
let title = "";
let year = ""; 

// 최초 호출
;(async () => {
  const movies = await getMovies();
  page += 1;
  renderMovies(movies);
})

// 검색창에 영화 제목 input 이벤트
searchFormEl.addEventListener('submit', async (event) => {
  event.preventDefault();
  deleteResult();
  loading()
  title = searchInputEl.value;

  if (title !== "" && title.length > 2) {
    const {movies, totalResults } = await getMovies(title, year, page);

    renderMovies(movies, totalResults);
    pieces(movies);
  } else {
    errorMessage();
  }
});


//에러메시지 출력
function errorMessage() {
  message.classList.add('error');
  loaded()

  //한글 입력 검사
  let koCheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  
  if (title === "" || title.length < 3) {
    message.textContent = `Please enter at least 3 characters.`;
  } else if ( koCheck.test(title) == true ) {
    message.textContent = `Please enter the search word in English.`;
  } else {
    message.textContent = `Movie not found!`;
  }
  moviesEl.append(message);
  setMoreBtnVisibility();
}


// 기존 출력 내용 지우기
function deleteResult () {
  moviesEl.textContent = "";
  totalEl.textContent = "";
  page = 1;
}

// 화면에 더 출력하기
async function moreMovies() {
  page += 1;
  const {movies, totalResults} = await getMovies(title, year, page);
  renderMovies(movies, totalResults);
}

// 출력갯수 옵션 선택
function pieces(movies) {
  const selectPieces = document.querySelector('.pieces:checked').value;
  for (let i = 1; i < selectPieces; i+=1) {
    moreMovies();
  }
}


// 더보기 버튼 클릭이벤트
const moreBtnClick = 
  moreBtnEl.addEventListener('click', () => {
    moreMovies()
  });


// 더보기 버튼 나타내기/숨기기
function setMoreBtnVisibility(totalResults, page) {
  maxPage = Math.ceil(+(totalResults / 10)); //+로 string에서 Number 형변환
  if (page < maxPage && totalResults > 10) {
    moreBtnEl.style.visibility = 'visible';
  } else {
    moreBtnEl.style.visibility = 'hidden';
  }
}

// 로딩애니메이션
function loading() {
  loadEl.style.visibility = "visible";
}
function loaded() {
  loadEl.style.visibility = "hidden";
}


// 영화 정보 가져오기
async function getMovies(title, year = '', page = 1) {

  const y = `&y=${year}`;
  const res = await fetch(`https://omdbapi.com/?apikey=${API_KEY}&s=${title}${y}&page=${page}`);
  const json = await res.json();
  if (json.Response === 'True') {
    const { Search: movies, totalResults } = json
    return {
      movies,
      totalResults
      // page
    }
  } 
  else {  //에러메세지 출력
    errorMessage();
  }
}


// 결과 갯수 출력
function displayTotalResult(totalResults) {
  totalEl.textContent = `Total Results ${totalResults}`;
  if (totalEl.textcontent === '' && page===1) {
    moviesEl.append(totalEl);
  } 
}
  
// 영화 목록 출력
function renderMovies(movies, totalResults) {
  displayTotalResult(totalResults);
  for (const movie of movies) {
    const el = document.createElement('div');
    el.classList.add('movie');
    const titleEl = document.createElement('h1');
    titleEl.textContent = movie.Title;
    const imgEl = document.createElement('img');
    imgEl.src = movie.Poster;
    imgEl.alt = movie.Title;
    imgEl.onerror = function() {
      this.src = "./images/No-image.png";
      this.alt = "Alternative image";
    }
    el.append(imgEl, titleEl);
    moviesEl.append(el); 
    
    const id = movie.imdbID;
    el.addEventListener("click", async () => {
      modalControl();
      const detail = await getMovieDetail(id);
      renderMovieDetail(detail);
    })
  }
  setMoreBtnVisibility(totalResults, page);
  loaded();
}




async function getMovieDetail(id) {
  const res = await fetch(`https://omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`)
  const movieDetail = await res.json()
  if (movieDetail.Response === 'True') {
    return movieDetail
  }
  return movieDetail.Error
}



// 상세정보 출력하기
function renderMovieDetail(movieDetail) {
  modalEl.textContent='';
  console.log(movieDetail);

    // 영화이미지 출력
    const imageContainer = document.createElement('div'); 
    imageContainer.classList.add('modal-img');
    const imgEl = document.createElement('img');
    imgEl.src = movieDetail.Poster;
    imgEl.alt = movieDetail.Title;
    imgEl.onerror = function() {
      this.src = "./images/No-image.png";
      this.alt = "Alternative image";
    }
    console.log(imgEl.src)

    // 타이틀 출력
    const modalTitleEl = document.createElement('h2'); 
    modalTitleEl.textContent = movieDetail.Title
    // 컨텐트 컨테이너
    const modalContentEl = document.createElement('div'); 
    modalContentEl.classList.add('modal-content');
    // 컨텐트 - 개봉정보
    const releasedEl = document.createElement('div');
    releasedEl.classList.add('released');
    releasedEl.textContent = `${movieDetail.Released}, ${movieDetail.Runtime}, ${movieDetail.Country}`;
    // 컨텐트 - 감독
    const directorEl = document.createElement('div');
    directorEl.classList.add('director');
    directorEl.textContent = `${movieDetail.Director}`;
    // 컨텐트 - 배우
    const actorsEl = document.createElement('div');
    actorsEl.classList.add('actors');
    actorsEl.textContent = `${movieDetail.Actors}`;
    // 컨텐트 - 플롯
    const plotEl = document.createElement('div');
    plotEl.classList.add('plot');
    plotEl.textContent = `${movieDetail.Plot}`;
    // 컨텐트 - 평점
    const ratingsEl = document.createElement('div');
    const imdbEl = document.createElement('div');
    const imdbImgEl = document.createElement('div');
    imdbImgEl.classList.add('rating-img');
    const imdbRatingEl = document.createElement('div');
    imdbRatingEl.classList.add('rating-text');

    const rottenEl = document.createElement('div');
    const rottenImgEl = document.createElement('div');
    rottenImgEl.classList.add('rating-img');
    const rottenRatingEl = document.createElement('div');
    rottenRatingEl.classList.add('rating-text');

    const metaEl = document.createElement('div');
    const metaImgEl = document.createElement('div');
    metaImgEl.classList.add('rating-img');
    const metaRatingEl = document.createElement('div');
    metaRatingEl.classList.add('rating-text');

    // html에 넣어주기
    modalEl.append(
      imageContainer, 
      imgEl,
      modalTitleEl, 
      modalContentEl, 
      releasedEl, 
      directorEl, 
      actorsEl, 
      plotEl, 
      ratingsEl,
      imdbEl,
      imdbImgEl,
      imdbRatingEl,
      rottenEl,
      rottenImgEl,
      rottenRatingEl,
      metaEl,
      metaImgEl,
      metaRatingEl
      );
}

import {modalControl} from './modal.js'


// 초기화 코드
const moviesEl = document.querySelector('.movies');
const searchFormEl = document.querySelector('.search-form');
const searchInputEl = document.querySelector('.search-input');
const moreBtnEl = document.querySelector('.more-btn');
const totalEl = document.querySelector('.total');
const loadEl = document.querySelector('.loading');
const movieEl = document.querySelector('.movie');
const modalEl = document.querySelector('.modal');
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
    const {movies, totalResults} = await getMovies(title, year, page);
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
  if (selectPieces === "20") {
    moreMovies();
  } else if (selectPieces === "30") {
    moreMovies();
    moreMovies();
  }
  console.log(movies)
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
  const s = `&s=${title}`;
  const y = `&y=${year}`;
  const p = `&page=${page}`;
  const res = await fetch(`https://omdbapi.com/?apikey=7035c60c${s}${y}${p}`);
  const json = await res.json();
  if (json.Response === 'True') {
    const { Search: movies, totalResults } = json
    return {
      movies,
      totalResults,
      page
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
    imgEl.alt = "Movie poster";
    imgEl.onerror = function() {
      this.src = "./images/No-image.png";
      this.alt = "Alternative image";
    }
    el.append(imgEl, titleEl);
    moviesEl.append(el); 
    
    // const id = movie.imdbID;

    // el.addEventListener("click", async() => {
    //   const detail = await getMovieDetail(id);
    //   renderMovieDetail(detail);
    // })
  }
  setMoreBtnVisibility(totalResults, page);
  modalControl();
  loaded();
}


async function getMovieDetail(id) {
  const res = await fetch(`https://omdbapi.com/?apikey=7035c60c&i=${id}&plot=full`)
  const movieDetail = await res.json()
  if (movieDetail.Response === 'True') {
    return movieDetail
  }
  return movieDetail.Error
}



// 상세정보 출력하기
function renderMovieDetail(detail) {
    const modalEl = document.querySelector('.modal-window'); 
    // 영화이미지 출력
    const imageContainer = modalEl.createElement('div'); 
    imageContainer.classList.add('modal-img');
    const imgEl = imageContainer.createElement('img');
    if (detail.Poster === 'N/A') {
      detail.Poster = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019'
    } else {
      imgEl.src = detail.Poster;
    }
    // 타이틀 출력
    const modalTitleEl = modalEl.createElement('h2'); 
    modalTitleEl.textContent = detail.Title
    // 컨텐트 컨테이너
    const modalContentEl = modalEl.createElement('div'); 
    modalContentEl.classList.add('modal-content');
    // 컨텐트 - 개봉정보
    const releasedEl = modalContentEl.createElement('div');
    releasedEl.classList.add('released');
    releasedEl.textContent = `${detail.Released}, ${detail.Runtime}, ${detail.Country}`;
    // 컨텐트 - 감독
    const directorEl = modalEl.createElement('div');
    directorEl.classList.add('director');
    directorEl.textContent = `${detail.Director}`;
    // 컨텐트 - 배우
    const actorsEl = modalEl.createElement('div');
    actorsEl.classList.add('actors');
    actorsEl.textContent = `${detail.Actors}`;
    // 컨텐트 - 플롯
    const plotEl = modalEl.createElement('div');
    plotEl.classList.add('plot');
    plotEl.textContent = `${detail.Plot}`;
    // 컨텐트 - 평점
    const ratingsEl = modalEl.createElement('div');
    const imdbEl = ratingsEl.createElement('div');
    const imdbImgEl = imdbEl.createElement('div');
    imdbImgEl.classList.add('rating-img');
    const imdbRatingEl = imdbEl.createElement('div');
    imdbRatingEl.classList.add('rating-text');

    const rottenEl = ratingsEl.createElement('div');
    const rottenImgEl = rottenEl.createElement('div');
    rottenImgEl.classList.add('rating-img');
    const rottenRatingEl = rottenEl.createElement('div');
    rottenRatingEl.classList.add('rating-text');

    const metaEl = ratingsEl.createElement('div');
    const metaImgEl = metaEl.createElement('div');
    metaImgEl.classList.add('rating-img');
    const metaRatingEl = metaEl.createElement('div');
    metaRatingEl.classList.add('rating-text');

    // html에 넣어주기
    modalEl.append(
      imageContainer, 
      modalTitleEl, 
      modalContentEl, 
      releasedEl, 
      directorEl, 
      actorsEl, 
      plotEl, 
      ratingsEl);
}

import { modalControl } from './modal.js'
import { getMovieDetail, renderMovieDetail } from './detail.js';
import API_KEY from '../apikey.js';
import { setMoreBtnVisibility, moreBtnEl } from './morebtn.js';
import { loadEl, loading, loaded } from './loading.js';

// 초기화 코드
const moviesEl = document.querySelector('.movies');
const searchFormEl = document.querySelector('.search-form');
const searchInputEl = document.querySelector('.search-input');
const totalEl = document.querySelector('.total');
const message = document.querySelector('span');

let page = 1;
let title = "";
let year = "";

// 최초 호출
;(async () => {
  const movies = await getMovies();
  page += 1;
  renderMovies(movies);
})


// 검색어 submit 이벤트
searchFormEl.addEventListener('submit', async (event) => {
  event.preventDefault();
  deleteResult();
  loading()
  title = searchInputEl.value;
  const selectDecade = document.querySelector('.years:checked').value;

  if (title !== "" && title.length > 2) {
    if (selectDecade === "All") {
      const { movies, totalResults } = await getMovies(title, year, page);
      renderMovies(movies, totalResults);
      pieces();
    } else { // 시대별 검색옵션 적용 시 함수 실행
      decade(selectDecade);
    }    
  } else {
    errorMessage();
  }
});


// 시대별 검색옵션
async function decade(selectDecade) {
  let decadeStrg = [];
  // 열번 불러와서 결과를 Decadestrg배열에 push해주기
  // fetch로 api 데이터 가져오기, await을 안붙이면 promise는 pending상태?
  // 가져온 데이터를 배열에 담기
  // response가 true일 때만 배열에 담아주기
  // 담아둔 친구들을 합치고 한번에 출력... 이 때 concat을 쓰는건가?
  // 에러와 더보기버튼 동작 확인하기

  for (let i = +(selectDecade); i < +(selectDecade)+10; i += 1) {
    const response = await fetch(`https://omdbapi.com/?apikey=${API_KEY}&s=${title}&y=${i}&page=${page}`);
    const movieData = await response.json();
    
    if (movieData.Response === 'True') {
      const { Search: movies, totalResults } = movieData
      console.log(movies, totalResults)
      return {
        movies,
        totalResults
      }
    }
    else { 
      // 배열에 push하지 않음. 아무 동작 x
      console.log("no result")
      return;
      // errorMessage();
    }
  }
}



//에러메시지 출력
function errorMessage() {
  message.classList.add('error');
  loaded()

  //한글 입력 검사
  let koCheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  if (moviesEl.textContent !== '') {
    moviesEl.removeChild(span);
  } else {
    if (title === "" || title.length < 3) {
      message.textContent = `Please enter at least 3 characters.`;
    } else if (koCheck.test(title) == true) {
      message.textContent = `Please enter the search word in English.`;
    } else {
      message.textContent = `Movie not found!`;
    }
    moviesEl.append(message);
  }
  setMoreBtnVisibility();
}


// 기존 출력 내용 지우기
function deleteResult() {
  moviesEl.textContent = "";
  totalEl.textContent = "";
  page = 1;
}

// 화면에 더 출력하기
async function moreMovies() {
  //year가 ""가 아니면 ?
  page += 1;
  const { movies, totalResults } = await getMovies(title, year, page);
  renderMovies(movies, totalResults);
}

// 출력갯수 옵션 선택
function pieces() {
  const selectPieces = document.querySelector('.pieces:checked').value;
  for (let i = 1; i < selectPieces; i += 1) {
    moreMovies();
  }
}

// 더보기 버튼 클릭이벤트
const moreBtnClick =
  moreBtnEl.addEventListener('click', () => {
    moreMovies()
  });


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
    }
  }
  else {  //에러메세지 출력
    errorMessage();
  }
}


// 결과 갯수 출력
function displayTotalResult(totalResults) {
  totalEl.textContent = `Total Results ${totalResults}`;
  if (totalEl.textcontent === '' && page === 1) {
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
    imgEl.onerror = function () {
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


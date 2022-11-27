import API_KEY from '../apikey.js';

export async function getMovieDetail(id) {
  const res = await fetch(`https://omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`)
  const movieDetail = await res.json()
  if (movieDetail.Response === 'True') {
    return movieDetail
  }
  return movieDetail.Error
}


// 상세정보 출력하기
export function renderMovieDetail(movieDetail) {
  const modalEl = document.querySelector('.modal-inner');
  modalEl.textContent='';

    // 영화이미지 출력
    const imageContainer = document.createElement('div'); 
    imageContainer.classList.add('modal-img');
    const imgEl = document.createElement('img');
    imageContainer.append(imgEl);
    imgEl.src = movieDetail.Poster;
    imgEl.alt = movieDetail.Title;
    imgEl.onerror = function() {
      this.src = "./images/No-image.png";
      this.alt = "Alternative image";
    }
    // 타이틀 출력
    const modalTitleEl = document.createElement('h2'); 
    modalTitleEl.textContent = movieDetail.Title
    // 컨텐트 컨테이너
    const modalContentEl = document.createElement('div'); 
    modalContentEl.classList.add('modal-content');
    // 컨텐트 - 개봉정보
    const releasedEl = document.createElement('div');
    releasedEl.classList.add('released');
    releasedEl.textContent = `Released: ${movieDetail.Released} · Runtime: ${movieDetail.Runtime} · Country: ${movieDetail.Country}`;
    // 컨텐트 - 감독
    const directorEl = document.createElement('div');
    directorEl.classList.add('director');
    directorEl.textContent = `Director: ${movieDetail.Director}`;
    // 컨텐트 - 배우
    const actorsEl = document.createElement('div');
    actorsEl.classList.add('actors');
    actorsEl.textContent = `Actors: ${movieDetail.Actors}`;
    // 컨텐트 - 플롯
    const plotEl = document.createElement('div');
    plotEl.classList.add('plot');
    plotEl.textContent = `${movieDetail.Plot}`;
    // 컨텐트 - 평점 (삭제)
    // const ratingsEl = document.createElement('div');
    // const imdbEl = document.createElement('div');
    // const imdbImgEl = document.createElement('div');
    // imdbImgEl.classList.add('rating-img');
    // const imdbRatingEl = document.createElement('div');
    // imdbRatingEl.classList.add('rating-text');

    // const rottenEl = document.createElement('div');
    // const rottenImgEl = document.createElement('div');
    // rottenImgEl.classList.add('rating-img');
    // const rottenRatingEl = document.createElement('div');
    // rottenRatingEl.classList.add('rating-text');

    // const metaEl = document.createElement('div');
    // const metaImgEl = document.createElement('div');
    // metaImgEl.classList.add('rating-img');
    // const metaRatingEl = document.createElement('div');
    // metaRatingEl.classList.add('rating-text');

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
      // ratingsEl, (삭제)
      // imdbEl,
      // imdbImgEl,
      // imdbRatingEl,
      // rottenEl,
      // rottenImgEl,
      // rottenRatingEl,
      // metaEl,
      // metaImgEl,
      // metaRatingEl
      );
}

// 상세정보 가져오기
export async function getMovieDetail(id) {
  const res = await fetch(`https://omdbapi.com/?apikey=7035c60c&i=${id}&plot=full`)
  const movieDetail = await res.json()
  if (movieDetail.Response === 'True') {
    console.log(movieDetail)
    return movieDetail
  }
  return movieDetail.Error
}



// 상세정보 출력하기
export function renderMovieDetail(detail) {
    const modalEl = document.querySelector('.modal-window'); 
    // 영화이미지 출력
    const imageContainer = modalEl.createElement('div'); 
    imageContainer.classList.add('modal-img');
    const imgEl = imageContainer.createElement('img');
    if (detail.Poster == 'N/A') {
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

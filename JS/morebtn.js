// 더보기 버튼 나타내기/숨기기

export const moreBtnEl = document.querySelector('.more-btn');

export function setMoreBtnVisibility(totalResults, page) {
  let maxPage = -1;
  maxPage = Math.ceil(+(totalResults / 10)); //+로 string에서 Number 형변환
  if (page < maxPage && totalResults > 10) {
    moreBtnEl.style.visibility = 'visible';
  } else {
    moreBtnEl.style.visibility = 'hidden';
  }
}

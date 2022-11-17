// 영화 클릭 시 모달 열기, 닫기 
export async function modalControl() {
  const modalEl = document.querySelector('.modal');
  function modalOpen() {
    modalEl.style.display = "flex"
  }
  function modalClose() {
    modalEl.style.display = "none";
  }
  //모달 열기
  const openDetail = document.querySelector('.movies');
  openDetail.addEventListener("click", event => {
    modalOpen()
  })
  // close버튼 클릭으로 모달 닫기
  const closeBtn = document.querySelector(".modal-close")
  closeBtn.addEventListener("click", event => {
    modalClose()
  })
  // 모달 밖 요소를 클릭해 모달 닫기
  modalEl.addEventListener("click", event => {
    const eventTarget = event.target;
    if (eventTarget.classList.contains("modal")) {
      modalClose()
    }
  })
  // ESC버튼을 눌러 모달 닫기
  window.addEventListener("keyup", event => {
    if (modalEl.style.display == "flex" && event.key == "Escape") {
      modalClose()
    }
  })
}
  
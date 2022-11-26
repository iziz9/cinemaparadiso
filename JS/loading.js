// 로딩애니메이션
export const loadEl = document.querySelector('.loading');
export function loading() {
  loadEl.style.visibility = "visible";
}
export function loaded() {
  loadEl.style.visibility = "hidden";
}
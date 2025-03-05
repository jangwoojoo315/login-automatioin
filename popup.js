document.getElementById("add").addEventListener("click", () => {
  const addInfo = document.getElementById("add-info");
  if (addInfo.style.display === "flex") {
    addInfo.style.display = "none";
  } else {
    addInfo.style.display = "flex";
  }
});

document.getElementById("vn").addEventListener("click", () => {
  const data = ["vn첫 번째 항목", "vn두 번째 항목", "vn세 번째 항목"];

  const list = document.getElementById("list");
  list.innerHTML = "";

  list.appendChild(document.createElement("div"));
  // data 배열을 순회하면서 span 요소를 생성하고 list에 추가합니다.
  data.forEach((item) => {
    const span = document.createElement("p"); // 새로운 span 요소 생성
    span.textContent = item; // span 요소에 텍스트 값 설정
    list.appendChild(span); // list div에 span 요소를 추가
  });
});
document.getElementById("eg").addEventListener("click", () => {
  const data = ["eg첫 번째 항목", "eg두 번째 항목", "eg세 번째 항목"];

  const list = document.getElementById("list");
  list.innerHTML = "";
  // data 배열을 순회하면서 span 요소를 생성하고 list에 추가합니다.
  data.forEach((item) => {
    const span = document.createElement("p"); // 새로운 span 요소 생성
    span.textContent = item; // span 요소에 텍스트 값 설정
    list.appendChild(span); // list div에 span 요소를 추가
  });
});
document.getElementById("in").addEventListener("click", () => {
  const data = ["in첫 번째 항목", "in두 번째 항목", "in세 번째 항목"];

  const list = document.getElementById("list");
  list.innerHTML = "";
  // data 배열을 순회하면서 span 요소를 생성하고 list에 추가합니다.
  data.forEach((item) => {
    const span = document.createElement("p"); // 새로운 span 요소 생성
    span.textContent = item; // span 요소에 텍스트 값 설정
    list.appendChild(span); // list div에 span 요소를 추가
  });
});

document.getElementById("openDashboardTab").addEventListener("click", () => {
  const button = document.getElementById("openDashboardTab");

  const clinicId = button.querySelector("#clinicId").textContent;
  const userId = button.querySelector("#userId").textContent;
  const password = button.querySelector("#password").textContent;

  chrome.runtime.sendMessage({
    action: "startSessionEnd",
    url: "",
    clinicIdDB: clinicId,
    userIdDB: userId,
    passwordDB: password,
  });
});

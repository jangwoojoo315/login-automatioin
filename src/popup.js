import { fetchLoginInfo } from "./excel/loginInfoList.js";

// 로그인 정보 가져오기
document.getElementById("scync").addEventListener("click", () => {
  fetchLoginInfo();
  const list = document.getElementById("list");
  list.innerHTML = "";
});

// 계정 추가 기능
document.getElementById("add").addEventListener("click", () => {
  const addInfo = document.getElementById("add-info");
  const allListWrapper = document.getElementById("all-list-wrapper");
  if (addInfo.style.display === "flex") {
    addInfo.style.display = "none";
    allListWrapper.style.display = "block";
  } else {
    addInfo.style.display = "flex";
    allListWrapper.style.display = "none";
  }
});

function cancelAdd() {
  const addInfo = document.getElementById("add-info");
  const allListWrapper = document.getElementById("all-list-wrapper");

  addInfo.style.display = "none";
  allListWrapper.style.display = "block";
}
function initAddInfo() {
  const addVnqa = document.getElementById("add-vnqa");
  addVnqa.checked = true;
  const allElement = document.querySelectorAll("#add-login-info input");
  allElement.forEach((input) => (input.value = ""));
}
document.getElementById("add-cancel").addEventListener("click", () => {
  cancelAdd();
});
document.getElementById("add-save").addEventListener("click", async () => {
  const selectedRadio = document.querySelector('input[name="option"]:checked');
  const allElement = document.querySelectorAll("#add-login-info input");
  const [clinicId, userId, password] = Array.from(allElement).map(
    (input) => input.value
  );

  let region = "";

  switch (selectedRadio.id) {
    case "add-vnqa":
      region = "vn";
      break;
    case "add-egqa":
      region = "eg";
      break;
    case "add-inqa":
      region = "in";
      break;
  }

  const regsionData = await chrome.storage.sync.get([region]);

  const existingArr = regsionData[region] || [];
  existingArr.push({
    clinicId,
    userId,
    password,
  });

  await chrome.storage.sync.set({ [region]: existingArr });
  const regionList = document.getElementById(region);
  regionList.click();
  cancelAdd();
  initAddInfo();
});

//계정 수정 기능
document.getElementById("modify-cancel").addEventListener("click", () => {
  const modifyInfo = document.getElementById("modify-info");
  modifyInfo.style.display = "none";
  const allListWrapper = document.getElementById("all-list-wrapper");
  allListWrapper.style.display = "block";
  const add = document.getElementById("add");
  add.style.display = "block";
});
document.getElementById("modify-save").addEventListener("click", async () => {
  const loginInfo = document.getElementById("modify-login-info");
  const curIndex = loginInfo.dataset.curIndex;
  const region = loginInfo.dataset.region;
  const result = await chrome.storage.sync.get([region]);

  const allElement = document.querySelectorAll("#modify-login-info input");
  const [clinicId, userId, password] = Array.from(allElement).map(
    (input) => input.value
  );

  const modifyItem = {
    clinicId,
    userId,
    password,
  };

  let dupArr = result || [];
  dupArr[region].splice(curIndex, 1, modifyItem);

  chrome.storage.sync.set(dupArr);

  const modifyInfo = document.getElementById("modify-info");
  modifyInfo.style.display = "none";
  const allListWrapper = document.getElementById("all-list-wrapper");
  allListWrapper.style.display = "block";
  const add = document.getElementById("add");
  add.style.display = "block";

  const regionList = document.getElementById(region);
  regionList.click();
});

// 계정 수정
function modifyAccount(clinicId, userId, password, index, region) {
  const modifyInfo = document.getElementById("modify-info");
  modifyInfo.style.display = "flex";
  const allListWrapper = document.getElementById("all-list-wrapper");
  allListWrapper.style.display = "none";
  const add = document.getElementById("add");
  add.style.display = "none";

  const loginInfo = document.getElementById("modify-login-info");
  const clinicIdEl = document.getElementById("modify-clinicId");
  const userIdEl = document.getElementById("modify-userId");
  const passwordEl = document.getElementById("modify-password");

  loginInfo.dataset.curIndex = index;
  loginInfo.dataset.region = region;
  clinicIdEl.value = clinicId;
  userIdEl.value = userId;
  passwordEl.value = password;
}
// 계정 삭제
function deleteAccount(accountList, region, index) {
  let dupArr = accountList || [];
  dupArr[region].splice(index, 1);

  chrome.storage.sync.set(dupArr);

  const regionList = document.getElementById(region);
  regionList.click();
}
function getDomain(region) {
  switch (region) {
    case "dev":
      return "dev.vnclever.com";
    case "dev2":
      return "dev2.vnclever.com";
    case "qa_vietnam":
      return "vnm2.vnclever.com";
    case "qa_egypt":
      return "egy2.vnclever.com";
    case "qa_india":
      return "ind2.vnclever.com";
    case "prod_vietnam":
      return "vnm.dentalclever.com";
    case "prod_egypt":
      return "egy.dentalclever.com";
    case "prod_india":
      return "ind.dentalclever.com";
  }
}

// 국가별 계정 출력
function getAccount(result, region) {
  // data 배열을 순회하면서 span 요소를 생성하고 list에 추가합니다.
  result[region].forEach((item, index) => {
    const { clinicId, userId, password } = item;

    const wrapper = document.createElement("div");
    wrapper.className = "account-wrapper";
    wrapper.style.display = "flex";
    list.appendChild(wrapper);

    const loginStart = document.createElement("button"); // 새로운 button 요소 생성
    loginStart.textContent = `${clinicId} / ${userId} / ${password}`;
    const secret = document.getElementById("secret");

    loginStart.addEventListener("click", () => {
      chrome.runtime.sendMessage({
        action: secret.checked ? "secretLoginStart" : "loginStart",
        domain: getDomain(region),
        clinicIdDB: clinicId,
        userIdDB: userId,
        passwordDB: password,
      });
    });

    wrapper.appendChild(loginStart);

    const modifyButton = document.createElement("button"); // 새로운 button 요소 생성
    modifyButton.textContent = "수정";

    modifyButton.addEventListener("click", () => {
      modifyAccount(clinicId, userId, password, index, region);
    });
    wrapper.appendChild(modifyButton);

    const deleteButton = document.createElement("button"); // 새로운 button 요소 생성
    deleteButton.textContent = "삭제";

    deleteButton.addEventListener("click", () => {
      deleteAccount(result, region, index);
    });
    wrapper.appendChild(deleteButton);
  });
}
async function initAccountList(region) {
  const result = await chrome.storage.sync.get([region]);

  const buttons = document.querySelectorAll(".domain-btn");

  buttons.forEach((button) => {
    if (button.id === region) {
      button.style.borderBottom = "2px solid #00bfa5";
    } else {
      button.style.borderBottom = "none";
    }
  });

  const list = document.getElementById("list");
  list.innerHTML = "";

  return result;
}

const regionList = [
  "dev",
  "dev2",
  "qa_vietnam",
  "qa_egypt",
  "qa_india",
  "prod_vietnam",
  "prod_egypt",
  "prod_india",
];

regionList.forEach((region) => {
  document.getElementById(region).addEventListener("click", async () => {
    const result = await initAccountList(region);

    getAccount(result, region);
  });
});

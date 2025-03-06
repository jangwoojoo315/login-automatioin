document.getElementById("add").addEventListener("click", () => {
  const addInfo = document.getElementById("add-info");
  if (addInfo.style.display === "flex") {
    addInfo.style.display = "none";
  } else {
    addInfo.style.display = "flex";
  }
});

document.getElementById("clear-all").addEventListener("click", () => {
  chrome.storage.sync.clear();
});
document.getElementById("check-bucket").addEventListener("click", () => {
  chrome.storage.sync.getBytesInUse(null, (bytes) => {
    alert(`현재 사용 중인 용량: ${bytes} 바이트`);
  });
});

document.getElementById("save").addEventListener("click", async () => {
  const selectedRadio = document.querySelector('input[name="option"]:checked');
  const allElement = document.querySelectorAll("#add-login-info input");
  const [clinicId, userId, password] = Array.from(allElement).map(
    (input) => input.value
  );

  let region = "";
  let domain = "";

  switch (selectedRadio.id) {
    case "add-vnqa":
      region = "vn";
      domain = "vnm2.vnclever.com";
      break;
    case "add-egqa":
      region = "eg";
      domain = "egy2.vnclever.com";
      break;
    case "add-inqa":
      region = "in";
      domain = "ind2.vnclever.com";
      break;
  }

  chrome.storage.sync.get([region], (result) => {
    const existingArr = result[region] || [];
    existingArr.push({
      clinicId,
      userId,
      password,
    });

    chrome.storage.sync.set({ [region]: existingArr }, () => {
      console.log("업데이트된 배열 : ", existingArr);
    });
  });

  // chrome.runtime.sendMessage({
  //   action: "add",
  //   domain: domain,
  //   clinicIdDB: clinicId,
  //   userIdDB: userId,
  //   passwordDB: password,
  // });
});

document.getElementById("vn").addEventListener("click", async () => {
  const result = await chrome.storage.sync.get(["vn"]);

  const list = document.getElementById("list");
  list.innerHTML = "";

  list.appendChild(document.createElement("div"));
  // data 배열을 순회하면서 span 요소를 생성하고 list에 추가합니다.
  result["vn"].forEach((item) => {
    const { clinicId, userId, password } = item;
    const button = document.createElement("button"); // 새로운 button 요소 생성
    button.textContent = `${clinicId} / ${userId} / ${password}`;

    button.addEventListener("click", () => {
      chrome.runtime.sendMessage({
        action: "start",
        domain: "vnm2.vnclever.com",
        clinicIdDB: clinicId,
        userIdDB: userId,
        passwordDB: password,
      });
    });
    list.appendChild(button);
  });
});
document.getElementById("eg").addEventListener("click", async () => {
  const result = await chrome.storage.sync.get(["eg"]);

  const list = document.getElementById("list");
  list.innerHTML = "";

  list.appendChild(document.createElement("div"));
  // data 배열을 순회하면서 span 요소를 생성하고 list에 추가합니다.
  result["eg"].forEach((item) => {
    const { clinicId, userId, password } = item;
    const button = document.createElement("button"); // 새로운 button 요소 생성
    button.textContent = `${clinicId} / ${userId} / ${password}`;

    button.addEventListener("click", () => {
      chrome.runtime.sendMessage({
        action: "start",
        domain: "egy2.vnclever.com",
        clinicIdDB: clinicId,
        userIdDB: userId,
        passwordDB: password,
      });
    });
    list.appendChild(button);
  });
});
document.getElementById("in").addEventListener("click", async () => {
  const result = await chrome.storage.sync.get(["in"]);

  const list = document.getElementById("list");
  list.innerHTML = "";

  list.appendChild(document.createElement("div"));
  // data 배열을 순회하면서 span 요소를 생성하고 list에 추가합니다.
  result["in"].forEach((item) => {
    const { clinicId, userId, password } = item;
    const button = document.createElement("button"); // 새로운 button 요소 생성
    button.textContent = `${clinicId} / ${userId} / ${password}`;

    button.addEventListener("click", () => {
      chrome.runtime.sendMessage({
        action: "start",
        domain: "ind2.vnclever.com",
        clinicIdDB: clinicId,
        userIdDB: userId,
        passwordDB: password,
      });
    });
    list.appendChild(button);
  });
});

document.getElementById("openDashboardTab").addEventListener("click", () => {
  const button = document.getElementById("openDashboardTab");

  const clinicId = button.querySelector("#clinicId").textContent;
  const userId = button.querySelector("#userId").textContent;
  const password = button.querySelector("#password").textContent;

  chrome.runtime.sendMessage({
    action: "startSessionEnd",
    domain: "",
    clinicIdDB: clinicId,
    userIdDB: userId,
    passwordDB: password,
  });
});

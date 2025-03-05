chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, url, clinicIdDB, userIdDB, passwordDB } = message;
  console.log("MESSAGE >>> ", message);
  if (action === "startSessionEnd") {
    chrome.tabs.create(
      { url: "https://cvauth.dev2.vnclever.com/session/end", active: false },
      (tab) => {
        if (!tab || !tab.id) {
          console.error("탭 생성 실패");
          return;
        }

        // 첫 번째 페이지가 완전히 로드된 후 실행할 함수
        function onPageLoad(details) {
          if (details.tabId === tab.id) {
            console.log("1");
            // 이벤트 리스너 제거 (중복 실행 방지)
            chrome.webNavigation.onCompleted.removeListener(onPageLoad);

            // 최종 목적지로 이동
            chrome.tabs.update(tab.id, {
              url: "https://intro.dev2.vnclever.com/",
              active: true,
            });
          }
        }

        function onIntroPageLoad(details) {
          if (details.tabId === tab.id) {
            console.log("2");

            // 이벤트 리스너 제거 (중복 실행 방지)
            chrome.webNavigation.onCompleted.removeListener(onIntroPageLoad);
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: () => {
                const div = document.getElementById("md_login");
                const button = div.querySelector("div");
                button.click();
              },
            });
          }
        }

        function onLoginLoad(details) {
          if (details.tabId === tab.id) {
            console.log("3");

            // 이벤트 리스너 제거 (중복 실행 방지)
            chrome.webNavigation.onCompleted.removeListener(onLoginLoad);
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: (message) => {
                const { clinicIdDB, userIdDB, passwordDB } = message;
                const clinicId = document.getElementById("hospital");
                const userId = document.getElementById("userID");
                const password = document.getElementById("passwordInput");

                clinicId.value = clinicIdDB;
                userId.value = userIdDB;
                password.value = passwordDB;

                const loginBtn = document.querySelector(
                  'button[type="submit"]'
                );
                // loginBtn.click();
              },
              args: [message],
            });
          }
        }

        // 새로 열린 탭에서 `session/end/success` 페이지가 완전히 로드되었을 때 감지
        chrome.webNavigation.onCompleted.addListener(onPageLoad, {
          url: [
            {
              hostSuffix: "cvauth.dev2.vnclever.com",
              pathContains: "session/end/success",
            },
          ], // 여기에 session/end 페이지의 도메인을 설정
        });

        // 인트로 페이지가 완전히 로드되었을 때 감지
        chrome.webNavigation.onCompleted.addListener(onIntroPageLoad, {
          url: [{ hostContains: "intro.dev2.vnclever.com" }],
        });

        // 로그인 화면 완전히 로드되었을때 감지
        chrome.webNavigation.onCompleted.addListener(onLoginLoad, {
          url: [
            {
              hostSuffix: "cvauth.dev2.vnclever.com",
              pathContains: "interaction",
            },
          ], // 여기에 session/end 페이지의 도메인을 설정
        });
      }
    );
  }
});

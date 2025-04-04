chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, domain } = message;

  const cvauthUrl = `cvauth.${domain}`;
  const cvauthSessionEndUrl = `https://${cvauthUrl}/session/end`;

  const introUrl = `intro.${domain}`;
  const fullIntroUrl = `https://${introUrl}`;

  if (action === "loginStart") {
    chrome.tabs.create({ url: cvauthSessionEndUrl, active: false }, (tab) => {
      if (!tab || !tab.id) {
        console.error("탭 생성 실패");
        return;
      }

      // 첫 번째 페이지가 완전히 로드된 후 실행할 함수
      function onPageLoad(details) {
        if (details.tabId === tab.id) {
          // 이벤트 리스너 제거 (중복 실행 방지)
          chrome.webNavigation.onCompleted.removeListener(onPageLoad);

          // 최종 목적지로 이동
          chrome.tabs.update(tab.id, {
            url: fullIntroUrl,
            active: true,
          });
        }
      }

      function onIntroPageLoad(details) {
        if (details.tabId === tab.id) {
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

              const loginBtn = document.querySelector('button[type="submit"]');
              loginBtn.click();
            },
            args: [message],
          });
        }
      }

      // 새로 열린 탭에서 `session/end/success` 페이지가 완전히 로드되었을 때 감지
      chrome.webNavigation.onCompleted.addListener(onPageLoad, {
        url: [
          {
            hostSuffix: cvauthUrl,
            pathContains: "session/end/success",
          },
        ], // 여기에 session/end 페이지의 도메인을 설정
      });

      // 인트로 페이지가 완전히 로드되었을 때 감지
      chrome.webNavigation.onCompleted.addListener(onIntroPageLoad, {
        url: [{ hostContains: introUrl }],
      });

      // 로그인 화면 완전히 로드되었을때 감지
      chrome.webNavigation.onCompleted.addListener(onLoginLoad, {
        url: [
          {
            hostSuffix: cvauthUrl,
            pathContains: "interaction",
          },
        ], // 여기에 session/end 페이지의 도메인을 설정
      });
    });
  }
  if (action === "secretLoginStart") {
    chrome.windows.create(
      { url: fullIntroUrl, incognito: true },
      (newWindow) => {
        if (chrome.runtime.lastError) {
          console.error("창 생성 오류:", chrome.runtime.lastError.message);
          return;
        }

        const tabId = newWindow.tabs[0].id;

        chrome.tabs.onUpdated.addListener(function listener(
          updatedTabId,
          changeInfo
        ) {
          if (updatedTabId === tabId && changeInfo.status === "complete") {
            // 이벤트 리스너 제거 (한 번만 실행되도록)
            chrome.tabs.onUpdated.removeListener(listener);

            // 탭이 완전히 로드된 후 실행
            chrome.scripting.executeScript({
              target: { tabId },
              func: () => {
                const div = document.getElementById("md_login");
                if (!div) {
                  console.error("#md_login 요소를 찾을 수 없습니다.");
                  return;
                }
                const button = div.querySelector("div");
                if (!button) {
                  console.error("로그인 버튼을 찾을 수 없습니다.");
                  return;
                }
                button.click();
              },
            });
          }
        });

        function onIntroPageLoad(details) {
          // 이벤트 리스너 제거 (중복 실행 방지)
          chrome.webNavigation.onCompleted.removeListener(onIntroPageLoad);
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => {
              const div = document.getElementById("md_login");
              const button = div.querySelector("div");
              button.click();
            },
          });
        }

        function onLoginLoad(details) {
          if (details.tabId === tabId) {
            // 이벤트 리스너 제거 (중복 실행 방지)
            chrome.webNavigation.onCompleted.removeListener(onLoginLoad);
            chrome.scripting.executeScript({
              target: { tabId: tabId },
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
                loginBtn.click();
              },
              args: [message],
            });
          }
        }

        // 인트로 페이지가 완전히 로드되었을 때 감지
        chrome.webNavigation.onCompleted.addListener(onIntroPageLoad, {
          url: [{ hostContains: introUrl }],
        });

        // 로그인 화면 완전히 로드되었을때 감지
        chrome.webNavigation.onCompleted.addListener(onLoginLoad, {
          url: [
            {
              hostSuffix: cvauthUrl,
              pathContains: "interaction",
            },
          ], // 여기에 session/end 페이지의 도메인을 설정
        });
      }
    );
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("확장 프로그램이 처음 설치됨");
  } else if (details.reason === "update") {
    console.log("확장 프로그램이 업데이트됨");
  } else if (details.reason === "chrome_update") {
    console.log("Chrome이 업데이트됨");
  }
});

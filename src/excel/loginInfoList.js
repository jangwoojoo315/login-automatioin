import ExcelJS from "exceljs";

class CustomError extends Error {
  code;

  constructor(code, message) {
    super(message);
    this.name = code; // 혹은 this.code = code;
    this.code = code;
  }
}

const LOCALE_XSLX_SP_PATH =
  "https://vatechcorp.sharepoint.com/sites/vt/VT Document/VT_플랫폼사업본부/01. 웹개발팀/16.로그인자동화/로그인계정리스트.xlsx";

const fetchLoginInfo = async () => {
  try {
    console.log("엑셀 다운로드 시작");

    const response = await fetch(LOCALE_XSLX_SP_PATH, {
      method: "GET",
      credentials: "include", // 👈 SharePoint 세션 쿠키 포함
    });
    if (
      !response.ok ||
      response.headers.get("content-type")?.includes("text/html")
    ) {
      throw new CustomError(
        "NOT_AUTHENTICATED",
        "Not authenticated or received HTML instead of Excel file"
      );
    }

    const blob = await response.blob();

    // 엑셀 파싱 시작
    const arrayBuffer = await blob.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.worksheets[0];
    const rows = worksheet.getSheetValues(); // 2차원 배열로 데이터 획득

    const setArr = [];
    workbook.worksheets.forEach((sheet) => {
      console.log("시트 이름:", sheet.name);
      console.log("시트 데이터:", sheet.getSheetValues());
      const dataArr = sheet.getSheetValues().slice(2);

      const loginInfo = dataArr.map((item) => {
        return {
          clinicId: item[1],
          userId: item[2],
          password: item[3],
        };
      });
      console.log("엑셀 데이터:", loginInfo);

      setArr.push(
        chrome.storage.sync.set({
          [sheet.name]: loginInfo,
        })
      );
    });

    await Promise.all(setArr);
  } catch (err) {
    if (err.name === "NOT_AUTHENTICATED") {
      chrome.windows.create({
        url: "https://login.microsoftonline.com/",
      });
      alert("마이크로소프트 365에 로그인이 필요합니다.");
    } else {
      console.error("에러:", err);
      alert("다운로드 또는 파싱 실패");
    }
  }
};

export { fetchLoginInfo };

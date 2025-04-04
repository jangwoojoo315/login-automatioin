import ExcelJS from "exceljs";

const LOCALE_XSLX_SP_PATH =
  "https://vatechcorp.sharepoint.com/sites/vt/VT Document/VT_플랫폼사업본부/01. 웹개발팀/16.로그인자동화/로그인계정리스트.xlsx";

const fetchLoginInfo = async () => {
  try {
    console.log("엑셀 다운로드 시작");

    const response = await fetch(LOCALE_XSLX_SP_PATH, {
      method: "GET",
      credentials: "include", // 👈 SharePoint 세션 쿠키 포함
    });

    if (!response.ok) throw new Error("다운로드 실패");

    const blob = await response.blob();

    // 엑셀 파싱 시작
    const arrayBuffer = await blob.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.worksheets[0];
    const rows = worksheet.getSheetValues(); // 2차원 배열로 데이터 획득

    console.log("엑셀 데이터:", rows);
    alert("엑셀 데이터 콘솔에 출력됨!");
  } catch (err) {
    console.error("에러:", err);
    alert("다운로드 또는 파싱 실패");
  }
};

export { fetchLoginInfo };

const API_BASE_URL = "http://localhost:9000";

//DOM 엘리먼트 가져오기
const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody");

//Document Load 이벤트 처리하기
document.addEventListener("DOMContentLoaded", function () {
  loadBooks();
});

//Form Submit 이벤트 처리하기
bookForm.addEventListener("submit", function (event) {
  //기본으로 설정된 Event가 동작하지 않도록 하기 위함
  event.preventDefault();
  console.log("Form 제출 되었음...");

  //FormData 객체생성 <form>엘리먼트를 객체로 변환
  const bookFormData = new FormData(bookForm);


  //사용자 정의 book 객체생성 ( 공백 제거 )
  const bookData = {
    title: bookFormData.get("title").trim(),
    author: bookFormData.get("author").trim(),
    isbn: bookFormData.get("isbn").trim(),
    price: bookFormData.get("price").trim(),
    publishDate: bookFormData.get("publishDate").trim(),
    description: bookFormData.get("description").trim(),
    language: bookFormData.get("language").trim(),
    pageCount: bookFormData.get("pageCount").trim(),
    publisher: bookFormData.get("publisher").trim(),
    coverImageUrl: bookFormData.get("coverImageUrl").trim(),
    edition: bookFormData.get("edition").trim(),
  };
  
  if(!validateBook(bookData)){
    return ;
  }
//유효한 데이터 출력하기
    console.log(studentData);

});

function validateBook(book){
    if(!book.title){
        alert("title 를 입력해주세요");
        return false;
    }
    if(!book.author){
        alert("author 를 입력해주세요");
        return false;
    }
    if(!book.isbn){
        alert("isbn 를 입력해주세요");
        return false;
    }
    if(!book.price){
        alert("price 를 입력해주세요");
        return false;
    }
    if(!book.publishDate){
        alert("publishDate 를 입력해주세요");
        return false;
    }
    if(!book.description){
        alert("description 를 입력해주세요");
        return false;
    }
    if(!book.language){
        alert("language 를 입력해주세요");
        return false;
    }
    if(!book.pageCount){
        alert("pageCount 를 입력해주세요");
        return false;
    }
    if(!book.publisher){
        alert("publisher 를 입력해주세요");
        return false;
    }
    if(!book.coverImageUrl){
        alert("coverImageUrl 를 입력해주세요");
        return false;
    }
    if(!book.edition){
        alert("edition 를 입력해주세요");
        return false;
    }
}

//학생목록 로드하는 함수
function loadBooks() {
  console.log("학생 목록 로드 중.....");
}
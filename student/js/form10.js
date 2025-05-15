//전역변수
const API_BASE_URL = "http://localhost:9000";
//현재 수정중인 책 ID
let editingBookId = null;

//DOM 엘리먼트 가져오기
const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody");
const cancelButton = bookForm.querySelector('.cancel-btn');
const submitButton = bookForm.querySelector('button[type="submit"]');
const formError = document.getElementById("formError");

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
    // stuFormData.forEach((value, key) => {
    //     console.log(key + ' = ' + value);
    // });

    //사용자 정의 book 객체생성 ( 공백 제거 )
    const bookData = {
        title: bookFormData.get("title").trim(),
        author: bookFormData.get("author").trim(),
        isbn: bookFormData.get("isbn").trim(),
        price: bookFormData.get("price").trim(),
        publishDate: bookFormData.get("publishDate").trim(),
        detailRequest: {
            description: bookFormData.get("description").trim(),
            language: bookFormData.get("language").trim(),
            pageCount: bookFormData.get("pageCount").trim(),
            publisher: bookFormData.get("publisher").trim(),
            coverImageUrl: bookFormData.get("coverImageUrl").trim(),
            edition: bookFormData.get("edition").trim(),
        },
    };


    if(!validateBook(bookData)){
        console.log("fail validate");
        return ;
    }

    //현재 수정중인 책 ID가 있으면 
    if (editingBookId) {
        console.log("update");
        //서버로 book 수정 요청하기
        updateBook(editingBookId, bookData);
    } else {
        console.log("create");
        //서버로 book 등록 요청하기
        createBook(bookData);
    }

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
    if(!book.detailRequest.description){
        alert("description 를 입력해주세요");
        return false;
    }
    if(!book.detailRequest.language){
        alert("language 를 입력해주세요");
        return false;
    }
    if(!book.detailRequest.pageCount){
        alert("pageCount 를 입력해주세요");
        return false;
    }
    if(!book.detailRequest.publisher){
        alert("publisher 를 입력해주세요");
        return false;
    }
    if(!book.detailRequest.coverImageUrl){
        alert("coverImageUrl 를 입력해주세요");
        return false;
    }
    if(!book.detailRequest.edition){
        alert("edition 를 입력해주세요");
        return false;
    }
    return true
}


// // 이메일 유효성 검사
// function isValidEmail(email) {
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailPattern.test(email);
// }

//책목록 로드하는 함수
function loadBooks() {
    console.log("책 목록 로드 중.....");
    fetch(`${API_BASE_URL}/api/books`) //Promise
        .then((response) => {
            if (!response.ok) {
                throw new Error("책 목록을 불러오는데 실패했습니다!.");
            }
            return response.json();
        })
        .then((books) => renderBookTable(books))
        .catch((error) => {
            console.log("Error: " + error);
            alert("책 목록을 불러오는데 실패했습니다!.");
        });
}

function renderBookTable(books) {
    bookTableBody.innerHTML = "";

    console.log(books);
    books.forEach((book) => {
        //<tr> 엘리먼트를 생성하기
        const row = document.createElement("tr");

        //<tr>의 content을 동적으로 생성
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.price}</td>
            <td>${book.publishDate}</td>
            <td>${book.detail?.description   ?? "-"}</td>
            <td>${book.detail?.language      ?? "-"}</td>
            <td>${book.detail?.pageCount     ?? "-"}</td>
            <td>${book.detail?.publisher     ?? "-"}</td>
            <td>${book.detail?.coverImageUrl ?? "-"}</td>
            <td>${book.detail?.edition       ?? "-"}</td>
            <td>
                <button class="edit-btn" onclick="editBook(${book.id})">수정</button>
                <button class="delete-btn" onclick="deleteBook(${book.id})">삭제</button>
            </td>
        `;
                
        //<tbody>의 아래에 <tr>을 추가시켜 준다.
        bookTableBody.appendChild(row);
    });
}

// //book 등록 함수
function createBook(bookData) {
    fetch(`${API_BASE_URL}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData)  //Object => json
    })
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();
                //status code와 message를 확인하기
                if (response.status === 409) {
                    //중복 오류 처리
                    throw new Error(errorData.message || '중복 되는 정보가 있습니다.');
                } else {
                    //기타 오류 처리
                    throw new Error(errorData.message || '책 등록에 실패했습니다.')
                }
            }
            return response.json();
        })
        .then((result) => {
            alert("책이 성공적으로 등록되었습니다!");
            //bookForm.reset();
            resetForm();
            //목록 새로 고침
            loadBooks();
        })
        .catch((error) => {
            console.log('Error : ', error);
            alert(error.message);
        });
}

//책 삭제 함수
function deleteBook(bookId) {
    if (!confirm(`ID = ${bookId} 인 책을 정말로 삭제하시겠습니까?`)) {
        return;
    }
    console.log('삭제처리 ...');
    fetch(`${API_BASE_URL}/api/books/${bookId}`, {
        method: 'DELETE'
    })
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();
                //status code와 message를 확인하기
                if (response.status === 404) {
                    //중복 오류 처리
                    throw new Error(errorData.message || '존재하지 않는 책입니다다.');
                } else {
                    //기타 오류 처리
                    throw new Error(errorData.message || '책 삭제에 실패했습니다.')
                }
            }
            alert("책이 성공적으로 삭제되었습니다!");
            //목록 새로 고침
            loadBooks();
        })
        .catch((error) => {
            console.log('Error : ', error);
            alert(error.message);
        });

}

//책 수정전에 데이터 로드하는 함수
function editBook(bookId) {
    fetch(`${API_BASE_URL}/api/books/${bookId}`)
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();
                //status code와 message를 확인하기
                if (response.status === 404) {
                    //중복 오류 처리
                    throw new Error(errorData.message || '존재하지 않는 책입니다.');
                }
            }
            return response.json();
        })
        .then((book) => {
            //Form에 데이터 채우기
            bookForm.title.value = book.title
            bookForm.author.value = book.author
            bookForm.isbn.value = book.isbn
            bookForm.price.value = book.price
            bookForm.publishDate.value = book.publishDate
            if(book.detail){
                bookForm.description.value = book.detail.description
                bookForm.language.value = book.detail.language
                bookForm.pageCount.value = book.detail.pageCount
                bookForm.publisher.value = book.detail.publisher
                bookForm.coverImageUrl.value = book.detail.coverImageUrl
                bookForm.edition.value = book.detail.edition
            }

            //수정 Mode 설정
            editingBookId = bookId;
            //버튼의 타이틀을 등록 => 수정으로 변경
            submitButton.textContent = "책 수정";
            //취소 버튼을 활성화
            cancelButton.style.display = 'inline-block';
        })
        .catch((error) => {
            console.log('Error : ', error);
            alert(error.message);
        });

}
// 수정 모드에서 등록 모드로 초기화 하는 함수
function resetForm() {
    //form 초기화
    bookForm.reset();
    editingBookId = null;
    submitButton.textContent = "책 등록";
    //취소버튼 사라짐
    cancelButton.style.display = 'none';
}

// 책 수정 처리하는 함수
function updateBook(bookId, bookData) {
    fetch(`${API_BASE_URL}/api/books/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData)  //Object => json
    })
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();
                //status code와 message를 확인하기
                if (response.status === 409) {
                    //중복 오류 처리
                    throw new Error(errorData.message || '중복 되는 정보가 있습니다.');
                } else {
                    //기타 오류 처리
                    throw new Error(errorData.message || '책 수정에 실패했습니다.')
                }
            }
            return response.json();
        })
        .then((result) => {
            alert("책이 성공적으로 수정되었습니다!");
            //등록모드로 초기화
            resetForm();
            //목록 새로 고침
            loadBooks();
        })
        .catch((error) => {
            console.log('Error : ', error);
            alert(error.message);
        });
}


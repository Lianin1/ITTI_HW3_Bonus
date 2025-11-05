// 1. 等待 DOM 內容完全載入
document.addEventListener('DOMContentLoaded', function() {

    // --- 變數選取 (和之前一樣) ---
    const commentForm = document.getElementById('comment-form');
    const nameInput = document.getElementById('name-input');
    const commentInput = document.getElementById('comment-input');
    const commentList = document.getElementById('comment-list');

    // --- (新) 全局變數 ---
    
    // 這是我們在 localStorage 中儲存資料的「鑰匙」(Key)
    const STORAGE_KEY = 'commentsDB';

    // 這是一個陣列 (Array)，用來在記憶體中管理所有的留言資料
    // 它是我們和 localStorage 溝通的橋樑
    let allComments = [];

    // --- (新) 核心功能：儲存、渲染、載入 ---

    /**
     * 功能 1: 將目前的 allComments 陣列儲存到 localStorage
     * 我們需要用 JSON.stringify 將陣列轉換成「字串」才能儲存
     */
    function saveComments() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));
    }

    /**
     * 功能 2: 將一筆留言物件(object)渲染到 HTML 畫面上
     * @param {object} commentObj - 包含 name, comment, time 的物件
     * @param {boolean} prepend - 是否要加在列表的最前面 (true/false)
     */
    function renderComment(commentObj, prepend = false) {
        // (這段程式碼是從 'submit' 事件中搬移過來的)
        
        // 7. 建立新的留言元素 (HTML 結構)
        const commentItem = document.createElement('article');
        commentItem.className = 'comment-item'; 

        const nameElement = document.createElement('strong');
        nameElement.textContent = commentObj.name + ':'; 

        const commentElement = document.createElement('p');
        commentElement.textContent = commentObj.comment;

        const timeElement = document.createElement('small');
        timeElement.textContent = commentObj.time; 

        // 8. 組裝
        commentItem.appendChild(nameElement);
        commentItem.appendChild(commentElement);
        commentItem.appendChild(timeElement);

        // 9. 根據 prepend 參數決定是加在最前面還是最後面
        if (prepend) {
            commentList.prepend(commentItem); // 加在最前面 (用於新留言)
        } else {
            commentList.appendChild(commentItem); // 加在最後面 (用於載入舊留言)
        }
    }

    /**
     * 功能 3: (新) 載入 localStorage 中的資料
     * 這是頁面一開始就要執行的
     */
    function loadComments() {
        // 1. 從 localStorage 中根據 "鑰匙" 取出資料
        const storedComments = localStorage.getItem(STORAGE_KEY);

        // 2. 檢查是否有資料 (如果 storedComments 不是 null 或 undefined)
        if (storedComments) {
            // 3. (重要) 將取出的「字串」用 JSON.parse 轉回「陣列」
            allComments = JSON.parse(storedComments);
            
            // 4. 清空畫面，避免重複 (雖然目前是空的，但這是好習慣)
            commentList.innerHTML = ''; 

            // 5. 遍歷 allComments 陣列中的每一筆資料
            //    並使用 renderComment 把它們依序畫在頁面上
            //    (注意：這裡 prepend 是 false，我們會照順序 append)
            //
            //    * 備註: 由於我們在提交時是用 unshift (加到陣列開頭)
            //      所以載入時用 forEach + append (從頭到尾加到結尾)
            //      就能保持「最新在最上面」的順序
            allComments.forEach(function(comment) {
                renderComment(comment, false); // false = append to end
            });
        }
    }

    // --- 事件監聽 (Event Listeners) ---

    // (修改) 監聽表單的 "submit" (提交) 事件
    commentForm.addEventListener('submit', function(event) {
        
        event.preventDefault(); // 4. 防止表單預設行為 (一樣)

        // 5. 獲取使用者填寫的值 (一樣)
        const name = nameInput.value.trim();
        const comment = commentInput.value.trim();

        // 6. 檢查 (一樣)
        if (name === '' || comment === '') {
            alert('Please fill in your name and comment!'); 
            return;
        }

        // --- (新) 建立資料物件 ---
        // 我們不再直接建立 HTML，而是先建立一個「資料物件」
        const newComment = {
            name: name,
            comment: comment,
            time: new Date().toLocaleString() // 產生當下時間
        };

        // --- (新) 更新資料與儲存 ---
        
        // (重要) 將這筆「新」留言加到 allComments 陣列的「最前面」
        allComments.unshift(newComment);
        
        // 呼叫儲存功能，將更新後的 allComments 存回 localStorage
        saveComments();

        // --- (新) 呼叫渲染函式 ---
        // 呼叫 renderComment 來把這筆新資料畫在畫面上
        // (true = prepend，加在最前面)
        renderComment(newComment, true);

        // 10. 清空輸入框 (一樣)
        nameInput.value = '';
        commentInput.value = '';
    });


    // --- (新) 程式執行起點 ---
    // 當 DOM 載入完成時，立即執行 loadComments()
    // 這樣頁面一打開，舊的留言就會被載入
    loadComments();

});
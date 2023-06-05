function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};
const csrftoken = getCookie('csrftoken');


$(function(){
    $('body').on('click', '#openRepliesBtn', function(e) {
        const commentId = e.target.getAttribute('data-comment-id')
        $(`#nestedComments${commentId}`).toggle();
    });
});

$(function(){
    $('body').on('click', '#submitReplyButton', function(e) {
        const commentId = e.target.getAttribute('data-comment-id')
        $.ajax({
            type: 'POST',
            url: 'add-reply/',
            data: JSON.stringify({'comment_id': commentId, 'body': $(`#id_body${commentId}`).val()}),
            headers: {'X-CSRFToken': csrftoken}
        }).done(function(response) {
            const replyId = response['replyId']
            const name = response['name']
            const replyBody = response['replyBody']
            console.log($(`#replyButtonDiv${commentId}`))
            $(`#replyButtonDiv${commentId}`).after(
                `
                <div class="reply horizontal mt-2" id="${replyId}">
                  <div class="row w-100">
                    <div class="col-10 px-0">
                      <div class="text">
                        <div class="meta">
                          <span><a href="#">${name}</a></span>
                          <span>&bullet;</span>
                          <span>just now</span>
                        </div>
                        <p id="replyBodyId${replyId}">${replyBody}</p>
                      </div>
                    </div>
                    <div class="col-2 d-flex justify-content-end px-0">
                      <div class="row">
                        <div class="settings d-flex justify-content-end mb-auto px-0">
                            <div class="dropdown">
                              <ion-icon id="dropdownMenuButton" class="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" name="ellipsis-vertical-outline"></ion-icon>
                              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#editModal${replyId}">Edit</a>
                                <a class="dropdown-item red" data-bs-toggle="modal" data-bs-target="#deleteModal${replyId}">Delete</a>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div> 
                </div>
                `
            )
            $(`#id_body${commentId}`).val('');
        });

    });
});
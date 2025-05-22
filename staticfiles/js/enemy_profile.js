function showMoreComments() {
    const hiddenComments = document.querySelectorAll('.comment.hidden');
    for (let i = 0; i < 5 && i < hiddenComments.length; i++) {
        hiddenComments[i].classList.remove('hidden');
    }
    if (document.querySelectorAll('.comment.hidden').length === 0) {
        document.querySelector('.show-more').style.display = 'none';
    }
}

document.getElementById('commentsList').addEventListener('scroll', function() {
    const commentsList = document.getElementById('commentsList');
    if (commentsList.scrollTop + commentsList.clientHeight >= commentsList.scrollHeight) {
        showMoreComments();
    }
});
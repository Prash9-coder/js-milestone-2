document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/forum')
        .then(response => response.json())
        .then(posts => {
            const forumDiv = document.getElementById('forum');
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.textContent = post.content;
                forumDiv.appendChild(postElement);
            });
        });

    document.getElementById('forumForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const postContent = document.getElementById('postContent').value;
        fetch('/api/forum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: postContent })
        })
        .then(response => response.json())
        .then(post => {
            const forumDiv = document.getElementById('forum');
            const postElement = document.createElement('div');
            postElement.textContent = post.content;
            forumDiv.appendChild(postElement);
        });
        document.getElementById('postContent').value = '';
    });
});

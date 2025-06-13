// blog-comment.js

document.addEventListener('DOMContentLoaded', function () {
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxkoD3mplS7jhmlYkl3VyOe8Bj2vozjQygXiOGPiZk3lbgXxAoDXQSfTWseAZ9eZfNd/exec';
  const blogUrl = window.location.href;
  let currentPage = 1;
  const pageSize = 5;

  const form = document.getElementById('commentForm');
  const list = document.getElementById('commentList');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
    const timestamp = new Date().toLocaleString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true
      });
  // Format timestamp
  function formatTimestamp(ts) {
    const date = new Date(ts);
    return date.toLocaleString(undefined, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
  }

  // Submit comment
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('commentName').value;
      const comment = document.getElementById('commentText').value;

      // 🌍 Fetch country from IP
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(loc => loc.country_name || '')
        .catch(() => '') // fallback to empty country
        .then(country => {
          const commentData = {
            timestamp: timestamp,
            blogUrl: blogUrl,
            name: name,
            comment: comment,
            country: country
          };

          return fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData)
          });
        })
        .then(() => {
          form.reset();
          document.getElementById('commentSuccess').classList.remove('d-none');
        })
        .catch(() => {
          alert('Comment could not be submitted.');
        });
    });
  }

  // 📥 Load and display comments
  function loadComments(page = 1) {
    fetch(`${SCRIPT_URL}?blogUrl=${encodeURIComponent(blogUrl)}&page=${page}&limit=${pageSize}`)
      .then(response => response.json())
      .then(data => {
        list.innerHTML = '';

        if (!data.comments.length) {
          list.innerHTML = '<li class="list-group-item text-muted">No comments yet.</li>';
          prevBtn.disabled = true;
          nextBtn.disabled = true;
          return;
        }

        data.comments.forEach(comment => {
          const item = document.createElement('li');
          item.className = 'list-group-item mt-2';
          item.innerHTML = `
            <strong>${comment.name}</strong>
            <span class="text-muted float-end">${comment.commentedOn}</span>
            <p class="mb-0">${comment.comment}</p>
            ${comment.country ? `<small class="text-muted">From ${comment.country}</small>` : ''}
          `;
          list.appendChild(item);
        });

        const totalPages = Math.ceil(data.total / pageSize);
        currentPage = page;
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
      })
      .catch(err => {
        console.error('Failed to fetch comments:', err);
        list.innerHTML = '<li class="list-group-item text-danger">Failed to load comments.</li>';
      });
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) loadComments(currentPage - 1);
    });

    nextBtn.addEventListener('click', () => {
      loadComments(currentPage + 1);
    });
  }

  loadComments(); // Initial load
});
document.addEventListener('DOMContentLoaded', function () {
  const tocContainer = document.getElementById('toc');
  if (!tocContainer) return;

  const tocList = tocContainer.querySelector('.toc-list');
  const headings = document.querySelectorAll('.toc-title'); // Use '.toc-title' if preferred

  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = 'section-' + index;
    }

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + heading.id;
    a.textContent = heading.textContent || '🏠 Home';
    li.appendChild(a);
    tocList.appendChild(li);
  });

  // Reveal ToC only after it's built
  if (headings.length > 0) {
    tocContainer.classList.remove('d-none');
tocContainer.classList.add('visible', 'd-block');
  }

  // ScrollSpy behavior
  const links = tocList.querySelectorAll('a');
  const sections = [...links].map(link => document.querySelector(link.getAttribute('href')));

  function highlightLink() {
    let index = sections.findIndex(section =>
      section.getBoundingClientRect().top > 0
    );
    if (index === -1) index = sections.length - 1;
    if (index > 0) index -= 1;

    links.forEach(link => link.classList.remove('active'));
    if (sections[index]) {
      const activeLink = tocList.querySelector(`a[href="#${sections[index].id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  }

  document.addEventListener('scroll', highlightLink);
  highlightLink();
});

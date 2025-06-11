 
  document.querySelectorAll('#owaspTiles .card').forEach(card => {
    const button = card.querySelector('button');
    const modalId = button.getAttribute('data-bs-target') + '-modal';

    const content = card.querySelector('.collapse').innerHTML;
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = modalId.substring(1);
    modal.tabIndex = -1;
    modal.innerHTML = `
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${card.querySelector('.card-title').innerText}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">${content}</div>
        </div>
      </div>`;

    document.body.appendChild(modal);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#' + modal.id);
  }); 
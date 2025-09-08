function handleTasks() {
  document.querySelectorAll('.task').forEach(task => {
    const type = task.dataset.type;

    // для кожного питання в задачі (щоб працювало з 1.1, 1.2 ...)
    task.querySelectorAll('.question').forEach(question => {

      if (type === 'test') {
        question.querySelectorAll('.options li').forEach(li => {
          li.addEventListener('click', () => {
            // підсвічуємо лише варіанти в цьому питанні
            li.parentElement.querySelectorAll('li').forEach(el => el.classList.remove('selected'));
            li.classList.add('selected');
            // запис відповіді в поле, що належить саме цьому питанню
            const ansBox = question.querySelector('.answer');
            if (ansBox) ansBox.textContent = li.getAttribute('data-value');
          });
        });
      }

      if (type === 'multichoice') {
        question.querySelectorAll('.options li').forEach(li => {
          li.addEventListener('click', () => {
            li.classList.toggle('selected');
            const selected = [...question.querySelectorAll('.options li.selected')].map(x => x.getAttribute('data-value'));
            const ansBox = question.querySelector('.answer');
            if (ansBox) ansBox.textContent = selected.join(', ');
          });
        });
      }

      if (type === 'truefalse') {
        question.querySelectorAll('.option').forEach(opt => {
          opt.addEventListener('click', () => {
            // знімаємо виділення в цьому підпитанні і ставимо для натиснутого
            question.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
            opt.classList.add('selected');
          });
        });
      }

    
    });
  });
}


    handleTasks();

    document.getElementById('submit-btn').addEventListener('click', () => {
      document.getElementById('quiz').style.display = 'none';
      document.getElementById('submit-btn').style.display = 'none';
      document.getElementById('summary').style.display = 'block';

      const columns = document.getElementById('summary-columns');
      columns.innerHTML = '';

      const categoryNames = {
        test: '📝 Тести',
        multichoice: '✅ Множинний вибір',
        short: '✍️ Короткі відповіді',
        long: '✍️ Розгорнуті відповіді',
        gap: '🔲 Пропуски',
        match: '🔗 Відповідності',
        order: '🔢 Послідовності',
        group: '📂 Групування',
        table: '📊 Таблиця',
        case: '💭 Ситуація',
        assoc: '💭 Асоціації',
        truefalse: '📄 Так/Ні'
      };

      const categories = {};

      document.querySelectorAll('.task').forEach(task => {
    const type = task.dataset.type;

    // проходимо по кожному question в task
    task.querySelectorAll('.question').forEach(question => {
      const qNum = question.getAttribute('data-q') || '';
      let answers = [];

      if (type === 'test' || type === 'multichoice') {
        const ansBox = question.querySelector('.answer');
        const ans = ansBox ? ansBox.textContent.trim() : '';
        if (ans) answers.push((qNum ? qNum + ' ' : '') + ans);
      } else if (type === 'truefalse') {
        const selected = question.querySelector('.option.selected');
        if (selected) answers.push((qNum ? qNum + ' ' : '') + selected.textContent);
      } else if (type === 'table') {
        // для таблиці збираємо всі .answer в цій question без номерів
        question.querySelectorAll('.answer').forEach(cell => {
          const val = cell.textContent.trim();
          if (val) answers.push(val);
        });
      } else {
        // short, long, gap, match, order, group, case, assoc
        question.querySelectorAll('.answer').forEach(ansEl => {
          const val = ansEl.textContent.trim();
          if (val) answers.push((qNum ? qNum + ' ' : '') + val);
        });
      }

      if (answers.length) {
        if (!categories[type]) categories[type] = [];
        categories[type].push(...answers);
      }
    });
  });

  // рендеримо колонки (ті, що існують)
  for (const [cat, items] of Object.entries(categories)) {
    if (items.length) {
      const ul = document.createElement('ul');
      const header = document.createElement('li');
      header.style.fontWeight = 'bold';
      header.textContent = categoryNames[cat] || cat;
      ul.appendChild(header);
      items.forEach(it => { const li = document.createElement('li'); li.textContent = it; ul.appendChild(li); });
      columns.appendChild(ul);
    }
      }
    });

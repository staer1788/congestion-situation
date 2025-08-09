const PERSON_IMAGE = 'https://thumb.silhouette-ac.com/20/20ff46a8b3407f6843179c3d0704e8ae_w.jpeg';

// データ取得
function fetchData() {
  document.getElementById('status-message').innerText = 'Updating data...';

  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(displayData)
    .catch(error => {
      console.error('Error fetching data:', error);
      document.getElementById('status-message').innerText = 'Failed to fetch data.';
    });
}

// データ表示
function displayData(data) {
  document.getElementById('status-message').innerText = 'Data fetched successfully.';

  // dataは単一の配列として渡される
  displayItems(data, 'data-container');
}

function displayItems(data, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (data && data.length > 0) {
    data.forEach(row => {
      const div = document.createElement('div');
      div.classList.add('item'); // 新しいクラス名

      const headerInfo = document.createElement('div');
      headerInfo.classList.add('header-info');
      // row[0]: 項目名 (場所A, イベントXなど)
      // row[1]: 詳細 (発表内容A, イベント内容Xなど)
      // row[2]: 混雑状況 (空いています, 混んでいます, とても混んでいます)
      // row[3]: 最終更新
      headerInfo.innerHTML = `<p><strong>${row[0]}</strong>: ${row[1]}</p>`;
      div.appendChild(headerInfo);

      const statusBox = document.createElement('div');
      statusBox.classList.add('status-box');
      if (row[2] === '空いています') statusBox.classList.add('light-green');
      else if (row[2] === '混んでいます') statusBox.classList.add('orange');
      else if (row[2] === 'とても混んでいます') statusBox.classList.add('red');

      statusBox.innerHTML = `<p>混雑状況: ${row[2]}</p><p>最終更新: ${row[3]}</p>`;

      const imagesContainer = document.createElement('div');
      imagesContainer.classList.add('images');
      addImages(imagesContainer, row[2]);
      statusBox.appendChild(imagesContainer);

      div.appendChild(statusBox);
      container.appendChild(div);
    });
  } else {
    container.innerHTML = '<p>データがありません。</p>';
  }
}

// 混雑状況に応じて画像を追加
function addImages(container, status) {
  container.innerHTML = '';
  let count = 0;

  if (status === '空いています') count = 1;
  else if (status === '混んでいます') count = 2;
  else if (status === 'とても混んでいます') count = 3;

  for (let i = 0; i < count; i++) {
    const img = document.createElement('img');
    img.src = PERSON_IMAGE;
    container.appendChild(img);
  }
}

window.onload = fetchData;
setInterval(fetchData, 60000);
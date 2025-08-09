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

  const { sheet1, sheet2 } = data;

  displaySheetData(sheet1, 'sheet1-container');
  displaySheetData(sheet2, 'sheet2-container');
}

function displaySheetData(data, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (data && data.length > 0) {
    data.forEach(row => {
      const div = document.createElement('div');
      div.classList.add(containerId === 'sheet1-container' ? 'venue' : 'club');

      const headerInfo = document.createElement('div');
      headerInfo.classList.add('header-info');
      // row[0]はクラス名または部活名、row[1]は場所、row[2]は発表内容または場所
      // Google Apps ScriptのfetchSheetData()の戻り値の構造に合わせて調整
      // sheet1: [クラス, 場所, 発表内容, 混雑状況]
      // sheet2: [部活, 場所, 発表場所, 混雑状況]
      // 混雑状況はrow[3]に格納されていると仮定
      headerInfo.innerHTML = `<p>${containerId === 'sheet1-container' ? `クラス: ${row[0]} | 場所: ${row[1]}` : `部活: ${row[0]} | 場所: ${row[1]}`}</p>`;
      div.appendChild(headerInfo);

      const statusBox = document.createElement('div');
      statusBox.classList.add('status-box');
      if (row[3] === '空いています') statusBox.classList.add('light-green');
      else if (row[3] === '混んでいます') statusBox.classList.add('orange');
      else if (row[3] === 'とても混んでいます') statusBox.classList.add('red');

      statusBox.innerHTML = `<p>${containerId === 'sheet1-container' ? `発表内容: ${row[2]}` : `発表場所: ${row[2]}`}</p><p>混雑状況: ${row[3]}</p>`;

      const imagesContainer = document.createElement('div');
      imagesContainer.classList.add('images');
      addImages(imagesContainer, row[3]);
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
// 추가 의류 합성 기능 - AI Fitting Studio
console.log('추가 의류 합성 기능 로드됨');

// 기존 showClothesResultImage 함수를 확장
document.addEventListener('DOMContentLoaded', function() {
  // 기존 함수 백업
  const originalShowClothesResultImage = window.showClothesResultImage;
  
  // 새로운 함수로 교체
  window.showClothesResultImage = function(src) {
    console.log('🎯 showClothesResultImage 호출됨:', src);
    
    // 기존 함수 실행
    if (originalShowClothesResultImage) {
      originalShowClothesResultImage(src);
    }
    
    // 이미지 로드 후 추가 의류 섹션 표시
    const clothesResultImage = document.getElementById('clothesResultImage');
    if (clothesResultImage) {
      clothesResultImage.addEventListener('load', function() {
        setTimeout(() => {
          showAdditionalClothingSection();
        }, 1000); // 1초 후 섹션 표시
      });
    }
  };
  
  console.log('showClothesResultImage 함수 확장 완료');
});

// 추가 의류 섹션 표시 함수
function showAdditionalClothingSection() {
  console.log('🔍 showAdditionalClothingSection 호출됨');
  
  const clothingCategory = document.getElementById('clothingCategory');
  if (!clothingCategory) {
    console.error('❌ clothingCategory 요소가 없습니다');
    return;
  }
  
  const currentCategory = clothingCategory.value;
  console.log('🎯 현재 의류 카테고리:', currentCategory);
  
  // 기존 추가 의류 섹션이 있으면 제거
  const existingSection = document.getElementById('additionalClothingSection');
  if (existingSection) {
    existingSection.remove();
  }
  
  // 카테고리에 따른 제안 텍스트와 타겟 카테고리 결정
  let suggestionText = '';
  let targetCategory = '';
  let emoji = '';
  
  switch (currentCategory) {
    case 'upper_body':
      suggestionText = '하의도 추가해서 완벽한 코디를 완성해보세요!';
      targetCategory = 'lower_body';
      emoji = '👖';
      break;
    case 'lower_body':
      suggestionText = '상의도 추가해서 완벽한 코디를 완성해보세요!';
      targetCategory = 'upper_body';
      emoji = '👕';
      break;
    case 'dresses':
      suggestionText = '액세서리를 추가해서 더욱 멋진 스타일을 만들어보세요!';
      targetCategory = 'accessories';
      emoji = '✨';
      break;
    default:
      console.warn('⚠️ 알 수 없는 카테고리:', currentCategory);
      return;
  }
  
  // 추가 의류 섹션 HTML 생성
  const additionalClothingHTML = `
    <div id="additionalClothingSection" style="max-width: 600px; margin: 2rem auto; background: var(--white); border-radius: 1rem; box-shadow: var(--shadow-lg); padding: 2rem; border: 1px solid var(--gray-200); animation: fadeInUp 0.5s ease-out;">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <h3 style="color: var(--gray-800); margin-bottom: 0.5rem; font-size: 1.3rem;">
          ${emoji} 추가 의류 합성
        </h3>
        <p style="color: var(--gray-600); font-size: 0.95rem;">
          ${suggestionText}
        </p>
      </div>
      
      <!-- 추가 의류 업로드 영역 -->
      <div class="upload-section" style="margin-bottom: 1.5rem;">
        <div class="drag-drop-area" id="additionalClothingDragDrop" style="width: 100%; height: 200px; border: 2px dashed var(--primary); border-radius: 1rem; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; background: rgba(37, 99, 235, 0.05);">
          <div class="drag-drop-content" style="text-align: center; pointer-events: none;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${emoji}</div>
            <div class="drag-drop-text" style="font-weight: 600; color: var(--primary); margin-bottom: 0.25rem;">
              ${targetCategory === 'upper_body' ? '상의' : targetCategory === 'lower_body' ? '하의' : '액세서리'} 사진을 드래그하세요
            </div>
            <div class="drag-drop-subtext" style="color: var(--gray-500); font-size: 0.9rem;">
              또는 클릭해서 파일을 선택하세요
            </div>
          </div>
        </div>
        <input type="file" id="additionalClothingUpload" accept="image/*" style="display: none;">
      </div>
      
      <!-- 미리보기 이미지 -->
      <div id="additionalClothingPreview" style="display: none; text-align: center; margin-bottom: 1.5rem;">
        <img id="additionalClothingPreviewImg" style="max-width: 200px; max-height: 200px; border-radius: 0.5rem; box-shadow: var(--shadow-md);">
        <p style="color: var(--gray-600); font-size: 0.9rem; margin-top: 0.5rem;">
          선택된 ${targetCategory === 'upper_body' ? '상의' : targetCategory === 'lower_body' ? '하의' : '액세서리'} 이미지
        </p>
      </div>
      
      <!-- 합성 버튼 -->
      <div style="text-align: center;">
        <button id="processAdditionalClothingBtn" disabled style="width: 100%; max-width: 300px; padding: 1rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 0.75rem; font-size: 1rem; font-weight: 600; cursor: not-allowed; transition: all 0.3s ease; position: relative; overflow: hidden;">
          <span class="button-text">${emoji} 추가 의류 합성하기</span>
          <div class="loading-spinner" style="display: none; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </button>
        <p style="color: var(--gray-500); font-size: 0.85rem; margin-top: 0.5rem;">
          현재 결과 이미지에 새로운 의류를 합성합니다
        </p>
      </div>
    </div>
  `;
  
  // 결과 컨테이너 다음에 추가 의류 섹션 삽입
  const resultContainer = document.querySelector('.result-container');
  if (resultContainer) {
    resultContainer.insertAdjacentHTML('afterend', additionalClothingHTML);
    
    // 이벤트 리스너 설정
    setupAdditionalClothingEvents(targetCategory);
    
    console.log('✅ 추가 의류 섹션 생성 완료');
  } else {
    console.error('❌ result-container를 찾을 수 없습니다');
  }
}

// 추가 의류 이벤트 설정
function setupAdditionalClothingEvents(targetCategory) {
  const dragDropArea = document.getElementById('additionalClothingDragDrop');
  const fileInput = document.getElementById('additionalClothingUpload');
  const previewDiv = document.getElementById('additionalClothingPreview');
  const previewImg = document.getElementById('additionalClothingPreviewImg');
  const processBtn = document.getElementById('processAdditionalClothingBtn');
  
  if (!dragDropArea || !fileInput || !previewDiv || !previewImg || !processBtn) {
    console.error('❌ 추가 의류 DOM 요소를 찾을 수 없습니다');
    return;
  }
  
  // 드래그 앤 드롭 이벤트
  dragDropArea.addEventListener('click', () => fileInput.click());
  
  dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.style.borderColor = 'var(--primary)';
    dragDropArea.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
  });
  
  dragDropArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragDropArea.style.borderColor = 'var(--primary)';
    dragDropArea.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
  });
  
  dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.style.borderColor = 'var(--primary)';
    dragDropArea.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleAdditionalClothingFile(files[0], targetCategory);
    }
  });
  
  // 파일 선택 이벤트
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleAdditionalClothingFile(e.target.files[0], targetCategory);
    }
  });
  
  // 합성 버튼 이벤트
  processBtn.addEventListener('click', () => {
    console.log('🔥 추가 의류 합성 버튼 클릭됨');
    
    // 파일이 선택되었는지 확인
    if (!fileInput.files || fileInput.files.length === 0) {
      alert('먼저 추가할 의류 사진을 업로드해주세요!');
      return;
    }
    
    console.log('📁 선택된 파일:', fileInput.files[0].name);
    processAdditionalClothing(fileInput.files[0], targetCategory);
  });
  
  console.log('✅ 추가 의류 이벤트 리스너 설정 완료');
}

// 추가 의류 파일 처리
function handleAdditionalClothingFile(file, targetCategory) {
  console.log('추가 의류 파일 처리:', file.name, targetCategory);
  
  const previewDiv = document.getElementById('additionalClothingPreview');
  const previewImg = document.getElementById('additionalClothingPreviewImg');
  const processBtn = document.getElementById('processAdditionalClothingBtn');
  
  if (!previewDiv || !previewImg || !processBtn) {
    console.error('❌ 미리보기 요소를 찾을 수 없습니다');
    return;
  }
  
  // 파일을 이미지로 미리보기
  const reader = new FileReader();
  reader.onload = function(e) {
    previewImg.src = e.target.result;
    previewDiv.style.display = 'block';
    
    // 합성 버튼 활성화
    processBtn.disabled = false;
    processBtn.style.cursor = 'pointer';
    processBtn.style.opacity = '1';
    
    console.log('✅ 추가 의류 미리보기 표시 완료');
  };
  
  reader.readAsDataURL(file);
}

// 추가 의류 처리 함수
async function processAdditionalClothing(file, targetCategory) {
  try {
    console.log('🔥 추가 의류 처리 시작:', targetCategory);
    
    // 현재 결과 이미지를 새로운 전신사진으로 사용
    const clothesResultImage = document.getElementById('clothesResultImage');
    if (!clothesResultImage || !clothesResultImage.src) {
      alert('현재 결과 이미지가 없습니다.');
      return;
    }
    
    // 로딩 상태 표시
    const processBtn = document.getElementById('processAdditionalClothingBtn');
    const buttonText = processBtn.querySelector('.button-text');
    const loadingSpinner = processBtn.querySelector('.loading-spinner');
    
    processBtn.disabled = true;
    processBtn.style.cursor = 'not-allowed';
    buttonText.style.display = 'none';
    loadingSpinner.style.display = 'block';
    
    console.log('🔧 함수 존재 여부 확인...');
    console.log('optimizeImage 함수:', typeof window.optimizeImage);
    console.log('callIDMVTONAPI 함수:', typeof window.callIDMVTONAPI);
    
    // 함수 존재 여부 확인
    if (typeof window.optimizeImage !== 'function') {
      throw new Error('optimizeImage 함수를 찾을 수 없습니다. app.js가 로드되었는지 확인해주세요.');
    }
    
    if (typeof window.callIDMVTONAPI !== 'function') {
      throw new Error('callIDMVTONAPI 함수를 찾을 수 없습니다. app.js가 로드되었는지 확인해주세요.');
    }
    
    // 추가 의류 이미지 최적화
    console.log('🖼️ 이미지 최적화 중...');
    const processedFile = await window.optimizeImage(file, 1024, 1024, 0.8);
    
    const reader = new FileReader();
    reader.onload = async function(evt) {
      try {
        const additionalClothingData = evt.target.result;
        
        console.log('🚀 추가 의류 합성 API 호출 시작...');
        
        // 현재 결과 이미지를 전신사진으로, 새 의류를 옷 이미지로 사용
        const resultImageUrl = await window.callIDMVTONAPI(
          clothesResultImage.src, // 현재 결과를 전신사진으로 사용
          additionalClothingData,  // 새 의류 이미지
          `additional ${targetCategory} clothing, layered outfit` // 추가 의류 프롬프트
        );
        
        console.log('✅ 추가 의류 합성 완료:', resultImageUrl);
        
        // 새로운 결과 표시
        if (typeof window.showClothesResultImage === 'function') {
          window.showClothesResultImage(resultImageUrl);
        } else {
          // 직접 이미지 표시
          clothesResultImage.src = resultImageUrl;
          clothesResultImage.style.display = 'block';
        }
        
        // 성공 메시지
        const categoryNames = {
          'upper_body': '상의',
          'lower_body': '하의', 
          'accessories': '액세서리'
        };
        
        alert(`${categoryNames[targetCategory]} 합성이 완료되었습니다! 🎉`);
        
        // 기존 추가 의류 섹션 제거 (새로운 섹션이 자동으로 생성됨)
        const additionalSection = document.getElementById('additionalClothingSection');
        if (additionalSection) {
          additionalSection.remove();
        }
        
      } catch (apiError) {
        console.error('❌ API 호출 오류:', apiError);
        throw apiError;
      }
    };
    
    reader.readAsDataURL(processedFile);
    
  } catch (error) {
    console.error('❌ 추가 의류 처리 오류:', error);
    alert('추가 의류 합성 중 오류가 발생했습니다: ' + error.message);
    
    // 로딩 상태 해제
    const processBtn = document.getElementById('processAdditionalClothingBtn');
    if (processBtn) {
      const buttonText = processBtn.querySelector('.button-text');
      const loadingSpinner = processBtn.querySelector('.loading-spinner');
      
      processBtn.disabled = false;
      processBtn.style.cursor = 'pointer';
      if (buttonText) buttonText.style.display = 'block';
      if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
  }
} 
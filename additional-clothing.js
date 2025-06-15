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
  
  // 원피스일 때는 추가 의류 합성 섹션을 표시하지 않음
  if (currentCategory === 'dresses') {
    console.log('👗 원피스 모드 - 추가 의류 합성 불필요');
    return;
  }
  
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
    
    // 1. 현재 결과 이미지(URL)를 base64로 변환
    console.log('🖼️ 현재 결과 이미지를 base64로 변환 중...');
    const currentResultBase64 = await convertImageUrlToBase64(clothesResultImage.src);
    
    // 2. 새로 업로드한 의류 이미지 최적화
    console.log('👕 새 의류 이미지 최적화 중...');
    const processedFile = await window.optimizeImage(file, 1024, 1024, 0.8);
    
    // 3. 새 의류 이미지를 base64로 변환
    const newClothingBase64 = await convertFileToBase64(processedFile);
    
    console.log('🚀 추가 의류 합성 API 호출 시작...');
    console.log('📸 전신사진: 현재 결과 이미지 (상의를 입은 사람)');
    console.log('👖 의류 사진: 새로 업로드한', targetCategory === 'upper_body' ? '상의' : targetCategory === 'lower_body' ? '하의' : '액세서리');
    
    // 카테고리 설정 - targetCategory를 그대로 사용 (추가할 의류의 종류)
    const clothingCategory = document.getElementById('clothingCategory');
    if (clothingCategory) {
      // 임시로 카테고리를 targetCategory로 설정
      const originalCategory = clothingCategory.value;
      clothingCategory.value = targetCategory;
      
      console.log('🎯 API 호출 카테고리:', targetCategory);
      console.log('📝 카테고리 설명:', 
        targetCategory === 'upper_body' ? '상의 (새로 추가할 상의)' : 
        targetCategory === 'lower_body' ? '하의 (새로 추가할 하의)' : 
        '액세서리 (새로 추가할 액세서리)'
      );
      
      // 4. API 호출 - 현재 결과를 전신사진으로, 새 의류를 옷 이미지로 사용
      const resultImageUrl = await window.callIDMVTONAPI(
        currentResultBase64,  // 현재 결과를 전신사진으로 사용
        newClothingBase64,    // 새 의류 이미지
        `additional ${targetCategory} clothing, layered outfit` // 추가 의류 프롬프트
      );
      
      // 원래 카테고리로 복원
      clothingCategory.value = originalCategory;
      
      console.log('✅ 추가 의류 합성 완료:', resultImageUrl);
      
      // 추가 의류 합성 결과를 별도 섹션에 표시
      showAdditionalClothingResult(resultImageUrl, targetCategory);
      
      // 성공 메시지
      const categoryNames = {
        'upper_body': '상의',
        'lower_body': '하의', 
        'accessories': '액세서리'
      };
      
      alert(`${categoryNames[targetCategory]} 합성이 완료되었습니다! 🎉`);
      
      // 기존 추가 의류 섹션 제거하지 않음 (사용자가 계속 사용할 수 있도록)
      
    } else {
      throw new Error('clothingCategory 요소를 찾을 수 없습니다.');
    }
    
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

// 이미지 URL을 base64로 변환하는 헬퍼 함수
async function convertImageUrlToBase64(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // CORS 문제 해결
    
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      const base64 = canvas.toDataURL('image/jpeg', 0.8);
      resolve(base64);
    };
    
    img.onerror = function() {
      reject(new Error('이미지 로드 실패: ' + imageUrl));
    };
    
    img.src = imageUrl;
  });
}

// 파일을 base64로 변환하는 헬퍼 함수
async function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      resolve(e.target.result);
    };
    reader.onerror = function() {
      reject(new Error('파일 읽기 실패'));
    };
    reader.readAsDataURL(file);
  });
}

// 추가 의류 합성 결과 표시 함수
function showAdditionalClothingResult(imageUrl, targetCategory) {
  console.log('🎨 추가 의류 합성 결과 표시:', imageUrl);
  
  // 기존 추가 의류 결과 섹션이 있으면 제거
  const existingResultSection = document.getElementById('additionalClothingResultSection');
  if (existingResultSection) {
    existingResultSection.remove();
  }
  
  const categoryNames = {
    'upper_body': '상의',
    'lower_body': '하의', 
    'accessories': '액세서리'
  };
  
  const categoryEmojis = {
    'upper_body': '👕',
    'lower_body': '👖',
    'accessories': '✨'
  };
  
  // 추가 의류 합성 결과 섹션 HTML 생성
  const resultHTML = `
    <div id="additionalClothingResultSection" style="max-width: 600px; margin: 2rem auto; background: var(--white); border-radius: 1rem; box-shadow: var(--shadow-lg); padding: 2rem; border: 1px solid var(--gray-200); animation: fadeInUp 0.5s ease-out;">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <h3 style="color: var(--gray-800); margin-bottom: 0.5rem; font-size: 1.3rem;">
          ${categoryEmojis[targetCategory]} ${categoryNames[targetCategory]} 합성 결과
        </h3>
        <p style="color: var(--gray-600); font-size: 0.95rem;">
          추가 의류가 성공적으로 합성되었습니다!
        </p>
      </div>
      
      <!-- 결과 이미지 -->
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <img id="additionalClothingResultImage" src="${imageUrl}" alt="추가 의류 합성 결과" style="max-width: 100%; max-height: 500px; border-radius: 1rem; box-shadow: var(--shadow-lg); border: 1px solid var(--gray-200);">
      </div>
      
      <!-- 액션 버튼들 -->
      <div class="action-buttons" style="display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <button class="share-button instagram" onclick="shareAdditionalClothingToInstagram()" style="background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); color: white; border: none; padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
          인스타그램 공유
        </button>
        <button onclick="shareAdditionalClothingToKakao()" class="share-btn kakao-btn" style="background: #FEE500; color: #000000; border: none; padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
          <span class="button-text">이미지 공유</span>
          <div class="button-loading-spinner" style="display: none;"></div>
        </button>
        <button class="save-button" onclick="saveAdditionalClothingImage()" style="background: var(--primary); color: white; border: none; padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
          이미지 저장
        </button>
      </div>
    </div>
  `;
  
  // 추가 의류 섹션 다음에 결과 섹션 삽입
  const additionalClothingSection = document.getElementById('additionalClothingSection');
  if (additionalClothingSection) {
    additionalClothingSection.insertAdjacentHTML('afterend', resultHTML);
    console.log('✅ 추가 의류 합성 결과 섹션 생성 완료');
  } else {
    console.error('❌ additionalClothingSection을 찾을 수 없습니다');
  }
}

// 추가 의류 합성 결과 인스타그램 공유
function shareAdditionalClothingToInstagram() {
  const resultImage = document.getElementById('additionalClothingResultImage');
  if (resultImage && resultImage.src) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(function(blob) {
        if (navigator.share) {
          const file = new File([blob], 'ai-fitting-result.jpg', { type: 'image/jpeg' });
          navigator.share({
            title: 'AI Fitting Studio - 추가 의류 합성 결과',
            text: 'AI로 만든 나만의 스타일링!',
            files: [file]
          }).catch(console.error);
        } else {
          alert('이 브라우저에서는 직접 공유가 지원되지 않습니다. 이미지를 저장한 후 인스타그램에 업로드해주세요.');
        }
      }, 'image/jpeg', 0.9);
    };
    
    img.src = resultImage.src;
  }
}

// 추가 의류 합성 결과 카카오톡 공유
function shareAdditionalClothingToKakao() {
  const resultImage = document.getElementById('additionalClothingResultImage');
  if (resultImage && resultImage.src) {
    // 카카오톡 공유 로직 (기존 함수와 동일)
    console.log('카카오톡 공유:', resultImage.src);
    alert('카카오톡 공유 기능은 준비 중입니다.');
  }
}

// 추가 의류 합성 결과 이미지 저장
async function saveAdditionalClothingImage() {
  const resultImage = document.getElementById('additionalClothingResultImage');
  if (resultImage && resultImage.src) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.crossOrigin = 'anonymous';
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(function(blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `ai-fitting-additional-${Date.now()}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 'image/jpeg', 0.9);
      };
      
      img.src = resultImage.src;
    } catch (error) {
      console.error('이미지 저장 오류:', error);
      alert('이미지 저장 중 오류가 발생했습니다.');
    }
  }
} 
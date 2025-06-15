// 추가 의류 합성 기능 - AI Fitting Studio
console.log('추가 의류 합성 기능 로드됨');

// 기존 showClothesResultImage 함수를 확장
document.addEventListener('DOMContentLoaded', function() {
  // 기존 함수 백업
  const originalShowClothesResultImage = window.showClothesResultImage;
  
  // 새로운 함수로 교체
  window.showClothesResultImage = function(src) {
    // 기존 함수 실행
    if (originalShowClothesResultImage) {
      originalShowClothesResultImage(src);
    }
    
    // 이미지 로드 후 추가 버튼 표시
    const clothesResultImage = document.getElementById('clothesResultImage');
    if (clothesResultImage) {
      clothesResultImage.addEventListener('load', function() {
        setTimeout(() => {
          showAdditionalClothingButtons();
        }, 500); // 0.5초 후 버튼 표시
      });
    }
  };
  
  console.log('showClothesResultImage 함수 확장 완료');
});

// 추가 의류 제안 버튼 표시 함수
function showAdditionalClothingButtons() {
  console.log('🔍 showAdditionalClothingButtons 호출됨');
  
  const additionalClothingButtons = document.getElementById('additionalClothingButtons');
  const addLowerClothingBtn = document.getElementById('addLowerClothingBtn');
  const addUpperClothingBtn = document.getElementById('addUpperClothingBtn');
  const addAccessoryBtn = document.getElementById('addAccessoryBtn');
  const clothingCategory = document.getElementById('clothingCategory');
  
  console.log('🔍 DOM 요소 확인:', {
    additionalClothingButtons: !!additionalClothingButtons,
    addLowerClothingBtn: !!addLowerClothingBtn,
    addUpperClothingBtn: !!addUpperClothingBtn,
    addAccessoryBtn: !!addAccessoryBtn,
    clothingCategory: !!clothingCategory
  });
  
  if (!additionalClothingButtons || !clothingCategory) {
    console.error('❌ 필수 DOM 요소가 없습니다');
    return;
  }
  
  // 모든 버튼 숨기기
  if (addLowerClothingBtn) addLowerClothingBtn.style.display = 'none';
  if (addUpperClothingBtn) addUpperClothingBtn.style.display = 'none';
  if (addAccessoryBtn) addAccessoryBtn.style.display = 'none';
  
  const currentCategory = clothingCategory.value;
  console.log('🎯 현재 의류 카테고리:', currentCategory);
  
  // 카테고리에 따라 적절한 버튼 표시
  switch (currentCategory) {
    case 'upper_body':
      console.log('👕 상의 모드 - 하의 버튼 표시');
      // 상의 결과 → 하의 제안
      if (addLowerClothingBtn) {
        addLowerClothingBtn.style.display = 'block';
        addLowerClothingBtn.onclick = () => showAdditionalClothingUpload('lower_body');
        console.log('✅ 하의 버튼 표시 완료');
      } else {
        console.error('❌ addLowerClothingBtn 요소가 없습니다');
      }
      break;
      
    case 'lower_body':
      console.log('👖 하의 모드 - 상의 버튼 표시');
      // 하의 결과 → 상의 제안
      if (addUpperClothingBtn) {
        addUpperClothingBtn.style.display = 'block';
        addUpperClothingBtn.onclick = () => showAdditionalClothingUpload('upper_body');
        console.log('✅ 상의 버튼 표시 완료');
      } else {
        console.error('❌ addUpperClothingBtn 요소가 없습니다');
      }
      break;
      
    case 'dresses':
      console.log('👗 원피스 모드 - 액세서리 버튼 표시');
      // 원피스 결과 → 액세서리 제안
      if (addAccessoryBtn) {
        addAccessoryBtn.style.display = 'block';
        addAccessoryBtn.onclick = () => showAdditionalClothingUpload('accessories');
        console.log('✅ 액세서리 버튼 표시 완료');
      } else {
        console.error('❌ addAccessoryBtn 요소가 없습니다');
      }
      break;
      
    default:
      console.warn('⚠️ 알 수 없는 카테고리:', currentCategory);
  }
  
  // 추가 버튼 섹션 표시
  additionalClothingButtons.style.display = 'block';
  console.log('✅ 추가 의류 제안 버튼 섹션 표시 완료');
}

// 추가 의류 업로드 모달 표시 함수
function showAdditionalClothingUpload(targetCategory) {
  console.log('추가 의류 업로드 시작:', targetCategory);
  
  // 카테고리별 메시지
  const categoryMessages = {
    'upper_body': '상의 사진을 업로드해서 현재 결과에 합성해보세요!',
    'lower_body': '하의 사진을 업로드해서 현재 결과에 합성해보세요!',
    'accessories': '액세서리 사진을 업로드해서 현재 결과에 합성해보세요!'
  };
  
  const categoryEmojis = {
    'upper_body': '👕',
    'lower_body': '👖',
    'accessories': '✨'
  };
  
  // 파일 입력 요소 생성
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  
  fileInput.onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
      console.log('추가 의류 파일 선택됨:', file.name);
      processAdditionalClothing(file, targetCategory);
    }
  };
  
  // 사용자에게 알림 후 파일 선택
  const message = `${categoryEmojis[targetCategory]} ${categoryMessages[targetCategory]}`;
  if (confirm(message)) {
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }
}

// 추가 의류 처리 함수
async function processAdditionalClothing(file, targetCategory) {
  try {
    console.log('추가 의류 처리 시작:', targetCategory);
    
    // 현재 결과 이미지를 새로운 전신사진으로 사용
    const clothesResultImage = document.getElementById('clothesResultImage');
    if (!clothesResultImage || !clothesResultImage.src) {
      alert('현재 결과 이미지가 없습니다.');
      return;
    }
    
    // 로딩 상태 표시
    const generateClothesBtn = document.getElementById('generateClothesBtn');
    if (typeof showButtonLoading === 'function') {
      showButtonLoading(generateClothesBtn, true);
    }
    
    // 추가 의류 이미지 최적화
    const processedFile = await optimizeImage(file, 1024, 1024, 0.8);
    
    const reader = new FileReader();
    reader.onload = async function(evt) {
      const additionalClothingData = evt.target.result;
      
      console.log('추가 의류 합성 시작...');
      
      // 현재 결과 이미지를 전신사진으로, 새 의류를 옷 이미지로 사용
      const resultImageUrl = await callIDMVTONAPI(
        clothesResultImage.src, // 현재 결과를 전신사진으로 사용
        additionalClothingData,  // 새 의류 이미지
        `additional ${targetCategory} clothing, layered outfit` // 추가 의류 프롬프트
      );
      
      console.log('추가 의류 합성 완료:', resultImageUrl);
      
      // 새로운 결과 표시
      showClothesResultImage(resultImageUrl);
      
      // 성공 메시지
      const categoryNames = {
        'upper_body': '상의',
        'lower_body': '하의', 
        'accessories': '액세서리'
      };
      
      alert(`${categoryNames[targetCategory]} 합성이 완료되었습니다! 🎉`);
    };
    
    reader.readAsDataURL(processedFile);
    
  } catch (error) {
    console.error('추가 의류 처리 오류:', error);
    alert('추가 의류 합성 중 오류가 발생했습니다: ' + error.message);
  } finally {
    // 로딩 상태 해제
    const generateClothesBtn = document.getElementById('generateClothesBtn');
    if (typeof showButtonLoading === 'function') {
      showButtonLoading(generateClothesBtn, false);
    }
  }
} 
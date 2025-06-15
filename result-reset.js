// 결과물 초기화 기능 모듈
console.log('🔄 결과물 초기화 모듈 로드됨');

// 기존 함수들을 래핑하여 결과물 초기화 기능 추가
(function() {
  // 페이지 로드 완료 후 실행
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 결과물 초기화 기능 초기화 시작...');
    
    // 기존 handleBodyImageFile 함수 백업
    if (typeof window.handleBodyImageFile === 'function') {
      const originalHandleBodyImageFile = window.handleBodyImageFile;
      
      // 새로운 함수로 교체 (결과물 초기화 기능 포함)
      window.handleBodyImageFile = async function(file) {
        console.log('🔄 전신사진 변경으로 인한 결과물 초기화');
        if (typeof resetClothesResultState === 'function') {
          resetClothesResultState();
        }
        return await originalHandleBodyImageFile(file);
      };
      console.log('✅ handleBodyImageFile 래핑 완료');
    }
    
    // 기존 handleClothingImageFile 함수 백업
    if (typeof window.handleClothingImageFile === 'function') {
      const originalHandleClothingImageFile = window.handleClothingImageFile;
      
      // 새로운 함수로 교체 (결과물 초기화 기능 포함)
      window.handleClothingImageFile = async function(file) {
        console.log('🔄 옷 이미지 변경으로 인한 결과물 초기화');
        if (typeof resetClothesResultState === 'function') {
          resetClothesResultState();
        }
        return await originalHandleClothingImageFile(file);
      };
      console.log('✅ handleClothingImageFile 래핑 완료');
    }
    
    // 의류 카테고리 변경 이벤트 리스너 추가
    const clothingCategory = document.getElementById('clothingCategory');
    if (clothingCategory) {
      clothingCategory.addEventListener('change', function() {
        console.log('🔄 의류 카테고리 변경:', this.value);
        
        // 결과물이 있는 경우에만 초기화
        const clothesResultImage = document.getElementById('clothesResultImage');
        if (clothesResultImage && clothesResultImage.style.display !== 'none') {
          if (typeof resetClothesResultState === 'function') {
            resetClothesResultState();
            console.log('✅ 카테고리 변경으로 인한 결과물 초기화 완료');
          }
        }
      });
      console.log('✅ 의류 카테고리 변경 이벤트 리스너 추가 완료');
    }
    
    console.log('🔄 결과물 초기화 기능 초기화 완료');
  });
})(); 
// 결과물 초기화 기능 모듈
console.log('🔄 결과물 초기화 모듈 로드됨');

// 강화된 결과물 초기화 함수
function enhancedResetClothesResultState() {
  console.log('🔄 강화된 옷 모드 결과물 초기화 시작...');
  
  const clothesResultPlaceholder = document.getElementById('clothesResultPlaceholder');
  if (clothesResultPlaceholder) {
    // 원래 텍스트와 모든 스타일 완전 복원
    clothesResultPlaceholder.innerHTML = '가상 피팅 결과가 여기에 표시됩니다';
    clothesResultPlaceholder.style.cssText = 'width: 100%; max-width: 512px; height: 300px; margin: 0 auto; border: 2px dashed var(--gray-300); border-radius: 1rem; display: flex; align-items: center; justify-content: center; color: var(--gray-400); font-size: 1rem;';
    console.log('✅ placeholder 스타일 완전 복원 완료');
  }
  
  const clothesResultImage = document.getElementById('clothesResultImage');
  if (clothesResultImage) {
    clothesResultImage.style.display = 'none';
    clothesResultImage.src = ''; // src도 초기화
    clothesResultImage.style.cssText = 'display: none;'; // 모든 스타일 초기화
    console.log('✅ 결과 이미지 완전 초기화 완료');
  }
  
  const clothesActionButtons = document.getElementById('clothesActionButtons');
  if (clothesActionButtons) {
    clothesActionButtons.style.display = 'none';
    console.log('✅ 액션 버튼 숨김 완료');
  }
  
  const clothesGoogleLensSection = document.getElementById('clothesGoogleLensSection');
  if (clothesGoogleLensSection) {
    clothesGoogleLensSection.style.display = 'none';
    console.log('✅ 구글 렌즈 섹션 숨김 완료');
  }
  
  console.log('✅ 강화된 옷 모드 결과물 초기화 완료');
}

// 기존 함수들을 래핑하여 결과물 초기화 기능 추가
(function() {
  // 페이지 로드 완료 후 실행
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 결과물 초기화 기능 초기화 시작...');
    
    // 기존 resetClothesResultState 함수를 강화된 버전으로 교체
    if (typeof window.resetClothesResultState === 'function') {
      window.resetClothesResultState = enhancedResetClothesResultState;
      console.log('✅ resetClothesResultState 함수 강화 완료');
    } else {
      // 함수가 없으면 새로 생성
      window.resetClothesResultState = enhancedResetClothesResultState;
      console.log('✅ resetClothesResultState 함수 새로 생성 완료');
    }
    
    // 기존 handleBodyImageFile 함수 백업
    if (typeof window.handleBodyImageFile === 'function') {
      const originalHandleBodyImageFile = window.handleBodyImageFile;
      
      // 새로운 함수로 교체 (결과물 초기화 기능 포함)
      window.handleBodyImageFile = async function(file) {
        console.log('🔄 전신사진 변경으로 인한 결과물 초기화');
        enhancedResetClothesResultState();
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
        enhancedResetClothesResultState();
        return await originalHandleClothingImageFile(file);
      };
      console.log('✅ handleClothingImageFile 래핑 완료');
    }
    
    // 의류 카테고리 변경 이벤트 리스너 추가
    const clothingCategory = document.getElementById('clothingCategory');
    if (clothingCategory) {
      clothingCategory.addEventListener('change', function() {
        console.log('🔄 의류 카테고리 변경:', this.value);
        
        // 1. 원피스 길이 옵션 토글 (기존 toggleDressLengthOption 기능)
        const dressLengthSection = document.getElementById('dressLengthSection');
        if (dressLengthSection) {
          if (this.value === 'dresses') {
            // 원피스 모드: 길이 선택 표시
            dressLengthSection.style.display = 'block';
            
            // 부드러운 애니메이션 효과
            dressLengthSection.style.opacity = '0';
            dressLengthSection.style.transform = 'translateY(-10px)';
            setTimeout(() => {
              dressLengthSection.style.transition = 'all 0.3s ease';
              dressLengthSection.style.opacity = '1';
              dressLengthSection.style.transform = 'translateY(0)';
            }, 10);
          } else {
            // 기타 모드: 길이 선택 숨김
            dressLengthSection.style.display = 'none';
          }
        }
        
        // 2. 의류 카테고리 변경 시 항상 결과물 초기화 (조건 없이)
        console.log('🔍 카테고리 변경 감지 - 무조건 초기화 진행');
        enhancedResetClothesResultState();
        console.log('✅ 카테고리 변경으로 인한 결과물 초기화 완료');
      });
      console.log('✅ 의류 카테고리 변경 이벤트 리스너 추가 완료');
    }
    
    console.log('🔄 결과물 초기화 기능 초기화 완료');
  });
})(); 
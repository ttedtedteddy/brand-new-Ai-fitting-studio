// AI Fitting Studio v2.0.1-final + 옷 이미지 자동 입히기 기능
// UI/UX 대폭 개선 버전: 갤러리 제거, 업로드-마스킹 통합, 구글렌즈 연동, 모바일 반응형, 옷 이미지 모드
console.log('AI Fitting Studio v2.0.1-final + 옷 이미지 모드 로드됨');
console.log('개선사항: 갤러리 제거, 업로드-마스킹 통합, 구글렌즈 연동, 모바일 반응형, 옷 이미지 자동 입히기');

// 랜딩 페이지 버튼 이벤트 리스너
document.addEventListener('DOMContentLoaded', () => {
  const tryMyStyleBtn = document.getElementById('tryMyStyleBtn');
  const landingPage = document.getElementById('landingPage');
  const modeSelectionPage = document.getElementById('modeSelectionPage');
  const mainApp = document.getElementById('mainApp');
  const promptModeBtn = document.getElementById('promptModeBtn');
  const clothesModeBtn = document.getElementById('clothesModeBtn');
  
  // 뒤로가기 버튼들
  const backToLandingBtn = document.getElementById('backToLandingBtn');
  const backToModeSelectionFromMainBtn = document.getElementById('backToModeSelectionFromMainBtn');
  const backToModeSelectionFromClothesBtn = document.getElementById('backToModeSelectionFromClothesBtn');
  
  // Try my style 버튼 클릭 → 모드 선택 페이지 표시
  if (tryMyStyleBtn && landingPage && modeSelectionPage) {
    tryMyStyleBtn.addEventListener('click', () => {
      showPageWithAnimation(landingPage, modeSelectionPage);
    });
  }
  
  // Start with prompt 버튼 클릭 → 메인 앱 표시 (기존 기능)
  if (promptModeBtn && modeSelectionPage && mainApp) {
    promptModeBtn.addEventListener('click', () => {
      showPageWithAnimation(modeSelectionPage, mainApp);
    });
  }
  
  // Start with pictures of clothes 버튼 클릭 → 옷 이미지 모드
  if (clothesModeBtn) {
    clothesModeBtn.addEventListener('click', () => {
      const clothesModeApp = document.getElementById('clothesModeApp');
      if (modeSelectionPage && clothesModeApp) {
        showPageWithAnimation(modeSelectionPage, clothesModeApp);
        // 옷 이미지 모드 초기화
        setupClothesMode();
      }
    });
  }
  
  // 뒤로가기 버튼 이벤트들
  
  // 모드 선택 → 랜딩 페이지
  if (backToLandingBtn) {
    backToLandingBtn.addEventListener('click', () => {
      showPageWithAnimation(modeSelectionPage, landingPage);
    });
  }
  
  // 메인 앱 → 모드 선택 페이지
  if (backToModeSelectionFromMainBtn) {
    backToModeSelectionFromMainBtn.addEventListener('click', () => {
      showPageWithAnimation(mainApp, modeSelectionPage);
    });
  }
  
  // 옷 이미지 모드 → 모드 선택 페이지
  if (backToModeSelectionFromClothesBtn) {
    backToModeSelectionFromClothesBtn.addEventListener('click', () => {
      const clothesModeApp = document.getElementById('clothesModeApp');
      if (clothesModeApp) {
        showPageWithAnimation(clothesModeApp, modeSelectionPage);
      }
    });
  }
  
  // 기존 초기화 함수들
  setupDragAndDrop();
  setupGoogleLensSearch();
  initKakaoSDK();
  registerServiceWorker();
});

// AI Fitting Studio v2.0.1-final
// UI/UX 대폭 개선 버전: 갤러리 제거, 업로드-마스킹 통합, 구글렌즈 연동, 모바일 반응형
console.log('AI Fitting Studio v2.0.1-final 로드됨');
console.log('개선사항: 갤러리 제거, 업로드-마스킹 통합, 구글렌즈 연동, 모바일 반응형');

// AI Fitting Studio v2.0.1-final
// UI/UX 대폭 개선 버전: 갤러리 제거, 업로드-마스킹 통합, 구글렌즈 연동, 모바일 반응형
console.log('AI Fitting Studio v2.0.1-final 로드됨');
console.log('개선사항: 갤러리 제거, 업로드-마스킹 통합, 구글렌즈 연동, 모바일 반응형');

const photoCanvas = document.getElementById('photoCanvas');
const maskCanvas = document.getElementById('maskCanvas');
const photoCtx = photoCanvas.getContext('2d');
const maskCtx = maskCanvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const dragDropArea = document.getElementById('dragDropArea');
const maskSection = document.getElementById('maskSection');
const brushSizeInput = document.getElementById('brushSize');
const clearMaskBtn = document.getElementById('clearMaskBtn');
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const resultImage = document.getElementById('resultImage');
const resultPlaceholder = document.getElementById('resultPlaceholder');
const actionButtons = document.getElementById('actionButtons');
const dropNotice = document.getElementById('dropNotice');
const googleSearchInput = document.getElementById('googleSearchInput');
const googleSearchBtn = document.getElementById('googleSearchBtn');

// 새로운 옷 이미지 모드 관련 요소들
const textModeBtn = document.getElementById('textModeBtn');
const imageModeBtn = document.getElementById('imageModeBtn');
const textMode = document.getElementById('textMode');
const imageMode = document.getElementById('imageMode');
const clothingDropArea = document.getElementById('clothingDropArea');
const clothingUpload = document.getElementById('clothingUpload');
const clothingPreview = document.getElementById('clothingPreview');
const clothingImage = document.getElementById('clothingImage');
const removeClothingBtn = document.getElementById('removeClothingBtn');
const additionalPrompt = document.getElementById('additionalPrompt');

// 마스킹 모달 관련
const maskModal = document.getElementById('maskModal');
const modalPhotoCanvas = document.getElementById('modalPhotoCanvas');
const modalMaskCanvas = document.getElementById('modalMaskCanvas');
const applyMaskBtn = document.getElementById('applyMaskBtn');
const closeMaskBtn = document.getElementById('closeMaskBtn');
const modalPhotoCtx = modalPhotoCanvas.getContext('2d');
const modalMaskCtx = modalMaskCanvas.getContext('2d');

let img = new Image();
let drawing = false;
let lastX, lastY;
let modalDrawing = false;
let modalLastX, modalLastY;
let brushSize = 30;
let originalImageData = null; // 원본 이미지 데이터 저장

// 새로운 변수들
let currentMode = 'text'; // 'text' 또는 'image'
let bodyImageData = null; // 전신사진 데이터 (옷 이미지 모드용)
let clothingImageData = null; // 옷 이미지 데이터 (옷 이미지 모드용)
let upperClothingImageData = null; // 상의 이미지 데이터 (상하의 각각 업로드용)
let lowerClothingImageData = null; // 하의 이미지 데이터 (상하의 각각 업로드용)

// 드래그 앤 드롭 기능 구현
function setupDragAndDrop() {
  // 드래그 앤 드롭 영역 클릭 시 파일 선택
  dragDropArea.addEventListener('click', () => {
    imageUpload.click();
  });

  // 드래그 오버 이벤트
  dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.classList.add('drag-over');
  });

  // 드래그 리브 이벤트
  dragDropArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragDropArea.classList.remove('drag-over');
  });

  // 드롭 이벤트
  dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleImageFile(file);
      } else {
        alert('이미지 파일만 업로드 가능합니다.');
      }
    }
  });

  // 전체 페이지에서 드래그 앤 드롭 방지
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  document.addEventListener('drop', (e) => {
    e.preventDefault();
  });
}

// 이미지 최적화 함수 추가 (IDM-VTON 3:4 비율 최적화)
function optimizeImage(file, maxWidth = 1920, maxHeight = 1920, quality = 0.8, forceAspectRatio = null) {
  console.log(`🔧 디버그: optimizeImage 함수 시작 - forceAspectRatio: "${forceAspectRatio}"`);
  
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
      // 원본 크기
      const originalWidth = img.width;
      const originalHeight = img.height;
      const originalRatio = originalWidth / originalHeight;
      
      console.log(`🔧 디버그: 원본 이미지 크기 - ${originalWidth}x${originalHeight}, 비율: ${originalRatio.toFixed(3)}`);
      
      let newWidth = originalWidth;
      let newHeight = originalHeight;
      
      // IDM-VTON용 3:4 비율 강제 적용
      if (forceAspectRatio === '3:4') {
        console.log('🎯 IDM-VTON 최적화: 3:4 비율로 조정');
        
        // IDM-VTON은 정확히 768x1024만 받도록 강제 설정
        newWidth = 768;
        newHeight = 1024;
        
        console.log(`📐 3:4 비율 강제 조정: ${originalWidth}x${originalHeight} → ${newWidth}x${newHeight} (IDM-VTON 전용)`);
        
      } else {
        console.log(`🔧 디버그: 3:4 비율 조정 건너뜀 - forceAspectRatio가 "${forceAspectRatio}"임`);
        // 기존 비율 유지 로직
        if (newWidth > maxWidth || newHeight > maxHeight) {
          const ratio = Math.min(maxWidth / newWidth, maxHeight / newHeight);
          newWidth = Math.floor(newWidth * ratio);
          newHeight = Math.floor(newHeight * ratio);
        }
      }
      
      // 최종 비율 확인
      const finalRatio = newWidth / newHeight;
      
      // 캔버스 크기 설정
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // 배경을 흰색으로 설정 (패딩 영역)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, newWidth, newHeight);
      
      // 이미지를 중앙에 맞춰 그리기 (비율 유지하면서 패딩 추가)
      const scale = Math.min(newWidth / originalWidth, newHeight / originalHeight);
      const scaledWidth = originalWidth * scale;
      const scaledHeight = originalHeight * scale;
      const offsetX = (newWidth - scaledWidth) / 2;
      const offsetY = (newHeight - scaledHeight) / 2;
      
      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
      
      // 압축된 이미지를 Blob으로 변환
      canvas.toBlob((blob) => {
        const originalSizeKB = Math.round(file.size / 1024);
        const compressedSizeKB = Math.round(blob.size / 1024);
        
        console.log(`📊 이미지 최적화 완료:`);
        console.log(`   - 원본 크기: ${originalSizeKB}KB`);
        console.log(`   - 압축 후: ${compressedSizeKB}KB`);
        console.log(`   - 압축률: ${Math.round((1 - blob.size / file.size) * 100)}%`);
        console.log(`   - 해상도: ${originalWidth}x${originalHeight} → ${newWidth}x${newHeight}`);
        console.log(`   - 비율: ${originalRatio.toFixed(3)} → ${finalRatio.toFixed(3)} ${forceAspectRatio ? '(강제 조정)' : '(유지)'}`);
        
        // File 객체로 변환
        const optimizedFile = new File([blob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        
        resolve(optimizedFile);
      }, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

// 파일 크기 체크 및 최적화 함수
async function processImageFile(file) {
  const fileSizeKB = Math.round(file.size / 1024);
  
  console.log(`📁 파일 처리 시작: ${file.name} (${fileSizeKB}KB)`);
  
  // 이미지 파일인지 확인
  if (!file.type.startsWith('image/')) {
    throw new Error('이미지 파일만 업로드 가능합니다.');
  }
  
  // 해상도 체크
  const imageSize = await getImageDimensions(file);
  console.log(`📐 원본 해상도: ${imageSize.width}x${imageSize.height}`);
  
  // 모든 이미지를 1024x1024로 압축 (업로드 즉시)
  console.log('🔄 이미지 압축 시작 - 최대 1024x1024로 축소...');
  
  const optimizedFile = await optimizeImage(file, 1024, 1024, 0.8);
  
  const optimizedSizeKB = Math.round(optimizedFile.size / 1024);
  console.log(`✅ 압축 완료: ${fileSizeKB}KB → ${optimizedSizeKB}KB`);
  
  return optimizedFile;
}

// 이미지 크기 확인 함수 추가
function getImageDimensions(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = function() {
      URL.revokeObjectURL(url);
      resolve({
        width: this.width,
        height: this.height
      });
    };
    
    img.src = url;
  });
}

// 기존 handleImageFile 함수 수정
async function handleImageFile(file) {
  try {
    // 이미지 최적화 처리
    const processedFile = await processImageFile(file);
    
    const reader = new FileReader();
    reader.onload = function(evt) {
      const tempImg = new window.Image();
      tempImg.onload = function() {
        // 원본 이미지 데이터 저장
        originalImageData = {
          width: tempImg.width,
          height: tempImg.height,
          src: evt.target.result
        };
        
        // 캔버스 초기화
        photoCtx.clearRect(0, 0, photoCanvas.width, photoCanvas.height);
        maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        
        // 이미지 비율 계산
        const canvasW = photoCanvas.width;
        const canvasH = photoCanvas.height;
        const imgW = tempImg.width;
        const imgH = tempImg.height;
        const scale = Math.min(canvasW / imgW, canvasH / imgH);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        const offsetX = (canvasW - drawW) / 2;
        const offsetY = (canvasH - drawH) / 2;
        
        // 중앙에 맞춰 그리기
        photoCanvas.style.display = 'block';
        maskCanvas.style.display = 'block';
        photoCtx.drawImage(tempImg, offsetX, offsetY, drawW, drawH);
        
        // 마스킹 섹션 자동으로 표시
        maskSection.style.display = 'block';
        
        // 마스킹 섹션으로 스크롤
        maskSection.scrollIntoView({ behavior: 'smooth' });
        
        // 결과 이미지 초기화
        resetResultState();
      }
      tempImg.src = evt.target.result;
    }
    reader.readAsDataURL(processedFile);
    
  } catch (error) {
    console.error('이미지 처리 오류:', error);
    alert(`이미지 처리 중 오류가 발생했습니다: ${error.message}`);
  }
}

// 전신사진 파일 처리 함수 수정 (3:4 비율 최적화)
async function handleBodyImageFile(file) {
  try {
    console.log('🏃 전신사진 최적화 시작 (IDM-VTON 3:4 비율)...');
    console.log('🔧 디버그: optimizeImage 호출 전 - forceAspectRatio: "3:4"');
    
    // IDM-VTON용 3:4 비율로 최적화
    const processedFile = await optimizeImage(file, 768, 1024, 0.8, '3:4');
    
    console.log('🔧 디버그: optimizeImage 호출 완료');
    
    const reader = new FileReader();
    reader.onload = function(evt) {
      bodyImageData = evt.target.result;
      
      // 업로드 영역 업데이트 - 3:4 비율로 표시
      const bodyDragDropArea = document.getElementById('bodyDragDropArea');
      if (bodyDragDropArea) {
        bodyDragDropArea.style.backgroundImage = `url(${evt.target.result})`;
        bodyDragDropArea.style.backgroundSize = 'contain';
        bodyDragDropArea.style.backgroundPosition = 'center';
        bodyDragDropArea.style.backgroundRepeat = 'no-repeat';
        bodyDragDropArea.classList.add('has-image');
        
        // 3:4 비율 강제 적용 (미리보기)
        bodyDragDropArea.style.aspectRatio = '3/4';
        bodyDragDropArea.style.width = '300px';
        bodyDragDropArea.style.height = '400px';
        bodyDragDropArea.style.margin = '0 auto';
        
        const content = bodyDragDropArea.querySelector('.drag-drop-content');
        if (content) {
          content.innerHTML = '<div>✅ 전신사진 업로드 완료 (3:4 비율 최적화)</div>';
          content.style.background = 'rgba(0, 0, 0, 0.7)';
          content.style.color = 'white';
          content.style.padding = '0.5rem';
          content.style.borderRadius = '0.5rem';
          content.style.backdropFilter = 'blur(4px)';
        }
        
        console.log('📱 전신사진 미리보기 3:4 비율로 표시 완료');
      }
      
      updateGenerateButton();
      console.log('✅ 전신사진 3:4 비율 최적화 완료');
    };
    reader.readAsDataURL(processedFile);
    
  } catch (error) {
    console.error('전신사진 처리 오류:', error);
    alert(`전신사진 처리 중 오류가 발생했습니다: ${error.message}`);
  }
}

// 옷 이미지 파일 처리 함수 수정 (3:4 비율 최적화)
async function handleClothingImageFile(file) {
  try {
    console.log('👕 옷 이미지 최적화 시작 (IDM-VTON 3:4 비율)...');
    
    // IDM-VTON용 3:4 비율로 최적화
    const processedFile = await optimizeImage(file, 768, 1024, 0.8, '3:4');
    
    const reader = new FileReader();
    reader.onload = function(evt) {
      clothingImageData = evt.target.result;
      
      // 업로드 영역 업데이트 - 3:4 비율로 표시
      const clothesDragDropArea = document.getElementById('clothesDragDropArea');
      if (clothesDragDropArea) {
        clothesDragDropArea.style.backgroundImage = `url(${evt.target.result})`;
        clothesDragDropArea.style.backgroundSize = 'contain';
        clothesDragDropArea.style.backgroundPosition = 'center';
        clothesDragDropArea.style.backgroundRepeat = 'no-repeat';
        clothesDragDropArea.classList.add('has-image');
        
        // 3:4 비율 강제 적용 (미리보기)
        clothesDragDropArea.style.aspectRatio = '3/4';
        clothesDragDropArea.style.width = '300px';
        clothesDragDropArea.style.height = '400px';
        clothesDragDropArea.style.margin = '0 auto';
        
        const content = clothesDragDropArea.querySelector('.drag-drop-content');
        if (content) {
          content.innerHTML = '<div>✅ 옷 이미지 업로드 완료 (3:4 비율 최적화)</div>';
          content.style.background = 'rgba(0, 0, 0, 0.7)';
          content.style.color = 'white';
          content.style.padding = '0.5rem';
          content.style.borderRadius = '0.5rem';
          content.style.backdropFilter = 'blur(4px)';
        }
        
        console.log('📱 옷 이미지 미리보기 3:4 비율로 표시 완료');
      }
      
      updateGenerateButton();
      console.log('✅ 옷 이미지 3:4 비율 최적화 완료');
    };
    reader.readAsDataURL(processedFile);
    
  } catch (error) {
    console.error('옷 이미지 처리 오류:', error);
    alert(`옷 이미지 처리 중 오류가 발생했습니다: ${error.message}`);
  }
}

// 결과 이미지 표시 함수
function showResultImage(imageUrl) {
  resultImage.src = imageUrl;
  resultImage.style.display = 'block';
  
  if (resultPlaceholder) {
    resultPlaceholder.style.display = 'none';
  }
  
  // 액션 버튼들 표시
  if (actionButtons) {
    actionButtons.style.display = 'flex';
  }
  
  // 구글 렌즈 섹션 표시
  const googleLensSection = document.getElementById('googleLensSection');
  if (googleLensSection) {
    googleLensSection.style.display = 'block';
  }
}

// 결과 이미지 숨기기 함수
function hideResultImage() {
  resultImage.style.display = 'none';
  if (resultPlaceholder) {
    resultPlaceholder.style.display = 'flex';
  }
  if (actionButtons) {
    actionButtons.style.display = 'none';
  }
  // 구글 렌즈 섹션 숨기기
  const googleLensSection = document.getElementById('googleLensSection');
  if (googleLensSection) {
    googleLensSection.style.display = 'none';
  }
}

// 로딩 상태 표시 함수
function showLoadingState() {
  if (resultPlaceholder) {
    resultPlaceholder.innerHTML = `
      <div style="text-align: center;">
        <div class="loading" style="margin: 0 auto 1rem auto; width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%); animation: pulse 1s infinite alternate;"></div>
        <div style="font-weight: bold; font-size: 1.1rem; background: linear-gradient(90deg, #2563eb, #60a5fa, #2563eb); background-size: 200% auto; color: transparent; background-clip: text; -webkit-background-clip: text; animation: flowingText 2s linear infinite;">결과를 생성하는 중입니다...</div>
        <div style="font-size: 0.9rem; color: var(--gray-500); margin-top: 0.5rem;">잠시만 기다려주세요</div>
      </div>
    `;
    resultPlaceholder.style.display = 'flex';
  }
  resultImage.style.display = 'none';
  if (actionButtons) {
    actionButtons.style.display = 'none';
  }
}

// 기본 상태로 복원 함수
function resetResultState() {
  if (resultPlaceholder) {
    resultPlaceholder.innerHTML = '생성된 이미지가 여기에 표시됩니다';
    resultPlaceholder.style.display = 'flex';
  }
  resultImage.style.display = 'none';
  if (actionButtons) {
    actionButtons.style.display = 'none';
  }
  // 구글 렌즈 섹션 숨기기
  const googleLensSection = document.getElementById('googleLensSection');
  if (googleLensSection) {
    googleLensSection.style.display = 'none';
  }
}

// 브러쉬 크기 조절
brushSizeInput.addEventListener('input', (e) => {
  brushSize = parseInt(e.target.value, 10);
});

// 마스크 지우기 버튼
clearMaskBtn.addEventListener('click', () => {
  maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
});

// 좌표 계산 함수 (마우스와 터치 이벤트 통합)
function getEventPos(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
  const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height)
  };
}

// 마스킹 브러쉬 기능 (마우스 + 터치 지원)
function setupBrushEvents(canvas, ctx, drawingVar, lastXVar, lastYVar) {
  // 마우스 이벤트
  canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    window[drawingVar] = true;
    const pos = getEventPos(e, canvas);
    window[lastXVar] = pos.x;
    window[lastYVar] = pos.y;
  });

  canvas.addEventListener('mousemove', (e) => {
    e.preventDefault();
    if (!window[drawingVar]) return;
    drawBrush(e, canvas, ctx, lastXVar, lastYVar);
  });

  canvas.addEventListener('mouseup', (e) => {
    e.preventDefault();
    window[drawingVar] = false;
  });

  canvas.addEventListener('mouseleave', (e) => {
    e.preventDefault();
    window[drawingVar] = false;
  });

  // 터치 이벤트
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    window[drawingVar] = true;
    const pos = getEventPos(e, canvas);
    window[lastXVar] = pos.x;
    window[lastYVar] = pos.y;
  });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!window[drawingVar]) return;
    drawBrush(e, canvas, ctx, lastXVar, lastYVar);
  });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    window[drawingVar] = false;
  });

  canvas.addEventListener('touchcancel', (e) => {
    e.preventDefault();
    window[drawingVar] = false;
  });
}

// 브러시 그리기 함수
function drawBrush(e, canvas, ctx, lastXVar, lastYVar) {
  const pos = getEventPos(e, canvas);
  const brushSizeValue = canvas === modalMaskCanvas ? 30 : brushSize;
  
  ctx.strokeStyle = '#ea580c'; // 진한 주황색
  ctx.lineWidth = brushSizeValue;
  ctx.lineCap = 'round';
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(window[lastXVar], window[lastYVar]);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  
  window[lastXVar] = pos.x;
  window[lastYVar] = pos.y;
}

// 메인 캔버스 브러시 설정
setupBrushEvents(maskCanvas, maskCtx, 'drawing', 'lastX', 'lastY');

// 모달 캔버스 브러시 설정  
setupBrushEvents(modalMaskCanvas, modalMaskCtx, 'modalDrawing', 'modalLastX', 'modalLastY');

// 모달 적용 버튼: 메인 캔버스에 이미지와 마스크 반영
applyMaskBtn.addEventListener('click', () => {
  // 메인 캔버스 초기화
  photoCtx.clearRect(0, 0, photoCanvas.width, photoCanvas.height);
  maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  // 모달의 이미지와 마스크를 메인 캔버스에 복사
  photoCtx.drawImage(modalPhotoCanvas, 0, 0);
  maskCtx.drawImage(modalMaskCanvas, 0, 0);
  maskModal.classList.remove('show');
  if (dropNotice) dropNotice.style.display = 'none';
});
// 모달 취소 버튼: 닫기
closeMaskBtn.addEventListener('click', () => {
  maskModal.classList.remove('show');
});

// 주황색 마스크를 흰색으로 변환하는 함수
function convertOrangeMaskToWhite(canvas) {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  
  // 원본 캔버스를 임시 캔버스에 복사
  tempCtx.drawImage(canvas, 0, 0);
  
  // 이미지 데이터 가져오기
  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const data = imageData.data;
  
  // 주황색 픽셀을 흰색으로 변환
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    // 주황색 범위 감지 (대략적인 주황색 범위)
    if (r > 200 && g > 50 && g < 150 && b < 50 && a > 0) {
      data[i] = 255;     // R
      data[i + 1] = 255; // G
      data[i + 2] = 255; // B
      data[i + 3] = 255; // A
    } else if (a > 0) {
      // 다른 색상은 검은색으로
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }
  }
  
  // 변환된 데이터를 다시 캔버스에 적용
  tempCtx.putImageData(imageData, 0, 0);
  
  return tempCanvas.toDataURL('image/png');
}

// AI 스타일링 생성 버튼
generateBtn.addEventListener('click', async () => {
  // 원본 이미지와 마스크 이미지 추출
  const imageData = photoCanvas.toDataURL('image/png');
  // 주황색 마스크를 흰색으로 변환
  const maskData = convertOrangeMaskToWhite(maskCanvas);
  const prompt = promptInput.value;

  if (!prompt.trim()) {
    alert('프롬프트를 입력해주세요.');
    return;
  }

  // 로딩 상태 표시
  showLoadingState();
  showButtonLoading(generateBtn, true);

  try {
    const outputUrl = await callReplicateAPI(imageData, maskData, prompt);
    if (outputUrl) {
      showResultImage(outputUrl);
    } else {
      resetResultState();
      alert('AI 스타일링 생성 실패: 결과 이미지가 없습니다.');
    }
  } catch (err) {
    resetResultState();
    alert('AI 스타일링 생성 실패: ' + err.message);
  }
  showButtonLoading(generateBtn, false);
});

// 결과 이미지 로드 완료 시 이벤트
resultImage.addEventListener('load', () => {
  // 이미지가 성공적으로 로드되면 placeholder 숨기기
  if (resultPlaceholder) {
    resultPlaceholder.style.display = 'none';
  }
});

// 결과 이미지 로드 실패 시 이벤트
resultImage.addEventListener('error', () => {
  resetResultState();
  alert('이미지를 불러오는데 실패했습니다.');
});

// 구글 렌즈 연동 - 생성된 이미지를 구글 이미지 검색에 전달 (개선된 버전)
function setupGoogleLensSearch() {
  const googleLensBtn = document.getElementById('googleLensBtn');
  if (!googleLensBtn) return;
  
  googleLensBtn.addEventListener('click', () => {
    if (!resultImage.src) {
      alert('결과 이미지가 없습니다.');
      return;
    }
    
    try {
      console.log('구글 렌즈 검색 시작...');
      console.log('이미지 URL:', resultImage.src);
      
      // 구글 렌즈로 직접 이미지 검색 (옷 이미지 모드와 동일한 방식)
      const searchUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(resultImage.src)}`;
      console.log('구글 렌즈 URL:', searchUrl);
      
      window.open(searchUrl, '_blank');
      console.log('구글 렌즈 검색 완료');
      
    } catch (error) {
      console.error('구글 렌즈 연동 오류:', error);
      // 에러 시 기본 구글 렌즈만 열기
      window.open('https://lens.google.com/', '_blank');
      alert('구글 렌즈 페이지가 열렸습니다. 생성된 이미지를 수동으로 업로드해주세요.');
    }
  });
}

// 카카오톡 공유 기능 개선 (Kakao SDK 사용)
function initKakaoSDK() {
  // 카카오 SDK 동적 로드
  if (!window.Kakao) {
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.onload = () => {
      // 카카오 앱 키 (실제 서비스에서는 환경변수로 관리)
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('YOUR_KAKAO_APP_KEY'); // 실제 앱 키로 교체 필요
      }
    };
    document.head.appendChild(script);
  }
}

// 이미지를 Base64로 변환하는 함수
function imageToBase64(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/png');
}

// 개선된 이미지 저장 기능 (우클릭 저장처럼 다이얼로그 표시)
async function saveImage() {
  if (!resultImage.src) {
    alert('저장할 이미지가 없습니다.');
    return;
  }
  
  try {
    console.log('이미지 저장 시작...');
    console.log('이미지 URL:', resultImage.src);
    
    // 파일명 생성 (타임스탬프 포함)
    const now = new Date();
    const timestamp = now.getFullYear() + 
                     String(now.getMonth() + 1).padStart(2, '0') + 
                     String(now.getDate()).padStart(2, '0') + '_' +
                     String(now.getHours()).padStart(2, '0') + 
                     String(now.getMinutes()).padStart(2, '0') + 
                     String(now.getSeconds()).padStart(2, '0');
    const filename = `AI스타일링_결과_${timestamp}.jpg`;
    
    console.log('파일명:', filename);
    
    // File System Access API 사용하여 저장 다이얼로그 표시
    if ('showSaveFilePicker' in window) {
      try {
        console.log('파일 저장 다이얼로그 표시...');
        
        // 이미지를 fetch로 가져와서 blob으로 변환
        const response = await fetch(resultImage.src);
        const blob = await response.blob();
        
        console.log('이미지 blob 생성 완료, 크기:', blob.size);
        
        // 저장 다이얼로그 표시
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: 'JPEG 이미지',
              accept: {
                'image/jpeg': ['.jpg', '.jpeg'],
              },
            },
            {
              description: 'PNG 이미지',
              accept: {
                'image/png': ['.png'],
              },
            },
          ],
        });
        
        console.log('파일 핸들 생성 완료:', fileHandle.name);
        
        // 파일 쓰기
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        
        console.log('파일 저장 완료');
        alert(`이미지가 성공적으로 저장되었습니다!\n파일명: ${fileHandle.name}`);
        return;
        
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('사용자가 저장을 취소했습니다.');
          return;
        }
        console.error('File System Access API 오류:', error);
        // 에러 시 폴백 방식 사용
      }
    }
    
    // 폴백: 기본 다운로드 방식
    console.log('기본 다운로드 방식 사용');
        const link = document.createElement('a');
    link.href = resultImage.src;
        link.download = filename;
    link.target = '_blank';
        link.style.display = 'none';
    
        document.body.appendChild(link);
        link.click();
    
    setTimeout(() => {
        document.body.removeChild(link);
    }, 100);
      
    alert(`이미지가 다운로드 폴더에 저장되었습니다!\n파일명: ${filename}`);
    console.log('이미지 저장 완료:', filename);
    
  } catch (error) {
    console.error('이미지 저장 오류:', error);
    
    // 간단한 우클릭 저장 안내
    alert('자동 저장에 실패했습니다.\n\n해결 방법:\n1. 결과 이미지에서 우클릭\n2. "이미지를 다른 이름으로 저장" 선택\n3. 원하는 위치에 저장');
    
    // 이미지에 포커스를 주어 우클릭하기 쉽게 만들기
    if (resultImage) {
      resultImage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      resultImage.style.border = '3px solid #ff6b6b';
      resultImage.style.borderRadius = '8px';
      
      setTimeout(() => {
        resultImage.style.border = '';
        resultImage.style.borderRadius = '';
      }, 3000);
    }
  }
}

// Replicate FLUX Fill Pro API 호출 함수 (최신 모델)
async function callReplicateAPI(imageData, maskData, prompt) {
  // DataURL → base64 (헤더 제거)
  const imageBase64 = imageData.replace(/^data:image\/png;base64,/, '');
  const maskBase64 = maskData.replace(/^data:image\/png;base64,/, '');

  // 현재 페이지의 호스트를 기반으로 API URL 생성
  const baseUrl = window.location.protocol + '//' + window.location.host;
  
  // 1. 이미지 업로드 (base64 → URL)
  const imageUploadRes = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageBase64 })
  });
  const imageUploadData = await imageUploadRes.json();
  if (!imageUploadData.url) throw new Error('원본 이미지 업로드 실패');

  const maskUploadRes = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: maskBase64 })
  });
  const maskUploadData = await maskUploadRes.json();
  if (!maskUploadData.url) throw new Error('마스크 이미지 업로드 실패');

  // 2. Replicate API 호출 (FLUX Fill Pro 최신 모델)
  const response = await fetch(`${baseUrl}/replicate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // FLUX Fill Pro - 최신 2024년 3월 버전
      version: "10b45d01bb46cffc8d7893b36d720e369d732bb2e48ca3db469a18929eff359d",
      input: {
        prompt: prompt,
        image: imageUploadData.url,
        mask: maskUploadData.url,
        steps: 50,
        guidance: 60,
        output_format: "jpg",
        safety_tolerance: 2,
        prompt_upsampling: false,
        seed: Math.floor(Math.random() * 1000000)
      }
    })
  });
  
  if (!response.ok) {
    // 폴백: FLUX Fill Dev 모델 (더 안정적인 버전)
    console.log('FLUX Fill Pro 실패, FLUX Fill Dev로 폴백...');
    const fallbackResponse = await fetch(`${baseUrl}/replicate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // FLUX Fill Dev - 안정적인 대안 모델
        version: "8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f",
        input: {
          prompt: prompt,
          image: imageUploadData.url,
          mask: maskUploadData.url,
          steps: 28,
          guidance: 30,
          output_format: "jpg",
          seed: Math.floor(Math.random() * 1000000)
        }
      })
    });
    
    if (!fallbackResponse.ok) {
      const errorText = await fallbackResponse.text();
      console.error('API 응답 오류:', errorText);
      throw new Error('AI 이미지 생성 API 호출 실패');
    }
    
    const prediction = await fallbackResponse.json();
    return await pollForResult(baseUrl, prediction.id);
  }
  
  const prediction = await response.json();
  console.log('FLUX Fill Pro prediction:', JSON.stringify(prediction, null, 2));
  return await pollForResult(baseUrl, prediction.id);
}

// 결과 폴링 함수 분리
async function pollForResult(baseUrl, predictionId) {
  let outputUrl = null;
  let attempts = 0;
  const maxAttempts = 60; // 최대 2분 대기
  
  while (!outputUrl && attempts < maxAttempts) {
    await new Promise(res => setTimeout(res, 2000));
    const pollRes = await fetch(`${baseUrl}/replicate/${predictionId}`);
    const pollData = await pollRes.json();
    console.log('pollData:', JSON.stringify(pollData, null, 2));
    
    if (pollData.status === 'succeeded') {
      if (Array.isArray(pollData.output)) {
        outputUrl = pollData.output[0];
      } else {
        outputUrl = pollData.output;
      }
    } else if (pollData.status === 'failed') {
      throw new Error('AI 이미지 생성 실패: ' + (pollData.error || '알 수 없는 오류'));
    }
    
    attempts++;
  }
  
  if (!outputUrl) {
    throw new Error('이미지 생성 시간 초과');
  }
  
  return outputUrl;
}

// 옷 이미지 모드 공유 함수들
function shareClothesToInstagram() {
  const clothesResultImage = document.getElementById('clothesResultImage');
  if (!clothesResultImage || !clothesResultImage.src) {
    alert('공유할 이미지가 없습니다.');
    return;
  }
  
  // 모바일에서는 인스타그램 앱으로, 데스크톱에서는 웹으로
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // 모바일: 이미지를 다운로드하고 인스타그램 앱 열기
    saveClothesImage();
    setTimeout(() => {
      window.open('instagram://camera', '_blank');
    }, 1000);
  } else {
    // 데스크톱: 인스타그램 웹사이트 열기
    window.open('https://www.instagram.com/', '_blank');
    alert('이미지를 저장한 후 인스타그램에 업로드해주세요.');
  }
}

function shareClothesToKakao() {
  const clothesResultImage = document.getElementById('clothesResultImage');
  if (!clothesResultImage || !clothesResultImage.src) {
    alert('공유할 이미지가 없습니다.');
    return;
  }
  
  try {
    console.log('가상 피팅 이미지 파일 공유 시작...');
    console.log('공유할 이미지 URL:', clothesResultImage.src);
    
    // Web Share API로 실제 이미지 파일만 공유
    if (navigator.share) {
      console.log('Web Share API 사용 - 이미지 파일 공유');
      
      // 이미지를 Blob으로 변환하여 파일로 공유
      fetch(clothesResultImage.src)
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], 'AI가상피팅_결과.jpg', { type: 'image/jpeg' });
          
          return navigator.share({
            title: 'AI Fitting Studio - 가상 피팅 결과',
            text: 'AI 기술로 생성한 멋진 가상 피팅 결과를 확인해보세요!',
            files: [file] // 실제 이미지 파일만 공유
          });
        })
        .then(() => {
          console.log('가상 피팅 이미지 파일 공유 성공');
        })
        .catch((error) => {
          console.log('이미지 파일 공유 실패:', error);
          if (error.name === 'AbortError') {
            console.log('사용자가 공유를 취소했습니다.');
          } else {
            alert('이미지 파일 공유가 지원되지 않는 환경입니다.\n이미지를 저장한 후 직접 공유해주세요.');
          }
        });
      return;
    }
    
    // Web Share API 미지원시
    alert('이 브라우저에서는 이미지 파일 공유가 지원되지 않습니다.\n이미지를 저장한 후 직접 공유해주세요.');
    
  } catch (error) {
    console.error('가상 피팅 이미지 공유 오류:', error);
    alert('이미지 파일 공유 중 오류가 발생했습니다.\n이미지를 저장한 후 직접 공유해주세요.');
  }
}

// 개선된 옷 이미지 저장 기능 (우클릭 저장처럼 다이얼로그 표시)
async function saveClothesImage() {
  const clothesResultImage = document.getElementById('clothesResultImage');
  if (!clothesResultImage || !clothesResultImage.src) {
    alert('저장할 이미지가 없습니다.');
    return;
  }
  
  try {
    console.log('가상 피팅 이미지 저장 시작...');
    console.log('이미지 URL:', clothesResultImage.src);
    
    // 파일명 생성 (타임스탬프 포함)
    const now = new Date();
    const timestamp = now.getFullYear() + 
                     String(now.getMonth() + 1).padStart(2, '0') + 
                     String(now.getDate()).padStart(2, '0') + '_' +
                     String(now.getHours()).padStart(2, '0') + 
                     String(now.getMinutes()).padStart(2, '0') + 
                     String(now.getSeconds()).padStart(2, '0');
    const filename = `AI가상피팅_결과_${timestamp}.jpg`;
    
    console.log('파일명:', filename);
    
    // File System Access API 사용하여 저장 다이얼로그 표시
    if ('showSaveFilePicker' in window) {
      try {
        console.log('파일 저장 다이얼로그 표시...');
        
        // 이미지를 fetch로 가져와서 blob으로 변환
        const response = await fetch(clothesResultImage.src);
        const blob = await response.blob();
        
        console.log('이미지 blob 생성 완료, 크기:', blob.size);
        
        // 저장 다이얼로그 표시
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [
        {
              description: 'JPEG 이미지',
              accept: {
                'image/jpeg': ['.jpg', '.jpeg'],
              },
            },
            {
              description: 'PNG 이미지',
              accept: {
                'image/png': ['.png'],
              },
            },
          ],
        });
        
        console.log('파일 핸들 생성 완료:', fileHandle.name);
        
        // 파일 쓰기
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        
        console.log('파일 저장 완료');
        alert(`이미지가 성공적으로 저장되었습니다!\n파일명: ${fileHandle.name}`);
    return;
        
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('사용자가 저장을 취소했습니다.');
    return;
  }
        console.error('File System Access API 오류:', error);
        // 에러 시 폴백 방식 사용
      }
    }
    
    // 폴백: 기본 다운로드 방식
    console.log('기본 다운로드 방식 사용');
  const link = document.createElement('a');
  link.href = clothesResultImage.src;
    link.download = filename;
    link.target = '_blank';
    link.style.display = 'none';
    
  document.body.appendChild(link);
  link.click();
    
    setTimeout(() => {
  document.body.removeChild(link);
    }, 100);
    
    alert(`이미지가 다운로드 폴더에 저장되었습니다!\n파일명: ${filename}`);
    console.log('가상 피팅 이미지 저장 완료:', filename);
    
  } catch (error) {
    console.error('가상 피팅 이미지 저장 오류:', error);
    
    // 간단한 우클릭 저장 안내
    alert('자동 저장에 실패했습니다.\n\n해결 방법:\n1. 결과 이미지에서 우클릭\n2. "이미지를 다른 이름으로 저장" 선택\n3. 원하는 위치에 저장');
    
    // 이미지에 포커스를 주어 우클릭하기 쉽게 만들기
    if (clothesResultImage) {
      clothesResultImage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      clothesResultImage.style.border = '3px solid #ff6b6b';
      clothesResultImage.style.borderRadius = '8px';
    
    setTimeout(() => {
        clothesResultImage.style.border = '';
        clothesResultImage.style.borderRadius = '';
      }, 3000);
    }
  }
}

// Service Worker 등록
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW 등록 성공:', registration.scope);
        })
        .catch((error) => {
          console.log('SW 등록 실패:', error);
        });
    });
  }
}

// 버튼 로딩 상태 표시 함수
function showButtonLoading(button, isLoading) {
  if (!button) return;
  
  if (isLoading) {
    button.classList.add('button-loading');
    button.disabled = true;
    } else {
    button.classList.remove('button-loading');
    button.disabled = false;
  }
}

// 옷 이미지 모드 초기화 함수
function setupClothesMode() {
  console.log('옷 이미지 모드 초기화 시작...');
  
  // HTML에서 실제 존재하는 요소들과 연결
  const clothesDragDropArea = document.getElementById('clothesDragDropArea');
  const clothesImageUpload = document.getElementById('clothesImageUpload');
  const bodyDragDropArea = document.getElementById('bodyDragDropArea');
  const bodyImageUpload = document.getElementById('bodyImageUpload');
  const generateClothesBtn = document.getElementById('generateClothesBtn');
  const clothingCategory = document.getElementById('clothingCategory');
  
  // 결과 표시 요소들
  const clothesResultImage = document.getElementById('clothesResultImage');
  const clothesResultPlaceholder = document.getElementById('clothesResultPlaceholder');
  const clothesActionButtons = document.getElementById('clothesActionButtons');
  const clothesGoogleLensSection = document.getElementById('clothesGoogleLensSection');
  
  // 옷 이미지 업로드 설정
  if (clothesDragDropArea && clothesImageUpload) {
    setupImageDragAndDrop(clothesDragDropArea, clothesImageUpload, (file) => {
      console.log('옷 이미지 업로드:', file.name);
      handleClothingImageFile(file);
  });
  }
  
  // 전신사진 업로드 설정
  if (bodyDragDropArea && bodyImageUpload) {
    setupImageDragAndDrop(bodyDragDropArea, bodyImageUpload, (file) => {
      console.log('전신사진 업로드:', file.name);
      handleBodyImageFile(file);
  });
  }
  
  // 생성 버튼 이벤트
  if (generateClothesBtn) {
  generateClothesBtn.addEventListener('click', async function() {
      console.log('가상 피팅 생성 시작...');
    
    // 이미지 유효성 검사
    if (!bodyImageData) {
      alert('전신사진을 업로드해주세요.');
      return;
    }
    
      if (!clothingImageData) {
        alert('옷 사진을 업로드해주세요.');
        return;
    }
    
    // 로딩 상태 시작
      showButtonLoading(generateClothesBtn, true);
    
    try {
      // 추가 프롬프트 가져오기
        const additionalPrompt = '';
        const category = clothingCategory?.value || 'upper_body';
      
        console.log('가상 피팅 설정:', {
          category,
          prompt: additionalPrompt,
          bodyImage: bodyImageData ? '있음' : '없음',
          clothingImage: clothingImageData ? '있음' : '없음'
        });
        
        // IDM-VTON API 호출
        const resultImageUrl = await callIDMVTONAPI(bodyImageData, clothingImageData, additionalPrompt);
      
        console.log('가상 피팅 완료:', resultImageUrl);
      
      // 결과 이미지 표시
      showClothesResultImage(resultImageUrl);
      
    } catch (error) {
        console.error('가상 피팅 오류:', error);
      alert('가상 피팅 생성 중 오류가 발생했습니다: ' + error.message);
    } finally {
      // 로딩 상태 종료
        showButtonLoading(generateClothesBtn, false);
        updateGenerateButton();
    }
  });
  }
  
  // 구글 렌즈 기능 초기화
  setupClothesGoogleLens();

  // 초기 버튼 상태 업데이트
    updateGenerateButton();
  
  console.log('옷 이미지 모드 초기화 완료');
}

// 드래그 앤 드롭 설정 함수 (개선된 버전)
function setupImageDragAndDrop(dropArea, fileInput, handleFileCallback) {
  if (!dropArea || !fileInput) {
    console.warn('드래그 앤 드롭 요소가 없습니다:', { dropArea, fileInput });
    return;
  }
  
  // 드래그 앤 드롭 영역 클릭 시 파일 선택
  dropArea.addEventListener('click', () => {
    fileInput.click();
  });
  
  // 파일 선택 이벤트
  fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleFileCallback(file);
      } else {
        alert('이미지 파일만 업로드 가능합니다.');
      }
    }
  });

  // 드래그 오버 이벤트
  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('drag-over');
  });
  
  // 드래그 리브 이벤트
  dropArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over');
  });
  
  // 드롭 이벤트
  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleFileCallback(file);
      } else {
        alert('이미지 파일만 업로드 가능합니다.');
      }
    }
  });
}

// 전신사진 파일 처리 (개선된 버전)
function handleBodyImageFile(file) {
  const reader = new FileReader();
  reader.onload = function(evt) {
    bodyImageData = evt.target.result;
    
    // 업로드 영역 업데이트
    const bodyDragDropArea = document.getElementById('bodyDragDropArea');
    if (bodyDragDropArea) {
      bodyDragDropArea.style.backgroundImage = `url(${evt.target.result})`;
      bodyDragDropArea.style.backgroundSize = 'contain';
      bodyDragDropArea.style.backgroundPosition = 'center';
      bodyDragDropArea.style.backgroundRepeat = 'no-repeat';
      bodyDragDropArea.classList.add('has-image');
      
      const content = bodyDragDropArea.querySelector('.drag-drop-content');
      if (content) {
        content.innerHTML = '<div>전신사진 업로드 완료</div>';
      }
    }
    
    updateGenerateButton();
    console.log('전신사진 업로드 완료');
  };
  reader.readAsDataURL(file);
}

// 옷 이미지 파일 처리 (개선된 버전)
function handleClothingImageFile(file) {
  const reader = new FileReader();
  reader.onload = function(evt) {
    clothingImageData = evt.target.result;
    
    // 업로드 영역 업데이트
    const clothesDragDropArea = document.getElementById('clothesDragDropArea');
    if (clothesDragDropArea) {
      clothesDragDropArea.style.backgroundImage = `url(${evt.target.result})`;
      clothesDragDropArea.style.backgroundSize = 'contain';
      clothesDragDropArea.style.backgroundPosition = 'center';
      clothesDragDropArea.style.backgroundRepeat = 'no-repeat';
      clothesDragDropArea.classList.add('has-image');
      
      const content = clothesDragDropArea.querySelector('.drag-drop-content');
      if (content) {
        content.innerHTML = '<div>옷 이미지 업로드 완료</div>';
      }
    }
    
    updateGenerateButton();
    console.log('옷 이미지 업로드 완료');
  };
  reader.readAsDataURL(file);
}

// 생성 버튼 상태 업데이트
function updateGenerateButton() {
  const generateClothesBtn = document.getElementById('generateClothesBtn');
  if (!generateClothesBtn) return;
  
  const hasBodyImage = bodyImageData !== null;
  const hasClothingImage = clothingImageData !== null;
  
  if (hasBodyImage && hasClothingImage) {
    generateClothesBtn.disabled = false;
    generateClothesBtn.style.background = '#000000';
    generateClothesBtn.style.cursor = 'pointer';
    generateClothesBtn.querySelector('.button-text').textContent = '가상 피팅 생성';
  } else {
    generateClothesBtn.disabled = true;
    generateClothesBtn.style.background = '#cccccc';
    generateClothesBtn.style.cursor = 'not-allowed';
    
    if (!hasBodyImage && !hasClothingImage) {
      generateClothesBtn.querySelector('.button-text').textContent = '전신사진과 옷 사진을 업로드해주세요';
    } else if (!hasBodyImage) {
      generateClothesBtn.querySelector('.button-text').textContent = '전신사진을 업로드해주세요';
    } else if (!hasClothingImage) {
      generateClothesBtn.querySelector('.button-text').textContent = '옷 사진을 업로드해주세요';
    }
  }
}

// IDM-VTON API 호출 함수 (정확한 cuuupid/idm-vton 모델 사용)
async function callIDMVTONAPI(bodyImageData, clothingImageData, prompt) {
  // DataURL → base64 (헤더 제거)
  const bodyImageBase64 = bodyImageData.replace(/^data:image\/[a-z]+;base64,/, '');
  const clothingImageBase64 = clothingImageData.replace(/^data:image\/[a-z]+;base64,/, '');

  // 현재 페이지의 호스트를 기반으로 API URL 생성
  const baseUrl = window.location.protocol + '//' + window.location.host;
  
  try {
    // 1. 이미지 업로드 (base64 → URL)
    const bodyImageUploadRes = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: bodyImageBase64 })
    });
    const bodyImageUploadData = await bodyImageUploadRes.json();
    if (!bodyImageUploadData.url) throw new Error('전신사진 업로드 실패');

    const clothingImageUploadRes = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: clothingImageBase64 })
    });
    const clothingImageUploadData = await clothingImageUploadRes.json();
    if (!clothingImageUploadData.url) throw new Error('옷 사진 업로드 실패');

    console.log('이미지 업로드 완료:', {
      bodyImage: bodyImageUploadData.url,
      clothingImage: clothingImageUploadData.url
    });

    // 의류 카테고리 자동 감지
    const category = detectClothingCategory(clothingImageData);
    console.log('감지된 의류 카테고리:', category);

    // 스마트 프롬프트 생성
    const enhancedPrompt = generateSmartPrompt(category, prompt);
    console.log('최종 프롬프트:', enhancedPrompt);

    // 전체 의상 모드 처리 (조합된 이미지)
    if (category === 'full_outfit') {
      console.log('전체 의상 모드: 상의와 하의를 순차적으로 처리합니다');
      
      // 1단계: 상의 변경
      console.log('상의 변경 중...');
      const upperResult = await callSingleIDMVTON(
        bodyImageUploadData.url, 
        clothingImageUploadData.url, 
        'upper_body', 
        `upper body clothing, top wear, ${enhancedPrompt}`
      );
      
      if (!upperResult) {
        throw new Error('상의 변경 실패');
      }
      
      console.log('상의 변경 완료: 전체 의상 변경 성공');
      
      // 2단계: 하의 변경 (상의 변경된 이미지 사용)
      console.log('하의 변경 중...');
      const lowerPrompt = generateSmartPrompt('lower_body', `lower body clothing, bottom wear, ${enhancedPrompt}`);
      
      // 상의 변경 결과를 바이너리 데이터로 변환
      const upperResultResponse = await fetch(upperResult);
      const upperResultBlob = await upperResultResponse.blob();
      
      // Blob을 base64로 변환
      const upperResultBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(upperResultBlob);
      });
      
      // 변환된 결과로 하의 변경
      const finalResult = await callIDMVTONAPI(upperResultBase64, lowerClothingImageData, lowerPrompt);
      
      console.log('하의 변경 완료: 전체 의상 변경 성공');
      return finalResult;
      
    } else {
      // 단일 카테고리 모드
      return await callSingleIDMVTON(
        bodyImageUploadData.url, 
        clothingImageUploadData.url, 
        category, 
        enhancedPrompt
      );
    }

  } catch (error) {
    console.error('IDM-VTON API 오류:', error);
    throw error;
  }
}

// 단일 IDM-VTON API 호출 함수 (내부 사용)
async function callSingleIDMVTON(bodyImageUrl, clothingImageUrl, category, prompt) {
  const baseUrl = window.location.protocol + '//' + window.location.host;
  
  console.log(`IDM-VTON API 호출 - 카테고리: ${category}`);
  
  // IDM-VTON은 768x1024 (3:4 비율)로 고정 출력하므로
  // 입력 이미지를 미리 3:4 비율로 조정하여 비율 왜곡 방지
  console.log('🎯 IDM-VTON 최적 비율 조정: 3:4 비율로 전처리');
  
  const replicateResponse = await fetch(`${baseUrl}/replicate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      version: 'c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4', // 정확한 IDM-VTON 모델 버전 해시
      input: {
        human_img: bodyImageUrl,
        garm_img: clothingImageUrl,
        garment_des: prompt || "clothing",
        category: category === 'full_outfit' ? 'upper_body' : category, // full_outfit은 처리 단계에서 분리됨
        is_checked: true,
        is_checked_crop: false, // 크롭 비활성화로 원본 비율 최대한 유지
        denoise_steps: 30,
        seed: Math.floor(Math.random() * 1000000)
      }
    })
  });

  const replicateData = await replicateResponse.json();
  console.log(`IDM-VTON API 응답 (${category}):`, replicateData);

  if (!replicateData.id) {
    throw new Error(`IDM-VTON API 호출 실패 (${category}): ` + (replicateData.detail || 'Unknown error'));
  }

  // 결과 polling
  return await pollForIDMVTONResult(replicateData.id);
}

// 의류 카테고리 자동 감지 함수 (간단한 휴리스틱)
function detectClothingCategory(imageData) {
  // 1. 사용자가 직접 선택한 카테고리 우선 사용
  const selectedCategory = document.getElementById('clothingCategory')?.value;
  if (selectedCategory) {
    console.log('사용자 선택 카테고리:', selectedCategory);
    return selectedCategory;
  }
  
  // 2. 기본값: 상의
  console.log('자동 감지: upper_body (기본값)');
    return 'upper_body'; // 기본값: 상의
}

// IDM-VTON 결과 polling 함수
async function pollForIDMVTONResult(predictionId, maxAttempts = 60, intervalMs = 2000) {
  const baseUrl = window.location.protocol + '//' + window.location.host;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`IDM-VTON 결과 확인 중... (${attempt}/${maxAttempts})`);
      
      const response = await fetch(`${baseUrl}/replicate/${predictionId}`);
      const data = await response.json();
      
      console.log('IDM-VTON 상태:', data);
      
      if (data.status === 'succeeded') {
        console.log('IDM-VTON 완료!', data.output);
        console.log('IDM-VTON 결과 타입:', typeof data.output, Array.isArray(data.output));
        // IDM-VTON 결과가 배열로 오는 경우 첫 번째 이미지 URL 반환
        if (Array.isArray(data.output) && data.output.length > 0) {
          console.log('배열에서 첫 번째 결과 반환:', data.output[0]);
          return data.output[0];
        } else if (typeof data.output === 'string') {
          console.log('문자열 결과 반환:', data.output);
          return data.output;
        } else {
          console.error('예상치 못한 결과 형식:', data.output);
          throw new Error('IDM-VTON 결과 형식이 올바르지 않습니다: ' + JSON.stringify(data.output));
        }
      } else if (data.status === 'failed') {
        console.error('IDM-VTON 실패:', data.error);
        throw new Error('IDM-VTON 생성 실패: ' + (data.error || 'Unknown error'));
      } else if (data.status === 'canceled') {
        throw new Error('IDM-VTON 작업이 취소되었습니다');
      } else {
        console.log(`IDM-VTON 진행 중... 상태: ${data.status}`);
      }
      
      // 아직 진행 중이면 대기
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    } catch (error) {
      console.error(`IDM-VTON 결과 확인 오류 (시도 ${attempt}):`, error);
      if (attempt === maxAttempts) throw error;
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }
  
  throw new Error('IDM-VTON 결과 대기 시간 초과 (2분)');
}

// 옷 이미지 모드 결과 이미지 표시 함수
function showClothesResultImage(src) {
  const clothesResultImage = document.getElementById('clothesResultImage');
  const clothesResultPlaceholder = document.getElementById('clothesResultPlaceholder');
  const clothesActionButtons = document.getElementById('clothesActionButtons');
  const clothesGoogleLensSection = document.getElementById('clothesGoogleLensSection');
  
  if (!clothesResultImage) {
    console.error('clothesResultImage 요소를 찾을 수 없습니다');
    return;
  }
  
  clothesResultImage.onload = function() {
    console.log(`🖼️ 결과 이미지 로드 완료: ${this.naturalWidth}x${this.naturalHeight}`);
    
    // 이미지 스타일 설정 - 3:4 비율 강제 유지
    this.style.maxWidth = '100%';
    this.style.height = 'auto';
    this.style.objectFit = 'contain';
    this.style.display = 'block';
    this.style.borderRadius = '1rem';
    this.style.boxShadow = 'var(--shadow-lg)';
    this.style.border = '1px solid var(--gray-200)';
    
    // 3:4 비율 강제 적용 (세로 이미지 보장)
    this.style.aspectRatio = '3/4';
    this.style.width = 'auto';
    this.style.maxHeight = '600px';
    
    console.log('✅ 결과 이미지 3:4 비율로 표시 완료');
    
    if (clothesResultPlaceholder) {
      clothesResultPlaceholder.style.display = 'none';
    }
    if (clothesActionButtons) {
      clothesActionButtons.style.display = 'flex';
    }
    if (clothesGoogleLensSection) {
      clothesGoogleLensSection.style.display = 'block';
    }
    
    console.log('가상 피팅 결과 이미지 표시 완료');
  };
  
  clothesResultImage.onerror = function() {
    resetClothesResultState();
    alert('가상 피팅 결과 이미지를 불러오는데 실패했습니다.');
  };
  
  clothesResultImage.src = src;
}

// 옷 이미지 모드 결과 상태 초기화
function resetClothesResultState() {
  const clothesResultPlaceholder = document.getElementById('clothesResultPlaceholder');
  if (clothesResultPlaceholder) {
    clothesResultPlaceholder.innerHTML = '가상 피팅 결과가 여기에 표시됩니다';
    clothesResultPlaceholder.style.display = 'flex';
  }
  
  const clothesResultImage = document.getElementById('clothesResultImage');
  if (clothesResultImage) {
    clothesResultImage.style.display = 'none';
  }
  
  const clothesActionButtons = document.getElementById('clothesActionButtons');
  if (clothesActionButtons) {
    clothesActionButtons.style.display = 'none';
  }
  
  const clothesGoogleLensSection = document.getElementById('clothesGoogleLensSection');
  if (clothesGoogleLensSection) {
    clothesGoogleLensSection.style.display = 'none';
  }
}

// 옷 이미지 모드용 구글 렌즈 함수
function setupClothesGoogleLens() {
  const clothesGoogleLensBtn = document.getElementById('clothesGoogleLensBtn');
  if (clothesGoogleLensBtn) {
    clothesGoogleLensBtn.addEventListener('click', () => {
      const clothesResultImage = document.getElementById('clothesResultImage');
      if (!clothesResultImage || !clothesResultImage.src) {
        alert('검색할 이미지가 없습니다.');
        return;
      }
      
      try {
        // 구글 렌즈로 이미지 검색
        const searchUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(clothesResultImage.src)}`;
        window.open(searchUrl, '_blank');
      } catch (error) {
        console.error('구글 렌즈 연동 오류:', error);
        window.open('https://lens.google.com/', '_blank');
        alert('구글 렌즈 페이지가 열렸습니다. 생성된 이미지를 수동으로 업로드해주세요.');
      }
    });
  }
}

// 페이지 전환 애니메이션 함수
function showPageWithAnimation(hidePage, showPage) {
  if (hidePage) {
    hidePage.style.display = 'none';
  }
  
  if (showPage) {
    showPage.style.display = showPage.classList.contains('landing-page') || 
                             showPage.classList.contains('mode-selection-page') ? 'flex' : 'block';
    
    // 부드러운 애니메이션 효과
    showPage.style.opacity = '0';
    showPage.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      showPage.style.transition = 'all 0.5s ease-out';
      showPage.style.opacity = '1';
      showPage.style.transform = 'translateY(0)';
    }, 10);
  }
}

// 원피스 길이 옵션 토글 함수
function toggleDressLengthOption() {
  const categorySelect = document.getElementById('clothingCategory');
  const dressLengthSection = document.getElementById('dressLengthSection');
  
  if (categorySelect && dressLengthSection) {
    if (categorySelect.value === 'dresses') {
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
}

// 스마트 프롬프트 생성 함수
function generateSmartPrompt(category, userPrompt) {
  const dressLength = document.getElementById('dressLength')?.value || 'midi';
  let enhancedPrompt = userPrompt || '';
  
  // 카테고리별 프롬프트 강화
  switch (category) {
    case 'full_outfit':
      // 전체 의상 모드: 상의와 하의 모두 언급
      if (!enhancedPrompt.includes('outfit') && !enhancedPrompt.includes('전체')) {
        enhancedPrompt = `complete outfit, full clothing set, ${enhancedPrompt}`;
      }
      console.log('전체 의상 모드 활성화');
      break;
      
    case 'dresses':
      // 원피스 모드: 길이 정보 추가
      const lengthMap = {
        'short': 'short dress, mini dress, above knee',
        'midi': 'midi dress, knee-length dress, mid-length',
        'long': 'long dress, maxi dress, floor-length, ankle-length'
      };
      
      const lengthDesc = lengthMap[dressLength] || lengthMap['midi'];
      if (!enhancedPrompt.includes('dress') && !enhancedPrompt.includes('원피스')) {
        enhancedPrompt = `${lengthDesc}, elegant dress, ${enhancedPrompt}`;
      } else {
        enhancedPrompt = `${lengthDesc}, ${enhancedPrompt}`;
      }
      console.log(`원피스 모드 - 길이: ${dressLength}`);
      break;
      
    case 'upper_body':
      // 상의 모드: 상의 관련 키워드 강화
      if (!enhancedPrompt.includes('shirt') && !enhancedPrompt.includes('상의') && 
          !enhancedPrompt.includes('top') && !enhancedPrompt.includes('blouse')) {
        enhancedPrompt = `stylish top, fashionable upper wear, ${enhancedPrompt}`;
      }
      console.log('상의 모드');
      break;
      
    case 'lower_body':
      // 하의 모드: 하의 관련 키워드 강화
      if (!enhancedPrompt.includes('pants') && !enhancedPrompt.includes('하의') && 
          !enhancedPrompt.includes('bottom') && !enhancedPrompt.includes('skirt')) {
        enhancedPrompt = `stylish bottoms, fashionable lower wear, ${enhancedPrompt}`;
      }
      console.log('하의 모드');
      break;
  }
  
  // 공통 품질 향상 키워드 추가
  if (!enhancedPrompt.includes('high quality') && !enhancedPrompt.includes('detailed')) {
    enhancedPrompt = `${enhancedPrompt}, high quality, detailed, realistic`;
  }
  
  console.log('향상된 프롬프트:', enhancedPrompt);
  return enhancedPrompt.trim();
}

// 공유 및 저장 기능 (텍스트 모드)
function shareToInstagram() {
  if (!resultImage.src) {
    alert('공유할 이미지가 없습니다.');
    return;
  }
  
  // 모바일에서는 인스타그램 앱으로, 데스크톱에서는 웹으로
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // 모바일: 이미지를 다운로드하고 인스타그램 앱 열기
    saveImage();
    setTimeout(() => {
      window.open('instagram://camera', '_blank');
    }, 1000);
  } else {
    // 데스크톱: 인스타그램 웹사이트 열기
    window.open('https://www.instagram.com/', '_blank');
    alert('이미지를 저장한 후 인스타그램에 업로드해주세요.');
  }
}

function shareToKakao() {
  if (!resultImage.src) {
    alert('공유할 이미지가 없습니다.');
    return;
  }
  
  try {
    console.log('AI 스타일링 이미지 파일 공유 시작...');
    console.log('공유할 이미지 URL:', resultImage.src);
    
    // Web Share API로 실제 이미지 파일만 공유
    if (navigator.share) {
      console.log('Web Share API 사용 - 이미지 파일 공유');
      
      // 이미지를 Blob으로 변환하여 파일로 공유
      fetch(resultImage.src)
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], 'AI스타일링_결과.jpg', { type: 'image/jpeg' });
          
          return navigator.share({
            title: 'AI Fitting Studio - AI 스타일링 결과',
            text: 'AI 기술로 생성한 멋진 스타일링 결과를 확인해보세요!',
            files: [file] // 실제 이미지 파일만 공유
          });
        })
        .then(() => {
          console.log('AI 스타일링 이미지 파일 공유 성공');
        })
        .catch((error) => {
          console.log('이미지 파일 공유 실패:', error);
          if (error.name === 'AbortError') {
            console.log('사용자가 공유를 취소했습니다.');
          } else {
            alert('이미지 파일 공유가 지원되지 않는 환경입니다.\n이미지를 저장한 후 직접 공유해주세요.');
          }
        });
      return;
    }
    
    // Web Share API 미지원시
    alert('이 브라우저에서는 이미지 파일 공유가 지원되지 않습니다.\n이미지를 저장한 후 직접 공유해주세요.');
    
  } catch (error) {
    console.error('AI 스타일링 이미지 공유 오류:', error);
    alert('이미지 파일 공유 중 오류가 발생했습니다.\n이미지를 저장한 후 직접 공유해주세요.');
  }
}

// 이미지 업로드 시 마스킹 섹션 보이기 및 캔버스에 이미지 표시
imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  handleImageFile(file);
});
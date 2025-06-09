// AI Fitting Studio v2.0.1-final + 옷 이미지 자동 입히기 기능
// UI/UX 대폭 개선 버전: 갤러리 제거, 업로드-마스킹 통합, 구글렌즈 연동, 모바일 반응형, 옷 이미지 모드
console.log('🚀 AI Fitting Studio v2.0.1-final + 옷 이미지 모드 로드됨');
console.log('✅ 개선사항: 갤러리 제거, 업로드-마스킹 통합, 구글렌즈 연동, 모바일 반응형, 옷 이미지 자동 입히기');

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
  setupPWAInstall();
});

// AI Fitting Studio v2.0.1-final
// UI/UX 대폭 개선 버전: 갤러리 제거, 업로드-마스킹 통합, 구글렌즈 연동, 모바일 반응형
console.log('🚀 AI Fitting Studio v2.0.1-final 로드됨');
console.log('✅ 개선사항: 갤러리 제거, 업로드-마스킹 통합, 구글렌즈 연동, 모바일 반응형');

// AI Fitting Studio v2.0.1-final
// UI/UX 대폭 개선 버전: 갤러리 제거, 업로드-마스킹 통합, 구글렌즈 연동, 모바일 반응형
console.log('🚀 AI Fitting Studio v2.0.1-final 로드됨');
console.log('✅ 개선사항: 갤러리 제거, 업로드-마스킹 통합, 구글렌즈 연동, 모바일 반응형');

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

// 이미지 파일 처리 함수
function handleImageFile(file) {
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
  reader.readAsDataURL(file);
}

// 이미지 업로드 시 마스킹 섹션 보이기 및 캔버스에 이미지 표시
imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  handleImageFile(file);
});

// 결과 이미지 표시 함수 (비율 유지)
function showResultImage(src) {
  resultImage.onload = function() {
    // 원본 이미지 비율 유지
    const maxWidth = 512;
    const maxHeight = 768;
    const imgWidth = this.naturalWidth;
    const imgHeight = this.naturalHeight;
    const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);
    const displayWidth = imgWidth * scale;
    const displayHeight = imgHeight * scale;
    this.style.width = displayWidth + 'px';
    this.style.height = displayHeight + 'px';
    this.style.maxWidth = '100%';
    this.style.height = 'auto';
    this.style.objectFit = 'contain';
    this.style.display = 'block';
    if (resultPlaceholder) {
      resultPlaceholder.style.display = 'none';
    }
    if (actionButtons) {
      actionButtons.style.display = 'flex';
    }
    // 구글 렌즈 섹션 표시
    const googleLensSection = document.getElementById('googleLensSection');
    if (googleLensSection) {
      googleLensSection.style.display = 'block';
    }
  };
  resultImage.src = src;
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
  generateBtn.disabled = true;
  generateBtn.textContent = '✨ 생성 중...';

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
  generateBtn.disabled = false;
  generateBtn.textContent = '🚀 AI 스타일링 생성';
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

// 구글 렌즈 연동 - 생성된 이미지를 구글 이미지 검색에 전달 (파일 다운로드 없이)
function setupGoogleLensSearch() {
  const googleLensBtn = document.getElementById('googleLensBtn');
  if (!googleLensBtn) return;
  
  googleLensBtn.addEventListener('click', () => {
    if (!resultImage.src) {
      alert('결과 이미지가 없습니다.');
      return;
    }
    
    try {
      // 구글 이미지 검색에 이미지 URL 직접 전달
      const searchUrl = `https://www.google.com/searchbyimage?image_url=${encodeURIComponent(resultImage.src)}`;
      window.open(searchUrl, '_blank');
      
      // 추가로 구글 렌즈도 열어주기
      setTimeout(() => {
        window.open('https://lens.google.com/', '_blank');
      }, 1000);
      
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

// 개선된 이미지 저장 기능 (저장 다이얼로그 방식)
async function saveImage() {
  if (!resultImage.src) {
    alert('저장할 이미지가 없습니다.');
    return;
  }
  
  try {
    // 이미지를 캔버스로 변환
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = resultImage.naturalWidth || resultImage.width;
    canvas.height = resultImage.naturalHeight || resultImage.height;
    ctx.drawImage(resultImage, 0, 0);
    
    // 파일명 생성
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const filename = `ai-fitting-result-${timestamp}.png`;
    
    // File System Access API 지원 확인 (Chrome 86+, Edge 86+)
    if ('showSaveFilePicker' in window) {
      try {
        // 저장 다이얼로그 표시
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: 'PNG 이미지',
              accept: {
                'image/png': ['.png'],
              },
            },
            {
              description: 'JPEG 이미지', 
              accept: {
                'image/jpeg': ['.jpg', '.jpeg'],
              },
            },
          ],
        });
        
        // 선택한 파일 형식에 따라 변환
        const fileExtension = fileHandle.name.split('.').pop().toLowerCase();
        const mimeType = fileExtension === 'jpg' || fileExtension === 'jpeg' ? 'image/jpeg' : 'image/png';
        const quality = mimeType === 'image/jpeg' ? 0.95 : 1.0;
        
        // 파일 데이터 생성
        const blob = await new Promise(resolve => {
          canvas.toBlob(resolve, mimeType, quality);
        });
        
        // 파일 쓰기
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        
        alert('✅ 이미지가 성공적으로 저장되었습니다!');
        return;
        
      } catch (error) {
        if (error.name === 'AbortError') {
          // 사용자가 취소한 경우
          return;
        }
        console.error('File System Access API 오류:', error);
        // 에러 시 폴백 방식 사용
      }
    }
    
    // 폴백: 기본 다운로드 방식 (구형 브라우저 또는 API 실패 시)
    canvas.toBlob((blob) => {
      if (navigator.msSaveBlob) {
        // IE/Edge 레거시
        navigator.msSaveBlob(blob, filename);
      } else {
        // 모던 브라우저 기본 다운로드
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      alert('💾 이미지가 다운로드 폴더에 저장되었습니다!');
    }, 'image/png', 1.0);
    
  } catch (error) {
    console.error('이미지 저장 오류:', error);
    alert('이미지 저장 중 오류가 발생했습니다.');
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

// 공유 및 저장 기능
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
  
  if (window.Kakao && window.Kakao.isInitialized()) {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: 'AI Fitting Studio',
        description: 'AI 기술로 생성한 스타일링 이미지입니다! ✨',
        imageUrl: resultImage.src,
        link: {
          mobileWebUrl: window.location.origin,
          webUrl: window.location.origin
        }
      },
      buttons: [
        {
          title: 'AI Fitting Studio 체험하기',
          link: {
            mobileWebUrl: window.location.origin,
            webUrl: window.location.origin
          }
        }
      ]
    });
  } else {
    alert('카카오톡 공유를 위해 카카오 SDK가 초기화되어야 합니다.');
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

// PWA 설치 프롬프트 설정
function setupPWAInstall() {
  let deferredPrompt;
  
  // 설치 프롬프트 이벤트 캐치
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // 설치 버튼 표시 (선택사항)
    showInstallButton(deferredPrompt);
  });
  
  // 앱이 설치되었을 때
  window.addEventListener('appinstalled', (evt) => {
    console.log('앱이 설치되었습니다!');
    // 설치 버튼 숨기기
    hideInstallButton();
  });
}

// 설치 버튼 표시 함수
function showInstallButton(deferredPrompt) {
  // 헤더에 설치 버튼 추가
  const header = document.querySelector('header');
  if (header && !document.getElementById('installBtn')) {
    const installBtn = document.createElement('button');
    installBtn.id = 'installBtn';
    installBtn.innerHTML = '📱 앱 설치';
    installBtn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, var(--cobalt-blue) 0%, var(--cobalt-blue-dark) 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      transition: all 0.3s ease;
    `;
    
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`사용자 선택: ${outcome}`);
        deferredPrompt = null;
        hideInstallButton();
      }
    });
    
    installBtn.addEventListener('mouseenter', () => {
      installBtn.style.transform = 'translateY(-2px)';
    });
    
    installBtn.addEventListener('mouseleave', () => {
      installBtn.style.transform = 'translateY(0)';
    });
    
    document.body.appendChild(installBtn);
  }
}

// 설치 버튼 숨기기 함수
function hideInstallButton() {
  const installBtn = document.getElementById('installBtn');
  if (installBtn) {
    installBtn.remove();
  }
}

// 옷 이미지 모드 변수들
// bodyImageData와 clothingImageData는 이미 전역변수로 선언됨

// 옷 이미지 모드 초기화 함수
function setupClothesMode() {
  const bodyImageDropArea = document.getElementById('bodyImageDropArea');
  const bodyImageUpload = document.getElementById('bodyImageUpload');
  const bodyImagePreview = document.getElementById('bodyImagePreview');
  const bodyImageDisplay = document.getElementById('bodyImageDisplay');
  const removeBodyImageBtn = document.getElementById('removeBodyImageBtn');
  
  const clothingImageDropArea = document.getElementById('clothingImageDropArea');
  const clothingImageUpload = document.getElementById('clothingImageUpload');
  const clothingImagePreview = document.getElementById('clothingImagePreview');
  const clothingImageDisplay = document.getElementById('clothingImageDisplay');
  const removeClothingImageBtn = document.getElementById('removeClothingImageBtn');
  
  const generateClothesBtn = document.getElementById('generateClothesBtn');
  const clothesPromptInput = document.getElementById('clothesPromptInput');
  const clothesResultImage = document.getElementById('clothesResultImage');
  const clothesResultPlaceholder = document.getElementById('clothesResultPlaceholder');
  const clothesActionButtons = document.getElementById('clothesActionButtons');
  const clothesGoogleLensSection = document.getElementById('clothesGoogleLensSection');
  
  // 전신사진 드래그 앤 드롭 설정
  setupImageDragAndDrop(bodyImageDropArea, bodyImageUpload, (file) => {
    handleBodyImageFile(file, bodyImageDisplay, bodyImagePreview);
  });
  
  // 옷 사진 드래그 앤 드롭 설정
  setupImageDragAndDrop(clothingImageDropArea, clothingImageUpload, (file) => {
    handleClothingImageFile(file, clothingImageDisplay, clothingImagePreview);
  });
  
  // 이미지 제거 버튼
  removeBodyImageBtn.addEventListener('click', () => {
    bodyImageData = null;
    bodyImagePreview.style.display = 'none';
    updateGenerateButton();
  });
  
  removeClothingImageBtn.addEventListener('click', () => {
    clothingImageData = null;
    clothingImagePreview.style.display = 'none';
    updateGenerateButton();
  });
  
  // 생성 버튼
  generateClothesBtn.addEventListener('click', async function() {
    // 이미지 유효성 검사
    if (!bodyImageData || !clothingImageData) {
      alert('전신사진과 옷 사진을 모두 업로드해주세요.');
      return;
    }
    
    // 로딩 상태 시작
    generateClothesBtn.disabled = true;
    generateClothesBtn.innerHTML = '<span class="loading-spinner"></span>AI가 옷을 입혀드리고 있어요...';
    
    try {
      // 추가 프롬프트 가져오기
      const additionalPrompt = document.getElementById('clothesPrompt')?.value || '';
      
      console.log('🚀 OOTDiffusion API 호출 시작...');
      
      // OOTDiffusion API 호출
      const resultImageUrl = await callOOTDiffusionAPI(bodyImageData, clothingImageData, additionalPrompt);
      
      console.log('✅ OOTDiffusion 결과:', resultImageUrl);
      
      // 결과 이미지 표시
      showClothesResultImage(resultImageUrl);
      
    } catch (error) {
      console.error('❌ 가상 피팅 오류:', error);
      alert('가상 피팅 생성 중 오류가 발생했습니다: ' + error.message);
    } finally {
      // 로딩 상태 종료
      generateClothesBtn.disabled = false;
      generateClothesBtn.innerHTML = '가상 피팅 생성';
    }
  });
  
  // 구글 렌즈 기능 초기화
  setupClothesGoogleLens();
}

// 이미지 드래그 앤 드롭 설정 함수
function setupImageDragAndDrop(dropArea, fileInput, handleFile) {
  dropArea.addEventListener('click', () => {
    fileInput.click();
  });
  
  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('drag-over');
  });
  
  dropArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over');
  });
  
  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleFile(file);
      } else {
        alert('이미지 파일만 업로드 가능합니다.');
      }
    }
  });
  
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  });
}

// 전신사진 파일 처리
function handleBodyImageFile(file, displayImg, previewDiv) {
  const reader = new FileReader();
  reader.onload = function(evt) {
    bodyImageData = evt.target.result;
    displayImg.src = evt.target.result;
    previewDiv.style.display = 'block';
    updateGenerateButton();
  };
  reader.readAsDataURL(file);
}

// 옷 사진 파일 처리
function handleClothingImageFile(file, displayImg, previewDiv) {
  const reader = new FileReader();
  reader.onload = function(evt) {
    clothingImageData = evt.target.result;
    displayImg.src = evt.target.result;
    previewDiv.style.display = 'block';
    updateGenerateButton();
  };
  reader.readAsDataURL(file);
}

// 생성 버튼 상태 업데이트
function updateGenerateButton() {
  const generateClothesBtn = document.getElementById('generateClothesBtn');
  if (bodyImageData && clothingImageData) {
    generateClothesBtn.disabled = false;
    generateClothesBtn.style.background = 'linear-gradient(135deg, var(--cobalt-blue) 0%, var(--cobalt-blue-dark) 100%)';
    generateClothesBtn.style.cursor = 'pointer';
    generateClothesBtn.nextElementSibling.textContent = '가상 피팅을 시작할 준비가 되었습니다!';
  } else {
    generateClothesBtn.disabled = true;
    generateClothesBtn.style.background = 'var(--gray-400)';
    generateClothesBtn.style.cursor = 'not-allowed';
    generateClothesBtn.nextElementSibling.textContent = '전신사진과 옷 사진을 모두 업로드해주세요';
  }
}

// 옷 이미지 모드 로딩 상태 표시
function showClothesLoadingState() {
  const clothesResultPlaceholder = document.getElementById('clothesResultPlaceholder');
  if (clothesResultPlaceholder) {
    clothesResultPlaceholder.innerHTML = `
      <div style="text-align: center;">
        <div class="loading" style="margin: 0 auto 1rem auto; width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%); animation: pulse 1s infinite alternate;"></div>
        <div style="font-weight: bold; font-size: 1.1rem; background: linear-gradient(90deg, #2563eb, #60a5fa, #2563eb); background-size: 200% auto; color: transparent; background-clip: text; -webkit-background-clip: text; animation: flowingText 2s linear infinite;">가상 피팅을 생성하는 중입니다...</div>
        <div style="font-size: 0.9rem; color: var(--gray-500); margin-top: 0.5rem;">AI가 옷을 입혀드리고 있어요</div>
      </div>
    `;
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
}

// OOTDiffusion API 호출 함수 (IDM-VTON 대체)
async function callOOTDiffusionAPI(bodyImageData, clothingImageData, prompt) {
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

    console.log('✅ 이미지 업로드 완료:', {
      bodyImage: bodyImageUploadData.url,
      clothingImage: clothingImageUploadData.url
    });

    // 2. OOTDiffusion API 호출 (qiweiii/oot_diffusion_dc 모델 사용)
    const replicateResponse = await fetch(`${baseUrl}/replicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        version: 'dfda793f95fb788961b38ce72978a350cd7b689c17bbfeb7e1048fc9c7c4849d', // 정확한 OOTDiffusion 모델 버전 해시
        input: {
          model_image: bodyImageUploadData.url,
          cloth_image: clothingImageUploadData.url,
          category: 0, // 0: upper_body, 1: lower_body, 2: dress
          num_inference_steps: 20,
          guidance_scale: 2.0,
          seed: Math.floor(Math.random() * 1000000)
        }
      })
    });

    const replicateData = await replicateResponse.json();
    console.log('🚀 OOTDiffusion API 응답:', replicateData);

    if (!replicateData.id) {
      throw new Error('OOTDiffusion API 호출 실패: ' + (replicateData.detail || 'Unknown error'));
    }

    // 3. 결과 polling
    const result = await pollForOOTDResult(replicateData.id);
    return result;

  } catch (error) {
    console.error('❌ OOTDiffusion API 오류:', error);
    throw error;
  }
}

// OOTDiffusion 결과 polling 함수
async function pollForOOTDResult(predictionId, maxAttempts = 60, intervalMs = 2000) {
  const baseUrl = window.location.protocol + '//' + window.location.host;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`🔄 OOTDiffusion 결과 확인 중... (${attempt}/${maxAttempts})`);
      
      const response = await fetch(`${baseUrl}/replicate/${predictionId}`);
      const data = await response.json();
      
      console.log('📊 OOTDiffusion 상태:', data);
      
      if (data.status === 'succeeded') {
        console.log('✅ OOTDiffusion 완료!', data.output);
        return data.output;
      } else if (data.status === 'failed') {
        throw new Error('OOTDiffusion 생성 실패: ' + (data.error || 'Unknown error'));
      } else if (data.status === 'canceled') {
        throw new Error('OOTDiffusion 작업이 취소되었습니다');
      }
      
      // 아직 진행 중이면 대기
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    } catch (error) {
      console.error(`❌ OOTDiffusion 결과 확인 오류 (시도 ${attempt}):`, error);
      if (attempt === maxAttempts) throw error;
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }
  
  throw new Error('OOTDiffusion 결과 대기 시간 초과 (2분)');
}

// 옷 이미지 모드 결과 이미지 표시 함수
function showClothesResultImage(src) {
  const clothesResultImage = document.getElementById('clothesResultImage');
  const clothesResultPlaceholder = document.getElementById('clothesResultPlaceholder');
  const clothesActionButtons = document.getElementById('clothesActionButtons');
  const clothesGoogleLensSection = document.getElementById('clothesGoogleLensSection');
  
  clothesResultImage.onload = function() {
    // 이미지 스타일 설정
    this.style.maxWidth = '100%';
    this.style.height = 'auto';
    this.style.objectFit = 'contain';
    this.style.display = 'block';
    this.style.borderRadius = '1rem';
    this.style.boxShadow = 'var(--shadow-lg)';
    this.style.border = '1px solid var(--gray-200)';
    
    if (clothesResultPlaceholder) {
      clothesResultPlaceholder.style.display = 'none';
    }
    if (clothesActionButtons) {
      clothesActionButtons.style.display = 'flex';
    }
    if (clothesGoogleLensSection) {
      clothesGoogleLensSection.style.display = 'block';
    }
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

// 옷 이미지 모드 공유 함수들 (기존 함수와 동일한 로직)
function shareClothesToInstagram() {
  const clothesResultImage = document.getElementById('clothesResultImage');
  if (!clothesResultImage.src) {
    alert('공유할 이미지가 없습니다.');
    return;
  }
  shareToInstagram(); // 기존 함수 재사용
}

function shareClothesToKakao() {
  const clothesResultImage = document.getElementById('clothesResultImage');
  if (!clothesResultImage.src) {
    alert('공유할 이미지가 없습니다.');
    return;
  }
  shareToKakao(); // 기존 함수 재사용
}

function saveClothesImage() {
  const clothesResultImage = document.getElementById('clothesResultImage');
  if (!clothesResultImage.src) {
    alert('저장할 이미지가 없습니다.');
    return;
  }
  
  // 이미지를 다운로드
  const link = document.createElement('a');
  link.href = clothesResultImage.src;
  link.download = `ai-fitting-result-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 옷 이미지 모드용 구글 렌즈 함수
function setupClothesGoogleLens() {
  const clothesGoogleLensBtn = document.getElementById('clothesGoogleLensBtn');
  if (clothesGoogleLensBtn) {
    clothesGoogleLensBtn.addEventListener('click', () => {
      const clothesResultImage = document.getElementById('clothesResultImage');
      if (!clothesResultImage.src) {
        alert('검색할 이미지가 없습니다.');
        return;
      }
      
      // 구글 렌즈로 이미지 검색
      const searchUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(clothesResultImage.src)}`;
      window.open(searchUrl, '_blank');
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
// AI Fitting Studio v2.0.1-final + 옷 이미지 자동 입히기 기능
// UI/UX 대폭 개선 버전: 갤러리 제거, 업로드-마스킹 통합, 구글렌즈 연동, 모바일 반응형, 옷 이미지 모드
console.log('🚀 AI Fitting Studio v2.0.1-final + 옷 이미지 모드 로드됨');
console.log('✅ 개선사항: 갤러리 제거, 업로드-마스킹 통합, 구글렌즈 연동, 모바일 반응형, 옷 이미지 자동 입히기');

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
let clothingImageData = null; // 업로드된 옷 이미지 데이터

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

// 페이지 로드 시 드래그 앤 드롭 설정
document.addEventListener('DOMContentLoaded', function() {
  initKakaoSDK();
  setupDragAndDrop();
  setupBrushEvents(maskCanvas, maskCtx, isDrawing, lastX, lastY);
  setupGoogleLensSearch();
  registerServiceWorker();
  setupPWAInstall();
  
  // 성능 테스트 버튼 이벤트 추가
  const performanceTestBtn = document.getElementById('performanceTestBtn');
  if (performanceTestBtn) {
    performanceTestBtn.addEventListener('click', testCloudinaryPerformance);
  }
});

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
  
  console.log('📊 Cloudinary 업로드 성능 측정 시작...');
  
  // 1. 원본 이미지 업로드 (base64 → URL)
  const imageUploadStart = Date.now();
  const imageUploadRes = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageBase64 })
  });
  const imageUploadData = await imageUploadRes.json();
  const imageUploadTime = Date.now() - imageUploadStart;
  
  if (!imageUploadData.url) throw new Error('원본 이미지 업로드 실패');

  // 첫 번째 업로드 결과 출력
  if (imageUploadData.performance) {
    console.log(`⚡ 원본 이미지 업로드 완료:`);
    console.log(`   - 클라이언트 측정: ${imageUploadTime}ms`);
    console.log(`   - 서버 측정: ${imageUploadData.performance.uploadTime}ms`);
    console.log(`   - 이미지 크기: ${imageUploadData.performance.imageSizeKB}KB`);
    console.log(`   - 업로드 속도: ${imageUploadData.performance.uploadSpeedKBps} KB/s`);
  }

  // 2. 마스크 이미지 업로드 (base64 → URL)  
  const maskUploadStart = Date.now();
  const maskUploadRes = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: maskBase64 })
  });
  const maskUploadData = await maskUploadRes.json();
  const maskUploadTime = Date.now() - maskUploadStart;
  
  if (!maskUploadData.url) throw new Error('마스크 이미지 업로드 실패');
  
  // 두 번째 업로드 결과 출력
  if (maskUploadData.performance) {
    console.log(`⚡ 마스크 이미지 업로드 완료:`);
    console.log(`   - 클라이언트 측정: ${maskUploadTime}ms`);
    console.log(`   - 서버 측정: ${maskUploadData.performance.uploadTime}ms`);
    console.log(`   - 이미지 크기: ${maskUploadData.performance.imageSizeKB}KB`);
    console.log(`   - 업로드 속도: ${maskUploadData.performance.uploadSpeedKBps} KB/s`);
  }
  
  // 전체 업로드 성능 요약
  const totalUploadTime = imageUploadTime + maskUploadTime;
  const totalSizeKB = (imageUploadData.performance?.imageSizeKB || 0) + (maskUploadData.performance?.imageSizeKB || 0);
  const avgSpeedKBps = totalSizeKB / (totalUploadTime / 1000);
  
  console.log(`📈 Cloudinary 업로드 성능 요약:`);
  console.log(`   - 총 업로드 시간: ${totalUploadTime}ms`);
  console.log(`   - 총 이미지 크기: ${totalSizeKB}KB`);
  console.log(`   - 평균 업로드 속도: ${avgSpeedKBps.toFixed(2)} KB/s`);
  
  // 업로드 속도가 느린 경우 경고
  if (avgSpeedKBps < 100) {
    console.warn('⚠️  Cloudinary 업로드 속도가 느립니다. 네트워크 상태를 확인해주세요.');
  } else if (avgSpeedKBps > 500) {
    console.log('✅ Cloudinary 업로드 속도가 양호합니다.');
  }

  // 3. Replicate API 호출 시작 시간 측정
  const replicateStart = Date.now();
  console.log('🚀 Replicate API 호출 시작...');

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
    return await pollForResult(baseUrl, prediction.id, replicateStart, totalUploadTime);
  }
  
  const prediction = await response.json();
  console.log('FLUX Fill Pro prediction:', JSON.stringify(prediction, null, 2));
  return await pollForResult(baseUrl, prediction.id, replicateStart, totalUploadTime);
}

// 결과 폴링 함수 분리
async function pollForResult(baseUrl, predictionId, replicateStart, totalUploadTime) {
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
  
  const replicateTime = Date.now() - replicateStart;
  const totalProcessingTime = replicateTime;
  
  console.log(`🎯 전체 처리 성능 요약:`);
  console.log(`   - 📤 업로드 시간: ${totalUploadTime}ms`);
  console.log(`   - ⚡ AI 생성 시간: ${replicateTime}ms`);
  console.log(`   - 🎨 총 처리 시간: ${totalProcessingTime}ms`);
  console.log(`   - 📊 업로드 비율: ${((totalUploadTime / totalProcessingTime) * 100).toFixed(1)}%`);
  
  // 성능 경고 및 조언
  if (totalUploadTime > replicateTime) {
    console.warn('⚠️  업로드 시간이 AI 생성 시간보다 깁니다. 네트워크 상태를 확인해주세요.');
  }
  
  if (replicateTime > 60000) { // 1분 이상
    console.warn('⚠️  AI 생성 시간이 비정상적으로 깁니다. Replicate 서버 상태를 확인해주세요.');
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

// Cloudinary 업로드 성능 테스트 함수
async function testCloudinaryPerformance() {
  const performanceBtn = document.getElementById('performanceTestBtn');
  const performanceResult = document.getElementById('performanceResult');
  
  try {
    // 버튼 비활성화 및 로딩 상태
    performanceBtn.disabled = true;
    performanceBtn.innerHTML = '🔄 테스트 중...';
    performanceResult.innerHTML = '업로드 속도를 측정하고 있습니다...';
    
    // 더미 이미지 생성 (작은 PNG 이미지)
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // 그라데이션으로 테스트 이미지 생성
    const gradient = ctx.createLinearGradient(0, 0, 200, 200);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(1, '#4ecdc4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 200);
    
    // 테스트 텍스트 추가
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('업로드 테스트', 100, 100);
    ctx.fillText(new Date().toLocaleTimeString(), 100, 120);
    
    // 캔버스를 base64로 변환
    const testImageData = canvas.toDataURL('image/png');
    const imageBase64 = testImageData.replace(/^data:image\/png;base64,/, '');
    
    // 현재 페이지의 호스트를 기반으로 API URL 생성
    const baseUrl = window.location.protocol + '//' + window.location.host;
    
    console.log('🔍 Cloudinary 성능 테스트 시작...');
    
    // 3번 테스트하여 평균 속도 계산
    const testResults = [];
    
    for (let i = 0; i < 3; i++) {
      const testStart = Date.now();
      
      const uploadRes = await fetch(`${baseUrl}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64 })
      });
      
      const uploadData = await uploadRes.json();
      const testTime = Date.now() - testStart;
      
      if (uploadRes.ok && uploadData.performance) {
        testResults.push({
          clientTime: testTime,
          serverTime: uploadData.performance.uploadTime,
          imageSize: uploadData.performance.imageSizeKB,
          speed: uploadData.performance.uploadSpeedKBps
        });
        
        console.log(`테스트 ${i + 1}/3 완료: ${testTime}ms (서버: ${uploadData.performance.uploadTime}ms)`);
      } else {
        throw new Error(`테스트 ${i + 1} 실패: ${uploadData.error || '알 수 없는 오류'}`);
      }
      
      // 테스트 간 1초 대기
      if (i < 2) await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // 평균 계산
    const avgClientTime = testResults.reduce((sum, r) => sum + r.clientTime, 0) / testResults.length;
    const avgServerTime = testResults.reduce((sum, r) => sum + r.serverTime, 0) / testResults.length;
    const avgSpeed = testResults.reduce((sum, r) => sum + r.speed, 0) / testResults.length;
    const avgSize = testResults[0].imageSize; // 같은 이미지이므로 크기는 동일
    
    console.log('📊 성능 테스트 완료');
    console.log(`평균 클라이언트 시간: ${avgClientTime.toFixed(0)}ms`);  
    console.log(`평균 서버 시간: ${avgServerTime.toFixed(0)}ms`);
    console.log(`평균 업로드 속도: ${avgSpeed.toFixed(0)} KB/s`);
    
    // 결과 표시
    let resultText = `✅ 테스트 완료: 평균 ${avgClientTime.toFixed(0)}ms (${avgSpeed.toFixed(0)} KB/s)`;
    let resultColor = '#059669'; // 녹색
    
    if (avgSpeed < 100) {
      resultText = `⚠️ 느림: 평균 ${avgClientTime.toFixed(0)}ms (${avgSpeed.toFixed(0)} KB/s)`;
      resultColor = '#dc2626'; // 빨간색
    } else if (avgSpeed < 300) {
      resultText = `⚡ 보통: 평균 ${avgClientTime.toFixed(0)}ms (${avgSpeed.toFixed(0)} KB/s)`;
      resultColor = '#d97706'; // 주황색
    }
    
    performanceResult.innerHTML = resultText;
    performanceResult.style.color = resultColor;
    
  } catch (error) {
    console.error('성능 테스트 오류:', error);
    performanceResult.innerHTML = `❌ 테스트 실패: ${error.message}`;
    performanceResult.style.color = '#dc2626';
  } finally {
    // 버튼 복원
    performanceBtn.disabled = false;
    performanceBtn.innerHTML = '�� 업로드 속도 테스트';
  }
} 
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

const IMGUR_CLIENT_ID = '5113b55e73871a6';

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
document.addEventListener('DOMContentLoaded', () => {
  setupDragAndDrop();
  setupGoogleImageSearch();
  initKakaoSDK();
  registerServiceWorker();
  setupPWAInstall();
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
    
    const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
    const displayWidth = imgWidth * scale;
    const displayHeight = imgHeight * scale;
    
    this.style.width = displayWidth + 'px';
    this.style.height = displayHeight + 'px';
    this.style.display = 'block';
    
    if (resultPlaceholder) {
      resultPlaceholder.style.display = 'none';
    }
    if (actionButtons) {
      actionButtons.style.display = 'flex';
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
}

// 로딩 상태 표시 함수
function showLoadingState() {
  if (resultPlaceholder) {
    resultPlaceholder.innerHTML = `
      <div style="text-align: center;">
        <div class="loading" style="margin: 0 auto 1rem auto;"></div>
        <div>AI가 이미지를 생성하고 있습니다...</div>
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

// 구글 이미지 검색 기능
function setupGoogleImageSearch() {
  googleSearchBtn.addEventListener('click', () => {
    const searchQuery = googleSearchInput.value.trim();
    if (!searchQuery) {
      alert('검색할 키워드를 입력해주세요.');
      return;
    }
    
    // 구글 이미지 검색 URL로 이동
    const googleImageSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchQuery)}`;
    window.open(googleImageSearchUrl, '_blank');
  });
  
  // 엔터키로도 검색 가능
  googleSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      googleSearchBtn.click();
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

// 개선된 이미지 저장 기능
function saveImageImproved() {
  if (!resultImage.src) {
    alert('저장할 이미지가 없습니다.');
    return;
  }
  
  try {
    // 이미지를 캔버스에 그려서 고화질로 다운로드
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 원본 크기로 캔버스 설정
    canvas.width = resultImage.naturalWidth || resultImage.width;
    canvas.height = resultImage.naturalHeight || resultImage.height;
    
    // 이미지 그리기
    ctx.drawImage(resultImage, 0, 0);
    
    // 다운로드 링크 생성
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-fitting-studio-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
      
      // 임시로 DOM에 추가하고 클릭
      document.body.appendChild(link);
      link.click();
      
      // 정리
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // 성공 메시지
      alert('이미지가 성공적으로 저장되었습니다! 📁');
    }, 'image/png', 1.0); // 최고 품질로 저장
    
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

  // 2. Replicate API 호출 (FLUX Fill Pro 모델 사용)
  const response = await fetch(`${baseUrl}/replicate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // FLUX Fill Pro - 최신 inpainting 모델
      version: "black-forest-labs/flux-fill-pro",
      input: {
        prompt: prompt,
        image: imageUploadData.url,
        mask: maskUploadData.url,
        num_outputs: 1,
        guidance_scale: 30,
        num_inference_steps: 28,
        seed: Math.floor(Math.random() * 1000000)
      }
    })
  });
  
  if (!response.ok) {
    // FLUX Fill Pro가 실패하면 FLUX Fill Dev로 폴백
    console.log('FLUX Fill Pro 실패, FLUX Fill Dev로 시도...');
    const fallbackResponse = await fetch(`${baseUrl}/replicate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // FLUX Fill Dev - 오픈소스 버전
        version: "black-forest-labs/flux-fill-dev",
        input: {
          prompt: prompt,
          image: imageUploadData.url,
          mask: maskUploadData.url,
          num_outputs: 1,
          guidance_scale: 30,
          num_inference_steps: 28,
          seed: Math.floor(Math.random() * 1000000)
        }
      })
    });
    
    if (!fallbackResponse.ok) {
      // 최종 폴백: 기존 Stable Diffusion 모델
      console.log('FLUX 모델들 실패, Stable Diffusion으로 폴백...');
      const sdResponse = await fetch(`${baseUrl}/replicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: "95b7223104132402a9ae91cc677285bc5eb997834bd2349fa486f53910fd68b3",
          input: {
            prompt: prompt,
            image: imageUploadData.url,
            mask: maskUploadData.url
          }
        })
      });
      
      if (!sdResponse.ok) throw new Error('모든 API 요청 실패');
      const prediction = await sdResponse.json();
      return await pollForResult(baseUrl, prediction.id);
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
    saveImageImproved();
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
  
  // 카카오톡 공유 기능
  if (window.Kakao && window.Kakao.isInitialized()) {
    // Kakao SDK를 사용한 공유
    try {
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
    } catch (error) {
      console.error('카카오톡 공유 오류:', error);
      fallbackKakaoShare();
    }
  } else {
    fallbackKakaoShare();
  }
}

function fallbackKakaoShare() {
  // 폴백: 기본 공유 방식
  const shareText = `AI Fitting Studio에서 생성한 스타일링 이미지입니다! ✨\n${window.location.origin}`;
  
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // 모바일: 카카오톡 앱으로 공유
    const kakaoUrl = `kakaotalk://send?text=${encodeURIComponent(shareText)}`;
    window.open(kakaoUrl, '_blank');
  } else {
    // 데스크톱: 클립보드에 복사
    navigator.clipboard.writeText(shareText).then(() => {
      alert('공유 텍스트가 클립보드에 복사되었습니다! 💬');
    }).catch(() => {
      alert('공유 텍스트: ' + shareText);
    });
  }
}

function saveImage() {
  saveImageImproved();
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
// 카메라 관련 변수
let currentStream = null;
let currentFacingMode = 'user'; // 'user' (전면) 또는 'environment' (후면)
let availableCameras = [];

// 카메라 모달 열기
function openCameraModal() {
    const modal = document.getElementById('cameraModal');
    modal.style.display = 'flex';
    initializeCamera();
}

// 카메라 모달 닫기
function closeCameraModal() {
    const modal = document.getElementById('cameraModal');
    modal.style.display = 'none';
    stopCamera();
    resetCameraUI();
}

// 카메라 스트림 중지
function stopCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
}

// 카메라 UI 초기화
function resetCameraUI() {
    const video = document.getElementById('cameraVideo');
    const preview = document.getElementById('capturedPhotoPreview');
    const controls = document.getElementById('cameraControls');
    const error = document.getElementById('cameraError');
    
    video.style.display = 'block';
    preview.style.display = 'none';
    controls.style.display = 'flex';
    error.style.display = 'none';
}

// 사용 가능한 카메라 목록 가져오기
async function getAvailableCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        availableCameras = devices.filter(device => device.kind === 'videoinput');
        
        // 카메라 전환 버튼 표시/숨김
        const switchBtn = document.getElementById('switchCameraBtn');
        if (availableCameras.length > 1) {
            switchBtn.style.display = 'inline-block';
        } else {
            switchBtn.style.display = 'none';
        }
        
        return availableCameras;
    } catch (error) {
        console.error('카메라 목록 가져오기 실패:', error);
        return [];
    }
}

// 카메라 초기화
async function initializeCamera() {
    try {
        // 먼저 사용 가능한 카메라 목록 가져오기
        await getAvailableCameras();
        
        // 카메라 스트림 시작
        await startCamera();
        
    } catch (error) {
        console.error('카메라 초기화 실패:', error);
        showCameraError();
    }
}

// 카메라 스트림 시작
async function startCamera() {
    try {
        // 기존 스트림 중지
        stopCamera();
        
        // 카메라 제약 조건 설정
        const constraints = {
            video: {
                facingMode: currentFacingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        };
        
        // 카메라 스트림 가져오기
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // 비디오 요소에 스트림 연결
        const video = document.getElementById('cameraVideo');
        video.srcObject = currentStream;
        
        // 에러 숨기기
        document.getElementById('cameraError').style.display = 'none';
        
    } catch (error) {
        console.error('카메라 시작 실패:', error);
        showCameraError();
    }
}

// 카메라 전환
async function switchCamera() {
    // 전면/후면 카메라 전환
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    await startCamera();
}

// 사진 촬영
function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('cameraCanvas');
    const capturedPhoto = document.getElementById('capturedPhoto');
    const preview = document.getElementById('capturedPhotoPreview');
    const controls = document.getElementById('cameraControls');
    
    // 전신사진에 맞는 3:4 비율로 캔버스 크기 설정
    const aspectRatio = 3 / 4; // 가로:세로 = 3:4
    let canvasWidth, canvasHeight;
    
    if (video.videoWidth / video.videoHeight > aspectRatio) {
        // 비디오가 더 넓은 경우, 높이를 기준으로 조정
        canvasHeight = video.videoHeight;
        canvasWidth = canvasHeight * aspectRatio;
    } else {
        // 비디오가 더 높은 경우, 너비를 기준으로 조정
        canvasWidth = video.videoWidth;
        canvasHeight = canvasWidth / aspectRatio;
    }
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // 비디오 프레임을 캔버스 중앙에 크롭해서 그리기
    const ctx = canvas.getContext('2d');
    const sourceX = (video.videoWidth - canvasWidth) / 2;
    const sourceY = (video.videoHeight - canvasHeight) / 2;
    
    ctx.drawImage(video, sourceX, sourceY, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
    
    // 캔버스를 이미지로 변환
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    // 미리보기 이미지 설정
    capturedPhoto.src = imageDataUrl;
    
    // UI 전환
    video.style.display = 'none';
    controls.style.display = 'none';
    preview.style.display = 'block';
}

// 다시 촬영
function retakePhoto() {
    const video = document.getElementById('cameraVideo');
    const preview = document.getElementById('capturedPhotoPreview');
    const controls = document.getElementById('cameraControls');
    
    // UI 전환
    video.style.display = 'block';
    controls.style.display = 'flex';
    preview.style.display = 'none';
}

// 촬영한 사진 사용
function usePhoto() {
    const capturedPhoto = document.getElementById('capturedPhoto');
    const bodyDragDropArea = document.getElementById('bodyDragDropArea');
    const textModeDragDropArea = document.getElementById('dragDropArea');
    
    // 캔버스에서 Blob 생성
    const canvas = document.getElementById('cameraCanvas');
    canvas.toBlob((blob) => {
        // File 객체 생성
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        
        // 현재 모드 확인 (옷 모드 vs 텍스트 모드)
        if (bodyDragDropArea && window.getComputedStyle(document.getElementById('clothesModeApp')).display !== 'none') {
            // 옷 모드: 전신사진 업로드 영역에 이미지 설정
            const reader = new FileReader();
            reader.onload = function(e) {
                bodyDragDropArea.style.backgroundImage = `url(${e.target.result})`;
                bodyDragDropArea.querySelector('.drag-drop-content').style.display = 'none';
                
                // 전역 변수에 파일 저장
                window.bodyImageFile = file;
                
                // 생성 버튼 활성화 체크
                if (typeof checkGenerateButtonState === 'function') {
                    checkGenerateButtonState();
                }
            };
            reader.readAsDataURL(file);
        } else if (textModeDragDropArea && window.getComputedStyle(document.getElementById('mainApp')).display !== 'none') {
            // 텍스트 모드: 드래그 드롭 영역에 이미지 설정
            const reader = new FileReader();
            reader.onload = function(e) {
                textModeDragDropArea.style.backgroundImage = `url(${e.target.result})`;
                textModeDragDropArea.style.backgroundSize = 'cover';
                textModeDragDropArea.style.backgroundPosition = 'center';
                textModeDragDropArea.style.backgroundRepeat = 'no-repeat';
                textModeDragDropArea.querySelector('.drag-drop-text').style.display = 'none';
                textModeDragDropArea.querySelector('.drag-drop-subtext').style.display = 'none';
                
                // 전역 변수에 파일 저장
                window.uploadedFile = file;
                
                // 텍스트 모드의 이미지 처리 함수 호출
                if (typeof handleImageUpload === 'function') {
                    handleImageUpload(file);
                }
            };
            reader.readAsDataURL(file);
        }
        
        // 모달 닫기
        closeCameraModal();
        
    }, 'image/jpeg', 0.8);
}

// 카메라 에러 표시
function showCameraError() {
    const error = document.getElementById('cameraError');
    const video = document.getElementById('cameraVideo');
    const controls = document.getElementById('cameraControls');
    
    error.style.display = 'block';
    video.style.display = 'none';
    controls.style.display = 'none';
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
    // 카메라 촬영 버튼 (옷 모드)
    const takeCameraPhotoBtn = document.getElementById('takeCameraPhotoBtn');
    if (takeCameraPhotoBtn) {
        takeCameraPhotoBtn.addEventListener('click', openCameraModal);
    }
    
    // 카메라 촬영 버튼 (텍스트 모드)
    const takeTextModeCameraBtn = document.getElementById('takeTextModeCameraBtn');
    if (takeTextModeCameraBtn) {
        takeTextModeCameraBtn.addEventListener('click', openCameraModal);
    }
    
    // 카메라 모달 닫기 버튼
    const closeCameraBtn = document.getElementById('closeCameraBtn');
    if (closeCameraBtn) {
        closeCameraBtn.addEventListener('click', closeCameraModal);
    }
    
    // 카메라 전환 버튼
    const switchCameraBtn = document.getElementById('switchCameraBtn');
    if (switchCameraBtn) {
        switchCameraBtn.addEventListener('click', switchCamera);
    }
    
    // 사진 촬영 버튼
    const capturePhotoBtn = document.getElementById('capturePhotoBtn');
    if (capturePhotoBtn) {
        capturePhotoBtn.addEventListener('click', capturePhoto);
    }
    
    // 다시 촬영 버튼
    const retakePhotoBtn = document.getElementById('retakePhotoBtn');
    if (retakePhotoBtn) {
        retakePhotoBtn.addEventListener('click', retakePhoto);
    }
    
    // 사진 사용 버튼
    const usePhotoBtn = document.getElementById('usePhotoBtn');
    if (usePhotoBtn) {
        usePhotoBtn.addEventListener('click', usePhoto);
    }
    
    // 모달 배경 클릭 시 닫기
    const cameraModal = document.getElementById('cameraModal');
    if (cameraModal) {
        cameraModal.addEventListener('click', function(e) {
            if (e.target === cameraModal) {
                closeCameraModal();
            }
        });
    }
});

// 브라우저 호환성 체크
function checkCameraSupport() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('이 브라우저는 카메라 기능을 지원하지 않습니다.');
        return false;
    }
    return true;
}

// 카메라 권한 요청
async function requestCameraPermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch (error) {
        console.error('카메라 권한 요청 실패:', error);
        return false;
    }
} 
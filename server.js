// 환경변수 로드
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = process.env.PORT || 8787;

// 미들웨어 설정
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// Replicate API 키 (환경변수에서 가져오기)
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

// Cloudinary 환경설정
cloudinary.config({
  cloud_name: 'dwt9va79z',
  api_key: '341829715538849',
  api_secret: 'ftBZn-S__Au9rojUfvNAfJQE5oY'
});

// 이미지 업로드 엔드포인트 (Cloudinary 사용)
app.post('/upload', async (req, res) => {
  // 성능 측정 시작
  const startTime = Date.now();
  
  try {
    const { image, imageUrl } = req.body;
    
    if (!image && !imageUrl) {
      return res.status(400).json({ error: '이미지 데이터 또는 이미지 URL이 필요합니다.' });
    }

    let uploadInput;
    let imageSizeKB = 0;

    if (imageUrl) {
      // URL에서 이미지 다운로드 후 업로드
      console.log(`🔗 URL에서 이미지 다운로드: ${imageUrl}`);
      uploadInput = imageUrl;
    } else {
      // Base64 이미지 업로드
      imageSizeKB = Math.round((image.length * 3) / 4 / 1024);
      console.log(`📊 업로드 시작 - 이미지 크기: ${imageSizeKB}KB`);
      uploadInput = `data:image/png;base64,${image}`;
    }
    
    // Cloudinary 업로드 시작 시간
    const uploadStartTime = Date.now();
    
    // Cloudinary에 업로드
    const uploadRes = await cloudinary.uploader.upload(uploadInput, {
      folder: 'ai-styling',
      resource_type: 'image'
    });

    // 업로드 완료 시간 측정
    const uploadEndTime = Date.now();
    const uploadDuration = uploadEndTime - uploadStartTime;
    const totalDuration = uploadEndTime - startTime;

    console.log(`⚡ Cloudinary 업로드 완료:`);
    console.log(`   - 업로드 시간: ${uploadDuration}ms`);
    console.log(`   - 총 처리 시간: ${totalDuration}ms`);
    if (imageSizeKB > 0) {
      console.log(`   - 업로드 속도: ${(imageSizeKB / (uploadDuration / 1000)).toFixed(2)} KB/s`);
    }
    console.log(`   - 파일 URL: ${uploadRes.secure_url}`);

    if (uploadRes && uploadRes.secure_url) {
      res.json({ 
        url: uploadRes.secure_url,
        // 성능 정보 추가
        performance: {
          uploadTime: uploadDuration,
          totalTime: totalDuration,
          imageSizeKB: imageSizeKB,
          uploadSpeedKBps: imageSizeKB > 0 ? Math.round(imageSizeKB / (uploadDuration / 1000)) : 0
        }
      });
    } else {
      res.status(500).json({ 
        error: 'Cloudinary 업로드 실패', 
        details: uploadRes 
      });
    }
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`❌ 업로드 오류 (${errorTime}ms):`, error);
    res.status(500).json({ 
      error: '이미지 업로드 중 오류가 발생했습니다.',
      details: error.message,
      errorTime: errorTime
    });
  }
});

// Replicate API 호출 엔드포인트
app.post('/replicate', async (req, res) => {
  try {
    if (!REPLICATE_API_TOKEN || REPLICATE_API_TOKEN === 'your-replicate-api-token-here') {
      return res.status(500).json({ 
        error: 'Replicate API 토큰이 설정되지 않았습니다.',
        details: 'REPLICATE_API_TOKEN 환경변수를 설정해주세요.'
      });
    }

    const { version, input } = req.body;
    
    // IDM-VTON 모델 버전 확인
    const isIDMVTON = version === 'c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4';
    
    if (isIDMVTON) {
      console.log('IDM-VTON 모델 감지됨 - 가상 피팅 처리 시작');
      console.log('입력 데이터:', {
        human_img: input.human_img ? '전신사진' : '전신사진 없음',
        garm_img: input.garm_img ? '옷사진' : '옷사진 없음',
        category: input.category,
        garment_des: input.garment_des
      });
    }

    // 2초 대기 (안정성을 위해)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version,
        input
      })
    });

    const data = await response.json();
    
    if (isIDMVTON) {
      console.log('IDM-VTON 예측 생성:', JSON.stringify(data, null, 2));
    } else {
      console.log('Replicate 예측 생성:', JSON.stringify(data, null, 2));
    }
    
    res.json(data);
  } catch (error) {
    console.error('❌ Replicate API 오류:', error);
    res.status(500).json({ 
      error: 'AI 이미지 생성 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// IDM-VTON 전용 엔드포인트 (최적화된 가상 피팅)
app.post('/idm-vton', async (req, res) => {
  try {
    if (!REPLICATE_API_TOKEN || REPLICATE_API_TOKEN === 'your-replicate-api-token-here') {
      return res.status(500).json({ 
        error: 'Replicate API 토큰이 설정되지 않았습니다.',
        details: 'REPLICATE_API_TOKEN 환경변수를 설정해주세요.'
      });
    }

    const { human_img, garm_img, category, garment_des, denoise_steps = 30, seed } = req.body;
    
    console.log('IDM-VTON 가상 피팅 요청:');
    console.log(`   - 전신사진: ${human_img ? '있음' : '없음'}`);
    console.log(`   - 옷사진: ${garm_img ? '있음' : '없음'}`);
    console.log(`   - 카테고리: ${category}`);
    console.log(`   - 설명: ${garment_des}`);
    console.log(`   - 노이즈 제거 단계: ${denoise_steps}`);
    console.log(`   - 시드: ${seed}`);

    if (!human_img || !garm_img) {
      return res.status(400).json({
        error: '전신사진과 옷사진이 모두 필요합니다.',
        details: {
          human_img: !!human_img,
          garm_img: !!garm_img
        }
      });
    }

    // IDM-VTON 모델 호출
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: 'c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4',
        input: {
          human_img,
          garm_img,
          garment_des: garment_des || "clothing",
          category: category || "upper_body",
          is_checked: true,
          is_checked_crop: true,
          denoise_steps,
          seed: seed || Math.floor(Math.random() * 1000000)
        }
      })
    });

    const data = await response.json();
    console.log('IDM-VTON 예측 결과:', JSON.stringify(data, null, 2));
    
    res.json(data);
  } catch (error) {
    console.error('❌ IDM-VTON API 오류:', error);
    res.status(500).json({ 
      error: 'IDM-VTON 가상 피팅 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// Replicate 결과 polling 엔드포인트
app.get('/replicate/:id', async (req, res) => {
  try {
    if (!REPLICATE_API_TOKEN || REPLICATE_API_TOKEN === 'your-replicate-api-token-here') {
      return res.status(500).json({ 
        error: 'Replicate API 토큰이 설정되지 않았습니다.',
        details: 'REPLICATE_API_TOKEN 환경변수를 설정해주세요.'
      });
    }

    const response = await fetch(`https://api.replicate.com/v1/predictions/${req.params.id}`, {
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`
      }
    });

    const data = await response.json();
    
    // IDM-VTON 결과인지 확인
    const isIDMVTON = data.version === 'c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4';
    
    if (isIDMVTON) {
      console.log('IDM-VTON 결과 폴링:', JSON.stringify(data, null, 2));
    } else {
      console.log('Replicate 결과 폴링:', JSON.stringify(data, null, 2));
    }
    
    res.json(data);
  } catch (error) {
    console.error('❌ Replicate 폴링 오류:', error);
    res.status(500).json({ 
      error: '결과 확인 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// 메인 페이지 라우트
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 갤러리 페이지 라우트 (있는 경우)
app.get('/gallery', (req, res) => {
  const galleryPath = path.join(__dirname, 'gallery.html');
  if (require('fs').existsSync(galleryPath)) {
    res.sendFile(galleryPath);
  } else {
    res.redirect('/');
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log('AI Fitting Studio 서버가 포트', PORT, '에서 실행 중입니다.');
  console.log('브라우저에서 http://localhost:' + PORT + ' 를 열어보세요.');
  
  if (!REPLICATE_API_TOKEN || REPLICATE_API_TOKEN === 'your-replicate-api-token-here') {
    console.log('REPLICATE_API_TOKEN 환경변수를 설정해주세요.');
    console.log('   1. env.example 파일을 .env로 복사하세요');
    console.log('   2. .env 파일에서 REPLICATE_API_TOKEN을 실제 토큰으로 변경하세요');
    console.log('   3. Replicate 토큰은 https://replicate.com/account/api-tokens 에서 발급받을 수 있습니다');
  } else {
    console.log('Replicate API 토큰이 설정되었습니다.');
  }
  
  console.log('Cloudinary가 설정되었습니다.');
  console.log('IDM-VTON 가상 피팅 기능이 활성화되었습니다.');
}); 